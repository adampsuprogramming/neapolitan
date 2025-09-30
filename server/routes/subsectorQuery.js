const express = require("express");
const router = express.Router();
const pool = require("../db");

// API for returning NAICS subsector names and IDs

const subsectorQuery = `
select 
    n.naics_subsector_id, n.naics_subsector_name 
    from naics_subsectors n

`;

// API Endpoint to return every subsector

router.get("/api/subsectorQuery", async (req, res) => {
  try {
    const result = await pool.query(subsectorQuery, []);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Subsector query Has Failed)");
  }
});

module.exports = router;
