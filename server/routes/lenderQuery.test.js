// ************************************************************************
// *       UT-10 – Testing /api/lenderquery endpoint’s functionality      *
// ************************************************************************

// This mock must come before the import of object
jest.mock("../db");

const request = require("supertest");
const app = require("../app");

const mockedQuery = jest.fn();
require("../db").query = mockedQuery;

const pool = require("../db");
pool.end = jest.fn();

afterAll(async () =>{
  await pool.end();
})

describe("GET /api/lenderquery", () => {
  it("accepts lender info request from the front-end, queries the database, and then returns it", async () => {
    mockedQuery.mockResolvedValue({
      rows: [
        {
        lender_name: "Hines Bank",
	    lender_id: 301,
        },
        {
        lender_name: "Merritt Bank",
	   lender_id: 302,
        },
      ],
    });

	const response = await request(app).get("/api/lenderquery").query();
	
	expect(response.body).toEqual([
        {
        lender_name: "Hines Bank",
	    lender_id: 301,
        },
        {
        lender_name: "Merritt Bank",
	   lender_id: 302,
        }
      ]);
		
expect(mockedQuery).toHaveBeenCalledWith(

`
select 
    l.lender_name, l.lender_id 
    from lenders l

`, []);


  });
});
