// ************************************************************************
// *       UT-106 – test getPaymentInfo(everyIdInPeriod, paymentsResults) *
// ************************************************************************

const { getPaymentInfo } = require("./processPayments");

describe("test processPayments", () => {
  // ********************** UT-106 – test getPaymentInfo(everyIdInPeriod, paymentsResults) ***************************

  it("accepts a everyIdInPeriod and paymentsResults, returning total payments per collateral id", async () => {
    const everyIdInPeriod = [{ id: 150 }, { id: 153 }];

    const paymentResults = {
      rows: [
        {
          payments_id: 265,
          collateral_id: 150,
          payment_date: new Date("2025-05-31T00:00:00"),
          principal_received: 250000,
          interest_received: 75000,
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
          payments_id: 268,
          collateral_id: 150,
          payment_date: new Date("2025-06-30T00:00:00"),
          principal_received: 150000,
          interest_received: 25000,
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
          payments_id: 272,
          collateral_id: 150,
          payment_date: new Date("2025-07-31T00:00:00"),
          principal_received: 250000,
          interest_received: 150000,
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
          payments_id: 274,
          collateral_id: 153,
          payment_date: new Date("2025-07-31T00:00:00"),
          principal_received: null,
          interest_received: 15000,
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
          payments_id: 279,
          collateral_id: 153,
          payment_date: new Date("2025-08-31T00:00:00"),
          principal_received: 75000,
          interest_received: 80000,
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
          payments_id: 283,
          collateral_id: 153,
          payment_date: new Date("2025-09-30T00:00:00"),
          principal_received: 400000,
          interest_received: 15000,
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
          payments_id: 287,
          collateral_id: 153,
          payment_date: new Date("2025-10-31T00:00:00"),
          principal_received: 200000,
          interest_received: null,
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

    const result = getPaymentInfo(everyIdInPeriod, paymentResults);

    expect(result).toEqual([
      {
        collateralId: 150,
        principalRec: 650000,
        interestRec: 250000,
      },
      {
        collateralId: 153,
        principalRec: 675000,
        interestRec: 110000,
      },
    ]);
  });
});
