// ************************************************************************
// * UT-52– Determine that Node Receives Collateral Data and Sends out     *
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

describe("POST /api/createCollateral", () => {
  it("accepts data from a mocked api put and then runs an insert query on the database", async () => {
    mockedQuery
      .mockResolvedValueOnce({ rows: [{ collateral_id: "9876" }] }) //first insert sends back collateral's primary key
      .mockResolvedValueOnce({}); // second returns nothing (like the query actual query)

    const response = await request(app).post("/api/createCollateral").send({
      loanApprovalId: "333",
      debtFacilityId: "222",
      trancheId: "111",
      inclusionDate: "2025-10-31",
      outstandingAmount: 10000000.0,
      commitmentAmount: 10000000.0,
    });

    expect(response.status).toBe(201);

    expect(mockedQuery).toHaveBeenNthCalledWith(
      1,

      `
insert into collateral (inclusion_date, debt_facility_id, tranche_id, loan_approval_id)
values ($1,$2,$3,$4)
returning collateral_id
`,
      ["2025-10-31", "222", "111", "333"],
    );

    expect(mockedQuery).toHaveBeenNthCalledWith(
      2,

      `
insert into collateral_balance (collateral_id, start_date, outstanding_amount, commitment_amount)
values ($1,$2,$3,$4)
`,
      ["9876", "2025-10-31", 10000000.0, 10000000.0],
    );
  });
});
