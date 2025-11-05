// ************************************************************************
// *       UT-78 – test getFacilityCollateral(debtFacilityId)             *
// *       UT-79 - test getBalances(debtFacilityId)
// *       UT-80 - test getBankMetrics(debtFacilityId, date)
// *       UT-81 - test getFacilityMetrics(debtFacilityId, date)
// *       UT-82 - test getLienType(debtFacilityId)
// *       UT-83 - test getLoanApprovalInfo(debtFacilityId)
// *       UT-84 - test getInternalValInfo(debtFacilityId, date)
// *       UT-85 - test getIntValForCollateral(collateralId, date)
// *       UT-86 - test getPaymentsTimePeriod(debtFacilityId, startDate, endDate)
// *       UT-87 - test getCollateralNames(debtFacilityId)



// ************************************************************************

// This mock must come before the import of object
jest.mock("../db");

const request = require("supertest");
const app = require("../app");

const mockedQuery = jest.fn();
require("../db").query = mockedQuery;

const pool = require("../db");
pool.end = jest.fn();

const {
  getFacilityCollateral,
  getBalances,
  getBankMetrics,
  getFacilityMetrics,
  getLienType,
  getLoanApprovalInfo,
  getInternalValInfo,
  getIntValForCollateral,
  getPaymentsTimePeriod,
  getCollateralNames,
} = require("../routes/rollforwardQueries");


afterAll(async () => {
  await pool.end();
});

describe("test rollforwardQueries", () => {

// ********************** UT-78 – test getFacilityCollateral(debtFacilityId) ***************************

  it("accepts a debtFacilityId and returns data on Facility Collateral", async () => {
    mockedQuery.mockResolvedValue({
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
      },]
    });

    const result = await getFacilityCollateral(201);

    expect(result).toEqual({rows: [
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
      },]});

    expect(mockedQuery).toHaveBeenCalledWith(
      `
select 
    inclusion_date, removed_date, collateral_id, tranche_id, loan_approval_id
    from collateral
    where debt_facility_id = $1
`,
      [201],
    );
  });


// ********************** UT-79 - test getBalances(debtFacilityId) *******************************

  it("accepts a debtFacilityId and returns data on facility balances", async () => {

    const getBalancesResult = ({rows: [
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
  ]})


    mockedQuery.mockResolvedValue(getBalancesResult);

    const result = await getBalances(201);

    expect(result).toEqual(getBalancesResult);

    expect(mockedQuery).toHaveBeenCalledWith(
      `
select *
from collateral_balance cb
left join collateral c
	on c.collateral_id = cb.collateral_id
where c.debt_facility_id = $1
`,
      [201],
    );
  });

// ********************** UT-80 - test getBankMetrics(debtFacilityId, date) *******************************

  it("accepts a debtFacilityId and date, returning data on bank metrics", async () => {

    const getBankMetricsResult = ({rows:[
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
    ]})


    mockedQuery.mockResolvedValue(getBankMetricsResult);

    const result = await getBankMetrics(201, '2025-05-01');

    expect(result).toEqual(getBankMetricsResult);

    expect(mockedQuery).toHaveBeenCalledWith(
      `SELECT * FROM bank_metrics bm
left join collateral c
	on c.collateral_id = bm.collateral_id
left join debt_facilities df
	on c.debt_facility_id = df.debt_facility_id
where df.debt_facility_id = $1 and bm.start_date<=$2 and (bm.end_date>$2 OR bm.end_date IS NULL)`,
      [201, '2025-05-01'],
    );
  });



// ********************** UT-81 - test getFacilityMetrics(debtFacilityId, date) *******************************

  it("accepts a debtFacilityId and date, returning data on facility metrics", async () => {

    const getFacilityMetricsResult = ({rows:[
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
    ]})


    mockedQuery.mockResolvedValue(getFacilityMetricsResult);

    const result = await getFacilityMetrics(201, '2025-05-01');

    expect(result).toEqual(getFacilityMetricsResult);

    expect(mockedQuery).toHaveBeenCalledWith(
      `
SELECT d.portfolio_id, d.lender_id, d.debt_facility_id, dfo.start_date, dfo.end_date, dfo.is_overall_rate, dfo.overall_rate, dfo.is_first_lien_advance_rate, dfo.first_lien_advance_rate, 
dfo.is_second_lien_advance_rate, dfo.second_lien_advance_rate, dfo.is_mezzanine_advance_rate, dfo.mezzanine_advance_rate
FROM public.debt_facilities d
left join debt_facility_balances dfb
	on dfb.debt_facility_id  = d.debt_facility_id 
left join debt_facility_options dfo
	on dfo.debt_facility_id  = d.debt_facility_id 
WHERE d.debt_facility_id=$1 and dfo.start_date<=$2 and (dfo.end_date>$2 OR dfo.end_date IS NULL)`,
      [201, '2025-05-01'],
    );
  });



// ********************** UT-82 - test getLienType(debtFacilityId) *******************************

  it("accepts a debtFacilityId, returning data on lien types", async () => {

    const getLienTypeResult = ({rows:[
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
    ]})


    mockedQuery.mockResolvedValue(getLienTypeResult);

    const result = await getLienType(201);

    expect(result).toEqual(getLienTypeResult);

    expect(mockedQuery).toHaveBeenCalledWith(
      `SELECT c.collateral_id, lt.lien_Type FROM public.loan_metrics lm
left join loan_tranches lt
	on lm.tranche_id  = lt.tranche_id
left join collateral c
	on c.tranche_id = lt.tranche_id
left join debt_facilities df
	on c.debt_facility_id = df.debt_facility_id
WHERE df.debt_facility_id = $1`,
      [201],
    );
  });



