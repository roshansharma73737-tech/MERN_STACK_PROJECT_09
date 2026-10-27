import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { apiRequest } from "../services/api";

export function PaymentSuccess() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get("session_id");
    const [message, setMessage] = useState("Verifying your payment with Stripe...");
    const [error, setError] = useState("");

    useEffect(() => {
        if (!sessionId) return undefined;

        let active = true;
        let attempts = 0;
        let timer;

        async function checkPayment() {
            try {
                const result = await apiRequest(
                    `/payment/session/${encodeURIComponent(sessionId)}`
                );
                if (!active) return;

                if (result.status === "confirmed" && result.ticketId) {
                    navigate(`/ticket/${encodeURIComponent(result.ticketId)}`, {
                        replace: true
                    });
                    return;
                }

                if (result.status === "failed" || result.status === "canceled") {
                    setError("Payment was not completed. No ticket has been issued.");
                    return;
                }

                attempts += 1;
                if (attempts >= 30) {
                    setError(
                        "Payment is still being confirmed. Return here shortly to check again."
                    );
                    return;
                }

                setMessage("Payment received. Waiting for secure confirmation...");
                timer = setTimeout(checkPayment, 2000);
            } catch (requestError) {
                if (active) setError(requestError.message);
            }
        }

        checkPayment();
        return () => {
            active = false;
            clearTimeout(timer);
        };
    }, [sessionId, navigate]);

    return (
        <main className="page">
            <section className="payment-panel">
                <h1>{error || !sessionId ? "Payment status" : "Confirming payment"}</h1>
                <p>
                    {!sessionId
                        ? "The Stripe checkout session is missing."
                        : error || message}
                </p>
                {(error || !sessionId) && (
                    <Link to="/movies" className="button">Back to movies</Link>
                )}
            </section>
        </main>
    );
}

export function PaymentCancelled() {
    return (
        <main className="page">
            <section className="payment-panel">
                <h1>Checkout cancelled</h1>
                <p>No ticket was issued. You can start a new booking whenever you’re ready.</p>
                <Link to="/movies" className="button">Browse movies</Link>
            </section>
        </main>
    );
}
