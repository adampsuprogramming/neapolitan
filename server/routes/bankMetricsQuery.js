const express = require("express");
const router = express.Router();
const pool = require("../db");

// Retrieves newest loan metrics for specified tranche

const bankMetricsQuery = `
SELECT *
FROM bank_metrics m
where m.collateral_id=$1
order by m.start_date desc
limit 1;
`;

router.get("/api/bankMetricsQuery", async (req, res) => {
  const { collateral_id } = req.query;
  try {
    const result = await pool.query(bankMetricsQuery, [collateral_id]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Metrics query failed)");
  }
});

module.exports = router;
