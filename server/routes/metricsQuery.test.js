// **************************************************************************
// *       UT-68 – Testing /api/metricsQuery endpoint’s functionality *
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

describe("GET /api/metricsQuery", () => {
  it("accepts loan tranche info request from the front-end, queries the database, and then returns it", async () => {
    mockedQuery.mockResolvedValue({
      rows: [
        {
          loan_metrics_id: 67891,
          tranche_id: 22222,
          is_cov_default: true,
          is_payment_default: true,
          leverage_ratio: 6.025,
          net_leverage_ratio: 6,
          int_coverage_ratio: 3,
          ebitda: 1500000,
          start_date: "2024-12-31",
          end_date: "2029-12-31",
          internal_val: 0.98,
        },
      ],
    });

    const response = await request(app).get("/api/metricsQuery").query({ tranche_id: 22222 });

    expect(response.body).toEqual([
      {
        loan_metrics_id: 67891,
        tranche_id: 22222,
        is_cov_default: true,
        is_payment_default: true,
        leverage_ratio: 6.025,
        net_leverage_ratio: 6,
        int_coverage_ratio: 3,
        ebitda: 1500000,
        start_date: "2024-12-31",
        end_date: "2029-12-31",
        internal_val: 0.98,
      },
    ]);

    expect(mockedQuery).toHaveBeenCalledWith(
      `
SELECT loan_metrics_id, tranche_id, is_cov_default, is_payment_default, leverage_ratio, net_leverage_ratio, int_coverage_ratio, ebitda, start_date, end_date, internal_val
FROM loan_metrics m
where m.tranche_id=$1
order by m.start_date desc
limit 1;
`,
      ["22222"],
    );
  });
});
