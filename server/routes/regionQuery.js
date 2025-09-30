const express = require("express");
const router = express.Router();
const pool = require("../db");

// API for returning regions and IDs

const regionQuery = `
select 
    r.region_id, r.region_name 
    from regions r

`;

// API Endpoint to return every region

router.get("/api/regionQuery", async (req, res) => {
  try {
    const result = await pool.query(regionQuery, []);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Subsector query Has Failed)");
  }
});

module.exports = router;
