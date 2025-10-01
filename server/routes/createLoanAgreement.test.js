// ************************************************************************
// * UT-25– Determine that Node Receives Loan Agreement Data and Sends Out*
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

describe("POST /api/createloanagreement", () => {
  it("accepts loan agreement data from a mocked api put and then runs an insert query on the loan_agreements table of the database", async () => {
    mockedQuery
      .mockResolvedValueOnce({}) 
      
    const response = await request(app).post("/api/createloanagreement").send({
          loanAgreementName: "The Luigi's Mansion Term Loan A Agreement",
          borrowerId: 998,
          loanAgreementDate: "2025-05-04",
    });

    expect(response.status).toBe(201);

    expect(mockedQuery).toHaveBeenCalledWith(
      `
insert into loan_agreements (loan_agreement_name, borrower_id, loan_agreement_date)
values ($1,$2,$3)
`,
      ["The Luigi's Mansion Term Loan A Agreement",998,"2025-05-04"],
    );


  });
});
