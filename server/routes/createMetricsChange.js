const express = require("express");
const router = express.Router();
const pool = require("../db");

const metricsDataUpdate = `UPDATE loan_metrics
SET end_date = $1
WHERE loan_metrics_id = (
      SELECT loan_metrics_id
      FROM loan_metrics
      WHERE tranche_id = $2
      ORDER BY start_date DESC
      LIMIT 1);`;

const metricsDataInsert = `INSERT INTO loan_metrics (tranche_id, is_cov_default, is_payment_default, leverage_ratio, net_leverage_ratio, int_coverage_ratio, ebitda, start_date)
values ($1,$2,$3,$4,$5,$6,$7,$8);`;

router.post("/api/createMetricsChange", async (req, res) => {
  const {
    trancheId,
    changeDate,
    isCovDefault,
    isPaymentDefault,
    leverageRatio,
    netLeverageRatio,
    intCoverageRatio,
    ebitda,
  } = req.body;

  try {
    await pool.query(metricsDataUpdate, [changeDate, trancheId]);
  } catch (err) {
    console.error(err);
    res.status(500).send("DB create loan_metrics query failed");
    return;
  }

  try {
    await pool.query(metricsDataInsert, [
      trancheId,
      isCovDefault,
      isPaymentDefault,
      leverageRatio,
      netLeverageRatio,
      intCoverageRatio,
      ebitda,
      changeDate,
    ]);
    res.sendStatus(201);
  } catch (err) {
    console.error(err);
    res.status(500).send("DB create loan_metrics query failed");
    return;
  }
});

module.exports = router;
