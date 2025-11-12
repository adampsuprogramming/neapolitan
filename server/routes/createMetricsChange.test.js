// ************************************************************************
// * UT-65– Determine if Node Receives Metrics Update and Sends Out       *
// * Correct SQL Update and Insert Commands                               *
// * UT-66- Determine if first query handles error properly               *
// * UT-67- Determine if second query handles error properly              *
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

beforeEach(() => {
  mockedQuery.mockClear();
});

describe("POST /api/createMetricsChange", () => {
  it("accepts data from a mocked api put and then runs an insert query on the database", async () => {
    mockedQuery.mockResolvedValueOnce({}).mockResolvedValueOnce({});

    const response = await request(app).post("/api/createMetricsChange").send({
      trancheId: "112",
      changeDate: "2025-09-30",
      isCovDefault: true,
      isPaymentDefault: true,
      leverageRatio: 5,
      netLeverageRatio: 4.75,
      intCoverageRatio: 2,
      internalVal: 0.98,
      ebitda: 15000000,
    });

    expect(response.status).toBe(201);

    expect(mockedQuery).toHaveBeenNthCalledWith(
      1,

      `UPDATE loan_metrics
SET end_date = $1
WHERE loan_metrics_id = (
      SELECT loan_metrics_id
      FROM loan_metrics
      WHERE tranche_id = $2
      ORDER BY start_date DESC
      LIMIT 1);`,
      ["2025-09-30", "112"],
    );

    expect(mockedQuery).toHaveBeenNthCalledWith(
      2,

      `INSERT INTO loan_metrics (tranche_id, is_cov_default, is_payment_default, leverage_ratio, net_leverage_ratio, int_coverage_ratio, internal_val, ebitda, start_date)
values ($1,$2,$3,$4,$5,$6,$7,$8,$9);`,
      ["112", true, true, 5, 4.75, 2, .98, 15000000, "2025-09-30"],
    );
  });
});

describe("POST /api/createMetricsChange", () => {
  it("accepts data from a mocked api and fails on the first query to the database", async () => {
    mockedQuery.mockRejectedValueOnce(new Error("Failure"));

    const response = await request(app).post("/api/createMetricsChange").send({
      trancheId: "112",
      changeDate: "2025-09-30",
      isCovDefault: true,
      isPaymentDefault: true,
      leverageRatio: 5,
      netLeverageRatio: 4.75,
      intCoverageRatio: 2,
      internalVal: 0.98,
      ebitda: 15000000,
    });

    expect(response.status).toBe(500);
  });
});

describe("POST /api/createMetricsChange", () => {
  it("accepts data from a mocked api put and then fails on the second query to the database", async () => {
    mockedQuery.mockResolvedValueOnce({}).mockRejectedValueOnce(new Error("Failure"));

    const response = await request(app).post("/api/createMetricsChange").send({
      trancheId: "112",
      changeDate: "2025-09-30",
      isCovDefault: true,
      isPaymentDefault: true,
      leverageRatio: 5,
      netLeverageRatio: 4.75,
      intCoverageRatio: 2,
      internalVal: 0.98,
      ebitda: 15000000,
    });

    expect(response.status).toBe(500);
  });
});
