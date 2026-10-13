// import the  express 

const express = require("express");



const {createpayment,} = require("../controller/payment_setion");
const   authenticaion = require("../middleware/authmiddle");


const router = express.Router();

router.post("/create",authenticaion,createpayment);

module.exports = router;