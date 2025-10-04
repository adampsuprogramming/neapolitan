// ************************************************************************
// *       UT-39 – Testing /api/borrowerquery endpoint’s functionality    *
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

describe("GET /api/borrowerquery", () => {
  it("accepts borrower query request from the front-end, queries the database, and then returns it", async () => {
    mockedQuery.mockResolvedValue({
      rows: [
        {
          legal_name: "The Mario Company",
          borrower_id: 998,
        },
        {
          legal_name: "The Yoshi Corporation",
          borrower_id: 999,
        },
      ],
    });

    const response = await request(app).get("/api/borrowerquery").query();

    expect(response.body).toEqual([
      {
        legal_name: "The Mario Company",
        borrower_id: 998,
      },
      {
        legal_name: "The Yoshi Corporation",
        borrower_id: 999,
      },
    ]);

    expect(mockedQuery).toHaveBeenCalledWith(
      `
select 
    b.legal_name, b.borrower_id 
    from borrowers b
`,
      [],
    );
  });
});
