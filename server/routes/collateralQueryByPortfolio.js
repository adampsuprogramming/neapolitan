const pool = require("../db");

const collateralQuery = `
SELECT * 
FROM public.collateral c
left join debt_facilities d
	on c.debt_facility_id  = d.debt_facility_id 
WHERE d.portfolio_id=$1 and c.inclusion_date<=$2 and (c.removed_date>$2 OR c.removed_date IS NULL);
`;

async function getCollateralByPortfolio(portfolioId, asOfDate) {
  return await pool.query(collateralQuery, [portfolioId, asOfDate]);
}

module.exports = {
  getCollateralByPortfolio,
};
