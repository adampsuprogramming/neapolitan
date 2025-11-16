// ************************************************************************
// * UT-111– Determine if Node Receives Metrics Update and Sends Out      *
// * Correct SQL Update and Insert Commands                               *
// * UT-112- Determine if first query handles error properly              *
// * UT-113- Determine if second query handles error properly             *
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

describe("POST /api/createBankMetricsChange", () => {
  it("accepts data from a mocked api put and then runs an insert query on the database", async () => {
    mockedQuery.mockResolvedValueOnce({}).mockResolvedValueOnce({});

    const response = await request(app).post("/api/createBankMetricsChange").send({
      collateralId: "123",
      advanceRate: 0.655,
      valuation: 0.988,
      changeDate: "2025-09-30",
    });

    expect(response.status).toBe(201);

    expect(mockedQuery).toHaveBeenNthCalledWith(
      1,

      `UPDATE bank_metrics
SET end_date = $1
WHERE bank_metrics_id = (
      SELECT bank_metrics_id
      FROM bank_metrics
      WHERE collateral_id = $2
      ORDER BY start_date DESC
      LIMIT 1);`,
      ["2025-09-30", "123"],
    );

    expect(mockedQuery).toHaveBeenNthCalledWith(
      2,

      `INSERT INTO bank_metrics (collateral_id, advance_rate, valuation, start_date)
values ($1,$2,$3,$4);`,
      ["123", 0.655, 0.988, "2025-09-30"],
    );
  });
});

describe("POST /api/createMetricsChange", () => {
  it("accepts data from a mocked api and fails on the first query to the database", async () => {
    mockedQuery.mockRejectedValueOnce(new Error("Failure"));

    const response = await request(app).post("/api/createBankMetricsChange").send({
      collateralId: "123",
      advanceRate: 0.655,
      valuation: 0.988,
      changeDate: "2025-09-30",
    });

    expect(response.status).toBe(500);
  });
});

describe("POST /api/createMetricsChange", () => {
  it("accepts data from a mocked api put and then fails on the second query to the database", async () => {
    mockedQuery.mockResolvedValueOnce({}).mockRejectedValueOnce(new Error("Failure"));

    const response = await request(app).post("/api/createBankMetricsChange").send({
      collateralId: "123",
      advanceRate: 0.655,
      valuation: 0.988,
      changeDate: "2025-09-30",
    });

    expect(response.status).toBe(500);
  });
});
