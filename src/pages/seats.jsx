
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import SeatLayout from "../components/seatlayout";
import { apiRequest } from "../services/api";
import ticketPricing from "../../shared/ticket-pricing.json";

export default function Seats() {
    const location = useLocation();
    const navigate = useNavigate();

    const itemType = location.state?.itemType;
    const itemTitle = location.state?.itemTitle;

    const [selectedSeats, setSelectedSeats] = useState([]);
    const [bookingDate, setBookingDate] = useState("");
    const [bookingTime, setBookingTime] = useState("");
    const [availability, setAvailability] = useState(null);
    const [error, setError] = useState("");
    const [minimumBookingDate] = useState(() => {
        const now = new Date();
        const pad = (part) => String(part).padStart(2, "0");
        return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
    });
    const showSelectionKey = bookingDate && bookingTime
        ? `${itemType}|${itemTitle}|${bookingDate}|${bookingTime}`
        : "";

    useEffect(() => {
        if (!showSelectionKey) return undefined;

        let active = true;
        const query = new URLSearchParams({
            type: itemType,
            title: itemTitle,
            showDate: bookingDate,
            showTime: bookingTime
        });

        apiRequest(`/payment/availability?${query}`)
            .then((data) => {
                if (active) {
                    setAvailability({
                        key: showSelectionKey,
                        occupiedSeats: data.occupiedSeats,
                        error: ""
                    });
                }
            })
            .catch((requestError) => {
                if (active) {
                    setAvailability({
                        key: showSelectionKey,
                        occupiedSeats: [],
                        error: requestError.message
                    });
                }
            });

        return () => {
            active = false;
        };
    }, [showSelectionKey, itemType, itemTitle, bookingDate, bookingTime]);

    if (!itemType || !itemTitle) {
        return (
            <main className="page">
                <h1>Select a movie or event first</h1>
                <p className="page-intro">
                    Choose an item before selecting seats.
                </p>
                <Link to="/movies" className="button">
                    Browse movies
                </Link>
            </main>
        );
    }

    const unitPrice = itemType === "movie"
        ? ticketPricing.movieTicketPrice
        : ticketPricing.eventTicketPrices[itemTitle];
    const total = selectedSeats.length * unitPrice;

    function toggleSeat(seatId) {
        setError("");

        setSelectedSeats((previous) =>
            previous.includes(seatId)
                ? previous.filter((seat) => seat !== seatId)
                : previous.length < 10
                    ? [...previous, seatId]
                    : previous
        );
    }

    function continueToPayment() {
        if (!bookingDate || !bookingTime) {
            setError("Please select a date and time.");
            return;
        }

        const [year, month, day] = bookingDate.split("-").map(Number);
        const [hour, minute] = bookingTime.split(":").map(Number);
        const selectedDateTime = new Date(year, month - 1, day, hour, minute);
        const validDate =
            /^\d{4}-\d{2}-\d{2}$/.test(bookingDate) &&
            selectedDateTime.getFullYear() === year &&
            selectedDateTime.getMonth() === month - 1 &&
            selectedDateTime.getDate() === day &&
            /^\d{2}:\d{2}$/.test(bookingTime) &&
            selectedDateTime.getHours() === hour &&
            selectedDateTime.getMinutes() === minute;

        if (!validDate || year < 1000 || year > 9999) {
            setError("Enter a valid date with a four-digit year and a valid time.");
            return;
        }

        if (selectedDateTime <= new Date()) {
            setError("Please select a future date and time.");
            return;
        }

        if (selectedSeats.length === 0) {
            setError("Please select at least one seat.");
            return;
        }

        if (
            availability?.key !== showSelectionKey ||
            availability.error
        ) {
            setError("Seat availability is not ready. Please wait and try again.");
            return;
        }

        const paymentDetails = {
            itemType,
            itemTitle,
            bookingDate,
            bookingTime,
            seats: selectedSeats,
            ticketCount: selectedSeats.length,
            unitPrice,
            totalAmount: total
        };

        if (!localStorage.getItem("ticketly_token")) {
            navigate("/login", {
                state: {
                    from: {
                        pathname: "/payment",
                        state: paymentDetails
                    }
                }
            });
            return;
        }

        navigate("/payment", {
            state: paymentDetails
        });
    }

    return (
        <main className="page seats-page">
            <div className="seats-heading">
                <span className="eyebrow">STEP 1 OF 2 · SELECT SEATS</span>
                <h1>Choose your seats</h1>
                <p className="page-intro">
                    {itemTitle} · {itemType === "movie" ? "Movie" : "Event"}
                </p>
            </div>

            <div className="seat-summary">
                <div>
                    <span className="muted">Selected seats</span>
                    <strong>
                        {selectedSeats.length
                            ? selectedSeats.join(", ")
                            : "None selected"}
                    </strong>
                </div>

                <div>
                    <span className="muted">Tickets</span>
                    <strong>{selectedSeats.length}</strong>
                </div>

                <div>
                    <span className="muted">Total</span>
                    <strong>
                        {Number.isFinite(total)
                            ? `₹${total.toLocaleString("en-IN")}`
                            : "Price unavailable"}
                    </strong>
                </div>

                <div className="seat-date">
                    <label htmlFor="booking-date">Date (four-digit year)</label>
                    <input
                        id="booking-date"
                        type="date"
                        min={minimumBookingDate}
                        max="9999-12-31"
                        value={bookingDate}
                        onChange={(event) => {
                            setSelectedSeats([]);
                            setError("");
                            setBookingDate(event.target.value);
                        }}
                        required
                    />
                    <label htmlFor="booking-time">Show time</label>
                    <input
                        id="booking-time"
                        type="time"
                        value={bookingTime}
                        onChange={(event) => {
                            setSelectedSeats([]);
                            setError("");
                            setBookingTime(event.target.value);
                        }}
                        required
                    />
                </div>

                {!showSelectionKey && (
                    <p className="muted">
                        Choose a date and time to load current seat availability.
                    </p>
                )}
                {showSelectionKey && availability?.key !== showSelectionKey && (
                    <p className="muted">Loading seat availability...</p>
                )}
                {availability?.key === showSelectionKey && availability.error && (
                    <p className="error">{availability.error}</p>
                )}
                {availability?.key === showSelectionKey && !availability.error && (
                    <SeatLayout
                        selectedSeats={selectedSeats}
                        occupiedSeats={availability.occupiedSeats}
                        onToggleSeat={toggleSeat}
                    />
                )}

                {error && <p className="error">{error}</p>}

                <button
                    type="button"
                    className="button"
                    onClick={continueToPayment}
                    disabled={
                        !showSelectionKey ||
                        availability?.key !== showSelectionKey ||
                        Boolean(availability.error)
                    }
                >
                    Continue to payment →
                </button>
            </div>
        </main>
    );
}
