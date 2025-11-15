const express = require("express");
const router = express.Router();
const pool = require("../db");

const bankMetricsDataUpdate = `UPDATE bank_metrics
SET end_date = $1
WHERE bank_metrics_id = (
      SELECT bank_metrics_id
      FROM bank_metrics
      WHERE collateral_id = $2
      ORDER BY start_date DESC
      LIMIT 1);`;

const bankMetricsDataInsert = `INSERT INTO bank_metrics (collateral_id, advance_rate, valuation, start_date)
values ($1,$2,$3,$4);`;

router.post("/api/createBankMetricsChange", async (req, res) => {
  const { collateralId, advanceRate, valuation, changeDate } = req.body;

  try {
    await pool.query(bankMetricsDataUpdate, [changeDate, collateralId]);
  } catch {
    res.status(500).send("DB create bank_metrics query failed");
    return;
  }

  try {
    await pool.query(bankMetricsDataInsert, [collateralId, advanceRate, valuation, changeDate]);
    res.sendStatus(201);
  } catch {
    res.status(500).send("DB create bank_metrics query failed");
    return;
  }
});

module.exports = router;
