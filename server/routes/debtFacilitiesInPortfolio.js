const pool = require("../db");

const debtFacilityInPortfolioQuery = `
SELECT d.debt_facility_id
FROM public.debt_facilities d
left join debt_facility_options dfo
	on dfo.debt_facility_id  = d.debt_facility_id 
WHERE d.portfolio_id=$1 and dfo.start_date<=$2 and (dfo.end_date>$2 OR dfo.end_date IS NULL);
`;

async function getDebtFacilities(portfolioId, asOfDate) {
  return await pool.query(debtFacilityInPortfolioQuery, [portfolioId, asOfDate]);
}

module.exports = {
  getDebtFacilities,
};
