// ************************************************************************
// *       UT-15 – Testing /api/regionQuery endpoint’s functionality      *
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

describe("GET /api/regionQuery", () => {
  it("accepts region info request from the front-end, queries the database, and then returns it", async () => {
    mockedQuery.mockResolvedValue({
      rows: [
        {
          naics_subsector_id: 601,
          naics_subsector_name: "Narnia",
        },
        {
          naics_subsector_id: 602,
          naics_subsector_name: "Foon",
        },
        {
          naics_subsector_id: 603,
          naics_subsector_name: "Middle Earth",
        },
      ],
    });

    const response = await request(app).get("/api/regionQuery").query();

    expect(response.body).toEqual([
        {
          naics_subsector_id: 601,
          naics_subsector_name: "Narnia",
        },
        {
          naics_subsector_id: 602,
          naics_subsector_name: "Foon",
        },
        {
          naics_subsector_id: 603,
          naics_subsector_name: "Middle Earth",
        },
    ]);

    expect(mockedQuery).toHaveBeenCalledWith(
      `
select 
    r.region_id, r.region_name 
    from regions r

`,
      [],
    );
  });
});
