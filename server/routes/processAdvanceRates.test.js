// ************************************************************************
// *       UT-93 – test function getBegAndEndAdvRates()
// ************************************************************************

const { getBegAndEndAdvRates } = require("../routes/processAdvanceRates");




describe("test processAdvanceRates", () => {

// ********************** UT-93 – function getBegAndEndAdvRates() - First Lien Stated Advance ***************************




  it("accepts multiple parameters and beginning and ending advance rates for each collateral in facility for time period (first lien/stated advance)", async () => {

    const allIdsStart = ([150]);
    const addedIds = ([
      { id: 150, addedDate: new Date("2025-02-27T00:00:00") },
      { id: 153, addedDate: new Date("2025-07-14T00:00:00") },
    ]);
    const allIdsEnd = ([{ collateralId: 153, removedDate: null }]);
    const collateralLien = ({
      rows:[
      {
        collateral_id: 150,
        lien_type: "First Lien",
      },
      {
        collateral_id: 153,
        lien_type: "First Lien",
      },
      {
        collateral_id: 150,
        lien_type: "First Lien",
       },
    ]
    });
    
    const bankMetricsStart = ({
      rows:[
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
    ]
    });
    const bankMetricsEnd = ({
      rows:[
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
    ]
    });

    const loanApprovalResults = ({
      rows:[
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
    ]
    });

    const facilityMetricsStart =({
      rows:[
      {
        portfolio_id: 3,
        lender_id: 2,
        debt_facility_id: 201,
        start_date: new Date("2025-01-01T00:00:00"),
        end_date: new Date("2025-05-31T00:00:00"),
        is_overall_rate: false,
        overall_rate: null,
        is_first_lien_advance_rate: true,
        first_lien_advance_rate: 0.65,
        is_second_lien_advance_rate: true,
        second_lien_advance_rate: 0.4,
        is_mezzanine_advance_rate: true,
        mezzanine_advance_rate: 0.25,
      },
    ]
    });

    const facilityMetricsEnd =({
      rows:[
      {
        portfolio_id: 3,
        lender_id: 2,
        debt_facility_id: 201,
        start_date: new Date("2025-07-31T00:00:00"),
        end_date: new Date("2030-01-01T00:00:00"),
        is_overall_rate: false,
        overall_rate: null,
        is_first_lien_advance_rate: true,
        first_lien_advance_rate: 0.75,
        is_second_lien_advance_rate: true,
        second_lien_advance_rate: 0.42,
        is_mezzanine_advance_rate: true,
        mezzanine_advance_rate: 0.375,
      },
    ]
    });   

    const result = getBegAndEndAdvRates(
  allIdsStart,
  addedIds,
  allIdsEnd,
  collateralLien,
  bankMetricsStart,
  bankMetricsEnd,
  loanApprovalResults,
  facilityMetricsStart,
  facilityMetricsEnd,
);

    expect(result).toEqual([
      {
        collateralId: 150,
        advanceRateBeg: 0.7,
        advanceRateEnd: null,
      },
      {
        collateralId: 153,
        advanceRateBeg: 0.4,
        advanceRateEnd: 0.4,
      },
    ]);

  });


// ********************** UT-94 – function getBegAndEndAdvRates() - Second/Mezz Stated Advance ***************************




  it("accepts multiple parameters and beginning and ending advance rates for each collateral in facility for time period (second and mezzanine/stated advance)", async () => {

    const allIdsStart = ([150]);
    const addedIds = ([
      { id: 150, addedDate: new Date("2025-02-27T00:00:00") },
      { id: 153, addedDate: new Date("2025-07-14T00:00:00") },
    ]);
    const allIdsEnd = ([{ collateralId: 153, removedDate: null }]);
    const collateralLien = ({
      rows:[
      {
        collateral_id: 150,
        lien_type: "Second Lien",
      },
      {
        collateral_id: 153,
        lien_type: "Mezzanine",
      },
      {
        collateral_id: 150,
        lien_type: "Second Lien",
       },
    ]
    });
    
    const bankMetricsStart = ({
      rows:[
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
    ]
    });
    const bankMetricsEnd = ({
      rows:[
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
    ]
    });

    const loanApprovalResults = ({
      rows:[
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
    ]
    });

    const facilityMetricsStart =({
      rows:[
      {
        portfolio_id: 3,
        lender_id: 2,
        debt_facility_id: 201,
        start_date: new Date("2025-01-01T00:00:00"),
        end_date: new Date("2025-05-31T00:00:00"),
        is_overall_rate: false,
        overall_rate: null,
        is_first_lien_advance_rate: true,
        first_lien_advance_rate: 0.65,
        is_second_lien_advance_rate: true,
        second_lien_advance_rate: 0.4,
        is_mezzanine_advance_rate: true,
        mezzanine_advance_rate: 0.25,
      },
    ]
    });

    const facilityMetricsEnd =({
      rows:[
      {
        portfolio_id: 3,
        lender_id: 2,
        debt_facility_id: 201,
        start_date: new Date("2025-07-31T00:00:00"),
        end_date: new Date("2030-01-01T00:00:00"),
        is_overall_rate: false,
        overall_rate: null,
        is_first_lien_advance_rate: true,
        first_lien_advance_rate: 0.75,
        is_second_lien_advance_rate: true,
        second_lien_advance_rate: 0.42,
        is_mezzanine_advance_rate: true,
        mezzanine_advance_rate: 0.375,
      },
    ]
    });   

    const result = getBegAndEndAdvRates(
  allIdsStart,
  addedIds,
  allIdsEnd,
  collateralLien,
  bankMetricsStart,
  bankMetricsEnd,
  loanApprovalResults,
  facilityMetricsStart,
  facilityMetricsEnd,
);

    expect(result).toEqual([
      {
        collateralId: 150,
        advanceRateBeg: 0.7,
        advanceRateEnd: null,
      },
      {
        collateralId: 153,
        advanceRateBeg: 0.4,
        advanceRateEnd: 0.4,
      },
    ]);

  });


  
// ********************** UT-95 – function getBegAndEndAdvRates() - First Lien No Stated Advance ***************************


  it("accepts multiple parameters and beginning and ending advance rates for each collateral in facility for time period (first lien - no stated advance)", async () => {

    const allIdsStart = ([150]);
    const addedIds = ([
      { id: 150, addedDate: new Date("2025-02-27T00:00:00") },
      { id: 153, addedDate: new Date("2025-07-14T00:00:00") },
    ]);
    const allIdsEnd = ([{ collateralId: 153, removedDate: null }]);
    const collateralLien = ({
      rows:[
      {
        collateral_id: 150,
        lien_type: "First Lien",
      },
      {
        collateral_id: 153,
        lien_type: "First Lien",
      },
      {
        collateral_id: 150,
        lien_type: "First Lien",
       },
    ]
    });
    
    const bankMetricsStart = ({
      rows:[
      {
        collateral_id: 150,
        start_date: new Date("2025-02-27T00:00:00"),
        end_date: new Date("2025-06-10T00:00:00"),
        advance_rate: null,
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
    ]
    });
    const bankMetricsEnd = ({
      rows:[
      {
        collateral_id: 153,
        start_date: new Date("2025-07-14T00:00:00"),
        end_date: null,
        advance_rate: null,
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
    ]
    });

    const loanApprovalResults = ({
      rows:[
      {
        collateral_id: 153,
        approved_valuation: 0.98,
        approved_advance_rate: null,
      },
      {
        collateral_id: 150,
        approved_valuation: 0.98,
        approved_advance_rate: null,
       },
    ]
    });

    const facilityMetricsStart =({
      rows:[
      {
        portfolio_id: 3,
        lender_id: 2,
        debt_facility_id: 201,
        start_date: new Date("2025-01-01T00:00:00"),
        end_date: new Date("2025-05-31T00:00:00"),
        is_overall_rate: false,
        overall_rate: null,
        is_first_lien_advance_rate: true,
        first_lien_advance_rate: 0.65,
        is_second_lien_advance_rate: true,
        second_lien_advance_rate: 0.4,
        is_mezzanine_advance_rate: true,
        mezzanine_advance_rate: 0.25,
      },
    ]
    });

    const facilityMetricsEnd =({
      rows:[
      {
        portfolio_id: 3,
        lender_id: 2,
        debt_facility_id: 201,
        start_date: new Date("2025-07-31T00:00:00"),
        end_date: new Date("2030-01-01T00:00:00"),
        is_overall_rate: false,
        overall_rate: null,
        is_first_lien_advance_rate: true,
        first_lien_advance_rate: 0.75,
        is_second_lien_advance_rate: true,
        second_lien_advance_rate: 0.42,
        is_mezzanine_advance_rate: true,
        mezzanine_advance_rate: 0.375,
      },
    ]
    });   

    const result = getBegAndEndAdvRates(
  allIdsStart,
  addedIds,
  allIdsEnd,
  collateralLien,
  bankMetricsStart,
  bankMetricsEnd,
  loanApprovalResults,
  facilityMetricsStart,
  facilityMetricsEnd,
);

    expect(result).toEqual([
      {
        collateralId: 150,
        advanceRateBeg: 0.65,
        advanceRateEnd: null,
      },
      {
        collateralId: 153,
        advanceRateBeg: 0.65,
        advanceRateEnd: 0.75,
      },
    ]);

  });

  
  
// ********************** UT-96 – function getBegAndEndAdvRates() - Second Lien No Stated Advance ***************************


  it("accepts multiple parameters and beginning and ending advance rates for each collateral in facility for time period (second - no stated advance)", async () => {

    const allIdsStart = ([150]);
    const addedIds = ([
      { id: 150, addedDate: new Date("2025-02-27T00:00:00") },
      { id: 153, addedDate: new Date("2025-07-14T00:00:00") },
    ]);
    const allIdsEnd = ([{ collateralId: 153, removedDate: null }]);
    const collateralLien = ({
      rows:[
      {
        collateral_id: 150,
        lien_type: "Second Lien",
      },
      {
        collateral_id: 153,
        lien_type: "Second Lien",
      },
      {
        collateral_id: 150,
        lien_type: "Second Lien",
       },
    ]
    });
    
    const bankMetricsStart = ({
      rows:[
      {
        collateral_id: 150,
        start_date: new Date("2025-02-27T00:00:00"),
        end_date: new Date("2025-06-10T00:00:00"),
        advance_rate: null,
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
    ]
    });
    const bankMetricsEnd = ({
      rows:[
      {
        collateral_id: 153,
        start_date: new Date("2025-07-14T00:00:00"),
        end_date: null,
        advance_rate: null,
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
    ]
    });

    const loanApprovalResults = ({
      rows:[
      {
        collateral_id: 153,
        approved_valuation: 0.98,
        approved_advance_rate: null,
      },
      {
        collateral_id: 150,
        approved_valuation: 0.98,
        approved_advance_rate: null,
       },
    ]
    });

    const facilityMetricsStart =({
      rows:[
      {
        portfolio_id: 3,
        lender_id: 2,
        debt_facility_id: 201,
        start_date: new Date("2025-01-01T00:00:00"),
        end_date: new Date("2025-05-31T00:00:00"),
        is_overall_rate: false,
        overall_rate: null,
        is_first_lien_advance_rate: true,
        first_lien_advance_rate: 0.65,
        is_second_lien_advance_rate: true,
        second_lien_advance_rate: 0.4,
        is_mezzanine_advance_rate: true,
        mezzanine_advance_rate: 0.25,
      },
    ]
    });

    const facilityMetricsEnd =({
      rows:[
      {
        portfolio_id: 3,
        lender_id: 2,
        debt_facility_id: 201,
        start_date: new Date("2025-07-31T00:00:00"),
        end_date: new Date("2030-01-01T00:00:00"),
        is_overall_rate: false,
        overall_rate: null,
        is_first_lien_advance_rate: true,
        first_lien_advance_rate: 0.75,
        is_second_lien_advance_rate: true,
        second_lien_advance_rate: 0.42,
        is_mezzanine_advance_rate: true,
        mezzanine_advance_rate: 0.375,
      },
    ]
    });   

    const result = getBegAndEndAdvRates(
  allIdsStart,
  addedIds,
  allIdsEnd,
  collateralLien,
  bankMetricsStart,
  bankMetricsEnd,
  loanApprovalResults,
  facilityMetricsStart,
  facilityMetricsEnd,
);

    expect(result).toEqual([
      {
        collateralId: 150,
        advanceRateBeg: 0.4,
        advanceRateEnd: null,
      },
      {
        collateralId: 153,
        advanceRateBeg: 0.4,
        advanceRateEnd: 0.42,
      },
    ]);

  });


// ********************** UT-97 – function getBegAndEndAdvRates() - Mezzanine No Stated Advance ***************************


  it("accepts multiple parameters and beginning and ending advance rates for each collateral in facility for time period (Mezzanine - no stated advance)", async () => {

    const allIdsStart = ([150]);
    const addedIds = ([
      { id: 150, addedDate: new Date("2025-02-27T00:00:00") },
      { id: 153, addedDate: new Date("2025-07-14T00:00:00") },
    ]);
    const allIdsEnd = ([{ collateralId: 153, removedDate: null }]);
    const collateralLien = ({
      rows:[
      {
        collateral_id: 150,
        lien_type: "Mezzanine",
      },
      {
        collateral_id: 153,
        lien_type: "Mezzanine",
      },
      {
        collateral_id: 150,
        lien_type: "Mezzanine",
       },
    ]
    });
    
    const bankMetricsStart = ({
      rows:[
      {
        collateral_id: 150,
        start_date: new Date("2025-02-27T00:00:00"),
        end_date: new Date("2025-06-10T00:00:00"),
        advance_rate: null,
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
    ]
    });
    const bankMetricsEnd = ({
      rows:[
      {
        collateral_id: 153,
        start_date: new Date("2025-07-14T00:00:00"),
        end_date: null,
        advance_rate: null,
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
    ]
    });

    const loanApprovalResults = ({
      rows:[
      {
        collateral_id: 153,
        approved_valuation: 0.98,
        approved_advance_rate: null,
      },
      {
        collateral_id: 150,
        approved_valuation: 0.98,
        approved_advance_rate: null,
       },
    ]
    });

    const facilityMetricsStart =({
      rows:[
      {
        portfolio_id: 3,
        lender_id: 2,
        debt_facility_id: 201,
        start_date: new Date("2025-01-01T00:00:00"),
        end_date: new Date("2025-05-31T00:00:00"),
        is_overall_rate: false,
        overall_rate: null,
        is_first_lien_advance_rate: true,
        first_lien_advance_rate: 0.65,
        is_second_lien_advance_rate: true,
        second_lien_advance_rate: 0.4,
        is_mezzanine_advance_rate: true,
        mezzanine_advance_rate: 0.25,
      },
    ]
    });

    const facilityMetricsEnd =({
      rows:[
      {
        portfolio_id: 3,
        lender_id: 2,
        debt_facility_id: 201,
        start_date: new Date("2025-07-31T00:00:00"),
        end_date: new Date("2030-01-01T00:00:00"),
        is_overall_rate: false,
        overall_rate: null,
        is_first_lien_advance_rate: true,
        first_lien_advance_rate: 0.75,
        is_second_lien_advance_rate: true,
        second_lien_advance_rate: 0.42,
        is_mezzanine_advance_rate: true,
        mezzanine_advance_rate: 0.375,
      },
    ]
    });   

    const result = getBegAndEndAdvRates(
  allIdsStart,
  addedIds,
  allIdsEnd,
  collateralLien,
  bankMetricsStart,
  bankMetricsEnd,
  loanApprovalResults,
  facilityMetricsStart,
  facilityMetricsEnd,
);

    expect(result).toEqual([
      {
        collateralId: 150,
        advanceRateBeg: 0.25,
        advanceRateEnd: null,
      },
      {
        collateralId: 153,
        advanceRateBeg: 0.25,
        advanceRateEnd: 0.375,
      },
    ]);

  });


});
