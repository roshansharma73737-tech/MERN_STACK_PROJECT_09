
const { randomUUID } = require("crypto");
const Stripe = require("stripe");
const ticketPricing = require("../../shared/ticket-pricing.json");
const Ticket = require("../models/ticket");
const SeatReservation = require("../models/seat_reservation");

function getStripeConfiguration() {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!secretKey || !webhookSecret) {
        return {
            error: "Stripe is not configured. Set STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET."
        };
    }

    if (
        (!secretKey.startsWith("sk_test_") &&
            !secretKey.startsWith("sk_live_")) ||
        !webhookSecret.startsWith("whsec_")
    ) {
        return { error: "Stripe keys have an invalid format." };
    }

    const isLiveKey = secretKey.startsWith("sk_live_");

    if (
        (process.env.NODE_ENV === "production" && !isLiveKey) ||
        (process.env.NODE_ENV !== "production" && isLiveKey)
    ) {
        return {
            error: process.env.NODE_ENV === "production"
                ? "Production checkout requires a Stripe live key."
                : "Live Stripe keys are disabled outside production. Use a Stripe test key."
        };
    }

    let frontendUrl;

    try {
        frontendUrl = new URL(
            process.env.FRONTEND_URL || "http://localhost:5173"
        );
    } catch {
        return {
            error: "FRONTEND_URL must be a valid absolute URL."
        };
    }

    if (
        frontendUrl.protocol !== "https:" &&
        !(
            process.env.NODE_ENV !== "production" &&
            frontendUrl.hostname === "localhost"
        )
    ) {
        return {
            error: "FRONTEND_URL must use HTTPS outside local development."
        };
    }

    try {
        return {
            stripe: new Stripe(secretKey),
            webhookSecret,
            frontendUrl: frontendUrl.origin
        };
    } catch {
        console.error("Stripe configuration is invalid.");

        return {
            error: "Stripe configuration is invalid."
        };
    }
}

function isValidBookingDate(
    showDate,
    showTime,
    showDateTime,
    timezoneOffsetMinutes
) {
    if (
        typeof showDate !== "string" ||
        typeof showTime !== "string" ||
        typeof showDateTime !== "string"
    ) {
        return false;
    }

    const dateParts = /^(\d{4})-(\d{2})-(\d{2})$/.exec(showDate);
    const timeParts = /^(\d{2}):(\d{2})$/.exec(showTime);

    if (!dateParts || !timeParts) return false;

    const year = Number(dateParts[1]);
    const month = Number(dateParts[2]);
    const day = Number(dateParts[3]);
    const hour = Number(timeParts[1]);
    const minute = Number(timeParts[2]);

    if (
        year < 1000 ||
        year > 9999 ||
        month < 1 ||
        month > 12 ||
        day < 1 ||
        day > new Date(year, month, 0).getDate() ||
        hour > 23 ||
        minute > 59 ||
        !Number.isInteger(timezoneOffsetMinutes) ||
        Math.abs(timezoneOffsetMinutes) > 14 * 60
    ) {
        return false;
    }

    const timestamp = new Date(showDateTime);

    const reconstructedTimestamp = new Date(
        Date.UTC(year, month - 1, day, hour, minute) +
        timezoneOffsetMinutes * 60_000
    );

    return (
        !Number.isNaN(timestamp.getTime()) &&
        timestamp > new Date() &&
        timestamp.toISOString() === showDateTime &&
        reconstructedTimestamp.toISOString() === showDateTime
    );
}

function getUnitPrice(type, title) {
    if (
        type === "movie" &&
        ticketPricing.movieTitles.includes(title)
    ) {
        return ticketPricing.movieTicketPrice;
    }

    if (
        type === "event" &&
        Object.hasOwn(ticketPricing.eventTicketPrices, title)
    ) {
        return ticketPricing.eventTicketPrices[title];
    }

    return null;
}

function isValidSeatId(seat) {
    return typeof seat === "string" && /^[A-E][1-8]$/.test(seat);
}

