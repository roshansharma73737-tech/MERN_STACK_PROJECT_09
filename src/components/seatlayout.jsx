import Seat from "./seat";

const rows = ["A", "B", "C", "D", "E"];
const seatsPerRow = 8;

function SeatLayout({ selectedSeats, occupiedSeats, onToggleSeat }) {
    return (
        <section className="seat-layout" aria-label="Select seats">
            <div className="screen">
                <span>SCREEN / STAGE</span>
            </div>

            <div className="seat-legend">
                <span><i className="legend-seat available" /> Available</span>
                <span><i className="legend-seat selected" /> Selected</span>
                <span><i className="legend-seat occupied" /> Unavailable</span>
            </div>

            <div className="seat-grid">
                {rows.map((row) => (
                    <div className="seat-row" key={row}>
                        <span className="row-label">{row}</span>

                        {Array.from(
                            { length: seatsPerRow },
                            (_, index) => `${row}${index + 1}`
                        ).map((seatId, index) => (
                            <Seat
                                key={seatId}
                                seatId={seatId}
                                number={index + 1}
                                occupied={occupiedSeats.includes(seatId)}
                                selected={selectedSeats.includes(seatId)}
                                onClick={onToggleSeat}
                            />
                        ))}

                        <span className="row-label">{row}</span>
                    </div>
                ))}
            </div>

            <p className="seat-demo-note">
                Seats are temporarily reserved when you start checkout and
                confirmed after Stripe verifies payment.
            </p>
        </section>
    );
}

export default SeatLayout;