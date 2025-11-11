// ***********************************************************************
// *  ST-13 – Record Payments Received - Check Info Display              *
// ***********************************************************************

it("selects a faciltiy and validates information display", function () {
  //Navigate to the collateral pledge page

  cy.visit("localhost:3000/transactions/paymentsreceived/");

  // Test that autocomplete for portfolio and contains value inputted
  cy.get("#autocomplete-portfolio-name").click();
  cy.get("#autocomplete-portfolio-name").type("Fund A");
  cy.wait(200);
  cy.get("#autocomplete-portfolio-name-option-0").click();
  cy.get("#autocomplete-portfolio-name").should("have.value", "Fund A");
  cy.wait(200);

  // Test that autocomplete for facility name works and contains value inputted
  cy.get("#autocomplete-facility-name").click();
  cy.get("#autocomplete-facility-name").type("Coral Reef Bank Fund A");
  cy.get("#autocomplete-facility-name-option-0").click();
  cy.wait(200);

  cy.get("#autocomplete-facility-name").should("have.value", "Coral Reef Bank Fund A Facility");
  cy.wait(200);

  // Choose Date to Test Values
  cy.get('input[data-testid="payment-date-picker"]').click({ force: true });
  cy.focused().clear().type("09/30/2025{esc}");
  cy.wait(500);

  cy.get("#root tr:nth-child(1) td:nth-child(1)", { timeout: 10000 }).should("be.visible");
  // Test values displayed in first row
  cy.get("#root tr:nth-child(1) td:nth-child(1)").contains("2").should("be.visible");
  cy.get("#root tr:nth-child(1) td:nth-child(2)")
    .contains("Blackspire Enterprises")
    .should("be.visible");
  cy.get("#root tr:nth-child(1) td:nth-child(3) span")
    .contains("$20,000,000.00")
    .should("be.visible");
  cy.get("#root tr:nth-child(1) td:nth-child(4) span")
    .contains("$20,000,000.00")
    .should("be.visible");

  // Test values displayed in second to last row
  cy.get("#root tr:nth-child(18) td:nth-child(1)").contains("13").should("be.visible");
  cy.get("#root tr:nth-child(18) td:nth-child(2)").contains("Zephyros Global").should("be.visible");
  cy.get("#root tr:nth-child(18) td:nth-child(3) span")
    .contains("17,000,000.00")
    .should("be.visible");
  cy.get("#root tr:nth-child(18) td:nth-child(4) span")
    .contains("$17,000,000.00")
    .should("be.visible");

  // Test values displayed in last row
  cy.get("#root tr:nth-child(19) td:nth-child(1)").contains("10").should("be.visible");
  cy.get("#root tr:nth-child(19) td:nth-child(2)").contains("Zirconis Labs").should("be.visible");
  cy.get("#root tr:nth-child(19) td:nth-child(3) span")
    .contains("$24,000,000.00")
    .should("be.visible");
  cy.get("#root tr:nth-child(19) td:nth-child(4) span")
    .contains("$24,000,000.00")
    .should("be.visible");
});
