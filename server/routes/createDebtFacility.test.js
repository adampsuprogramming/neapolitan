// ************************************************************************
// * UT-6– Determine that Node Receives Debt Facility Data and Sends out  *
// * Correct SQL Inserts                                                  *
// ************************************************************************

// This mock must come before the import of object
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

describe("POST /api/createdebtfacility", () => {
  it("accepts data from a mocked api put and then runs an insert query on the database", async () => {
    mockedQuery
      .mockResolvedValueOnce({ rows: [{ debt_facility_id: 444 }] }) //first insert sends back debt facility primary key
      .mockResolvedValueOnce({}); // second returns nothing (like the query actual query)

    const response = await request(app).post("/api/createdebtfacility").send({
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
    });

    expect(response.status).toBe(201);

    expect(mockedQuery).toHaveBeenNthCalledWith(
      1,

      `
insert into debt_facilities (debt_facility_name, lender_id, portfolio_id)
values ($1,$2,$3)
returning debt_facility_id
`,
      ["Mario Kart Facility", "102", "2"],
    );

    expect(mockedQuery).toHaveBeenNthCalledWith(
      2,

      `
insert into debt_facility_options 
(debt_facility_id, 
start_date, 
end_date, 
overall_commitment_amount, 
is_overall_rate, 
overall_rate, 
is_asset_by_asset_advance, 
is_first_lien_advance_rate, 
first_lien_advance_rate, 
is_second_lien_advance_rate, 
second_lien_advance_rate, 
is_mezzanine_advance_rate, 
mezzanine_advance_rate, 
is_minimum_equity, 
minimum_equity_amount)
values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15);

`,
      [
        444,
        "2025-01-02",
        "2030-01-02",
        100000000,
        true,
        0.65,
        true,
        true,
        0.7,
        true,
        0.45,
        true,
        0.3,
        true,
        5000000,
      ],
    );
  });
});
