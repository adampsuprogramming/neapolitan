// **************************************************************************
// *       UT-40a – Testing /api/loantranchequery endpoint’s functionality  *
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

describe("GET /api/loantranchequery", () => {
  it("accepts loan tranche info request from the front-end, queries the database, and then returns it", async () => {
    mockedQuery.mockResolvedValue({
      rows: [
        {
          tranche_id: 100001,
          tranche_name: "Loan Tranche Test 1",
          loan_agreement_id: 3,
        },
        {
          tranche_id: 100002,
          tranche_name: "Loan Tranche Test 2",
          loan_agreement_id: 4,
        },
      ],
    });

    const response = await request(app).get("/api/loantranchequery").query();

    expect(response.body).toEqual([
      {
        tranche_id: 100001,
        tranche_name: "Loan Tranche Test 1",
        loan_agreement_id: 3,
      },
      {
        tranche_id: 100002,
        tranche_name: "Loan Tranche Test 2",
        loan_agreement_id: 4,
      },
    ]);

    expect(mockedQuery).toHaveBeenCalledWith(
      `
select 
    lt.tranche_name, lt.tranche_id, lt.loan_agreement_id
    from loan_tranches lt
`,
      [],
    );
  });
});
