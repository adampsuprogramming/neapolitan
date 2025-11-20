// ************************************************************************
// *       UT-118 – test getPieChartData(debtFacilityId)                  *
// ************************************************************************

// This mock must come before the import of object
jest.mock("../db");

const mockedQuery = jest.fn();
require("../db").query = mockedQuery;

const pool = require("../db");
pool.end = jest.fn();

const { getPieChartData } = require("../routes/pieChartQuery");

afterAll(async () => {
  await pool.end();
});

describe("test rollforwardQueries", () => {
  it("accepts a debtFacilityId and returns pie chart query data", async () => {
    mockedQuery.mockResolvedValue({
      rows: [
        {
          collateral_id: 150,
          debt_facility_id: 201,
          tranche_id: 236,
          lien_type: "First Lien",
          legal_name: "Buttercup & Bramble Ltd.",
          borrower_id: 205,
          corporate_hq_id: 5,
          hq_region_name: "Western Europe",
          revenue_geography_id: 8,
          rev_region_name: "Middle East",
          naics_subsector_id: 111,
          naics_subsector_name: "Crop Production",
          is_public: true,
        },
        {
          collateral_id: 153,
          debt_facility_id: 201,
          tranche_id: 239,
          lien_type: "Second Lien",
          legal_name: "Elfwood Delights",
          borrower_id: 208,
          corporate_hq_id: 2,
          hq_region_name: "Canada",
          revenue_geography_id: 12,
          rev_region_name: "Japan",
          naics_subsector_id: 211,
          naics_subsector_name: "Oil and Gas Extraction",
          is_public: false,
        },
        {
          collateral_id: 999,
          debt_facility_id: 201,
          tranche_id: 9999,
          lien_type: "Second Lien",

          borrower_id: 99999,
          corporate_hq_id: 2,
          hq_region_name: "Canada",
          revenue_geography_id: 8,
          rev_region_name: "Middle East",
          naics_subsector_id: 211,
          naics_subsector_name: "Oil and Gas Extraction",
          is_public: false,
        },
      ],
    });

    const result = await getPieChartData(201);

    expect(result).toEqual({
      rows: [
        {
          collateral_id: 150,
          debt_facility_id: 201,
          tranche_id: 236,
          lien_type: "First Lien",
          legal_name: "Buttercup & Bramble Ltd.",
          borrower_id: 205,
          corporate_hq_id: 5,
          hq_region_name: "Western Europe",
          revenue_geography_id: 8,
          rev_region_name: "Middle East",
          naics_subsector_id: 111,
          naics_subsector_name: "Crop Production",
          is_public: true,
        },
        {
          collateral_id: 153,
          debt_facility_id: 201,
          tranche_id: 239,
          lien_type: "Second Lien",
          legal_name: "Elfwood Delights",
          borrower_id: 208,
          corporate_hq_id: 2,
          hq_region_name: "Canada",
          revenue_geography_id: 12,
          rev_region_name: "Japan",
          naics_subsector_id: 211,
          naics_subsector_name: "Oil and Gas Extraction",
          is_public: false,
        },
        {
          collateral_id: 999,
          debt_facility_id: 201,
          tranche_id: 9999,
          lien_type: "Second Lien",

          borrower_id: 99999,
          corporate_hq_id: 2,
          hq_region_name: "Canada",
          revenue_geography_id: 8,
          rev_region_name: "Middle East",
          naics_subsector_id: 211,
          naics_subsector_name: "Oil and Gas Extraction",
          is_public: false,
        },
      ],
    });

    expect(mockedQuery).toHaveBeenCalledWith(
      `
SELECT 
c.collateral_id,
c.debt_facility_id,
lt.tranche_id, 
lt.lien_type, 
b.legal_name, 
b.borrower_id, 
b.corporate_hq_id, 
r_hq.region_name as hq_region_name,
b.revenue_geography_id, 
r_rev.region_name as rev_region_name,
b.naics_subsector_id, 
n.naics_subsector_name,
b.is_public
FROM collateral c
LEFT JOIN loan_tranches lt
ON c.tranche_id = lt.tranche_id
LEFT JOIN loan_agreements la
ON lt.loan_agreement_id = la.loan_agreement_id
LEFT JOIN borrowers b
ON la.borrower_id = b.borrower_id
LEFT JOIN regions r_hq
ON b.corporate_hq_id = r_hq.region_id
LEFT JOIN regions r_rev
ON b.revenue_geography_id = r_rev.region_id
LEFT JOIN naics_subsectors n
ON b.naics_subsector_id = n.naics_subsector_id
WHERE debt_facility_id = $1;
`,
      [201],
    );
  });
});
