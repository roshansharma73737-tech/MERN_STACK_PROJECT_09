const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema(
    {
        ticketId: {
            type: String,
            required: true,
            unique: true
        },
        paymentId: {
            type: String,
            required: true,
            unique: true
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true
        },
        type: {
            type: String,
            enum: ["movie", "event"],
            required: true
        },
        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 200
        },
        showDate: {
            type: String,
            required: true
        },
        showTime: {
            type: String,
            required: true
        },
        showDateTime: {
            type: Date,
            required: true
        },
        seats: {
            type: [String],
            required: true
        },
        amount: {
            type: Number,
            required: true,
            min: 0.01
        },
        currency: {
            type: String,
            required: true,
            default: "INR",
            uppercase: true,
            enum: ["INR"]
        },
        status: {
            type: String,
            enum: ["pending", "confirmed", "canceled", "failed"],
            default: "pending"
        },
        paymentMode: {
            type: String,
            enum: ["demo", "stripe"],
            default: "stripe"
        },
        stripeSessionId: {
            type: String,
            unique: true,
            sparse: true
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("ticket", ticketSchema);
