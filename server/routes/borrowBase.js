const express = require("express");
const router = express.Router();
const pool = require("../db");

// Basic query for borrowing base.  This will be separated into a separate file and folder along with
// all othese queries in the coming weeks.

const borrowBaseQuery = `
select 
	c.collateral_id,
	c.inclusion_date,
	c.removed_date,
	c.approval_date,
	c.approved_ebitda,
	c.approved_net_leverage,
	c.approved_int_coverage,
	c.approved_advance_rate,
	c.approved_valuation,
	c.approved_leverage,
	c.approved_ebitda,
	cb.commitment_amount,
	cb.outstanding_amount,
	lt.lien_type,
	lt.maturity_date,
	lt.tranche_type,
	la.loan_agreement_date,
	b.legal_name,
	b.short_name,
	lm.ebitda,
	lm.start_date,
	lm.int_coverage_ratio,
	lm.is_cov_default,
	lm.is_payment_default,
	lm.leverage_ratio,
	lm.loan_metrics_id,
	lm.net_leverage_ratio,
	rd.start_date,
	rd.end_date,
	rd.fixed_rate,
	rd.floor,
	rd.has_floor,
	rd.is_fixed,
	rd.reference_rate,
	rd.spread
from collateral c
left join collateral_balance cb 
	on cb.collateral_id = c.collateral_id 
	and cb.start_date <= $1
	and (cb.end_date > $1 or cb.end_date is null)
left join loan_tranches lt
	on lt.tranche_id = c.tranche_id
left join loan_agreements la
	on lt.loan_agreement_id = la.loan_agreement_id
left join borrowers b
	on la.borrower_id =b.borrower_id 
left join loan_metrics lm
	on lm.tranche_id =lt.tranche_id
	and lm.start_date <= $1
	and (lm.end_date > $1 or lm.end_date is null)
left join rate_data rd 
	on rd.tranche_id =lt.tranche_id
	and rd.start_date <= $1
	and (rd.end_date > $1 or rd.end_date is null)
where c.inclusion_date <= $1
	and (c.removed_date > $1 or c.removed_date is NULL)
`;



// route for borrorwing base query.  This will be expanded upong to receive input from user.

// router.get("/api/borrowbase", async (req, res) => {
//   try {
//     const result = await pool.query(borrowBaseQuery, ["2025-06-30"]);
//     res.json(result.rows);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("DB test tranches query failed)");
//   }
// });

router.get("/api/borrowbase", async (req, res) => {
  try {
    const result = await pool.query(borrowBaseQuery, ["2025-06-30"]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("DB test tranches query failed)");
  }
});


module.exports = router;