// ************************************************************************
// *       UT-3– Testing /api/borrowbase endpoint’s functionality         *
// ************************************************************************

// This mock must come before the import of object
jest.mock("../db");

const request = require("supertest");
const app = require("../app");

const mockedQuery = jest.fn();
require("../db").query = mockedQuery;

const pool = require("../db");
pool.end = jest.fn();

afterAll(async () =>{
  await pool.end();
})


describe("GET /api/borrowbase", () => {
  it("accepts an borrowing base info request from the front-end, queries the database, and then returns it", async () => {
    mockedQuery.mockResolvedValue({
      rows: [
        {
          collateral_id: 1000,
          inclusion_date: "2024-11-30",
          removed_date: null,
          approval_date: "2024-11-15",
          approved_ebitda: 18000000.0,
          approved_net_leverage: 4.3,
          approved_int_coverage: 1.25,
          approved_advance_rate: .70,
          approved_valuation: 1.0,
          approved_leverage: 4.45,
          commitment_amount: 28000000.0,
          outstanding_amount: 28000000.0,
          lien_type: "First",
          maturity_date: "2024-10-31",
          tranche_type: "Term",
          loan_agreement_date: "2029-10-31",
          legal_name: "Zelda Tecnologies",
          short_name: "Zelda Tech",
          ebitda: 10500415.22,
          loan_metrics_start_date: "2025-06-30",
          int_coverage_ratio: 0.71515,
          is_cov_default: false,
          is_payment_default: false,
          leverage_ratio: 4.487841,
          loan_metrics_id: 487,
          net_leverage_ratio: 5.484121,
          rate_start_date: "2024-11-30",
          end_date: "2024-12-31",
          fixed_rate: null,
          floor: null,
          has_floor: false,
          is_fixed: false,
          reference_rate: "LIBOR",
          spread: 0.0951,
        },
        {
          collateral_id: 1001,
          inclusion_date: "2024-02-08",
          removed_date: null,
          approval_date: "2024-02-08",
          approved_ebitda: 15000000.0,
          approved_net_leverage: 3.1,
          approved_int_coverage: 1.85,
          approved_advance_rate: 0.55,
          approved_valuation: 0.7,
          approved_leverage: 5.15,
          commitment_amount: 5500000.0,
          outstanding_amount: 5500000.0,
          lien_type: "First",
          maturity_date: "2029-01-31",
          tranche_type: "Term",
          loan_agreement_date: "2024-01-31",
          legal_name: "Yoshi Co.",
          short_name: "Yoshi Co.",
          ebitda: 4747841.14,
          loan_metrics_start_date: "2025-06-30",
          int_coverage_ratio: 1.4115141,
          is_cov_default: false,
          is_payment_default: false,
          leverage_ratio: 6.4848463,
          loan_metrics_id: 421,
          net_leverage_ratio: 7.487842,
          rate_start_date: "2025-01-01",
          end_date: "2025-01-31",
          fixed_rate: null,
          floor: null,
          has_floor: false,
          is_fixed: false,
          reference_rate: "LIBOR",
          spread: 0.0875,
        },
      ],
    });

	const response = await request(app).get("/api/borrowbase").query({ as_of_date: "2025-08-31", facility_id: 81 });
	
	expect(response.body).toEqual([
        {
          collateral_id: 1000,
          inclusion_date: "2024-11-30",
          removed_date: null,
          approval_date: "2024-11-15",
          approved_ebitda: 18000000.0,
          approved_net_leverage: 4.3,
          approved_int_coverage: 1.25,
          approved_advance_rate: .70,
          approved_valuation: 1.0,
          approved_leverage: 4.45,
          commitment_amount: 28000000.0,
          outstanding_amount: 28000000.0,
          lien_type: "First",
          maturity_date: "2024-10-31",
          tranche_type: "Term",
          loan_agreement_date: "2029-10-31",
          legal_name: "Zelda Tecnologies",
          short_name: "Zelda Tech",
          ebitda: 10500415.22,
          loan_metrics_start_date: "2025-06-30",
          int_coverage_ratio: 0.71515,
          is_cov_default: false,
          is_payment_default: false,
          leverage_ratio: 4.487841,
          loan_metrics_id: 487,
          net_leverage_ratio: 5.484121,
          rate_start_date: "2024-11-30",
          end_date: "2024-12-31",
          fixed_rate: null,
          floor: null,
          has_floor: false,
          is_fixed: false,
          reference_rate: "LIBOR",
          spread: 0.0951,
        },
        {
          collateral_id: 1001,
          inclusion_date: "2024-02-08",
          removed_date: null,
          approval_date: "2024-02-08",
          approved_ebitda: 15000000.0,
          approved_net_leverage: 3.1,
          approved_int_coverage: 1.85,
          approved_advance_rate: 0.55,
          approved_valuation: 0.7,
          approved_leverage: 5.15,
          commitment_amount: 5500000.0,
          outstanding_amount: 5500000.0,
          lien_type: "First",
          maturity_date: "2029-01-31",
          tranche_type: "Term",
          loan_agreement_date: "2024-01-31",
          legal_name: "Yoshi Co.",
          short_name: "Yoshi Co.",
          ebitda: 4747841.14,
          loan_metrics_start_date: "2025-06-30",
          int_coverage_ratio: 1.4115141,
          is_cov_default: false,
          is_payment_default: false,
          leverage_ratio: 6.4848463,
          loan_metrics_id: 421,
          net_leverage_ratio: 7.487842,
          rate_start_date: "2025-01-01",
          end_date: "2025-01-31",
          fixed_rate: null,
          floor: null,
          has_floor: false,
          is_fixed: false,
          reference_rate: "LIBOR",
          spread: 0.0875,
        }
      ]);
		
expect(mockedQuery).toHaveBeenCalledWith(

`
select 
	c.collateral_id,
	c.inclusion_date,
	c.removed_date,
	c.approval_date,
	c.approved_ebitda,
	c.approved_net_leverage,
	c.approved_int_coverage,
	c.approved_advance_rate,
	c.approved_valuation,
	c.approved_leverage,
	cb.commitment_amount,
	cb.outstanding_amount,
	lt.lien_type,
	lt.maturity_date,
	lt.tranche_type,
	la.loan_agreement_date,
	b.legal_name,
	b.short_name,
	lm.ebitda,
	lm.start_date as loan_metrics_start_date,
	lm.int_coverage_ratio,
	lm.is_cov_default,
	lm.is_payment_default,
	lm.leverage_ratio,
	lm.loan_metrics_id,
	lm.net_leverage_ratio,
	rd.start_date as rate_start_date,
	rd.end_date,
	rd.fixed_rate,
	rd.floor,
	rd.has_floor,
	rd.is_fixed,
	rd.reference_rate,
	rd.spread
from collateral c
left join collateral_balance cb 
	on cb.collateral_id = c.collateral_id 
	and cb.start_date <= $1
	and (cb.end_date > $1 or cb.end_date is null)
left join loan_tranches lt
	on lt.tranche_id = c.tranche_id
left join loan_agreements la
	on lt.loan_agreement_id = la.loan_agreement_id
left join borrowers b
	on la.borrower_id =b.borrower_id 
left join loan_metrics lm
	on lm.tranche_id =lt.tranche_id
	and lm.start_date <= $1
	and (lm.end_date > $1 or lm.end_date is null)
left join debt_facilities df
	on df.debt_facility_id = c.debt_facility_id
left join rate_data rd 
	on rd.tranche_id =lt.tranche_id
	and rd.start_date <= $1
	and (rd.end_date > $1 or rd.end_date is null)
where c.inclusion_date <= $1
	and (c.removed_date > $1 or c.removed_date is NULL)
	and df.debt_facility_id = $2
`, ["2025-08-31", "81"]);


  });
});