function isMatchingCheckoutSession(ticket, session) {
    return (
        /^cs_(?:test|live)_/.test(session.id) &&
        session.mode === "payment" &&
        session.client_reference_id === ticket.ticketId &&
        session.metadata?.ticketId === ticket.ticketId &&
        session.metadata?.userId === String(ticket.userId) &&
        session.currency === ticket.currency.toLowerCase() &&
        session.amount_total === Math.round(ticket.amount * 100) &&
        (!ticket.stripeSessionId ||
            ticket.stripeSessionId === session.id)
    );
}

async function createCheckout(req, res) {
    const configuration = getStripeConfiguration();

    if (configuration.error) {
        console.error("Stripe configuration error:", configuration.error);

        return res.status(503).json({
            message: configuration.error
        });
    }

    const {
        type,
        title,
        showDate,
        showTime,
        showDateTime,
        timezoneOffsetMinutes,
        seats
    } = req.body || {};

    if (
        (type !== "movie" && type !== "event") ||
        typeof title !== "string" ||
        !title.trim() ||
        title.trim().length > 200 ||
        !Array.isArray(seats) ||
        seats.length === 0 ||
        seats.length > 10 ||
        seats.some((seat) => !isValidSeatId(seat)) ||
        new Set(seats).size !== seats.length
    ) {
        return res.status(400).json({
            message:
                "Valid booking details and at least one unique seat are required."
        });
    }

    if (
        !isValidBookingDate(
            showDate,
            showTime,
            showDateTime,
            timezoneOffsetMinutes
        )
    ) {
        return res.status(400).json({
            message:
                "A valid future date and time with a four-digit year are required."
        });
    }

    const unitPrice = getUnitPrice(type, title.trim());

    if (!Number.isSafeInteger(unitPrice) || unitPrice <= 0) {
        return res.status(400).json({
            message: "The selected item is not available for booking."
        });
    }

    if (!req.user?.userId) {
        return res.status(401).json({
            message: "Authentication required."
        });
    }

    const ticketId = randomUUID();
    const totalAmount = unitPrice * seats.length;

    if (!Number.isSafeInteger(totalAmount)) {
        return res.status(400).json({
            message: "Invalid booking amount."
        });
    }

    const showKey =
        `${type}|${title.trim()}|${showDate}|${showTime}`;

    const reservationExpiresAt =
        new Date(Date.now() + 65 * 60 * 1000);

    let ticket;

    // Save a pending ticket in MongoDB.
    try {
        ticket = await Ticket.create({
            ticketId,
            paymentId: `pending-${ticketId}`,
            userId: req.user.userId,
            type,
            title: title.trim(),
            showDate,
            showTime,
            showDateTime: new Date(showDateTime),
            seats,
            amount: totalAmount,
            currency: "INR",
            status: "pending",
            paymentMode: "stripe"
        });
    } catch (error) {
        console.error("Unable to save pending ticket:", {
            name: error.name,
            message: error.message
        });

        return res.status(500).json({
            message: "Unable to start checkout. Please try again."
        });
    }

    // Reserve the selected seats.
    try {
        await SeatReservation.deleteMany({
            showKey,
            seat: { $in: seats },
            expiresAt: { $lte: new Date() }
        });

        await SeatReservation.create(
            seats.map((seat) => ({
                showKey,
                seat,
                ticketId,
                expiresAt: reservationExpiresAt
            }))
        );
    } catch (error) {
        try {
            await SeatReservation.deleteMany({ ticketId });

            await Ticket.updateOne(
                { ticketId, status: "pending" },
                { $set: { status: "failed" } }
            );
        } catch (cleanupError) {
            console.error("Seat reservation cleanup failed:", {
                message: cleanupError.message
            });
        }

        if (error.code === 11000) {
            return res.status(409).json({
                message:
                    "One or more selected seats were just booked. Choose different seats."
            });
        }

        console.error("Unable to reserve selected seats:", {
            name: error.name,
            message: error.message
        });

        return res.status(500).json({
            message: "Unable to reserve seats. Please try again."
        });
    }

    // Create the Stripe Checkout Session.
    try {
        const session =
            await configuration.stripe.checkout.sessions.create({
                mode: "payment",

                expires_at: Math.floor(Date.now() / 1000) + 60 * 60,

                line_items: [
                    {
                        price_data: {
                            currency: "inr",
                            product_data: {
                                name: ticket.title,
                                description:
                                    `${ticket.type} ticket · ` +
                                    `${ticket.showDate} ${ticket.showTime} · ` +
                                    `Seats ${ticket.seats.join(", ")}`
                            },
                            unit_amount: unitPrice * 100
                        },
                        quantity: ticket.seats.length
                    }
                ],

                client_reference_id: ticket.ticketId,

                metadata: {
                    ticketId: ticket.ticketId,
                    userId: String(req.user.userId)
                },

                success_url:
                    `${configuration.frontendUrl}/payment/success` +
                    "?session_id={CHECKOUT_SESSION_ID}",

                cancel_url:
                    `${configuration.frontendUrl}/payment/cancelled` +
                    `?ticket_id=${encodeURIComponent(ticket.ticketId)}`
            });

        if (!session.url || !session.id) {
            throw new Error(
                "Stripe did not return a Checkout URL."
            );
        }

        ticket.stripeSessionId = session.id;
        ticket.paymentId = session.id;

        await ticket.save();

        return res.status(201).json({
            checkoutUrl: session.url,
            ticketId: ticket.ticketId
        });
    } catch (error) {
        // Detailed diagnostics appear in the backend terminal.
        console.error("Stripe Checkout creation failed:", {
            type: error?.type || error?.name || "UnknownError",
            code: error?.code || null,
            message: error?.message || "Unknown Stripe error",
            statusCode: error?.statusCode || null,
            requestId: error?.requestId || null
        });

        // Clean up the failed checkout when possible.
        try {
            const failedTicket = await Ticket.updateOne(
                { ticketId, status: "pending" },
                { $set: { status: "failed" } }
            );

            if (failedTicket.modifiedCount > 0) {
                await SeatReservation.deleteMany({ ticketId });
            }
        } catch (cleanupError) {
            console.error("Stripe checkout cleanup failed:", {
                name: cleanupError?.name || "UnknownError",
                message:
                    cleanupError?.message || "Unknown cleanup error"
            });
        }

        return res.status(502).json({
            message:
                "Unable to start secure Stripe checkout. Please try again."
        });
    }
}

