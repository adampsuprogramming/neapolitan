const pool = require("../db");

// Retrieves newest rate data for specified tranche

const pieChartSQL = `
SELECT 
c.collateral_id,
c.debt_facility_id,
lt.tranche_id, 
lt.lien_type, 
b.legal_name, 
b.borrower_id, 
b.corporate_hq_id, 
r_hq.region_name as hq_region_name,
b.revenue_geography_id, 
r_rev.region_name as rev_region_name,
b.naics_subsector_id, 
n.naics_subsector_name,
b.is_public
FROM collateral c
LEFT JOIN loan_tranches lt
ON c.tranche_id = lt.tranche_id
LEFT JOIN loan_agreements la
ON lt.loan_agreement_id = la.loan_agreement_id
LEFT JOIN borrowers b
ON la.borrower_id = b.borrower_id
LEFT JOIN regions r_hq
ON b.corporate_hq_id = r_hq.region_id
LEFT JOIN regions r_rev
ON b.revenue_geography_id = r_rev.region_id
LEFT JOIN naics_subsectors n
ON b.naics_subsector_id = n.naics_subsector_id
WHERE debt_facility_id = $1;
`;

async function getPieChartData(debtFacilityId) {
  return await pool.query(pieChartSQL, [debtFacilityId]);
}

module.exports = {
  getPieChartData,
};
