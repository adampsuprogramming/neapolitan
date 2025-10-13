const express = require("express");
const router = express.Router();
const pool = require("../db");

// Retrieves newest rate data for specified tranche

const rateQuery = `
SELECT rate_data_id, tranche_id, is_fixed, fixed_rate, spread, floor, start_date, end_date, has_floor, reference_rate
FROM rate_data r
where r.tranche_id=$1
order by r.start_date desc
limit 1;
`;

router.get("/api/rateDataQuery", async (req, res) => {
  const { tranche_id } = req.query;
  try {
    const result = await pool.query(rateQuery, [tranche_id]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Rate query failed)");
  }
});

module.exports = router;
