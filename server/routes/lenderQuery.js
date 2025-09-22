const express = require("express");
const router = express.Router();
const pool = require("../db");

// Basic query for lenders and lender id.  This is
// Selecting every lender in the DB

const lenderQuery = `
select 
    l.lender_name, l.lender_id 
    from lenders l

`;

// API Endpoint to return every lender in the db

router.get("/api/lenderquery", async (req, res) => {
  try {
    const result = await pool.query(lenderQuery, []);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Lender Query Has Failed)");
  }
});

module.exports = router;
