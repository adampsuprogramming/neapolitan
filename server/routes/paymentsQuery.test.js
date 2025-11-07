// **************************************************************************
// *       UT-?? – Testing /api/paymentsQuery endpoint’s functionality *
// **************************************************************************

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

describe("GET /api/paymentsQuery", () => {
  it("accepts payments info request from the front-end, queries the database, and then returns it", async () => {
    mockedQuery.mockResolvedValue({
      rows: [
        {
          collateral_id: 123,
          debt_facility_id:123456,
          payment_date:"2024-12-31",
          principal_received:555555,
          interest_received:777777,

        },
        {
          collateral_id: 789,
          debt_facility_id: 123456,
          payment_date:"2025-12-31",
          principal_received:888888,
          interest_received:999999,

        },
      ],
    });

    const response = await request(app).get("/api/paymentsQuery").query({ debtFacilityId: 123456 });

    expect(response.body).toEqual([
        {
          collateral_id: 123,
          debt_facility_id:123456,
          payment_date:"2024-12-31",
          principal_received:555555,
          interest_received:777777,

        },
        {
          collateral_id: 789,
          debt_facility_id: 123456,
          payment_date:"2025-12-31",
          principal_received:888888,
          interest_received:999999,

        },
      ],);

    expect(mockedQuery).toHaveBeenCalledWith(
      `SELECT p.collateral_id, df.debt_facility_id, p.payment_date, p.principal_received, p.interest_received FROM payments p
left join collateral c
	on c.collateral_id = p.collateral_id
left join debt_facilities df
	on df.debt_facility_id = c.debt_facility_id
WHERE df.debt_facility_id=$1
ORDER BY payment_date DESC
`,
      ["123456"],
    );
  });
});
