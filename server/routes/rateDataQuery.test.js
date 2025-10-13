// **************************************************************************
// *       UT-62 – Testing /api/ratedataquery endpoint’s functionality      *
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

describe("GET /api/ratedataquery", () => {
  it("accepts rate data info request from the front-end, queries the database, and then returns it", async () => {
    mockedQuery.mockResolvedValue({
      rows: [
        {
          rate_data_id: 1111,
          tranche_id: 5555,
          is_fixed: false,
          fixed_rate: null,
          spread: 0.05,
          floor: 0.025,
          start_date: "2023-01-01",
          end_date: "2026-09-30",
          has_floor: true,
          reference_rate: "LIBOR",
        },
      ],
    });

    const response = await request(app).get("/api/ratedataquery").query({tranche_id: "5555"});

    expect(response.body).toEqual([
      {
          rate_data_id: 1111,
          tranche_id: 5555,
          is_fixed: false,
          fixed_rate: null,
          spread: 0.05,
          floor: 0.025,
          start_date: "2023-01-01",
          end_date: "2026-09-30",
          has_floor: true,
          reference_rate: "LIBOR",
      },

    ]);

    expect(mockedQuery).toHaveBeenCalledWith(
      `
SELECT rate_data_id, tranche_id, is_fixed, fixed_rate, spread, floor, start_date, end_date, has_floor, reference_rate
FROM rate_data r
where r.tranche_id=$1
order by r.start_date desc
limit 1;
`,
      ["5555"],
    );
  });
});
