// ***************************************************************************************************************
//                        UT-103 – function getBegAndEndBankValuations()                                          *
//                        UT-104 – function getBegAndEndBankValuations() - metrics do not exist for collateral id *
//                        UT-105 – function getBegAndEndBankValuations() - metrics null for collateral id         *
// ***************************************************************************************************************

const { getBegAndEndBankValuations } = require("./processBankValuations");

describe("test processBankValuations", () => {
  // ********************** UT-103 – function getBegAndEndBankValuations() - ***************************

  it("accepts multiple parameters returns beginning and ending valuations for each collateral in facility for time period", async () => {
    const allIdsStart = [150];
    const allIdsEnd = [{ collateralId: 153, removedDate: null }];
    const additions = [
      {
        collateralId: 153,
        addedDate: new Date("2025-07-14T00:00:00"),
        amtAdded: 15000000,
      },
    ];
    const bankMetricsStart = {
      rows: [
        {
          collateral_id: 150,
          start_date: new Date("2025-02-27T00:00:00"),
          end_date: new Date("2025-06-10T00:00:00"),
          advance_rate: 0.7,
          valuation: 0.98,
          bank_metrics_id: 2,
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
      ],
    };
    const bankMetricsEnd = {
      rows: [
        {
          collateral_id: 153,
          start_date: new Date("2025-07-14T00:00:00"),
          end_date: null,
          advance_rate: 0.4,
          valuation: 0.98,
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
    };

    const loanApprovalResults = {
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
      ],
    };

    const result = getBegAndEndBankValuations(
      allIdsStart,
      allIdsEnd,
      additions,
      bankMetricsStart,
      bankMetricsEnd,
      loanApprovalResults,
    );

    expect(result).toEqual([
      {
        collateralId: 150,
        bankValBeg: 0.98,
        bankValEnd: null,
      },
      {
        collateralId: 153,
        bankValBeg: 0.98,
        bankValEnd: 0.98,
      },
    ]);
  });

  // ********************** UT-104 – function getBegAndEndBankValuations() - metrics do not exist for collateral id ***************************

  it("accepts multiple parameters returns beginning and ending valuations for each collateral in facility for time period - metrics do not exist for collateral id ", async () => {
    const allIdsStart = [555];
    const allIdsEnd = [{ collateralId: 153, removedDate: null }];
    const additions = [
      {
        collateralId: 153,
        addedDate: new Date("2025-07-14T00:00:00"),
        amtAdded: 15000000,
      },
    ];
    const bankMetricsStart = {
      rows: [
        {
          collateral_id: 888,
          start_date: new Date("2025-02-27T00:00:00"),
          end_date: new Date("2025-06-10T00:00:00"),
          advance_rate: 0.7,
          valuation: 0.98,
          bank_metrics_id: 2,
          debt_facility_id: 201,
          inclusion_date: new Date("2025-02-27T00:00:00"),
          removed_date: new Date("2025-08-15T00:00:00"),
          collateral_id_2: 888,
          tranche_id: 236,
          loan_approval_id: 147,
          debt_facility_name: "Skyrim Debt Facility",
          portfolio_id: 3,
          lender_id: 2,
          debt_facility_id_2: 201,
        },
      ],
    };
    const bankMetricsEnd = {
      rows: [
        {
          collateral_id: 153,
          start_date: new Date("2025-07-14T00:00:00"),
          end_date: null,
          advance_rate: 0.4,
          valuation: 0.98,
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
    };

    const loanApprovalResults = {
      rows: [
        {
          collateral_id: 153,
          approved_valuation: 0.98,
          approved_advance_rate: 0.4,
        },
      ],
    };

    const result = getBegAndEndBankValuations(
      allIdsStart,
      allIdsEnd,
      additions,
      bankMetricsStart,
      bankMetricsEnd,
      loanApprovalResults,
    );

    expect(result).toEqual([
      {
        collateralId: 555,
        bankValBeg: null,
        bankValEnd: null,
      },
      {
        collateralId: 153,
        bankValBeg: 0.98,
        bankValEnd: 0.98,
      },
    ]);
  });

  // ********************** UT-105 – function getBegAndEndBankValuations() - metrics null for collateral id***************************

  it("accepts multiple parameters returns beginning and ending valuations for each collateral in facility for time period", async () => {
    const allIdsStart = [150];
    const allIdsEnd = [{ collateralId: 153, removedDate: null }];
    const additions = [
      {
        collateralId: 153,
        addedDate: new Date("2025-07-14T00:00:00"),
        amtAdded: 15000000,
      },
    ];
    const bankMetricsStart = {
      rows: [
        {
          collateral_id: 150,
          start_date: new Date("2025-02-27T00:00:00"),
          end_date: new Date("2025-06-10T00:00:00"),
          advance_rate: 0.7,
          valuation: null,
          bank_metrics_id: 2,
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
      ],
    };
    const bankMetricsEnd = {
      rows: [
        {
          collateral_id: 153,
          start_date: new Date("2025-07-14T00:00:00"),
          end_date: null,
          advance_rate: 0.4,
          valuation: null,
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
    };

    const loanApprovalResults = {
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
      ],
    };

    const result = getBegAndEndBankValuations(
      allIdsStart,
      allIdsEnd,
      additions,
      bankMetricsStart,
      bankMetricsEnd,
      loanApprovalResults,
    );

    expect(result).toEqual([
      {
        collateralId: 150,
        bankValBeg: null,
        bankValEnd: null,
      },
      {
        collateralId: 153,
        bankValBeg: 0.98,
        bankValEnd: null,
      },
    ]);
  });
});