async function getSeatAvailability(req, res) {
    const { type, title, showDate, showTime } = req.query;

    const unitPrice =
        typeof title === "string"
            ? getUnitPrice(type, title.trim())
            : null;

    if (
        !unitPrice ||
        typeof showDate !== "string" ||
        typeof showTime !== "string" ||
        !/^\d{4}-\d{2}-\d{2}$/.test(showDate) ||
        !/^\d{2}:\d{2}$/.test(showTime)
    ) {
        return res.status(400).json({
            message: "Valid item and show date/time are required."
        });
    }

    try {
        const showKey =
            `${type}|${title.trim()}|${showDate}|${showTime}`;

        const occupiedSeats = await SeatReservation.find({
            showKey,
            expiresAt: { $gt: new Date() }
        }).distinct("seat");

        return res.json({ occupiedSeats });
    } catch (error) {
        console.error("Seat availability lookup failed:", {
            name: error.name,
            message: error.message
        });

        return res.status(500).json({
            message: "Unable to load seat availability."
        });
    }
}

async function getCheckoutStatus(req, res) {
    const sessionId = req.params.sessionId;

    if (!/^cs_(?:test|live)_/.test(sessionId)) {
        return res.status(400).json({
            message: "Invalid checkout session."
        });
    }

    try {
        const ticket = await Ticket.findOne({
            stripeSessionId: sessionId,
            userId: req.user.userId
        }).select("ticketId status");

        if (!ticket) {
            return res.status(404).json({
                message: "Checkout session not found."
            });
        }

        return res.json({
            status: ticket.status,
            ticketId:
                ticket.status === "confirmed"
                    ? ticket.ticketId
                    : null
        });
    } catch (error) {
        console.error("Checkout status lookup failed:", {
            name: error.name,
            message: error.message
        });

        return res.status(500).json({
            message: "Unable to check payment status."
        });
    }
}

