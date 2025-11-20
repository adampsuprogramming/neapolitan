// ******************************************************************
// * UT-116 – Pie Chart Calculations Unit Test                      *
// * UT-117 - Pie Chart Calculations Unit Test (Handling missing )  *
// *          collateral name record, bank record, loan approval    *
// *          record, and internal valuation record                 *
// ******************************************************************

const request = require("supertest");
const app = require("../app");

const rollforwardQueries = require("./rollforwardQueries");
const processIds = require("./processIds");
const processBalanceData = require("./processBalanceData");
const pieChartQuery = require("./pieChartQuery");

jest.mock("../routes/rollforwardQueries");
jest.mock("../routes/processIds");
jest.mock("../routes/processBalanceData");
jest.mock("../routes/processAdvanceRates");
jest.mock("./processBankValuations");
jest.mock("./processInternalValuations");
jest.mock("./processPayments");
jest.mock("./pieChartQuery");

describe("GET /api/pieChartCalculations", () => {
  it("accepts region info request from the front-end, retrieves data, processes, and then returns it", async () => {
    rollforwardQueries.getFacilityCollateral.mockResolvedValue({
      rows: [
        {
          inclusion_date: new Date("2025-02-27T00:00:00"),
          removed_date: new Date("2025-08-15T00:00:00"),
          collateral_id: 150,
          tranche_id: 236,
          loan_approval_id: 147,
        },
        {
          inclusion_date: new Date("2025-07-14T00:00:00"),
          removed_date: null,
          collateral_id: 153,
          tranche_id: 239,
          loan_approval_id: 150,
        },
        {
          inclusion_date: new Date("2025-04-01T00:00:00"),
          removed_date: null,
          collateral_id: 999,
          tranche_id: 9999,
          loan_approval_id: 777,
        },
      ],
    });

    rollforwardQueries.getBalances.mockResolvedValue({
      rows: [
        {
          collateral_balance_id: 209,
          collateral_id: 153,
          start_date: new Date("2025-07-31T00:00:00"),
          end_date: new Date("2025-08-31T00:00:00"),
          outstanding_amount: 14800000,
          commitment_amount: 14800000,
          debt_facility_id: 201,
          inclusion_date: new Date("2025-07-14T00:00:00"),
          removed_date: null,
          collateral_id_2: 153,
          tranche_id: 239,
          loan_approval_id: 150,
        },
        {
          collateral_balance_id: 218,
          collateral_id: 153,
          start_date: new Date("2025-09-30T00:00:00"),
          end_date: new Date("2025-10-31T00:00:00"),
          outstanding_amount: 14325000,
          commitment_amount: 14325000,
          debt_facility_id: 201,
          inclusion_date: new Date("2025-07-14T00:00:00"),
          removed_date: null,
          collateral_id_2: 153,
          tranche_id: 239,
          loan_approval_id: 150,
        },
        {
          collateral_balance_id: 207,
          collateral_id: 150,
          start_date: new Date("2025-07-31T00:00:00"),
          end_date: new Date("2025-08-15T00:00:00"),
          outstanding_amount: 10600000,
          commitment_amount: 10600000,
          debt_facility_id: 201,
          inclusion_date: new Date("2025-02-27T00:00:00"),
          removed_date: new Date("2025-08-15T00:00:00"),
          collateral_id_2: 150,
          tranche_id: 236,
          loan_approval_id: 147,
        },
        {
          collateral_balance_id: 203,
          collateral_id: 150,
          start_date: new Date("2025-06-30T00:00:00"),
          end_date: new Date("2025-07-31T00:00:00"),
          outstanding_amount: 10850000,
          commitment_amount: 10850000,
          debt_facility_id: 201,
          inclusion_date: new Date("2025-02-27T00:00:00"),
          removed_date: new Date("2025-08-15T00:00:00"),
          collateral_id_2: 150,
          tranche_id: 236,
          loan_approval_id: 147,
        },
        {
          collateral_balance_id: 191,
          collateral_id: 153,
          start_date: new Date("2025-07-14T00:00:00"),
          end_date: new Date("2025-07-31T00:00:00"),
          outstanding_amount: 15000000,
          commitment_amount: 15000000,
          debt_facility_id: 201,
          inclusion_date: new Date("2025-07-14T00:00:00"),
          removed_date: null,
          collateral_id_2: 153,
          tranche_id: 239,
          loan_approval_id: 150,
        },
        {
          collateral_balance_id: 188,
          collateral_id: 150,
          start_date: new Date("2025-02-27T00:00:00"),
          end_date: new Date("2025-03-31T00:00:00"),
          outstanding_amount: 12500000,
          commitment_amount: 12500000,
          debt_facility_id: 201,
          inclusion_date: new Date("2025-02-27T00:00:00"),
          removed_date: new Date("2025-08-15T00:00:00"),
          collateral_id_2: 150,
          tranche_id: 236,
          loan_approval_id: 147,
        },
        {
          collateral_balance_id: 214,
          collateral_id: 153,
          start_date: new Date("2025-08-31T00:00:00"),
          end_date: new Date("2025-09-30T00:00:00"),
          outstanding_amount: 14725000,
          commitment_amount: 14725000,
          debt_facility_id: 201,
          inclusion_date: new Date("2025-07-14T00:00:00"),
          removed_date: null,
          collateral_id_2: 153,
          tranche_id: 239,
          loan_approval_id: 150,
        },
        {
          collateral_balance_id: 195,
          collateral_id: 150,
          start_date: new Date("2025-03-31T00:00:00"),
          end_date: new Date("2025-04-30T00:00:00"),
          outstanding_amount: 11750000,
          commitment_amount: 11750000,
          debt_facility_id: 201,
          inclusion_date: new Date("2025-02-27T00:00:00"),
          removed_date: new Date("2025-08-15T00:00:00"),
          collateral_id_2: 150,
          tranche_id: 236,
          loan_approval_id: 147,
        },
        {
          collateral_balance_id: 197,
          collateral_id: 150,
          start_date: new Date("2025-04-30T00:00:00"),
          end_date: new Date("2025-05-31T00:00:00"),
          outstanding_amount: 11250000,
          commitment_amount: 11250000,
          debt_facility_id: 201,
          inclusion_date: new Date("2025-02-27T00:00:00"),
          removed_date: new Date("2025-08-15T00:00:00"),
          collateral_id_2: 150,
          tranche_id: 236,
          loan_approval_id: 147,
        },
        {
          collateral_balance_id: 200,
          collateral_id: 150,
          start_date: new Date("2025-05-31T00:00:00"),
          end_date: new Date("2025-06-30T00:00:00"),
          outstanding_amount: 11000000,
          commitment_amount: 11000000,
          debt_facility_id: 201,
          inclusion_date: new Date("2025-02-27T00:00:00"),
          removed_date: new Date("2025-08-15T00:00:00"),
          collateral_id_2: 150,
          tranche_id: 236,
          loan_approval_id: 147,
        },
        {
          collateral_balance_id: 222,
          collateral_id: 153,
          start_date: new Date("2025-10-31T00:00:00"),
          end_date: null,
          outstanding_amount: 14125000,
          commitment_amount: 14125000,
          debt_facility_id: 201,
          inclusion_date: new Date("2025-07-14T00:00:00"),
          removed_date: null,
          collateral_id_2: 153,
          tranche_id: 239,
          loan_approval_id: 150,
        },
        {
          collateral_balance_id: 5555,
          collateral_id: 999,
          start_date: new Date("2025-04-01T00:00:00"),
          end_date: null,
          outstanding_amount: 5000000,
          commitment_amount: 5000000,
          debt_facility_id: 201,
          inclusion_date: new Date("2025-04-01T00:00:00"),
          removed_date: null,
          collateral_id_2: 999,
          tranche_id: 9999,
          loan_approval_id: 777,
        },
      ],
    });

    rollforwardQueries.getBankMetrics.mockResolvedValue({
      rows: [
        {
          collateral_id: 150,
          start_date: new Date("2025-02-27T00:00:00"),
          end_date: new Date("2025-08-15T00:00:00"),
          advance_rate: 0.65,
          valuation: 0.9,
          bank_metrics_id: 4,
          debt_facility_id: 201,
          inclusion_date: new Date("2025-02-27T00:00:00"),
          removed_date: new Date("2025-08-15T00:00:00"),
          collateral_id_2: 150,
          tranche_id: 236,
          loan_approval_id: 147,
          debt_facility_name: "Skyrim Debt Facility",
          portfolio_id: 3,
          lender_id: 2,
          debt_facility_id_2: 201,
        },
        {
          collateral_id: 153,
          start_date: new Date("2025-07-14T00:00:00"),
          end_date: null,
          advance_rate: 0.4,
          valuation: 0.89,
          bank_metrics_id: 5,
          debt_facility_id: 201,
          inclusion_date: new Date("2025-07-14T00:00:00"),
          removed_date: null,
          collateral_id_2: 153,
          tranche_id: 239,
          loan_approval_id: 150,
          debt_facility_name: "Skyrim Debt Facility",
          portfolio_id: 3,
          lender_id: 2,
          debt_facility_id_2: 201,
        },
        {
          collateral_id: 999,
          start_date: new Date("2025-04-01T00:00:00"),
          end_date: null,
          advance_rate: 0.5,
          valuation: 0.95,
          bank_metrics_id: 4444,
          debt_facility_id: 201,
          inclusion_date: new Date("2025-04-01T00:00:00"),
          removed_date: null,
          collateral_id_2: 999,
          tranche_id: 9999,
          loan_approval_id: 77777,
          debt_facility_name: "Stranger Things Company",
          portfolio_id: 3,
          lender_id: 2,
          debt_facility_id_2: 201,
        },
      ],
    });

    rollforwardQueries.getLoanApprovalInfo.mockResolvedValue({
      rows: [
        {
          collateral_id: 153,
          approved_valuation: 0.98,
          approved_advance_rate: 0.4,
        },
        {
          collateral_id: 150,
          approved_valuation: 0.98,
          approved_advance_rate: 0.7,
        },
        {
          collateral_id: 999,
          approved_valuation: 0.95,
          approved_advance_rate: 0.5,
        },
      ],
    });

    rollforwardQueries.getInternalValInfo.mockResolvedValue({
      rows: [
        {
          collateral_id: 150,
          start_date: new Date("2025-02-20T00:00:00"),
          end_date: new Date("2025-08-15T00:00:00"),
          internal_val: 0.98,
        },
        {
          collateral_id: 153,
          start_date: new Date("2025-07-14T00:00:00"),
          end_date: null,
          internal_val: 1,
        },
        {
          collateral_id: 999,
          start_date: new Date("2025-04-01T00:00:00"),
          end_date: null,
          internal_val: 0.78,
        },
      ],
    });

    rollforwardQueries.getCollateralNames.mockResolvedValue({
      rows: [
        {
          collateral_id: 150,
          legal_name: "Buttercup & Bramble Ltd.",
          short_name: "Buttercup",
        },
        {
          collateral_id: 153,
          legal_name: "Elfwood Delights",
          short_name: "Elfwood",
        },
        {
          collateral_id: 999,
          legal_name: "Stranger Things Company",
          short_name: "Stranger Things Co.",
        },
      ],
    });

    pieChartQuery.getPieChartData.mockResolvedValue({
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
          legal_name: "Stranger Things Company",
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

    processIds.getIdsAtEndOfPeriod.mockReturnValue([
      { collateralId: 150, removedDate: new Date("2025-08-15T00:00:00") },
      { collateralId: 153, removedDate: null },
      { collateralId: 999, removedDate: null },
    ]);

    processBalanceData.getEndOfPeriodBalances.mockReturnValue([
      {
        collateralId: 153,
        endBalance: 15000000,
      },
      {
        collateralId: 150,
        endBalance: 10850000,
      },
      {
        collateralId: 999,
        endBalance: 5000000,
      },
    ]);

    const response = await request(app).get("/api/pieChartCalculations").query({
      debtFacilityId: 201,
      asOfDate: "2025-07-25",
    });

    expect(response.body).toEqual([
      {
        collateralId: 150,
        collateralName: "Buttercup & Bramble Ltd.",
        valuationPercentage: 0.9,
        outstandingBalance: 10850000,
        valuation: 9765000,
        lienType: "First Lien",
        corpHQId: 5,
        corpHQRegionName: "Western Europe",
        revRegionID: 8,
        revRegionName: "Middle East",
        naicsCode: 111,
        naicsSubsector: "Crop Production",
        isPublic: "Public",
      },

      {
        collateralId: 153,
        collateralName: "Elfwood Delights",
        valuationPercentage: 0.89,
        outstandingBalance: 15000000,
        valuation: 13350000,
        lienType: "Second Lien",
        corpHQId: 2,
        corpHQRegionName: "Canada",
        revRegionID: 12,
        revRegionName: "Japan",
        naicsCode: 211,
        naicsSubsector: "Oil and Gas Extraction",
        isPublic: "Private",
      },
      {
        collateralId: 999,
        collateralName: "Stranger Things Company",
        valuationPercentage: 0.78,
        outstandingBalance: 5000000,
        valuation: 3900000,
        lienType: "Second Lien",
        corpHQId: 2,
        corpHQRegionName: "Canada",
        revRegionID: 8,
        revRegionName: "Middle East",
        naicsCode: 211,
        naicsSubsector: "Oil and Gas Extraction",
        isPublic: "Private",
      },
    ]);
  });

  it("accepts region info request from the front-end, retrieves data, processes, and then returns it - missing collateral name record, bank record, loan approval record, internal valuation record", async () => {
    rollforwardQueries.getFacilityCollateral.mockResolvedValue({
      rows: [
        {
          inclusion_date: new Date("2025-02-27T00:00:00"),
          removed_date: new Date("2025-08-15T00:00:00"),
          collateral_id: 150,
          tranche_id: 236,
          loan_approval_id: 147,
        },
        {
          inclusion_date: new Date("2025-07-14T00:00:00"),
          removed_date: null,
          collateral_id: 153,
          tranche_id: 239,
          loan_approval_id: 150,
        },
        {
          inclusion_date: new Date("2025-04-01T00:00:00"),
          removed_date: null,
          collateral_id: 999,
          tranche_id: 9999,
          loan_approval_id: 777,
        },
      ],
    });

    rollforwardQueries.getBalances.mockResolvedValue({
      rows: [
        {
          collateral_balance_id: 209,
          collateral_id: 153,
          start_date: new Date("2025-07-31T00:00:00"),
          end_date: new Date("2025-08-31T00:00:00"),
          outstanding_amount: 14800000,
          commitment_amount: 14800000,
          debt_facility_id: 201,
          inclusion_date: new Date("2025-07-14T00:00:00"),
          removed_date: null,
          collateral_id_2: 153,
          tranche_id: 239,
          loan_approval_id: 150,
        },
        {
          collateral_balance_id: 218,
          collateral_id: 153,
          start_date: new Date("2025-09-30T00:00:00"),
          end_date: new Date("2025-10-31T00:00:00"),
          outstanding_amount: 14325000,
          commitment_amount: 14325000,
          debt_facility_id: 201,
          inclusion_date: new Date("2025-07-14T00:00:00"),
          removed_date: null,
          collateral_id_2: 153,
          tranche_id: 239,
          loan_approval_id: 150,
        },
        {
          collateral_balance_id: 207,
          collateral_id: 150,
          start_date: new Date("2025-07-31T00:00:00"),
          end_date: new Date("2025-08-15T00:00:00"),
          outstanding_amount: 10600000,
          commitment_amount: 10600000,
          debt_facility_id: 201,
          inclusion_date: new Date("2025-02-27T00:00:00"),
          removed_date: new Date("2025-08-15T00:00:00"),
          collateral_id_2: 150,
          tranche_id: 236,
          loan_approval_id: 147,
        },
        {
          collateral_balance_id: 203,
          collateral_id: 150,
          start_date: new Date("2025-06-30T00:00:00"),
          end_date: new Date("2025-07-31T00:00:00"),
          outstanding_amount: 10850000,
          commitment_amount: 10850000,
          debt_facility_id: 201,
          inclusion_date: new Date("2025-02-27T00:00:00"),
          removed_date: new Date("2025-08-15T00:00:00"),
          collateral_id_2: 150,
          tranche_id: 236,
          loan_approval_id: 147,
        },
        {
          collateral_balance_id: 191,
          collateral_id: 153,
          start_date: new Date("2025-07-14T00:00:00"),
          end_date: new Date("2025-07-31T00:00:00"),
          outstanding_amount: 15000000,
          commitment_amount: 15000000,
          debt_facility_id: 201,
          inclusion_date: new Date("2025-07-14T00:00:00"),
          removed_date: null,
          collateral_id_2: 153,
          tranche_id: 239,
          loan_approval_id: 150,
        },
        {
          collateral_balance_id: 188,
          collateral_id: 150,
          start_date: new Date("2025-02-27T00:00:00"),
          end_date: new Date("2025-03-31T00:00:00"),
          outstanding_amount: 12500000,
          commitment_amount: 12500000,
          debt_facility_id: 201,
          inclusion_date: new Date("2025-02-27T00:00:00"),
          removed_date: new Date("2025-08-15T00:00:00"),
          collateral_id_2: 150,
          tranche_id: 236,
          loan_approval_id: 147,
        },
        {
          collateral_balance_id: 214,
          collateral_id: 153,
          start_date: new Date("2025-08-31T00:00:00"),
          end_date: new Date("2025-09-30T00:00:00"),
          outstanding_amount: 14725000,
          commitment_amount: 14725000,
          debt_facility_id: 201,
          inclusion_date: new Date("2025-07-14T00:00:00"),
          removed_date: null,
          collateral_id_2: 153,
          tranche_id: 239,
          loan_approval_id: 150,
        },
        {
          collateral_balance_id: 195,
          collateral_id: 150,
          start_date: new Date("2025-03-31T00:00:00"),
          end_date: new Date("2025-04-30T00:00:00"),
          outstanding_amount: 11750000,
          commitment_amount: 11750000,
          debt_facility_id: 201,
          inclusion_date: new Date("2025-02-27T00:00:00"),
          removed_date: new Date("2025-08-15T00:00:00"),
          collateral_id_2: 150,
          tranche_id: 236,
          loan_approval_id: 147,
        },
        {
          collateral_balance_id: 197,
          collateral_id: 150,
          start_date: new Date("2025-04-30T00:00:00"),
          end_date: new Date("2025-05-31T00:00:00"),
          outstanding_amount: 11250000,
          commitment_amount: 11250000,
          debt_facility_id: 201,
          inclusion_date: new Date("2025-02-27T00:00:00"),
          removed_date: new Date("2025-08-15T00:00:00"),
          collateral_id_2: 150,
          tranche_id: 236,
          loan_approval_id: 147,
        },
        {
          collateral_balance_id: 200,
          collateral_id: 150,
          start_date: new Date("2025-05-31T00:00:00"),
          end_date: new Date("2025-06-30T00:00:00"),
          outstanding_amount: 11000000,
          commitment_amount: 11000000,
          debt_facility_id: 201,
          inclusion_date: new Date("2025-02-27T00:00:00"),
          removed_date: new Date("2025-08-15T00:00:00"),
          collateral_id_2: 150,
          tranche_id: 236,
          loan_approval_id: 147,
        },
        {
          collateral_balance_id: 222,
          collateral_id: 153,
          start_date: new Date("2025-10-31T00:00:00"),
          end_date: null,
          outstanding_amount: 14125000,
          commitment_amount: 14125000,
          debt_facility_id: 201,
          inclusion_date: new Date("2025-07-14T00:00:00"),
          removed_date: null,
          collateral_id_2: 153,
          tranche_id: 239,
          loan_approval_id: 150,
        },
        {
          collateral_balance_id: 5555,
          collateral_id: 999,
          start_date: new Date("2025-04-01T00:00:00"),
          end_date: null,
          outstanding_amount: 5000000,
          commitment_amount: 5000000,
          debt_facility_id: 201,
          inclusion_date: new Date("2025-04-01T00:00:00"),
          removed_date: null,
          collateral_id_2: 999,
          tranche_id: 9999,
          loan_approval_id: 777,
        },
      ],
    });

    rollforwardQueries.getBankMetrics.mockResolvedValue({
      rows: [
        {
          collateral_id: 150,
          start_date: new Date("2025-02-27T00:00:00"),
          end_date: new Date("2025-08-15T00:00:00"),
          advance_rate: 0.65,
          valuation: 0.9,
          bank_metrics_id: 4,
          debt_facility_id: 201,
          inclusion_date: new Date("2025-02-27T00:00:00"),
          removed_date: new Date("2025-08-15T00:00:00"),
          collateral_id_2: 150,
          tranche_id: 236,
          loan_approval_id: 147,
          debt_facility_name: "Skyrim Debt Facility",
          portfolio_id: 3,
          lender_id: 2,
          debt_facility_id_2: 201,
        },
        {
          collateral_id: 153,
          start_date: new Date("2025-07-14T00:00:00"),
          end_date: null,
          advance_rate: 0.4,
          valuation: 0.89,
          bank_metrics_id: 5,
          debt_facility_id: 201,
          inclusion_date: new Date("2025-07-14T00:00:00"),
          removed_date: null,
          collateral_id_2: 153,
          tranche_id: 239,
          loan_approval_id: 150,
          debt_facility_name: "Skyrim Debt Facility",
          portfolio_id: 3,
          lender_id: 2,
          debt_facility_id_2: 201,
        },
      ],
    });

    rollforwardQueries.getLoanApprovalInfo.mockResolvedValue({
      rows: [
        {
          collateral_id: 150,
          approved_valuation: 0.98,
          approved_advance_rate: 0.7,
        },
        {
          collateral_id: 999,
          approved_valuation: 0.95,
          approved_advance_rate: 0.5,
        },
      ],
    });

    rollforwardQueries.getInternalValInfo.mockResolvedValue({
      rows: [
        {
          collateral_id: 150,
          start_date: new Date("2025-02-20T00:00:00"),
          end_date: new Date("2025-08-15T00:00:00"),
          internal_val: 0.98,
        },

        {
          collateral_id: 999,
          start_date: new Date("2025-04-01T00:00:00"),
          end_date: null,
          internal_val: 0.78,
        },
      ],
    });

    rollforwardQueries.getCollateralNames.mockResolvedValue({
      rows: [
        {
          collateral_id: 150,
          legal_name: "Buttercup & Bramble Ltd.",
          short_name: "Buttercup",
        },
        {
          collateral_id: 153,
          legal_name: "Elfwood Delights",
          short_name: "Elfwood",
        },
      ],
    });

    pieChartQuery.getPieChartData.mockResolvedValue({
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

    processIds.getIdsAtEndOfPeriod.mockReturnValue([
      { collateralId: 150, removedDate: new Date("2025-08-15T00:00:00") },
      { collateralId: 153, removedDate: null },
      { collateralId: 999, removedDate: null },
    ]);

    processBalanceData.getEndOfPeriodBalances.mockReturnValue([
      {
        collateralId: 153,
        endBalance: 15000000,
      },
      {
        collateralId: 150,
        endBalance: 10850000,
      },
      {
        collateralId: 999,
        endBalance: 5000000,
      },
    ]);

    const response = await request(app).get("/api/pieChartCalculations").query({
      debtFacilityId: 201,
      asOfDate: "2025-07-25",
    });

    expect(response.body).toEqual([
      {
        collateralId: 150,
        collateralName: "Buttercup & Bramble Ltd.",
        valuationPercentage: 0.9,
        outstandingBalance: 10850000,
        valuation: 9765000,
        lienType: "First Lien",
        corpHQId: 5,
        corpHQRegionName: "Western Europe",
        revRegionID: 8,
        revRegionName: "Middle East",
        naicsCode: 111,
        naicsSubsector: "Crop Production",
        isPublic: "Public",
      },

      {
        collateralId: 153,
        collateralName: "Elfwood Delights",
        valuationPercentage: 0.89,
        outstandingBalance: 15000000,
        valuation: 13350000,
        lienType: "Second Lien",
        corpHQId: 2,
        corpHQRegionName: "Canada",
        revRegionID: 12,
        revRegionName: "Japan",
        naicsCode: 211,
        naicsSubsector: "Oil and Gas Extraction",
        isPublic: "Private",
      },
      {
        collateralId: 999,
        collateralName: null,
        valuationPercentage: 0.78,
        outstandingBalance: 5000000,
        valuation: 3900000,
        lienType: "Second Lien",
        corpHQId: 2,
        corpHQRegionName: "Canada",
        revRegionID: 8,
        revRegionName: "Middle East",
        naicsCode: 211,
        naicsSubsector: "Oil and Gas Extraction",
        isPublic: "Private",
      },
    ]);
  });
});
