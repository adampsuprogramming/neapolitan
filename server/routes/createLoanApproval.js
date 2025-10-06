const express = require("express");
const router = express.Router();
const pool = require("../db");

const createApprovalSQL = `
insert into loan_approvals (loan_approval_name, tranche_id, debt_facility_id, approval_date, approved_amount, approved_ebitda, approved_leverage, approved_int_coverage, approved_net_leverage, approved_advance_rate, approved_valuation)
values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
`;

router.post("/api/createloanapproval", async (req, res) => {
  const { approvalName, selectedTrancheId, selectedFacilityId, approvalDate, approvedAmount, approvedEbitda, approvedLeverageRatio, approvedInterestCoverage, approvedNetLeverageRatio, approvedAdvanceRate, approvedValue} = req.body;
  try {
    result = await pool.query(createApprovalSQL, [
      approvalName,  
      selectedTrancheId,
      selectedFacilityId,
      approvalDate,
      approvedAmount,
      approvedEbitda,
      approvedLeverageRatio,
      approvedInterestCoverage,
      approvedNetLeverageRatio,
      approvedAdvanceRate,
      approvedValue
    ]);
    res.sendStatus(201);
  } catch (err) {
    console.error(err);
    res.status(500).send("Loan Approval Creation Failed");
  }
});

module.exports = router;
