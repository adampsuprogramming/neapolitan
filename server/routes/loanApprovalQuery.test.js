// **************************************************************************
// *       UT-47 – Testing /api/loanapprovalquery endpoint’s functionality *
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

describe("GET /api/loanapprovalquery", () => {
  it("accepts loan approval info request from the front-end, queries the database, and then returns it", async () => {
    mockedQuery.mockResolvedValue({
      rows: [
        {
          approved_amount: 10000000,
          loan_approval_name: "Loan Approval Name 1",
          approval_expiration: "2023-01-01",
          tranche_name: "Tranche Name 1",
          tranche_id: 301,
          loan_agreement_name: "Loan Agreement Name 1",
          legal_name: "Legal Name 1",
          lender_name: "Lender 1",
          debt_facility_name: "Debt Facility 1",
          debt_facility_id: 501,
          loan_approval_id: 801,
        },
        {
          approved_amount: 20000000,
          loan_approval_name: "Loan Approval Name 2",
          approval_expiration: "2023-02-02",
          tranche_name: "Tranche Name 2",
          tranche_id: 302,
          loan_agreement_name: "Loan Agreement Name 2",
          legal_name: "Legal Name 2",
          lender_name: "Lender 2",
          debt_facility_name: "Debt Facility 2",
          debt_facility_id: 502,
          loan_approval_id: 802,
        },
      ],
    });

    const response = await request(app).get("/api/loanapprovalquery").query();

    expect(response.body).toEqual([
      {
        approved_amount: 10000000,
        loan_approval_name: "Loan Approval Name 1",
        approval_expiration: "2023-01-01",
        tranche_name: "Tranche Name 1",
        tranche_id: 301,
        loan_agreement_name: "Loan Agreement Name 1",
        legal_name: "Legal Name 1",
        lender_name: "Lender 1",
        debt_facility_name: "Debt Facility 1",
        debt_facility_id: 501,
        loan_approval_id: 801,
      },
      {
        approved_amount: 20000000,
        loan_approval_name: "Loan Approval Name 2",
        approval_expiration: "2023-02-02",
        tranche_name: "Tranche Name 2",
        tranche_id: 302,
        loan_agreement_name: "Loan Agreement Name 2",
        legal_name: "Legal Name 2",
        lender_name: "Lender 2",
        debt_facility_name: "Debt Facility 2",
        debt_facility_id: 502,
        loan_approval_id: 802,
      },
    ]);

    expect(mockedQuery).toHaveBeenCalledWith(
      `
select 
	lap.approved_amount,
    lap.loan_approval_name,
    lap.approval_expiration,
	lt.tranche_name,
    lt.tranche_id,
    la.loan_agreement_name,
	b.legal_name,
    ln.lender_name,
    df.debt_facility_name,
    df.debt_facility_id,
    lap.loan_approval_id
from loan_approvals lap
left join loan_tranches lt
	on lt.tranche_id = lap.tranche_id
left join loan_agreements la
	on lt.loan_agreement_id = la.loan_agreement_id
left join borrowers b
	on la.borrower_id =b.borrower_id 
left join debt_facilities df
	on df.debt_facility_id = lap.debt_facility_id
left join lenders ln
    on ln.lender_id = df.lender_id 
`,
      [],
    );
  });
});
