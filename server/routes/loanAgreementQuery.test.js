// **************************************************************************
// *       UT-28 – Testing /api/loanagreementquery endpoint’s functionality *
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

describe("GET /api/loanagreementquery", () => {
  it("accepts loan agreement info request from the front-end, queries the database, and then returns it", async () => {
    mockedQuery.mockResolvedValue({
      rows: [
        {
          loan_agreement_id: 101,
          borrower_id: 501,
          loan_agreement_date: "2024-01-31",
          loan_agreement_name: "Loan Agreement Name 1"
        },
        {
          loan_agreement_id: 102,
          borrower_id: 501,
          loan_agreement_date: "2025-02-28",
          loan_agreement_name: "Loan Agreement Name 2"
        },
      ],
    });

    const response = await request(app).get("/api/loanagreementquery").query();

    expect(response.body).toEqual([
        {
          loan_agreement_id: 101,
          borrower_id: 501,
          loan_agreement_date: "2024-01-31",
          loan_agreement_name: "Loan Agreement Name 1"
        },
        {
          loan_agreement_id: 102,
          borrower_id: 501,
          loan_agreement_date: "2025-02-28",
          loan_agreement_name: "Loan Agreement Name 2"
        },
    ]);

    expect(mockedQuery).toHaveBeenCalledWith(
      `
select 
    l.loan_agreement_id, l.borrower_id, l.loan_agreement_date, l.loan_agreement_name
    from loan_agreements l

`,
      [],
    );
  });
});
