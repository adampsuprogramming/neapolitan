const express = require("express");
const router = express.Router();
const pool = require("../db");

// Basic query for tranche_name and tranche_id.  This is
// Selecting every tranche in the DB

const loanTrancheQuery = `
select 
    lt.tranche_name, lt.tranche_id, lt.loan_agreement_id
    from loan_tranches lt
`;

// API Endpoint to return every lender in the db

router.get("/api/loantranchequery", async (req, res) => {
  try {
    const result = await pool.query(loanTrancheQuery, []);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Loan Tranche Query Has Failed)");
  }
});

module.exports = router;
