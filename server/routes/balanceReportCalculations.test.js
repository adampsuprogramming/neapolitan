// ************************************************************************
// *       UT-____ – Balance Report Test                                   *
// ************************************************************************

// const request = require("supertest");
// const app = require("../app");

// const rollforwardQueries = require("./rollforwardQueries");
// const processIds = require("./processIds");
// const processBalanceData = require("./processBalanceData");
// const collateralQuery = require("./balanceReportCalculations");
// const debtFacilities = require("./debtFacilitiesInPortfolio");

// jest.mock("./rollforwardQueries");
// jest.mock("./processIds");
// jest.mock("./processBalanceData");
// jest.mock("./balanceReportCalculations");
// jest.mock("./debtFacilitiesInPortfolio");

// describe("GET /api/balanceReportCalculations", () => {
//   it("accepts balance report request from frontend and returns data", async () => {
//     rollforwardQueries.getFacilityCollateral.mockResolvedValue({
//       rows: [
//         {
//           inclusion_date: new Date("2025-02-27T00:00:00"),
//           removed_date: null,
//           collateral_id: 153,
//           tranche_id: 236,
//           loan_approval_id: 147,
//         },
//         {
//           inclusion_date: new Date("2025-07-14T00:00:00"),
//           removed_date: null,
//           collateral_id: 155,
//           tranche_id: 239,
//           loan_approval_id: 150,
//         },
//       ],
//     });

//     rollforwardQueries.getBalances.mockResolvedValue({
//       rows: [
//         {
//           collateral_balance_id: 209,
//           collateral_id: 153,
//           start_date: new Date("2025-07-31T00:00:00"),
//           end_date: null,
//           outstanding_amount: 10000000,
//           commitment_amount: 10000000,
//           debt_facility_id: 201,
//           inclusion_date: new Date("2025-07-14T00:00:00"),
//           removed_date: null,
//           collateral_id_2: 153,
//           tranche_id: 239,
//           loan_approval_id: 150,
//         },
//         {
//           collateral_balance_id: 210,
//           collateral_id: 154,
//           start_date: new Date("2025-07-31T00:00:00"),
//           end_date: null,
//           outstanding_amount: 20000000,
//           commitment_amount: 20000000,
//           debt_facility_id: 202,
//           inclusion_date: new Date("2025-07-14T00:00:00"),
//           removed_date: null,
//           collateral_id_2: 154,
//           tranche_id: 239,
//           loan_approval_id: 151,
//         },        
//         {
//           collateral_balance_id: 211,
//           collateral_id: 155,
//           start_date: new Date("2025-08-31T00:00:00"),
//           end_date: null,
//           outstanding_amount: 7500000,
//           commitment_amount: 7500000,
//           debt_facility_id: 201,
//           inclusion_date: new Date("2025-09-14T00:00:00"),
//           removed_date: null,
//           collateral_id_2: 155,
//           tranche_id: 240,
//           loan_approval_id: 152,
//         },
//         {
//           collateral_balance_id: 212,
//           collateral_id: 156,
//           start_date: new Date("2025-08-31T00:00:00"),
//           end_date: null,
//           outstanding_amount: 2500000,
//           commitment_amount: 2500000,
//           debt_facility_id: 202,
//           inclusion_date: new Date("2025-09-14T00:00:00"),
//           removed_date: null,
//           collateral_id_2: 156,
//           tranche_id: 240,
//           loan_approval_id: 152,
//         },
//       ],
//     });

//     rollforwardQueries.getBankMetrics
//       .mockResolvedValueOnce({
//         rows: [
//           {
//             collateral_id: 150,
//             start_date: new Date("2025-02-27T00:00:00"),
//             end_date: new Date("2025-06-10T00:00:00"),
//             advance_rate: 0.7,
//             valuation: 0.98,
//             bank_metrics_id: 2,
//             debt_facility_id: 201,
//             inclusion_date: new Date("2025-02-27T00:00:00"),
//             removed_date: new Date("2025-08-15T00:00:00"),
//             collateral_id_2: 150,
//             tranche_id: 236,
//             loan_approval_id: 147,
//             debt_facility_name: "Skyrim Debt Facility",
//             portfolio_id: 3,
//             lender_id: 2,
//             debt_facility_id_2: 201,
//           },
//         ],
//       })
//       .mockResolvedValueOnce({
//         rows: [
//           {
//             collateral_id: 153,
//             start_date: new Date("2025-07-14T00:00:00"),
//             end_date: null,
//             advance_rate: 0.4,
//             valuation: 0.98,
//             bank_metrics_id: 5,
//             debt_facility_id: 201,
//             inclusion_date: new Date("2025-07-14T00:00:00"),
//             removed_date: null,
//             collateral_id_2: 153,
//             tranche_id: 239,
//             loan_approval_id: 150,
//             debt_facility_name: "Skyrim Debt Facility",
//             portfolio_id: 3,
//             lender_id: 2,
//             debt_facility_id_2: 201,
//           },
//         ],
//       });

