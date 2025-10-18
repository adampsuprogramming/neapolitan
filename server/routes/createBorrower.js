const express = require("express");
const router = express.Router();
const pool = require("../db");

const createBorrowerSQL = `
insert into borrowers (legal_name, short_name, corporate_hq_id, revenue_geography_id, naics_subsector_id, is_public, ticker_symbol)
values ($1,$2,$3,$4,$5,$6,$7)
`;

router.post("/api/createborrower", async (req, res) => {
  const {
    legalName,
    shortName,
    corporateHqId,
    revenueGeographyId,
    naicsSubsectorId,
    isPublic,
    tickerSymbol,
  } = req.body;

  try {
    await pool.query(createBorrowerSQL, [
      legalName,
      shortName,
      corporateHqId,
      revenueGeographyId,
      naicsSubsectorId,
      isPublic,
      tickerSymbol,
    ]);
    res.sendStatus(201);
  } catch (err) {
    console.error(err);
    res.status(500).send("Borrower Creation Failed");
  }
});

module.exports = router;
