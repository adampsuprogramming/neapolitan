// **************************************************************
// *                UT-98 – test getFacilityBalanceAdditions()  *
// *                UT-99 – test getFacilityBalanceRemovals()   *
// *                UT-100 – test getStartOfPeriodBalances()    *
// *                UT-101 – test getEndOfPeriodBalances()      *
// *                UT-102 – test getBegAndEndOustandings()     *
// **************************************************************

const {
  getFacilityBalanceAdditions,
  getFacilityBalanceRemovals,
  getStartOfPeriodBalances,
  getEndOfPeriodBalances,
  getBegAndEndOustandings,
} = require("../routes/processBalanceData");

describe("test process Balance Data", () => {
  const collateralBalances = {
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
    ],
  };

  const startDateObject = new Date("2025-05-01T00:00:00");
  const endDateObject = new Date("2025-10-31T00:00:00");

  // ********************** UT-98 – test getFacilityBalanceAdditions() ***************************
  it("accepts collateralBalances, addedIds, startDateObject and endDateObject and returns balances of additions", async () => {
    const addedIds = [
      { id: 150, addedDate: new Date("2025-02-27T00:00:00") },
      { id: 153, addedDate: new Date("2025-07-14T00:00:00") },
    ];

    const result = getFacilityBalanceAdditions(
      collateralBalances,
      addedIds,
      startDateObject,
      endDateObject,
    );

    expect(result).toEqual([
      {
        collateralId: 153,
        addedDate: new Date("2025-07-14T00:00:00"),
        amtAdded: 15000000,
      },
    ]);
  });

  // ********************** UT-99 – test getFacilityBalanceRemovals() ***************************
  it("accepts collateralBalances, removedIds, startDateObject and endDateObject and returns balances of removals", async () => {
    const removedIds = [{ id: 150, removalDate: new Date("2025-08-15T00:00:00") }];

    const result = getFacilityBalanceRemovals(
      collateralBalances,
      removedIds,
      startDateObject,
      endDateObject,
    );

    expect(result).toEqual([
      {
        collateralId: 150,
        removalDate: new Date("2025-08-15T00:00:00"),
        amtRemoved: 10600000,
      },
    ]);
  });

  // ********************** UT-100 – test getStartOfPeriodBalances() ***************************
  it("accepts allIdsStart, collateralBalances, and endDateObject, and returns start of period balances", async () => {
    const allIdsStart = [150];

    const result = getStartOfPeriodBalances(allIdsStart, collateralBalances, startDateObject);

    expect(result).toEqual([
      {
        collateralId: 150,
        startBalance: 11250000,
      },
    ]);
  });

  // ********************** UT-101 – test getEndOfPeriodBalances() ***************************
  it("accepts allIdsEnd, collateralBalances, and endDateObject, and returns end of period balances", async () => {
    const allIdsEnd = [{ collateralId: 153, removedDate: null }];

    const result = getEndOfPeriodBalances(allIdsEnd, collateralBalances, endDateObject);

    expect(result).toEqual([
      {
        collateralId: 153,
        endBalance: 14125000,
      },
    ]);
  });

  // ********************** UT-102 – test getBegAndEndOustandings() ***************************
  it("accepts startBalances and endBalances, and returns both beginning and end of period balances", async () => {
    const startBalances = [
      {
        collateralId: 150,
        startBalance: 11250000,
      },
    ];
    const endBalances = [
      {
        collateralId: 153,
        endBalance: 14125000,
      },
    ];

    const result = getBegAndEndOustandings(startBalances, endBalances);

    expect(result).toEqual([
      {
        collateralId: 150,
        balanceBeg: 11250000,
        balanceEnd: null,
      },
      {
        collateralId: 153,
        balanceBeg: null,
        balanceEnd: 14125000,
      },
    ]);
  });
});
