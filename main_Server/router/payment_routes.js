const express = require("express");
const {
    createCheckout,
    getCheckoutStatus,
    getSeatAvailability,
    verifyTicket
} = require("../controller/payment_setion");
const authentication = require("../middleware/authmiddle");

const router = express.Router();

router.get("/verify/:ticketId", verifyTicket);
router.get("/availability", getSeatAvailability);
router.get("/session/:sessionId", authentication, getCheckoutStatus);
router.post("/checkout", authentication, createCheckout);

module.exports = router;