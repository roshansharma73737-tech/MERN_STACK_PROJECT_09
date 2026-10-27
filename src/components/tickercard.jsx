import TicketQr from "./ticketqr";

function TicketCard({ ticket, onHome }) {
    return (
        <div className="ticket-card">
            <div className="ticket-header">
                <h1>TICKETLY</h1>
                <span className="success-badge">
                    {ticket.paymentMode === "demo"
                        ? "DEMO CHECKOUT · TICKET CONFIRMED"
                        : "TICKET CONFIRMED"}
                </span>
            </div>

            <div className="ticket-content">
                <div className="ticket-details">
                    <h2>{ticket.title}</h2>
                    <p><strong>Type:</strong> {ticket.type}</p>
                    <p><strong>Date:</strong> {ticket.date || ticket.showDate}</p>
                    <p><strong>Time:</strong> {ticket.time || ticket.showTime}</p>
                    <p><strong>Seats:</strong> {ticket.seats.join(", ")}</p>
                    <p><strong>Amount:</strong> ₹{ticket.amount}</p>
                    {ticket.paymentId && (
                        <p><strong>Payment ID:</strong> {ticket.paymentId}</p>
                    )}
                    {ticket.ticketId && (
                        <p><strong>Ticket ID:</strong> {ticket.ticketId}</p>
                    )}
                </div>

                <TicketQr ticket={ticket} />
            </div>

            <button
                className="ticket-home-button"
                type="button"
                onClick={onHome}
            >
                Back to Home
            </button>
        </div>
    );
}

export default TicketCard;