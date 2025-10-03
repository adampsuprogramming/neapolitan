const express = require("express");
const router = express.Router();
const pool = require("../db");

const loanAgreementQuery = `
select 
    l.loan_agreement_id, l.borrower_id, l.loan_agreement_date, l.loan_agreement_name, b.legal_name
from loan_agreements l
left join borrowers b
    on b.borrower_id = l.borrower_id

`;

router.get("/api/loanagreementquery", async (req, res) => {
  try {
    const result = await pool.query(loanAgreementQuery, []);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Loan agreement query failed");
  }
});

module.exports = router;
