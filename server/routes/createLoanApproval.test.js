// ************************************************************************
// * UT-46– Determine if Node Receives Loan Approval Data and Sends Out  *
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

describe("POST /api/createloanapproval", () => {
  it("accepts loan approval from a mocked api put and then runs an insert query on the loan_approvals table of the database", async () => {
    mockedQuery.mockResolvedValueOnce({});

    const response = await request(app).post("/api/createloanapproval").send({
      approvalName: "2025-11-01 - Mario Bank - Zelda Company",
      selectedTrancheId: "3000",
      selectedFacilityId: "50000",
      approvalDate: "2025-11-01",
      approvalExpiration: "2025-12-10",
      approvedAmount: 48545646,
      approvedEbitda: 741210,
      approvedLeverageRatio: 5.45845,
      approvedInterestCoverage: 1.1,
      approvedNetLeverageRatio: 5.1154,
      approvedAdvanceRate: 0.6,
      approvedValue: 0.95,
    });

    expect(response.status).toBe(201);

    expect(mockedQuery).toHaveBeenCalledWith(
      `
insert into loan_approvals (loan_approval_name, tranche_id, debt_facility_id, approval_date, approval_expiration, approved_amount, approved_ebitda, approved_leverage, approved_int_coverage, approved_net_leverage, approved_advance_rate, approved_valuation)
values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
`,
      [
        "2025-11-01 - Mario Bank - Zelda Company",
        "3000",
        "50000",
        "2025-11-01",
        "2025-12-10",
        48545646,
        741210,
        5.45845,
        1.1,
        5.1154,
        0.6,
        0.95,
      ],
    );
  });
});
