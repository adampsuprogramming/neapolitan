const express = require("express");
const router = express.Router();
const pool = require("../db");

// Return loan approval data to populate collateral pledge page

const loanApprovalQuery = 
`
select 
	lap.approved_amount,
    lap.loan_approval_name,
    lap.approval_expiration,
	lt.tranche_name,
    lt.tranche_id,
    la.loan_agreement_name,
	b.legal_name,
    ln.lender_name,
    df.debt_facility_name,
    df.debt_facility_id,
    lap.loan_approval_id
from loan_approvals lap
left join loan_tranches lt
	on lt.tranche_id = lap.tranche_id
left join loan_agreements la
	on lt.loan_agreement_id = la.loan_agreement_id
left join borrowers b
	on la.borrower_id =b.borrower_id 
left join debt_facilities df
	on df.debt_facility_id = lap.debt_facility_id
left join lenders ln
    on ln.lender_id = df.lender_id 
`
;

// API Endpoint to return every loan approval in the db

router.get("/api/loanapprovalquery", async (req, res) => {
  try {
    const result = await pool.query(loanApprovalQuery, []);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Loan Approval Query Has Failed)");
  }
});

module.exports = router;
