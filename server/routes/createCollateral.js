const express = require("express");
const router = express.Router();
const pool = require("../db");

const createCollateral = `
insert into collateral (inclusion_date, debt_facility_id, tranche_id, loan_approval_id)
values ($1,$2,$3,$4)
returning collateral_id
`;

const createCollateralBalance = `
insert into collateral_balance (collateral_id, start_date, outstanding_amount, commitment_amount)
values ($1,$2,$3,$4)
`;

router.post("/api/createCollateral", async (req, res) => {
  const {
    loanApprovalId,
    debtFacilityId,
    trancheId,
    inclusionDate,
    outstandingAmount,
    commitmentAmount,
  } = req.body;

  try {
    result = await pool.query(createCollateral, [
      inclusionDate,
      debtFacilityId,
      trancheId,
      loanApprovalId,
    ]);
    newCollateralId = result.rows[0].collateral_id;
  } catch (err) {
    console.error(err);
    res.status(500).send("Collateral create query failed");
  }

  try {
    await pool.query(createCollateralBalance, [
      newCollateralId,
      inclusionDate,
      outstandingAmount,
      commitmentAmount,
    ]);
    res.sendStatus(201);
  } catch (err) {
    console.error(err);
    res.status(500).send("Collateral_balance create query failed");
  }
});

module.exports = router;
