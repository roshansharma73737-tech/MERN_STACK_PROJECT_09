const assert = require("node:assert/strict");
const test = require("node:test");
const {
    getUnitPrice,
    isValidBookingDate,
    isValidSeatId,
    isMatchingCheckoutSession
} = require("../controller/payment_setion");
const pricing = require("../../shared/ticket-pricing.json");

test("accepts valid future local date and time with a four-digit year", () => {
    const now = new Date();
    const futureDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 2,
        12,
        30
    );
    const pad = (value) => String(value).padStart(2, "0");
    const showDate =
        `${futureDate.getFullYear()}-${pad(futureDate.getMonth() + 1)}-` +
        pad(futureDate.getDate());
    const showTime = `${pad(futureDate.getHours())}:${pad(futureDate.getMinutes())}`;

    assert.equal(
        isValidBookingDate(
            showDate,
            showTime,
            futureDate.toISOString(),
            futureDate.getTimezoneOffset()
        ),
        true
    );
});

test("rejects invalid dates, six-digit years, and inconsistent local times", () => {
    const now = new Date();
    const futureDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 2,
        12,
        30
    );
    const offset = futureDate.getTimezoneOffset();

    assert.equal(
        isValidBookingDate("12026-01-01", "12:30", futureDate.toISOString(), offset),
        false
    );
    assert.equal(
        isValidBookingDate("2026-02-30", "12:30", futureDate.toISOString(), offset),
        false
    );
    assert.equal(
        isValidBookingDate(
            "2026-01-01",
            "12:30",
            futureDate.toISOString(),
            offset
        ),
        false
    );
});

test("calculates prices from the server catalog only", () => {
    assert.equal(getUnitPrice("movie", "Skyline Mission"), pricing.movieTicketPrice);
    assert.equal(
        getUnitPrice("event", "Comedy Night"),
        pricing.eventTicketPrices["Comedy Night"]
    );
    assert.equal(getUnitPrice("event", "Unlisted Event"), null);
    assert.equal(getUnitPrice("movie", "Unlisted Movie"), null);
});

test("accepts only seats in the rendered theater layout", () => {
    assert.equal(isValidSeatId("A1"), true);
    assert.equal(isValidSeatId("E8"), true);
    assert.equal(isValidSeatId("F1"), false);
    assert.equal(isValidSeatId("A9"), false);
    assert.equal(isValidSeatId("A1 "), false);
});

test("matches a Stripe Checkout session to its ticket before confirmation", () => {
    const ticket = {
        ticketId: "ticket-123",
        userId: "user-456",
        currency: "INR",
        amount: 500,
        stripeSessionId: "cs_test_checkout123"
    };
    const session = {
        id: "cs_test_checkout123",
        mode: "payment",
        client_reference_id: "ticket-123",
        metadata: {
            ticketId: "ticket-123",
            userId: "user-456"
        },
        currency: "inr",
        amount_total: 50000
    };

    assert.equal(isMatchingCheckoutSession(ticket, session), true);
    assert.equal(
        isMatchingCheckoutSession(ticket, { ...session, amount_total: 1 }),
        false
    );
    assert.equal(
        isMatchingCheckoutSession(ticket, {
            ...session,
            client_reference_id: "another-ticket"
        }),
        false
    );
    assert.equal(
        isMatchingCheckoutSession(ticket, {
            ...session,
            id: "cs_test_another-session"
        }),
        false
    );
});
