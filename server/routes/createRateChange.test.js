// ************************************************************************
// * UT-53– Determine if Node Receives Floating Rate Update Data          *
// * and Sends Out Correct SQL Update and Insert Commands                 *
// * UT-63– Determine if Node Receives Fixed Rate Update Data             *
// * and Sends Out Correct SQL Update and Insert Commands                 *
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

describe("POST /api/createratechange", () => {
  it("accepts floating rate data from a mocked api put and then runs an insert query on the database", async () => {
    mockedQuery.mockResolvedValueOnce({}).mockResolvedValueOnce({});

    const response = await request(app).post("/api/createratechange").send({
      trancheId: "1111",
      changeDate: "2025-10-31",
      rateType: "Floating Rate",
      fixedCoupon: null,
      spread: 0.04,
      floor: 0.015,
      refRate: "LIBOR",
    });

    expect(response.status).toBe(201);

    expect(mockedQuery).toHaveBeenNthCalledWith(
      1,

      `UPDATE rate_data
SET end_date = $1
WHERE rate_data_id = (
      SELECT rate_data_id
      FROM rate_data
      WHERE tranche_id = $2
      ORDER BY start_date DESC
      LIMIT 1);`,
      ["2025-10-31", "1111"],
    );

    expect(mockedQuery).toHaveBeenNthCalledWith(
      2,

      `INSERT INTO rate_data (tranche_id, is_fixed, fixed_rate, spread, floor, start_date, has_floor, reference_rate)
values ($1,$2,$3,$4,$5,$6,$7,$8);`,
      ["1111", false, null, 0.04, 0.015, "2025-10-31", true, "LIBOR"],
    );
  });
});

describe("POST /api/createratechange", () => {
  it("accepts fixed rate data from a mocked api put and then runs an insert query on the database", async () => {
    mockedQuery.mockResolvedValueOnce({}).mockResolvedValueOnce({});

    const response = await request(app).post("/api/createratechange").send({
      trancheId: "1111",
      changeDate: "2025-10-31",
      rateType: "Fixed Rate",
      fixedCoupon: 0.1,
      spread: null,
      floor: null,
      refRate: null,
    });

    expect(response.status).toBe(201);

    expect(mockedQuery).toHaveBeenNthCalledWith(
      1,

      `UPDATE rate_data
SET end_date = $1
WHERE rate_data_id = (
      SELECT rate_data_id
      FROM rate_data
      WHERE tranche_id = $2
      ORDER BY start_date DESC
      LIMIT 1);`,
      ["2025-10-31", "1111"],
    );

    expect(mockedQuery).toHaveBeenNthCalledWith(
      2,

      `INSERT INTO rate_data (tranche_id, is_fixed, fixed_rate, spread, floor, start_date, has_floor, reference_rate)
values ($1,$2,$3,$4,$5,$6,$7,$8);`,
      ["1111", true, 0.1, null, null, "2025-10-31", false, null],
    );
  });
});
