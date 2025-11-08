const express = require("express");
const router = express.Router();
const pool = require("../db");

// Selecting every payment in the DB for a given portfolio

const paymentsQuery = `SELECT p.collateral_id, df.debt_facility_id, p.payment_date, p.principal_received, p.interest_received FROM payments p
left join collateral c
	on c.collateral_id = p.collateral_id
left join debt_facilities df
	on df.debt_facility_id = c.debt_facility_id
WHERE df.debt_facility_id=$1
ORDER BY payment_date DESC
`;

// API Endpoint to return every payment for given portfolio

router.get("/api/paymentsQuery", async (req, res) => {
  const { debtFacilityId } = req.query;
  try {
    const result = await pool.query(paymentsQuery, [debtFacilityId]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Payments Query Has Failed)");
  }
});

module.exports = router;
