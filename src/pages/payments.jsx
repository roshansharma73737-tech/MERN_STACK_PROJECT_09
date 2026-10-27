
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { apiRequest } from "../services/api";
import PaymentCard from "../components/paymentcard";
import ticketPricing from "../../shared/ticket-pricing.json";

function getShowDateTime(dateValue, timeValue) {
    if (
        typeof dateValue !== "string" ||
        typeof timeValue !== "string" ||
        !/^\d{4}-\d{2}-\d{2}$/.test(dateValue) ||
        !/^\d{2}:\d{2}$/.test(timeValue)
    ) {
        return null;
    }

    const [year, month, day] = dateValue.split("-").map(Number);
    const [hour, minute] = timeValue.split(":").map(Number);
    const date = new Date(year, month - 1, day, hour, minute);

    if (
        date.getFullYear() !== year ||
        date.getMonth() !== month - 1 ||
        date.getDate() !== day ||
        date.getHours() !== hour ||
        date.getMinutes() !== minute
    ) {
        return null;
    }

    return {
        showDate: dateValue,
        showTime: timeValue,
        showDateTime: date.toISOString(),
        timezoneOffsetMinutes: date.getTimezoneOffset(),
        displayDate: date.toLocaleString()
    };
}

export default function Payment() {
    const location = useLocation();
    const navigate = useNavigate();

    const details = location.state;
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    if (
        !details?.itemType ||
        !details?.itemTitle ||
        !details?.bookingDate ||
        !details?.bookingTime ||
        !Array.isArray(details?.seats) ||
        details.seats.length === 0
    ) {
        return (
            <main className="page">
                <h1>No booking details found</h1>
                <p className="page-intro">
                    Select your seats before opening the payment page.
                </p>
                <Link to="/movies" className="button">
                    Browse movies
                </Link>
            </main>
        );
    }

    const unitPrice = details.itemType === "movie"
        ? ticketPricing.movieTicketPrice
        : ticketPricing.eventTicketPrices[details.itemTitle];
    const ticketCount = details.seats.length;
    const subtotal = unitPrice * ticketCount;
    const bookingDateTime = getShowDateTime(
        details.bookingDate,
        details.bookingTime
    );

    async function createPayment() {
        setError("");

        if (!Number.isFinite(unitPrice) || unitPrice <= 0) {
            setError("This item is not available for checkout.");
            return;
        }

        if (!bookingDateTime) {
            setError("The selected date and time are invalid. Please select them again.");
            return;
        }

        if (!localStorage.getItem("ticketly_token")) {
            navigate("/login", {
                state: {
                    from: {
                        pathname: "/payment",
                        state: details
                    }
                }
            });
            return;
        }

        setLoading(true);

        try {
            const data = await apiRequest("/payment/checkout", {
                method: "POST",
                body: JSON.stringify({
                    type: details.itemType,
                    title: details.itemTitle,
                    showDate: bookingDateTime.showDate,
                    showTime: bookingDateTime.showTime,
                    showDateTime: bookingDateTime.showDateTime,
                    timezoneOffsetMinutes: bookingDateTime.timezoneOffsetMinutes,
                    seats: details.seats
                })
            });

            if (!data?.checkoutUrl || !data.checkoutUrl.startsWith("https://")) {
                throw new Error("Stripe did not return a secure checkout URL.");
            }

            window.location.assign(data.checkoutUrl);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="page payment-page">
            <div className="payment-heading">
                <span className="eyebrow">STEP 2 OF 2 · REVIEW BOOKING</span>
                <h1>Checkout</h1>
                <p className="page-intro">
                    Review your selection before continuing.
                </p>
            </div>

            <div className="payment-grid">
                <section className="payment-panel">
                    <h2>Booking summary</h2>

                    <div className="summary-item">
                        <span className="muted">Movie / event</span>
                        <strong>{details.itemTitle}</strong>
                    </div>

                    <div className="summary-item">
                        <span className="muted">Type</span>
                        <strong>
                            {details.itemType === "movie" ? "Movie" : "Event"}
                        </strong>
                    </div>

                    <div className="summary-item">
                        <span className="muted">Date and time</span>
                        <strong>
                            {bookingDateTime?.displayDate || "Date/time unavailable"}
                        </strong>
                    </div>

                    <div className="summary-item">
                        <span className="muted">Selected seats</span>
                        <strong>{details.seats.join(", ")}</strong>
                    </div>

                    <div className="summary-item">
                        <span className="muted">Ticket quantity</span>
                        <strong>{ticketCount}</strong>
                    </div>

                    <div className="summary-item">
                        <span className="muted">
                            Price per ticket
                        </span>
                        <strong>
                            {Number.isFinite(unitPrice)
                                ? `₹${unitPrice.toLocaleString("en-IN")}`
                                : "Unavailable"}
                        </strong>
                    </div>

                    <div className="summary-total">
                        <span>Total amount</span>
                        <strong>
                            {Number.isFinite(subtotal)
                                ? `₹${subtotal.toLocaleString("en-IN")}`
                                : "Unavailable"}
                        </strong>
                    </div>

                    {(!bookingDateTime || !Number.isFinite(unitPrice)) && (
                        <div className="error">
                            <p>
                                {!bookingDateTime
                                    ? "The selected date and time are unavailable. Please choose them again before checkout."
                                    : "The item price is unavailable; checkout is disabled."}
                            </p>
                            <Link
                                to="/seats"
                                state={{
                                    itemType: details.itemType,
                                    itemTitle: details.itemTitle,
                                    unitPrice
                                }}
                                className="button"
                            >
                                Select date and seats again
                            </Link>
                        </div>
                    )}
                </section>

                <PaymentCard
                    loading={loading}
                    error={error}
                    onPay={createPayment}
                    disabled={!bookingDateTime || !Number.isFinite(unitPrice)}
                />
            </div>
        </main>
    );
}
