const express = require("express");
const router = express.Router();
const pool = require("../db");

const rateDataUpdate = `UPDATE rate_data
SET end_date = $1
WHERE rate_data_id = (
      SELECT rate_data_id
      FROM rate_data
      WHERE tranche_id = $2
      ORDER BY start_date DESC
      LIMIT 1);`;

const rateDataInsert = `INSERT INTO rate_data (tranche_id, is_fixed, fixed_rate, spread, floor, start_date, has_floor, reference_rate)
values ($1,$2,$3,$4,$5,$6,$7,$8);`;

router.post("/api/createratechange", async (req, res) => {
  const { trancheId, changeDate, rateType, fixedCoupon, spread, floor, refRate } = req.body;

  try {
    await pool.query(rateDataUpdate, [changeDate, trancheId]);
  } catch (err) {
    console.error(err);
    res.status(500).send("DB create debt_facility query failed");
  }

  try {
    const isFixed = rateType == "Fixed Rate" ? true : false;
    const hasFloor = floor > 0 ? true : false;
    await pool.query(rateDataInsert, [
      trancheId,
      isFixed,
      fixedCoupon,
      spread,
      floor,
      changeDate,
      hasFloor,
      refRate,
    ]);
    res.sendStatus(201);
  } catch (err) {
    console.error(err);
    res.status(500).send("DB create debt_facility_options query failed");
  }
});

module.exports = router;
