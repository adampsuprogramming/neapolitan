const express = require("express");
const router = express.Router();
const pool = require("../db");

// Basic query for facility balances.  This will be separated into a separate file and folder along with
// all othese queries in the coming weeks.

const facilityQuery = `
select 
	p.portfolio_name,
	d.debt_facility_name,
	d.debt_facility_id,
	l.lender_name,
	dfb.outstanding_amount,
	dfo.overall_commitment_amount 
from debt_facilities d
left join debt_facility_balances dfb
	on dfb.debt_facility_id  = d.debt_facility_id 
left join debt_facility_options dfo
	on dfo.debt_facility_id  = d.debt_facility_id 
left join portfolios p
	on d.portfolio_id = p.portfolio_id
left join lenders l
	on d.lender_id = l.lender_id 
`;

// route for borrorwing base query.  This will be expanded upong to receive input from user.

router.get("/api/facilities", async (req, res) => {
  try {
    const result = await pool.query(facilityQuery, []);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Facility query failed");
  }
});

module.exports = router;
