// *********************************************************************************************************
// * UT-30 – Determine that Node Receives Loan Tranche Creation Data (Floating, with Floor) and Sends out  *
// * Correct SQL Inserts                                                                                   *
// * UT-31 – Determine that Node Receives Loan Tranche Creation Data (Floating, without Floor) and Sends   *
// * out Correct SQL Inserts                                                                               *
// * UT-32 – Determine that Node Receives Loan Tranche Creation Data (Fixed) and Send sout Correct SQL     *
// * Inserts                                                                                               *
// *********************************************************************************************************

// This mock must come before the import of object
jest.mock("../db");

const request = require("supertest");
const app = require("../app");

const mockedQuery = jest.fn();
require("../db").query = mockedQuery;

const pool = require("../db");
pool.end = jest.fn();
beforeEach(() => {
  mockedQuery.mockClear();
});

afterAll(async () => {
  await pool.end();
});

// UT-30

describe("POST /api/createloantranche", () => {
  it("accepts data from a mocked api put for a floating rate loan with a floor and then runs an insert query on the database", async () => {
    mockedQuery
      .mockResolvedValueOnce({ rows: [{ tranche_id: 111 }] }) //first insert sends back debt facility primary key
      .mockResolvedValueOnce({}) // second returns nothing (like the query actual query)
      .mockResolvedValueOnce({}); // third returns nothing (like the query actual query)

    const response = await request(app).post("/api/createloantranche").send({
      loanTrancheName: "Fortnite Loan Tranche",
      loanAgreementId: "101",
      trancheType: "Term",
      lienType: "First Lien",
      trancheStart: "2025-10-31",
      trancheMaturity: "2030-10-31",
      ebitda: 15000000,
      leverageRatio: 5.4,
      netLeverageRatio: 5.32,
      interestCoverage: 1.5,
      rateType: "Floating Rate",
      fixedRate: null,
      spread: 2.25,
      floor: 1.5,
      refRate: "LIBOR",
    });

    expect(response.status).toBe(201);

    expect(mockedQuery).toHaveBeenNthCalledWith(
      1,

      `
insert into loan_tranches (loan_agreement_id, tranche_type, lien_type, start_date, maturity_date, tranche_name)
values ($1,$2,$3,$4,$5,$6)
returning tranche_id
`,
      [
        "101",
        "Term",
        "First Lien",
        "2025-10-31",
        "2030-10-31",
        "Fortnite Loan Tranche",
      ],
    );

    expect(mockedQuery).toHaveBeenNthCalledWith(
      2,

      `
insert into loan_metrics (tranche_id, start_date, leverage_ratio, net_leverage_ratio, int_coverage_ratio, ebitda)
values ($1,$2,$3,$4,$5,$6)
`,
      [111, "2025-10-31", 5.4, 5.32, 1.5, 15000000],
    );

    expect(mockedQuery).toHaveBeenNthCalledWith(
      3,

      `
insert into rate_data (tranche_id, is_fixed, start_date, fixed_rate, spread, floor, has_floor, reference_rate)
values ($1,$2,$3,$4,$5,$6,$7,$8)
`,
      [111, false, "2025-10-31", null, 2.25, 1.5, true, "LIBOR"],
    );
  });
}),
  // UT-31

  describe("POST /api/createloantranche", () => {
    it("accepts data from a mocked api put for a floating rate loan without a floor and then runs an insert query on the database", async () => {
      mockedQuery
        .mockResolvedValueOnce({ rows: [{ tranche_id: 111 }] }) //first insert sends back debt facility primary key
        .mockResolvedValueOnce({}) // second returns nothing (like the query actual query)
        .mockResolvedValueOnce({}); // third returns nothing (like the query actual query)

      const response = await request(app).post("/api/createloantranche").send({
        loanTrancheName: "Fortnite Loan Tranche",
        loanAgreementId: "101",
        trancheType: "Term",
        lienType: "First Lien",
        trancheStart: "2025-10-31",
        trancheMaturity: "2030-10-31",
        ebitda: 15000000,
        leverageRatio: 5.4,
        netLeverageRatio: 5.32,
        interestCoverage: 1.5,
        rateType: "Floating Rate",
        fixedRate: null,
        spread: 2.25,
        floor: null,
        refRate: "LIBOR",
      });

      expect(response.status).toBe(201);

      expect(mockedQuery).toHaveBeenNthCalledWith(
        1,

        `
insert into loan_tranches (loan_agreement_id, tranche_type, lien_type, start_date, maturity_date, tranche_name)
values ($1,$2,$3,$4,$5,$6)
returning tranche_id
`,
        [
          "101",
          "Term",
          "First Lien",
          "2025-10-31",
          "2030-10-31",
          "Fortnite Loan Tranche",
        ],
      );

      expect(mockedQuery).toHaveBeenNthCalledWith(
        2,

        `
insert into loan_metrics (tranche_id, start_date, leverage_ratio, net_leverage_ratio, int_coverage_ratio, ebitda)
values ($1,$2,$3,$4,$5,$6)
`,
        [111, "2025-10-31", 5.4, 5.32, 1.5, 15000000],
      );

      expect(mockedQuery).toHaveBeenNthCalledWith(
        3,

        `
insert into rate_data (tranche_id, is_fixed, start_date, fixed_rate, spread, floor, has_floor, reference_rate)
values ($1,$2,$3,$4,$5,$6,$7,$8)
`,
        [111, false, "2025-10-31", null, 2.25, null, false, "LIBOR"],
      );
    });
  }),
  // UT-32

  describe("POST /api/createloantranche", () => {
    it("accepts data from a mocked api put for a fixed rate loan and then runs an insert query on the database", async () => {
      mockedQuery
        .mockResolvedValueOnce({ rows: [{ tranche_id: 111 }] }) //first insert sends back debt facility primary key
        .mockResolvedValueOnce({}) // second returns nothing (like the query actual query)
        .mockResolvedValueOnce({}); // third returns nothing (like the query actual query)

      const response = await request(app).post("/api/createloantranche").send({
        loanTrancheName: "Fortnite Loan Tranche",
        loanAgreementId: "101",
        trancheType: "Term",
        lienType: "First Lien",
        trancheStart: "2025-10-31",
        trancheMaturity: "2030-10-31",
        ebitda: 15000000,
        leverageRatio: 5.4,
        netLeverageRatio: 5.32,
        interestCoverage: 1.5,
        rateType: "Fixed Rate",
        fixedRate: 10.25,
        spread: null,
        floor: null,
        refRate: null,
      });

      expect(response.status).toBe(201);

      expect(mockedQuery).toHaveBeenNthCalledWith(
        1,

        `
insert into loan_tranches (loan_agreement_id, tranche_type, lien_type, start_date, maturity_date, tranche_name)
values ($1,$2,$3,$4,$5,$6)
returning tranche_id
`,
        [
          "101",
          "Term",
          "First Lien",
          "2025-10-31",
          "2030-10-31",
          "Fortnite Loan Tranche",
        ],
      );

      expect(mockedQuery).toHaveBeenNthCalledWith(
        2,

        `
insert into loan_metrics (tranche_id, start_date, leverage_ratio, net_leverage_ratio, int_coverage_ratio, ebitda)
values ($1,$2,$3,$4,$5,$6)
`,
        [111, "2025-10-31", 5.4, 5.32, 1.5, 15000000],
      );

      expect(mockedQuery).toHaveBeenNthCalledWith(
        3,

        `
insert into rate_data (tranche_id, is_fixed, start_date, fixed_rate, spread, floor, has_floor, reference_rate)
values ($1,$2,$3,$4,$5,$6,$7,$8)
`,
        [111, true, "2025-10-31", 10.25, null, null, false, null],
      );
    });
  });
