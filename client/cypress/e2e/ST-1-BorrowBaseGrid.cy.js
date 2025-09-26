// ************************************************************************
// *  ST-1 – Test display of borrowing base given selection of a specific *
// *  portfolio, facility, and date                                       *
// ************************************************************************

describe("template spec", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/");
    cy.get('#root [href="/borrowingbase/"]').click();
    cy.get('#root [href="/borrowingbase/borrowbaselineitemview"]').click();
    cy.get("#portfolio_select").select("Fund A");
    cy.get("#facility_select").select("Coral Reef Bank Fund A Facility");
    cy.get("#asOfDate").click();
    cy.get("#asOfDate").type("2025-06-30");
  });

  it("displays the correct EBITDA amount in the first row", () => {
    cy.get(".ag-center-cols-container .ag-row")
      .eq(0)
      .find('[col-id="approved_ebitda"]')
      .invoke("text")
      .should("eq", "$95,000,000.00");
  });
  it("displays the correct inclusion date in the last row", () => {
    cy.get(".ag-center-cols-container .ag-row")
      .eq(18)
      .find('[col-id="inclusion_date"]')
      .invoke("text")
      .should("eq", "3/15/2025");
  });
  it("retrieves the correct number of rows", () => {
    cy.get(".ag-center-cols-container .ag-row").should("have.length", 19);
  });
});
