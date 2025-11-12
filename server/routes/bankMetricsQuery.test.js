// **************************************************************************
// *       UT-__ – Testing /api/bankMetricsQuery endpoint’s functionality *
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

describe("GET /api/bankMetricsQuery", () => {
  it("accepts loan tranche info request from the front-end, queries the database, and then returns it", async () => {
    mockedQuery.mockResolvedValue({
      rows: [
        {
          collateral_id: 123456,
          tranche_id: 999,
          start_date: "2025-03-31",
          end_date: "2025-06-30",
          advance_rate: .655,
          valuation: .915,    
          bank_metrics_id: 789,     
        },
      ],
    });

    const response = await request(app).get("/api/bankMetricsQuery").query({ tranche_id: 999 });

    expect(response.body).toEqual([
      {
          collateral_id: 123456,
          tranche_id: 999,
          start_date: "2025-03-31",
          end_date: "2025-06-30",
          advance_rate: .655,
          valuation: .915,    
          bank_metrics_id: 789,     
      },
    ]);

    expect(mockedQuery).toHaveBeenCalledWith(
      `
SELECT *
FROM bank_metrics m
where m.tranche_id=$1
order by m.start_date desc
limit 1;
`,
      ["999"],
    );
  });
});
