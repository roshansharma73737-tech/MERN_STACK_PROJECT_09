import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import Ticket_QR_function from "../components/ticketqr";

function Ticket(){
    const location  = useLocation();
    const navigate  = useNavigate();


    const ticket  = location.state?.ticket;

    if  (!ticket){
        return (
            <div className="ticket-page">
              <div className="ticket-card">
                <h1>No Ticket Found</h1>

                <p>
                   Please complete a payment first.
                </p>

                <button
                   onClick={() => navigate("/movies")}
                >
                  Browse Movies
                </button>
              </div>
            </div>
        );
    }

    return (
    <div className="ticket-page">

      <div className="ticket-card">

        <div className="ticket-header">
          <h1>TICKETLY</h1>

          <span className="success-badge">
            PAYMENT SUCCESS
          </span>
        </div>

        <div className="ticket-content">

          <div className="ticket-details">

            <h2>{ticket.title}</h2>

            <p>
              <strong>Type:</strong>{" "}
              {ticket.type}
            </p>

            <p>
              <strong>Date:</strong>{" "}
              {ticket.date}
            </p>

            <p>
              <strong>Time:</strong>{" "}
              {ticket.time}
            </p>

            <p>
              <strong>Seats:</strong>{" "}
              {ticket.seats.join(", ")}
            </p>

            <p>
              <strong>Amount:</strong>{" "}
              ₹{ticket.amount}
            </p>

            <p>
              <strong>Payment ID:</strong>{" "}
              {ticket.paymentId}
            </p>

            <p>
              <strong>Ticket ID:</strong>{" "}
              {ticket.ticketId}
            </p>

          </div>

          <Ticket_QR_function ticket={ticket} />

        </div>

        <button
          className="ticket-home-button"
          onClick={() => navigate("/")}
        >
          Back to Home
        </button>

      </div>

    </div>
  );
}


export default  Ticket;