//     rollforwardQueries.getFacilityMetrics
//       .mockResolvedValueOnce({
//         rows: [
//           {
//             portfolio_id: 3,
//             lender_id: 2,
//             debt_facility_id: 201,
//             start_date: new Date("2025-01-01T00:00:00"),
//             end_date: new Date("2025-05-31T00:00:00"),
//             is_overall_rate: false,
//             overall_rate: null,
//             is_first_lien_advance_rate: true,
//             first_lien_advance_rate: 0.65,
//             is_second_lien_advance_rate: true,
//             second_lien_advance_rate: 0.4,
//             is_mezzanine_advance_rate: true,
//             mezzanine_advance_rate: 0.25,
//           },
//         ],
//       })
//       .mockResolvedValueOnce({
//         rows: [
//           {
//             portfolio_id: 3,
//             lender_id: 2,
//             debt_facility_id: 201,
//             start_date: new Date("2025-07-31T00:00:00"),
//             end_date: new Date("2030-01-01T00:00:00"),
//             is_overall_rate: false,
//             overall_rate: null,
//             is_first_lien_advance_rate: true,
//             first_lien_advance_rate: 0.75,
//             is_second_lien_advance_rate: true,
//             second_lien_advance_rate: 0.42,
//             is_mezzanine_advance_rate: true,
//             mezzanine_advance_rate: 0.375,
//           },
//         ],
//       });

//     rollforwardQueries.getLienType.mockResolvedValue({
//       rows: [
//         {
//           collateral_id: 150,
//           lien_type: "First Lien",
//         },
//         {
//           collateral_id: 153,
//           lien_type: "First Lien",
//         },
//         {
//           collateral_id: 150,
//           lien_type: "First Lien",
//         },
//       ],
//     });

//     rollforwardQueries.getLoanApprovalInfo.mockResolvedValue({
//       rows: [
//         {
//           collateral_id: 153,
//           approved_valuation: 0.98,
//           approved_advance_rate: 0.4,
//         },
//         {
//           collateral_id: 150,
//           approved_valuation: 0.98,
//           approved_advance_rate: 0.7,
//         },
//       ],
//     });

//     rollforwardQueries.getInternalValInfo
//       .mockResolvedValueOnce({
//         rows: [
//           {
//             collateral_id: 150,
//             start_date: new Date("2025-02-20T00:00:00"),
//             end_date: new Date("2025-07-15T00:00:00"),
//             internal_val: 0.98,
//           },
//         ],
//       })
//       .mockResolvedValueOnce({
//         rows: [
//           {
//             collateral_id: 153,
//             start_date: new Date("2025-07-12T00:00:00"),
//             end_date: null,
//             internal_val: 0.985,
//           },
//           {
//             collateral_id: 150,
//             start_date: new Date("2025-07-15T00:00:00"),
//             end_date: null,
//             internal_val: 0.93,
//           },
//         ],
//       });