async function handleStripeWebhook(req, res) {
    const configuration = getStripeConfiguration();

    if (configuration.error) {
        console.error("Stripe webhook configuration error.");

        return res.status(503).send(
            "Stripe is not configured."
        );
    }

    let event;

    // Verify the signature using the original raw request body.
    try {
        const signature = req.headers["stripe-signature"];

        event = configuration.stripe.webhooks.constructEvent(
            req.body,
            signature,
            configuration.webhookSecret
        );
    } catch (error) {
        console.error(
            "Stripe webhook signature verification failed:",
            error.type || error.name
        );

        return res.status(400).send(
            "Invalid Stripe webhook signature."
        );
    }

    const session = event.data.object;

    const paidEvents = new Set([
        "checkout.session.completed",
        "checkout.session.async_payment_succeeded"
    ]);

    const failedEvents = new Set([
        "checkout.session.async_payment_failed",
        "checkout.session.expired"
    ]);

    if (
        !paidEvents.has(event.type) &&
        !failedEvents.has(event.type)
    ) {
        return res.json({ received: true });
    }

    if (
        paidEvents.has(event.type) &&
        session.payment_status !== "paid"
    ) {
        return res.json({ received: true });
    }

    try {
        const ticket = await Ticket.findOne({
            ticketId: session.metadata?.ticketId,
            userId: session.metadata?.userId
        });

        if (!ticket) {
            console.error(
                "Stripe webhook references an unknown ticket."
            );

            return res.status(500).send(
                "Ticket record not found."
            );
        }

        if (!isMatchingCheckoutSession(ticket, session)) {
            console.error(
                "Stripe webhook session did not match the pending ticket."
            );

            return res.status(400).send(
                "Checkout details do not match the ticket."
            );
        }

        // Do not allow late failure events to cancel a paid ticket.
        if (ticket.status === "confirmed") {
            return res.json({ received: true });
        }

        ticket.stripeSessionId = session.id;
        ticket.paymentId = session.id;

        if (paidEvents.has(event.type)) {
            ticket.status = "confirmed";

            await SeatReservation.updateMany(
                { ticketId: ticket.ticketId },
                {
                    $set: {
                        expiresAt: new Date(
                            ticket.showDateTime.getTime() +
                            4 * 60 * 60 * 1000
                        )
                    }
                }
            );
        } else {
            ticket.status =
                event.type === "checkout.session.expired"
                    ? "canceled"
                    : "failed";

            await SeatReservation.deleteMany({
                ticketId: ticket.ticketId
            });
        }

        await ticket.save();

        return res.json({ received: true });
    } catch (error) {
        console.error("Stripe webhook processing failed:", {
            name: error.name,
            message: error.message
        });

        return res.status(500).send(
            "Webhook processing failed."
        );
    }
}

async function verifyTicket(req, res) {
    try {
        const ticket = await Ticket.findOne({
            ticketId: req.params.ticketId,
            status: "confirmed"
        }).select(
            "-_id ticketId paymentId type title showDate " +
            "showTime seats amount currency status paymentMode createdAt"
        );

        if (!ticket) {
            return res.status(404).json({
                message: "Confirmed ticket not found."
            });
        }

        return res.json({ ticket });
    } catch (error) {
        console.error("Ticket verification error:", {
            name: error.name,
            message: error.message
        });

        return res.status(500).json({
            message: "Unable to verify ticket."
        });
    }
}

module.exports = {
    createCheckout,
    getSeatAvailability,
    getCheckoutStatus,
    handleStripeWebhook,
    verifyTicket,
    isValidBookingDate,
    getUnitPrice,
    isValidSeatId,
    isMatchingCheckoutSession
};
