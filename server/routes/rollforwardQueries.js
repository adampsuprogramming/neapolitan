const pool = require("../db");

const collateralQuery = `
select 
    inclusion_date, removed_date, collateral_id, tranche_id, loan_approval_id
    from collateral
    where debt_facility_id = $1
`;

const collateralNameQuery = `
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
`;

const balancesQuery = `
select *
from collateral_balance cb
left join collateral c
	on c.collateral_id = cb.collateral_id
where c.debt_facility_id = $1
`;

// Query to get advance rates in effect for given facility_id $1 and at given date $2
const facilityQuery = `
SELECT d.portfolio_id, d.lender_id, d.debt_facility_id, dfo.start_date, dfo.end_date, dfo.is_overall_rate, dfo.overall_rate, dfo.is_first_lien_advance_rate, dfo.first_lien_advance_rate, 
dfo.is_second_lien_advance_rate, dfo.second_lien_advance_rate, dfo.is_mezzanine_advance_rate, dfo.mezzanine_advance_rate
FROM public.debt_facilities d
left join debt_facility_balances dfb
	on dfb.debt_facility_id  = d.debt_facility_id 
left join debt_facility_options dfo
	on dfo.debt_facility_id  = d.debt_facility_id 
WHERE d.debt_facility_id=$1 and dfo.start_date<=$2 and (dfo.end_date>$2 OR dfo.end_date IS NULL)`;

// Query to get bank advance rates and valuations in effect for given facility_id $1

const bankMetricsQuery = `SELECT * FROM bank_metrics bm
left join collateral c
	on c.collateral_id = bm.collateral_id
left join debt_facilities df
	on c.debt_facility_id = df.debt_facility_id
where df.debt_facility_id = $1 and bm.start_date<=$2 and (bm.end_date>$2 OR bm.end_date IS NULL)`;

// Query to get all internal valuations for given facility_id $1
const intValQuery = `
SELECT c.collateral_id, lm.start_date, lm.end_date, lm.internal_val FROM public.loan_metrics lm
left join loan_tranches lt
	on lm.tranche_id  = lt.tranche_id
left join collateral c
	on c.tranche_id = lt.tranche_id
left join debt_facilities df
	on c.debt_facility_id = df.debt_facility_id
WHERE df.debt_facility_id = $1 and lm.start_date<=$2 and (lm.end_date>$2 OR lm.end_date IS NULL)`;

// Query to get all specific internal valuations for a given collateral id and date
const intValOneColl = `
SELECT c.collateral_id, lm.start_date, lm.end_date, lm.internal_val FROM public.loan_metrics lm
left join loan_tranches lt
	on lm.tranche_id  = lt.tranche_id
left join collateral c
	on c.tranche_id = lt.tranche_id
WHERE c.collateral_id=$1 and lm.start_date<=$2 and (lm.end_date>$2 OR lm.end_date IS NULL)`;

const lienTypeQuery = `SELECT c.collateral_id, lt.lien_Type FROM public.loan_metrics lm
left join loan_tranches lt
	on lm.tranche_id  = lt.tranche_id
left join collateral c
	on c.tranche_id = lt.tranche_id
left join debt_facilities df
	on c.debt_facility_id = df.debt_facility_id
WHERE df.debt_facility_id = $1`;

const paymentQuery = `SELECT * FROM public.payments p
left join collateral c
	on c.collateral_id  = p.collateral_id
left join debt_facilities df
    on df.debt_facility_id = c.debt_facility_id
where df.debt_facility_id = $1 and p.payment_date >= $2 and p.payment_date <= $3
ORDER BY payments_id ASC `;

const loanApprovalQuery = `
SELECT collateral_id, lap.approved_valuation, lap.approved_advance_rate
FROM loan_approvals lap
LEFT JOIN collateral c
on c.loan_approval_id = lap.loan_approval_id
WHERE lap.debt_facility_id = $1
`;

async function getFacilityCollateral(debtFacilityId) {
  return await pool.query(collateralQuery, [debtFacilityId]);
}

async function getBalances(debtFacilityId) {
  return await pool.query(balancesQuery, [debtFacilityId]);
}

async function getBankMetrics(debtFacilityId, date) {
  return await pool.query(bankMetricsQuery, [debtFacilityId, date]);
}

async function getFacilityMetrics(debtFacilityId, date) {
  return await pool.query(facilityQuery, [debtFacilityId, date]);
}

async function getLienType(debtFacilityId) {
  return await pool.query(lienTypeQuery, [debtFacilityId]);
}

async function getLoanApprovalInfo(debtFacilityId) {
  return await pool.query(loanApprovalQuery, [debtFacilityId]);
}

async function getInternalValInfo(debtFacilityId, date) {
  return await pool.query(intValQuery, [debtFacilityId, date]);
}

async function getIntValForCollateral(collateralId, date) {
  return await pool.query(intValOneColl, [collateralId, date]);
}

async function getPaymentsTimePeriod(debtFacilityId, startDate, endDate) {
  return await pool.query(paymentQuery, [debtFacilityId, startDate, endDate]);
}

async function getCollateralNames(debtFacilityId) {
  return await pool.query(collateralNameQuery, [debtFacilityId]);
}

module.exports = {
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
};