//     rollforwardQueries.getPaymentsTimePeriod.mockResolvedValue({
//       rows: [
//         {
//           payments_id: 265,
//           collateral_id: 150,
//           payment_date: new Date("2025-05-31T00:00:00"),
//           principal_received: 250000,
//           interest_received: 75000,
//           debt_facility_id: 201,
//           inclusion_date: new Date("2025-02-27T00:00:00"),
//           removed_date: new Date("2025-08-15T00:00:00"),
//           collateral_id_2: 150,
//           tranche_id: 236,
//           loan_approval_id: 147,
//           debt_facility_name: "Skyrim Debt Facility",
//           portfolio_id: 3,
//           lender_id: 2,
//           debt_facility_id_2: 201,
//         },
//         {
//           payments_id: 268,
//           collateral_id: 150,
//           payment_date: new Date("2025-06-30T00:00:00"),
//           principal_received: 150000,
//           interest_received: 25000,
//           debt_facility_id: 201,
//           inclusion_date: new Date("2025-02-27T00:00:00"),
//           removed_date: new Date("2025-08-15T00:00:00"),
//           collateral_id_2: 150,
//           tranche_id: 236,
//           loan_approval_id: 147,
//           debt_facility_name: "Skyrim Debt Facility",
//           portfolio_id: 3,
//           lender_id: 2,
//           debt_facility_id_2: 201,
//         },
//         {
//           payments_id: 272,
//           collateral_id: 150,
//           payment_date: new Date("2025-07-31T00:00:00"),
//           principal_received: 250000,
//           interest_received: 150000,
//           debt_facility_id: 201,
//           inclusion_date: new Date("2025-02-27T00:00:00"),
//           removed_date: new Date("2025-08-15T00:00:00"),
//           collateral_id_2: 150,
//           tranche_id: 236,
//           loan_approval_id: 147,
//           debt_facility_name: "Skyrim Debt Facility",
//           portfolio_id: 3,
//           lender_id: 2,
//           debt_facility_id_2: 201,
//         },
//         {
//           payments_id: 274,
//           collateral_id: 153,
//           payment_date: new Date("2025-07-31T00:00:00"),
//           principal_received: 200000,
//           interest_received: 15000,
//           debt_facility_id: 201,
//           inclusion_date: new Date("2025-07-14T00:00:00"),
//           removed_date: null,
//           collateral_id_2: 153,
//           tranche_id: 239,
//           loan_approval_id: 150,
//           debt_facility_name: "Skyrim Debt Facility",
//           portfolio_id: 3,
//           lender_id: 2,
//           debt_facility_id_2: 201,
//         },
//         {
//           payments_id: 279,
//           collateral_id: 153,
//           payment_date: new Date("2025-08-31T00:00:00"),
//           principal_received: 75000,
//           interest_received: 80000,
//           debt_facility_id: 201,
//           inclusion_date: new Date("2025-07-14T00:00:00"),
//           removed_date: null,
//           collateral_id_2: 153,
//           tranche_id: 239,
//           loan_approval_id: 150,
//           debt_facility_name: "Skyrim Debt Facility",
//           portfolio_id: 3,
//           lender_id: 2,
//           debt_facility_id_2: 201,
//         },
//         {
//           payments_id: 283,
//           collateral_id: 153,
//           payment_date: new Date("2025-09-30T00:00:00"),
//           principal_received: 400000,
//           interest_received: 15000,
//           debt_facility_id: 201,
//           inclusion_date: new Date("2025-07-14T00:00:00"),
//           removed_date: null,
//           collateral_id_2: 153,
//           tranche_id: 239,
//           loan_approval_id: 150,
//           debt_facility_name: "Skyrim Debt Facility",
//           portfolio_id: 3,
//           lender_id: 2,
//           debt_facility_id_2: 201,
//         },
//         {
//           payments_id: 287,
//           collateral_id: 153,
//           payment_date: new Date("2025-10-31T00:00:00"),
//           principal_received: 200000,
//           interest_received: 15000,
//           debt_facility_id: 201,
//           inclusion_date: new Date("2025-07-14T00:00:00"),
//           removed_date: null,
//           collateral_id_2: 153,
//           tranche_id: 239,
//           loan_approval_id: 150,
//           debt_facility_name: "Skyrim Debt Facility",
//           portfolio_id: 3,
//           lender_id: 2,
//           debt_facility_id_2: 201,
//         },
//       ],
//     });

//     rollforwardQueries.getCollateralNames.mockResolvedValue({
//       rows: [
//         {
//           collateral_id: 155,
//           legal_name: "Buttercup & Bramble Ltd.",
//           short_name: "Buttercup",
//         },
//         {
//           collateral_id: 156,
//           legal_name: "Buttercup & Bramble Ltd.",
//           short_name: "Buttercup",
//         },
//         {
//           collateral_id: 157,
//           legal_name: "Elfwood Delights",
//           short_name: "Elfwood",
//         },
//         {
//           collateral_id: 158,
//           legal_name: "Elfwood Delights",
//           short_name: "Elfwood",
//         },
//       ],
//     });

//     processIds.getIdsOfAdditions.mockReturnValue([
//       { id: 150, addedDate: "2/27/2025" },
//       { id: 153, addedDate: "7/14/2025" },
//     ]);

//     processBalanceData.getFacilityBalanceAdditions.mockReturnValue([
//       {
//         collateralId: 153,
//         addedDate: "7/14/2025",
//         amtAdded: 15000000,
//       },
//     ]);

//     processIds.getIdsOfRemoved.mockReturnValue([{ id: 150, removalDate: "8/15/2025" }]);

//     processBalanceData.getFacilityBalanceRemovals.mockReturnValue([
//       {
//         collateralId: 150,
//         removalDate: "8/15/2025",
//         amtRemoved: 10600000,
//       },
//     ]);

//     processIds.getIdsAtStartOfPeriod.mockReturnValue([150]);

//     processBalanceData.getStartOfPeriodBalances.mockReturnValue([
//       {
//         collateralId: 150,
//         startBalance: 11250000,
//       },
//     ]);

//     processIds.getIdsAtEndOfPeriod.mockReturnValue([{ collateralId: 153, removedDate: null }]);

