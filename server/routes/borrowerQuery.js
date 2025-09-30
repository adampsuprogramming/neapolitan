const express = require("express");
const router = express.Router();
const pool = require("../db");

// Basic query for borrower and borrower id.  This is
// Selecting every borrower in the DB

const borrowerQuery = `
select 
    b.legal_name, b.borrower_id 
    from borrowers b
`;

// API Endpoint to return every borrower in the db

router.get("/api/borrowerquery", async (req, res) => {
  try {
    const result = await pool.query(borrowerQuery, []);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Borrower Query Has Failed");
  }
});



module.exports = router;
