// ************************************************************************
// * UT-70– Determine if node receives payment creation request and sends *
// * out correct SQL update and insert query                              *
// * on the database                                                      *
// * UT-71- Determine if first query handles error properly               *
// * UT-72- Determine if second query handles error properly              *
// * UT-73- Determine if third query handles error properly               *
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

describe("POST /api/createPayments", () => {
  it("accepts data from a mocked api put an update and insert query on the database", async () => {
    mockedQuery.mockResolvedValueOnce({}).mockResolvedValueOnce({}).mockResolvedValueOnce({});

    const response = await request(app)
      .post("/api/createPayments")
      .send({
        paymentDate: "2025-07-31",
        paymentsReceived: [
          {
            collateralId: 101,
            commitment: 53000000.0,
            outstanding: 53000000.0,
            principalReceived: 3000000.0,
            interestReceived: 200000.0,
          },
          {
            collateralId: 102,
            commitment: 94000000.0,
            outstanding: 94000000.0,
            principalReceived: 4000000.0,
            interestReceived: 300000.0,
          },
        ],
      });

    expect(response.status).toBe(201);

    expect(mockedQuery).toHaveBeenNthCalledWith(
      1,

      `

WITH latest AS (
  SELECT DISTINCT ON (collateral_id)
    collateral_balance_id,
    collateral_id
  FROM collateral_balance
  ORDER BY collateral_id, start_date DESC
)
UPDATE collateral_balance c
SET end_date = $1
FROM latest l
WHERE c.collateral_balance_id = l.collateral_balance_id
  AND c.collateral_id = ANY($2)
`,
      ["2025-07-31", [101, 102]],
    );

    expect(mockedQuery).toHaveBeenNthCalledWith(
      2,

      `INSERT INTO collateral_balance (start_date, collateral_id, outstanding_amount, commitment_amount) VALUES ($1,$2,$3,$4),($5,$6,$7,$8);`,
      ["2025-07-31", 101, 53000000.0, 53000000.0, "2025-07-31", 102, 94000000.0, 94000000.0],
    );

    expect(mockedQuery).toHaveBeenNthCalledWith(
      3,

      `INSERT INTO payments (payment_date, collateral_id, principal_received, interest_received) VALUES ($1,$2,$3,$4),($5,$6,$7,$8);`,
      ["2025-07-31", 101, 3000000.0, 200000.0, "2025-07-31", 102, 4000000.0, 300000.0],
    );
  });
});

describe("POST /api/createPayments", () => {
  it("accepts data from a mocked api and fails on the first query to the database", async () => {
    mockedQuery.mockRejectedValueOnce(new Error("Failure"));

    const response = await request(app)
      .post("/api/createPayments")
      .send({
        paymentDate: "2025-07-31",
        paymentsReceived: [
          {
            collateralId: 101,
            commitment: 53000000.0,
            outstanding: 53000000.0,
            principalReceived: 3000000.0,
            interestReceived: 200000.0,
          },
          {
            collateralId: 102,
            commitment: 94000000.0,
            outstanding: 94000000.0,
            principalReceived: 4000000.0,
            interestReceived: 300000.0,
          },
        ],
      });

    expect(response.status).toBe(500);
  });
});

describe("POST /api/createPayments", () => {
  it("accepts data from a mocked api put and then fails on the second query to the database", async () => {
    mockedQuery.mockResolvedValueOnce({}).mockRejectedValueOnce(new Error("Failure"));

    const response = await request(app)
      .post("/api/createPayments")
      .send({
        paymentDate: "2025-07-31",
        paymentsReceived: [
          {
            collateralId: 101,
            commitment: 53000000.0,
            outstanding: 53000000.0,
            principalReceived: 3000000.0,
            interestReceived: 200000.0,
          },
          {
            collateralId: 102,
            commitment: 94000000.0,
            outstanding: 94000000.0,
            principalReceived: 4000000.0,
            interestReceived: 300000.0,
          },
        ],
      });

    expect(response.status).toBe(500);
  });
});

describe("POST /api/createPayments", () => {
  it("accepts data from a mocked api put and then fails on the third query to the database", async () => {
    mockedQuery
      .mockResolvedValueOnce({})
      .mockResolvedValueOnce({})
      .mockRejectedValueOnce(new Error("Failure"));

    const response = await request(app)
      .post("/api/createPayments")
      .send({
        paymentDate: "2025-07-31",
        paymentsReceived: [
          {
            collateralId: 101,
            commitment: 53000000.0,
            outstanding: 53000000.0,
            principalReceived: 3000000.0,
            interestReceived: 200000.0,
          },
          {
            collateralId: 102,
            commitment: 94000000.0,
            outstanding: 94000000.0,
            principalReceived: 4000000.0,
            interestReceived: 300000.0,
          },
        ],
      });

    expect(response.status).toBe(500);
  });
});
