
const path = require("path");
require("dotenv").config({
    path: path.join(__dirname, ".env")
});

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authentication = require("./router/auth_routes");
const paymentsRoutes = require("./router/payment_routes");
const { handleStripeWebhook } = require("./controller/payment_setion");

const User = require("./models/user");
const Ticket = require("./models/ticket");
const SeatReservation = require("./models/seat_reservation");

const app = express();
const port = Number(process.env.PORT) || 5000;

const mongoUri = process.env.MongoDB;

if (!mongoUri || !process.env.JWT_SECRETkey) {
    console.error(
        "Missing MongoDB or JWT_SECRETkey in backend .env"
    );
    process.exit(1);
}

if (!/^mongodb(?:\+srv)?:\/\//i.test(mongoUri)) {
    console.error("MongoDB must be a valid MongoDB URI.");
    process.exit(1);
}

let frontendOrigin;

try {
    frontendOrigin = new URL(
        process.env.FRONTEND_URL || "http://localhost:5173"
    ).origin;
} catch {
    console.error("FRONTEND_URL must be a valid URL.");
    process.exit(1);
}

app.use(cors({ origin: frontendOrigin }));

// Stripe webhook must receive the raw request body.
app.post(
    "/api/payment/webhook",
    express.raw({ type: "application/json" }),
    handleStripeWebhook
);

// Parse normal JSON requests only after webhook registration.
app.use(express.json({ limit: "1mb" }));

app.use("/api/Authentication", authentication);
app.use("/api/payment", paymentsRoutes);

app.get("/", (req, res) => {
    res.json({
        message: "Ticketly backend is running."
    });
});

mongoose
    .connect(mongoUri)
    .then(async () => {
        await Promise.all([
            User.init(),
            Ticket.init(),
            SeatReservation.init()
        ]);

        console.log("MongoDB connected successfully.");

        app.listen(port, () => {
            console.log(
                `Ticketly server running on http://localhost:${port}`
            );
        });
    })
    .catch((error) => {
        console.error("MongoDB startup failed:", error.message);
        process.exit(1);
    });
