const express = require("express");
const router = express.Router();
const pool = require("../db");

const createLoanTrancheSQL = `
insert into loan_tranches (loan_agreement_id, tranche_type, lien_type, start_date, maturity_date, tranche_name)
values ($1,$2,$3,$4,$5,$6)
returning tranche_id
`;

const createLoanMetricsSQL = `
insert into loan_metrics (tranche_id, start_date, leverage_ratio, net_leverage_ratio, int_coverage_ratio, ebitda)
values ($1,$2,$3,$4,$5,$6)
`;

const createRateSQL = `
insert into rate_data (tranche_id, is_fixed, start_date, fixed_rate, spread, floor, has_floor, reference_rate)
values ($1,$2,$3,$4,$5,$6,$7,$8)
`;

router.post("/api/createloantranche", async (req, res) => {
  const {
    loanTrancheName,
    loanAgreementId,
    trancheType,
    lienType,
    trancheStart,
    trancheMaturity,
    ebitda,
    leverageRatio,
    netLeverageRatio,
    interestCoverage,
    rateType,
    fixedRate,
    spread,
    floor,
    refRate,
  } = req.body;

  try {
    result = await pool.query(createLoanTrancheSQL, [
      loanAgreementId,
      trancheType,
      lienType,
      trancheStart,
      trancheMaturity,
      loanTrancheName,
    ]);
    newTrancheId = result.rows[0].tranche_id;
  } catch (err) {
    console.error(err);
    res.status(500).send("DB create loan_tranches query failed");
  }

  try {
    await pool.query(createLoanMetricsSQL, [
      newTrancheId,
      trancheStart,
      leverageRatio,
      netLeverageRatio,
      interestCoverage,
      ebitda,
    ]);
  } catch (err) {
    console.error(err);
    res.status(500).send("DB create loan_metrics query failed");
  }

  try {
    const is_fixed = rateType == "Fixed Rate" ? true : false;
    const has_floor = floor == null ? false : true;

    await pool.query(createRateSQL, [
      newTrancheId,
      is_fixed,
      trancheStart,
      fixedRate,
      spread,
      floor,
      has_floor,
      refRate,
    ]);
    res.sendStatus(201);
  } catch (err) {
    console.error(err);
    res.status(500).send("DB create rate_data query failed");
  }
});

module.exports = router;
