// ************************************************************************
// *       UT-122 – test getDebtFacilities(portfolioId, asOfDate)         *
// ************************************************************************

// This mock must come before the import of object
jest.mock("../db");

const mockedQuery = jest.fn();
require("../db").query = mockedQuery;

const pool = require("../db");
pool.end = jest.fn();

const { getDebtFacilities } = require("../routes/debtFacilitiesInPortfolio");

afterAll(async () => {
  await pool.end();
});

describe("test getDebtFacilities(portfolioId, asOfDate)", () => {
  it("test ability of getDebtFacilities to accept portfolioID and asOfDate and return list of debt facilities IDs in a portfolio", async () => {
    mockedQuery.mockResolvedValue({
      rows: [
        {
          debt_facility_id: 111,
        },
        {
          debt_facility_id: 222,
        },
        {
          debt_facility_id: 333,
        },
      ],
    });

    const result = await getDebtFacilities(888, "2025-09-01");

    expect(result).toEqual({
      rows: [
        {
          debt_facility_id: 111,
        },
        {
          debt_facility_id: 222,
        },
        {
          debt_facility_id: 333,
        },
      ],
    });

    expect(mockedQuery).toHaveBeenCalledWith(
      `
SELECT d.debt_facility_id
FROM public.debt_facilities d
left join debt_facility_options dfo
	on dfo.debt_facility_id  = d.debt_facility_id 
WHERE d.portfolio_id=$1 and dfo.start_date<=$2 and (dfo.end_date>$2 OR dfo.end_date IS NULL);
`,
      [888, "2025-09-01"],
    );
  });
});
