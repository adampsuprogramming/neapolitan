const express = require("express");
const router = express.Router();
const pool = require("../db");

// Retrieves newest loan metrics for specified tranche

const collateralQuery = `
SELECT loan_metrics_id, tranche_id, is_cov_default, is_payment_default, leverage_ratio, net_leverage_ratio, int_coverage_ratio, ebitda, start_date, end_date
FROM loan_metrics m
where m.tranche_id=$1
order by m.start_date desc
limit 1;
`;

const additionsQuery = `
SELECT *
FROM collateral_balance
WHERE 
`;

router.get("/api/metricsQuery", async (req, res) => {
  const { tranche_id } = req.query;
  try {
    const result = await pool.query(collateralQuery, [tranche_id]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Metrics query failed)");
  }
});

module.exports = router;