// ********************** UT-83 - test getLoanApprovalInfo(debtFacilityId) *******************************

  it("accepts a debtFacilityId, returning data on loan approvals", async () => {

    const getLoanApprovalInfoResult = ({rows:[
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
    ]})


    mockedQuery.mockResolvedValue(getLoanApprovalInfoResult);

    const result = await getLoanApprovalInfo(201);

    expect(result).toEqual(getLoanApprovalInfoResult);

    expect(mockedQuery).toHaveBeenCalledWith(
      `
  SELECT collateral_id, lap.approved_valuation, lap.approved_advance_rate
  FROM loan_approvals lap
  LEFT JOIN collateral c
  on c.loan_approval_id = lap.loan_approval_id
  WHERE lap.debt_facility_id = $1
`,
      [201],
    );
  });

  
// ********************** UT-84 - test getInternalValInfo(debtFacilityId, date) *******************************

  it("accepts a debtFacilityId and date, returning data on internal valuations", async () => {

    const getInternalValInfoResult = ({rows:[
      {
        collateral_id: 150,
        start_date: new Date("2025-02-20T00:00:00"),
        end_date: new Date("2025-07-15T00:00:00"),
        internal_val: 0.98,
      },
    ]})


    mockedQuery.mockResolvedValue(getInternalValInfoResult);

    const result = await getInternalValInfo(201, "2025-05-01");

    expect(result).toEqual(getInternalValInfoResult);

    expect(mockedQuery).toHaveBeenCalledWith(
      `
SELECT c.collateral_id, lm.start_date, lm.end_date, lm.internal_val FROM public.loan_metrics lm
left join loan_tranches lt
	on lm.tranche_id  = lt.tranche_id
left join collateral c
	on c.tranche_id = lt.tranche_id
left join debt_facilities df
	on c.debt_facility_id = df.debt_facility_id
WHERE df.debt_facility_id = $1 and lm.start_date<=$2 and (lm.end_date>$2 OR lm.end_date IS NULL)`,
      [201, "2025-05-01"],
    );
  });

  
// ********************** UT-85 - test getIntValForCollateral(collateralId, date) *******************************

  it("accepts a collateralId and date, returning data for the specific internal valuation", async () => {

    const getIntValForCollateralResult = ({rows:[
      {
        collateral_id: 150,
        start_date: new Date("2025-02-20T00:00:00"),
        end_date: new Date("2025-07-15T00:00:00"),
        internal_val: 0.98,
      },
    ]})


    mockedQuery.mockResolvedValue(getIntValForCollateralResult);

    const result = await getIntValForCollateral(150, "2025-05-01");

    expect(result).toEqual(getIntValForCollateralResult);

    expect(mockedQuery).toHaveBeenCalledWith(
      `
SELECT c.collateral_id, lm.start_date, lm.end_date, lm.internal_val FROM public.loan_metrics lm
left join loan_tranches lt
	on lm.tranche_id  = lt.tranche_id
left join collateral c
	on c.tranche_id = lt.tranche_id
WHERE c.collateral_id=$1 and lm.start_date<=$2 and (lm.end_date>$2 OR lm.end_date IS NULL)`,
      [150, "2025-05-01"],
    );
  });


  
// ********************** UT-86 - test getPaymentsTimePeriod(debtFacilityId, startDate, endDate) *******************************

  it("accepts a debtFacilityId, startDate, and endDate, returning payment date for that time period", async () => {

    const getPaymentsTimePeriodResult = ({rows: [
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
      principal_received: 200000,
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
  ]})


    mockedQuery.mockResolvedValue(getPaymentsTimePeriodResult);

    const result = await getPaymentsTimePeriod(201, "2025-05-01", "2025-10-31");

    expect(result).toEqual(getPaymentsTimePeriodResult);

    expect(mockedQuery).toHaveBeenCalledWith(
      `SELECT * FROM public.payments p
left join collateral c
	on c.collateral_id  = p.collateral_id
left join debt_facilities df
    on df.debt_facility_id = c.debt_facility_id
where df.debt_facility_id = $1 and p.payment_date >= $2 and p.payment_date <= $3
ORDER BY payments_id ASC `,
      [201, "2025-05-01", "2025-10-31"],
    );
  });


  
// ********************** UT-87 - test getCollateralNames(debtFacilityId) *******************************

  it("accepts a debtFacilityId and returns the names of collateral in that facility", async () => {

    const getCollateralNamesResult = ({rows: [
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
  ]})


    mockedQuery.mockResolvedValue(getCollateralNamesResult);

    const result = await getCollateralNames(201);

    expect(result).toEqual(getCollateralNamesResult);

    expect(mockedQuery).toHaveBeenCalledWith(
      `
select c.collateral_id, legal_name, short_name
from borrowers b
left join loan_agreements la
on la.borrower_id = b.borrower_id
left join loan_tranches lt
on lt.loan_agreement_id = la.loan_agreement_id
left join collateral c
on c.tranche_id = lt.tranche_id
left join debt_facilities df
on df.debt_facility_id = c.debt_facility_id
where df.debt_facility_id = $1
`,
      [201],
    );
  });



});
