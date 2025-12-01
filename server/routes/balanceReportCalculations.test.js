// ************************************************************************
// *       UT-124 – Balance Report Test                                   *
// ************************************************************************

const request = require("supertest");
const app = require("../app");

const { getFacilityCollateral, getBalances, getCollateralNames } = require("./rollforwardQueries");
const { getIdsAtEndOfPeriod } = require("./processIds");
const { getEndOfPeriodBalances } = require("./processBalanceData");
const { getDebtFacilities } = require("./debtFacilitiesInPortfolio");
const { getCollateralByPortfolio } = require("./collateralQueryByPortfolio");

jest.mock("./rollforwardQueries");
jest.mock("./processIds");
jest.mock("./processBalanceData");
jest.mock("./debtFacilitiesInPortfolio");
jest.mock("./collateralQueryByPortfolio");

describe("GET /api/balanceReportCalculations", () => {
  it("accepts balance report request from frontend and returns data", async () => {
    getDebtFacilities.mockResolvedValue({
      rows: [
        {
          debt_facility_id: 111,
        },
        {
          debt_facility_id: 222,
        },
      ],
    });

    getCollateralByPortfolio.mockResolvedValue({
      rows: [
        {
          debt_facility_id: 111,
          inclusion_date: "2025-03-01",
          removed_date: null,
          collateral_id: 333,
          tranche_id: 150,
          loan_approval_id: 555,
          debt_facility_name: "Facility A",
        },
        {
          debt_facility_id: 111,
          inclusion_date: "2025-04-01",
          removed_date: null,
          collateral_id: 334,
          tranche_id: 151,
          loan_approval_id: 556,
          debt_facility_name: "Facility A",
        },
        {
          debt_facility_id: 222,
          inclusion_date: "2025-03-01",
          removed_date: null,
          collateral_id: 335,
          tranche_id: 150,
          loan_approval_id: 557,
          debt_facility_name: "Facility B",
        },
      ],
    });

    getCollateralNames
      .mockResolvedValueOnce({
        rows: [
          { collateral_id: 333, legal_name: "Company A", short_name: "A Co." },
          { collateral_id: 334, legal_name: "Company B", short_name: "B Co." },
        ],
      })
      .mockResolvedValueOnce({
        rows: [{ collateral_id: 335, legal_name: "Company A", short_name: "A Co." }],
      });

    getFacilityCollateral
      .mockResolvedValueOnce({
        rows: [
          {
            inclusion_date: new Date("2025-03-01T00:00:00"),
            removed_date: null,
            collateral_id: 333,
            tranche_id: 150,
            loan_approval_id: 555,
          },
          {
            inclusion_date: new Date("2025-04-01T00:00:00"),
            removed_date: null,
            collateral_id: 334,
            tranche_id: 151,
            loan_approval_id: 556,
          },
        ],
      })
      .mockResolvedValueOnce({
        rows: [
          {
            inclusion_date: new Date("2025-03-01T00:00:00"),
            removed_date: null,
            collateral_id: 335,
            tranche_id: 150,
            loan_approval_id: 557,
          },
        ],
      });

    getBalances
      .mockResolvedValueOnce({
        rows: [
          {
            collateral_balance_id: 100,
            collateral_id: 333,
            start_date: new Date("2025-03-01T00:00:00"),
            end_date: null,
            outstanding_amount: 10000000,
            commitment_amount: 10000000,
            debt_facility_id: 111,
            inclusion_date: new Date("2025-03-01T00:00:00"),
            removed_date: null,
            collateral_id_2: 333,
            tranche_id: 150,
            loan_approval_id: 10000,
          },
          {
            collateral_balance_id: 101,
            collateral_id: 334,
            start_date: new Date("2025-04-01T00:00:00"),
            end_date: null,
            outstanding_amount: 20000000,
            commitment_amount: 20000000,
            debt_facility_id: 111,
            inclusion_date: new Date("2025-04-01T00:00:00"),
            removed_date: null,
            collateral_id_2: 334,
            tranche_id: 151,
            loan_approval_id: 10001,
          },
        ],
      })
      .mockResolvedValueOnce({
        rows: [
          {
            collateral_balance_id: 102,
            collateral_id: 335,
            start_date: new Date("2025-03-01T00:00:00"),
            end_date: null,
            outstanding_amount: 15000000,
            commitment_amount: 15000000,
            debt_facility_id: 222,
            inclusion_date: new Date("2025-03-01T00:00:00"),
            removed_date: null,
            collateral_id_2: 335,
            tranche_id: 150,
            loan_approval_id: 10002,
          },
        ],
      });

    getIdsAtEndOfPeriod
      .mockReturnValueOnce([
        { collateralId: 333, removedDate: null },
        { collateralId: 334, removedDate: null },
      ])
      .mockReturnValueOnce([{ collateralId: 335, removedDate: null }]);

    getEndOfPeriodBalances
      .mockReturnValueOnce([
        {
          collateralId: 333,
          endBalance: 10000000,
        },
        {
          collateralId: 334,
          endBalance: 20000000,
        },
      ])
      .mockReturnValueOnce([
        {
          collateralId: 335,
          endBalance: 15000000,
        },
      ]);

    const response = await request(app).get("/api/balanceReportCalculations").query({
      portfolioId: 999,
      asOfDate: "2025-10-01",
    });

    expect(response.body).toEqual([
      ["Tranche Name", "Facility A", "Facility B", "Total"],
      ["Company A", 10000000, 15000000, 25000000],
      ["Company B", 20000000, 0, 20000000],
      ["Total", 30000000, 15000000, 45000000],
    ]);
  });
});
