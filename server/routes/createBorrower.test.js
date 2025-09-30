// ************************************************************************
// * UT-17– Determine that Node Receives Borrower Data and Sends Out      *
// * Correct SQL Inserts                                                  *
// ************************************************************************

jest.mock("../db");

const request = require("supertest");
const app = require("../app");

const mockedQuery = jest.fn();
require("../db").query = mockedQuery;

const pool = require("../db");
pool.end = jest.fn();

afterAll(async () => {
  await pool.end();
});

describe("POST /api/createborrower", () => {
  it("accepts borrower data from a mocked api put and then runs an insert query on the borrower record of the database", async () => {
    mockedQuery
      .mockResolvedValueOnce({}) //first insert sends back debt facility primary key
      
    const response = await request(app).post("/api/createborrower").send({
      debtFacilityName: "Mario Kart Facility",
      portfolioId: "2",
      lenderId: "102",
      startDate: "2025-01-02",
      endDate: "2030-01-02",
      overAllCommitmentAmount: 100000000,
      isOverallRate: true,
      overallRate: 0.65,
      isAssetByAssetAdvance: true,
      firstLienRate: 0.7,
      secondLienRate: 0.45,
      mezzRate: 0.3,
      isMinEquity: true,
      minEquityAmount: 5000000,


      legalName: "The Uncharted Company",
      shortName: "Uncharted Co.",
      corporateHqId: 123,
      revenueGeographyId: 456,
      naicsSubsectorId: 111,
      isPublic: true,
      tickerSymbol: "ABC",
    });

    expect(response.status).toBe(201);

    expect(mockedQuery).toHaveBeenCalledWith(
      `
insert into borrowers (legal_name, short_name, corporate_hq_id, revenue_geography_id, naics_subsector_id, is_public, ticker_symbol)
values ($1,$2,$3,$4,$5,$6,$7)
`,
      ["The Uncharted Company", "Uncharted Co.", 123, 456, 111, true, "ABC"],
    );


  });
});
