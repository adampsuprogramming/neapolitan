const express = require("express");
const router = express.Router();
const pool = require("../db");

const createAgreementSQL = `
insert into loan_agreements (loan_agreement_name, borrower_id, loan_agreement_date)
values ($1,$2,$3)
`;

router.post("/api/createloanagreement", async (req, res) => {
  const { loanAgreementName, borrowerId, loanAgreementDate } = req.body;

  try {
    await pool.query(createAgreementSQL, [
      loanAgreementName,
      borrowerId,
      loanAgreementDate,
    ]);
    res.sendStatus(201);
  } catch (err) {
    console.error(err);
    res.status(500).send("Loan Agreement Creation Failed");
  }
});

module.exports = router;
