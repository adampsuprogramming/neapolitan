// ************************************************************************
// *       UT-16 – Testing /api/subsectorQuery endpoint’s functionality      *
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

describe("GET /api/subsectorQuery", () => {
  it("accepts subsectorQuery info request from the front-end, queries the database, and then returns it", async () => {
    mockedQuery.mockResolvedValue({
      rows: [
        {
          naics_subsector_id: 500,
          naics_subsector_name: "video game production",
        },
        {
          naics_subsector_id: 501,
          naics_subsector_name: "pizza making",
        },
        {
          naics_subsector_id: 502,
          naics_subsector_name: "travel",
        },
      ],
    });

    const response = await request(app).get("/api/subsectorQuery").query();

    expect(response.body).toEqual([
      {
        naics_subsector_id: 500,
        naics_subsector_name: "video game production",
      },
      {
        naics_subsector_id: 501,
        naics_subsector_name: "pizza making",
      },
      {
        naics_subsector_id: 502,
        naics_subsector_name: "travel",
      },
    ]);

    expect(mockedQuery).toHaveBeenCalledWith(
      `
select 
    n.naics_subsector_id, n.naics_subsector_name 
    from naics_subsectors n

`,
      [],
    );
  });
});
