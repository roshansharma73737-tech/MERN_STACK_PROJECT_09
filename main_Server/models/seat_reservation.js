const mongoose = require("mongoose");

const seatReservationSchema = new mongoose.Schema(
    {
        showKey: {
            type: String,
            required: true
        },
        seat: {
            type: String,
            required: true
        },
        ticketId: {
            type: String,
            required: true
        },
        expiresAt: {
            type: Date,
            required: true
        }
    },
    { timestamps: true }
);

seatReservationSchema.index({ showKey: 1, seat: 1 }, { unique: true });
seatReservationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("seat_reservation", seatReservationSchema);
