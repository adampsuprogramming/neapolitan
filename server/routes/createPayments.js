const express = require("express");
const router = express.Router();
const pool = require("../db");

//PLACEHOLDER PAYMENT CREATE



router.post("/api/createPayments", async (req, res) => {
  const {
    paymentDate,
    paymentsReceived,
  } = req.body;


  try {
    console.log(paymentDate, paymentsReceived);
    res.sendStatus(201);
  } catch (err) {
    console.error(err);
    res.status(500).send("Creating payment records in database failed");
  }
});

module.exports = router;
