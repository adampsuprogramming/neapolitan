// ************************************************************************
// *       UT-11 – Testing /api/portfolioquery endpoint’s functionality      *
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

describe("GET /api/portfolioquery", () => {
  it("accepts portfolio info request from the front-end, queries the database, and then returns it", async () => {
    mockedQuery.mockResolvedValue({
      rows: [
        {
          portfolio_name: "Game Fund",
          portfolio_id: 501,
        },
        {
          portfolio_name: "Scene Fund",
          portfolio_id: 502,
        },
      ],
    });

    const response = await request(app).get("/api/portfolioquery").query();

    expect(response.body).toEqual([
      {
        portfolio_name: "Game Fund",
        portfolio_id: 501,
      },
      {
        portfolio_name: "Scene Fund",
        portfolio_id: 502,
      },
    ]);

    expect(mockedQuery).toHaveBeenCalledWith(
      `
select 
    p.portfolio_name, p.portfolio_id 
    from portfolios p

`,
      [],
    );
  });
});
