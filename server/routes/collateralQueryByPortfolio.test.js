// ************************************************************************
// *       UT-121 – test getCollateralByPortfolio(portfolioId, asOfDate)  *
// ************************************************************************

// This mock must come before the import of object
jest.mock("../db");

const mockedQuery = jest.fn();
require("../db").query = mockedQuery;

const pool = require("../db");
pool.end = jest.fn();

const { getCollateralByPortfolio } = require("../routes/collateralQueryByPortfolio");

afterAll(async () => {
  await pool.end();
});

describe("test getCollateralByPortfolio(portfolioId, asOfDate)", () => {
  it("test ability of collateralQueryByPortfolio to accept portfolioID and asOfDate and return collateral in a portfolio", async () => {
    mockedQuery.mockResolvedValue({
      rows: [
        {
          debt_facility_id: 111,
          inclusion_date: "2025-03-01",
          removed_date: null,
          collateral_id: 333,
          tranche_id: 150,
          loan_approval_id: 555,
        },
        {
          debt_facility_id: 111,
          inclusion_date: "2025-04-01",
          removed_date: null,
          collateral_id: 334,
          tranche_id: 151,
          loan_approval_id: 556,
        },
        {
          debt_facility_id: 222,
          inclusion_date: "2025-05-01",
          removed_date: null,
          collateral_id: 335,
          tranche_id: 152,
          loan_approval_id: 557,
        },
      ],
    });

    const result = await getCollateralByPortfolio(888, "2025-05-02");

    expect(result).toEqual({
      rows: [
        {
          debt_facility_id: 111,
          inclusion_date: "2025-03-01",
          removed_date: null,
          collateral_id: 333,
          tranche_id: 150,
          loan_approval_id: 555,
        },
        {
          debt_facility_id: 111,
          inclusion_date: "2025-04-01",
          removed_date: null,
          collateral_id: 334,
          tranche_id: 151,
          loan_approval_id: 556,
        },
        {
          debt_facility_id: 222,
          inclusion_date: "2025-05-01",
          removed_date: null,
          collateral_id: 335,
          tranche_id: 152,
          loan_approval_id: 557,
        },
      ],
    });

    expect(mockedQuery).toHaveBeenCalledWith(
      `
SELECT * 
FROM public.collateral c
left join debt_facilities d
	on c.debt_facility_id  = d.debt_facility_id 
WHERE d.portfolio_id=$1 and c.inclusion_date<=$2 and (c.removed_date>$2 OR c.removed_date IS NULL);
`,
      [888, "2025-05-02"],
    );
  });
});