//     processBalanceData.getEndOfPeriodBalances.mockReturnValue([
//       {
//         collateralId: 153,
//         endBalance: 14125000,
//       },
//     ]);

//     processIds.getEveryIdInPeriod.mockReturnValue([{ id: 153 }, { id: 150 }]);

//     processBalanceData.getBegAndEndOustandings.mockReturnValue([
//       {
//         collateralId: 150,
//         balanceBeg: 11250000,
//         balanceEnd: null,
//       },
//       {
//         collateralId: 153,
//         balanceBeg: null,
//         balanceEnd: 14125000,
//       },
//     ]);

//     processAdvanceRates.getBegAndEndAdvRates.mockReturnValue([
//       {
//         collateralId: 150,
//         advanceRateBeg: 0.7,
//         advanceRateEnd: null,
//       },
//       {
//         collateralId: 153,
//         advanceRateBeg: 0.4,
//         advanceRateEnd: 0.4,
//       },
//     ]);

//     processBankValuations.getBegAndEndBankValuations.mockReturnValue([
//       {
//         collateralId: 150,
//         bankValBeg: 0.98,
//         bankValEnd: null,
//       },
//       {
//         collateralId: 153,
//         bankValBeg: 0.98,
//         bankValEnd: 0.98,
//       },
//     ]);

//     processInternalValuations.getBegAndEndInternalValuations.mockResolvedValue([
//       {
//         collateralId: 150,
//         internalValBeg: 0.98,
//         internalValEnd: null,
//       },
//       {
//         collateralId: 153,
//         internalValBeg: 0.985,
//         internalValEnd: 0.985,
//       },
//     ]);

//     processPayments.getPaymentInfo.mockReturnValue([
//       {
//         collateralId: 153,
//         principalRec: 875000,
//         interestRec: 125000,
//       },
//       {
//         collateralId: 150,
//         principalRec: 650000,
//         interestRec: 250000,
//       },
//     ]);

//     const response = await request(app).get("/api/reportingCalculations").query({
//       debtFacilityId: 999,
//       startDate: "2025-05-01",
//       endDate: "2025-10-31",
//       isFundsFlow: true,
//       currentOutstandings: 6000000,
//       intExpDue: 50000,
//     });

//     expect(response.body).toEqual({
//       collateralData: [
//         {
//           collateralId: 150,
//           collateralName: "Buttercup & Bramble Ltd.",
//           balanceBeg: 11250000,
//           collAdded: 0,
//           collRemoved: 10600000,
//           principalRec: 650000,
//           balanceEnd: 0,
//           begValue: 11025000,
//           chgDueToAdd: 0,
//           chgDueToRepay: -11025000,
//           chgDueToInternalVal: 0,
//           addlChgBankVal: 0,
//           endValue: 0,
//           begLevAvail: 7717500,
//           levAvailChgDueToAddition: 0,
//           levAvailChgDueToRepay: -7717500,
//           levAvailChgDueToVal: 0,
//           levAvailChgDueToAdvRate: 0,
//           endLevAvail: 0,
//           bankValBeg: 0.98,
//           bankValEnd: 0,
//           internalValBeg: 0.98,
//           internalValEnd: 0,
//           advanceRateBeg: 0.7,
//           advanceRateEnd: 0,
//           intRec: 250000,
//         },
//         {
//           collateralId: 153,
//           collateralName: "Elfwood Delights",
//           balanceBeg: 0,
//           collAdded: 15000000,
//           collRemoved: 0,
//           principalRec: 875000,
//           balanceEnd: 14125000,
//           begValue: 0,
//           chgDueToAdd: 14700000,
//           chgDueToRepay: -857500,
//           chgDueToInternalVal: 70625,
//           addlChgBankVal: -70625,
//           endValue: 13842500,
//           begLevAvail: 0,
//           levAvailChgDueToAddition: 5880000,
//           levAvailChgDueToRepay: -343000,
//           levAvailChgDueToVal: 0,
//           levAvailChgDueToAdvRate: 0,
//           endLevAvail: 5537000,
//           bankValBeg: 0.98,
//           bankValEnd: 0.98,
//           internalValBeg: 0.985,
//           internalValEnd: 0.985,
//           advanceRateBeg: 0.4,
//           advanceRateEnd: 0.4,
//           intRec: 125000,
//         },
//       ],

//       fundsFlowData: {
//         currFacBal: "6000000",
//         endLevAvail: 5537000,
//         currAvail: -463000,
//         intExp: -50000,
//         principalRec: 1525000,
//         intRec: 375000,
//         totalDist: 1900000,
//         dueToBank: 513000,
//         dueToClient: 1387000,
//       },
//     });
//   });
// });
