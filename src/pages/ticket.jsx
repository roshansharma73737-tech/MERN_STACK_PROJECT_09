import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";

import { apiRequest } from "../services/api";
import TicketCard from "../components/tickercard";

function Ticket(){
    const location = useLocation();
    const navigate = useNavigate();
    const { ticketId: routeTicketId } = useParams();
    const ticketId = routeTicketId || location.state?.ticket?.ticketId;
    const [verification, setVerification] = useState(null);

    useEffect(() => {
        let active = true;

        if (!ticketId) {
            return;
        }

        apiRequest(`/payment/verify/${encodeURIComponent(ticketId)}`)
            .then((data) => {
                if (!data?.ticket?.ticketId || data.ticket.status !== "confirmed") {
                    throw new Error("The server could not confirm this ticket.");
                }
                if (active) {
                    setVerification({
                        ticketId,
                        ticket: data.ticket,
                        error: ""
                    });
                }
            })
            .catch((requestError) => {
                if (active) {
                    setVerification({
                        ticketId,
                        ticket: null,
                        error: requestError.message
                    });
                }
            });

        return () => {
            active = false;
        };
    }, [ticketId]);

    if (!ticketId) {
        return (
            <main className="ticket-page">
                <div className="ticket-card">
                    <h1>Ticket not verified</h1>
                    <p>No ticket ID was provided.</p>
                    <Link to="/movies" className="button">Browse movies</Link>
                </div>
            </main>
        );
    }

    if (!verification || verification.ticketId !== ticketId) {
        return (
            <main className="ticket-page">
                <p>Verifying ticket...</p>
            </main>
        );
    }

    if (verification.error || !verification.ticket) {
        return (
            <main className="ticket-page">
                <div className="ticket-card">
                    <h1>Ticket not verified</h1>
                    <p>{verification.error || "This ticket could not be verified."}</p>
                    <Link to="/movies" className="button">Browse movies</Link>
                </div>
            </main>
        );
    }

    return (
        <main className="ticket-page">
            <TicketCard ticket={verification.ticket} onHome={() => navigate("/")} />
        </main>
    );
}


export default  Ticket;