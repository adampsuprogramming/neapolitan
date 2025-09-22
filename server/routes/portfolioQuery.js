const express = require("express");
const router = express.Router();
const pool = require("../db");

// Basic query for portfolios and portfolio id.  This is
// Selecting every portfolio in the DB

const portfolioQuery = `
select 
    p.portfolio_name, p.portfolio_id 
    from portfolios p

`;

// API Endpoint to return every portfolio in the db

router.get("/api/portfolioquery", async (req, res) => {
  try {
    const result = await pool.query(portfolioQuery, []);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Portfolio Query Has Failed)");
  }
});

module.exports = router;
