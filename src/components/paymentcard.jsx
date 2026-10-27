function PaymentCard({ loading, error, onPay, disabled }) {
    return (
        <section className="payment-panel">
            <h2>Secure payment</h2>
            <p className="muted">
                Complete your payment on Stripe's secure checkout page.
            </p>

            <div className="payment-notice">
                <strong>Stripe Checkout</strong>
                <p>
                    Your ticket is issued only after Stripe confirms payment
                    with the backend.
                </p>
            </div>

            {error && <p className="error">{error}</p>}

            <button
                type="button"
                className="button full-width"
                onClick={onPay}
                disabled={loading || disabled}
            >
                {loading ? "Connecting to Stripe..." : "Pay securely with Stripe"}
            </button>
        </section>
    );
}

export default PaymentCard;
