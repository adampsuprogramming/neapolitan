// **********************************************************************************
// *       UT-114 – Testing /api/borrowerquerybyfacility endpoint’s functionality   *
// **********************************************************************************

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

describe("GET /api/borrowerquerybyfacility", () => {
  it("accepts borrower query by facility request from the front-end, queries the database, and then returns it", async () => {
    mockedQuery.mockResolvedValue({
      rows: [
        {
          collateral_id: 123,
          debt_facility_id: 456,
          tranche_id: 789,
          inclusion_date: "2025-03-01",
          removed_date: null,
          legal_name: "The Mario Company",
        },
        {
          collateral_id: 111,
          debt_facility_id: 456,
          tranche_id: 777,
          inclusion_date: "2025-04-01",
          removed_date: null,
          legal_name: "The Yoshi Company",
        },
      ],
    });

    const response = await request(app)
      .get("/api/borrowerquerybyfacility")
      .query({ debtFacilityId: 456 });

    expect(response.body).toEqual([
      {
        collateral_id: 123,
        debt_facility_id: 456,
        tranche_id: 789,
        inclusion_date: "2025-03-01",
        removed_date: null,
        legal_name: "The Mario Company",
      },
      {
        collateral_id: 111,
        debt_facility_id: 456,
        tranche_id: 777,
        inclusion_date: "2025-04-01",
        removed_date: null,
        legal_name: "The Yoshi Company",
      },
    ]);

    expect(mockedQuery).toHaveBeenCalledWith(
      `SELECT c.collateral_id, c.debt_facility_id, c.tranche_id, c.inclusion_date, c.removed_date, b.legal_name
FROM collateral c
LEFT JOIN loan_tranches lt
  ON lt.tranche_id =c.tranche_id
LEFT JOIN loan_agreements la
  ON lt.loan_agreement_id = la.loan_agreement_id
LEFT JOIN borrowers b
  ON b.borrower_id = la.borrower_id
WHERE debt_facility_id = $1`,
      ["456"],
    );
  });
});
