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

  cy.get("#autocomplete-facility-name").should(
    "have.value",
    "Coral Reef Bank Fund A Facility",
  );
  cy.wait(200);

  // Choose Date to Test Values
  cy.get('input[data-testid="payment-date-picker"]').click({ force: true });
  cy.focused().clear().type("09/30/2025");
  cy.wait(200);

  // Test values displayed in first row
  cy.get("#root tr:nth-child(1) td:nth-child(1)")
    .contains("1")
    .should("be.visible");
  cy.get("#root tr:nth-child(1) td:nth-child(2)")
    .contains("YseraCore Technologies")
    .should("be.visible");
  cy.get("#root tr:nth-child(1) td:nth-child(3) span")
    .contains("$9,500,000.00")
    .should("be.visible");
  cy.get("#root tr:nth-child(1) td:nth-child(4) span")
    .contains("$9,500,000.00")
    .should("be.visible");

  // Test values displayed in second to last row
  cy.get("#root tr:nth-child(18) td:nth-child(1)")
    .contains("15")
    .should("be.visible");
  cy.get("#root tr:nth-child(18) td:nth-child(2)")
    .contains("Driftspire Holdings")
    .should("be.visible");
  cy.get("#root tr:nth-child(18) td:nth-child(3) span")
    .contains("$28,000,000.00")
    .should("be.visible");
  cy.get("#root tr:nth-child(18) td:nth-child(4) span")
    .contains("$28,000,000.00")
    .should("be.visible");

  // Test values displayed in last row
  cy.get("#root tr:nth-child(19) td:nth-child(1)")
    .contains("20")
    .should("be.visible");
  cy.get("#root tr:nth-child(19) td:nth-child(2)")
    .contains("Westspire Enterprises")
    .should("be.visible");
  cy.get("#root tr:nth-child(19) td:nth-child(3) span")
    .contains("$25,000,000.00")
    .should("be.visible");
  cy.get("#root tr:nth-child(19) td:nth-child(4) span")
    .contains("$19,200,000.00")
    .should("be.visible");
});
