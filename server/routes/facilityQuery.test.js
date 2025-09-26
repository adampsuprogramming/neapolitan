// ************************************************************************
// *       UT-9– Testing /api/facilities endpoint’s functionality         *
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

describe("GET /api/facilities", () => {
  it("accepts a facility info query request from the front-end, queries the database, and then returns it", async () => {
    mockedQuery.mockResolvedValue({
      rows: [
        {
          portfolio_name: "Sonic Portfolio",
          debt_facility_name: "Racetrack Facility",
          debt_facility_id: 999,
          lender_name: "Silksong Lender",
          outstanding_amount: 777777.77,
          overall_commitment_amount: 888888.88,
        },
        {
          portfolio_name: "Toadstool Portfolio",
          debt_facility_name: "Mushroom Facility",
          debt_facility_id: 1000,
          lender_name: "Obra Dinn Lender",
          outstanding_amount: 111111.11,
          overall_commitment_amount: 222222.22,
        },
      ],
    });

    const response = await request(app).get("/api/facilities").query();

    expect(response.body).toEqual([
      {
        portfolio_name: "Sonic Portfolio",
        debt_facility_name: "Racetrack Facility",
        debt_facility_id: 999,
        lender_name: "Silksong Lender",
        outstanding_amount: 777777.77,
        overall_commitment_amount: 888888.88,
      },
      {
        portfolio_name: "Toadstool Portfolio",
        debt_facility_name: "Mushroom Facility",
        debt_facility_id: 1000,
        lender_name: "Obra Dinn Lender",
        outstanding_amount: 111111.11,
        overall_commitment_amount: 222222.22,
      },
    ]);

    expect(mockedQuery).toHaveBeenCalledWith(
      `
select 
	p.portfolio_name,
	d.debt_facility_name,
	d.debt_facility_id,
	l.lender_name,
	dfb.outstanding_amount,
	dfo.overall_commitment_amount 
from debt_facilities d
left join debt_facility_balances dfb
	on dfb.debt_facility_id  = d.debt_facility_id 
left join debt_facility_options dfo
	on dfo.debt_facility_id  = d.debt_facility_id 
left join portfolios p
	on d.portfolio_id = p.portfolio_id
left join lenders l
	on d.lender_id = l.lender_id 
`,
      [],
    );
  });
});
