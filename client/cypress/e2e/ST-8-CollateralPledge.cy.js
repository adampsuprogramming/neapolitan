// ***********************************************************************
// *  ST-8 – Test pledging collateral to a facility                      *
// ***********************************************************************

it("submits a new collateral pledge form", function () {
  //Navigate to the collateral pledge page

  cy.visit("localhost:3000");
  cy.get('#root a[href="/transactions/"]').click();
  cy.get('#root a[href="/transactions/collateralpledgetransactions"]').click();
  cy.get(
    '#root a[href="/transactions/collateralpledgetransactions/collateralpledgeadd"]',
  ).click();

  // Test that autocomplete for loan approval name works and contains value inputted
  cy.get("#autocomplete-loan-approval-name").click();
  cy.get("#autocomplete-loan-approval-name").type("2025-10-09 - Starfish");
  cy.wait(200);
  cy.get("#autocomplete-loan-approval-name-option-0").click();
  cy.get("#autocomplete-loan-approval-name").should(
    "have.value",
    "2025-10-09 - Starfish Bank - Test - The Donkey Kong Company",
  );
  cy.wait(200);

  // Ensure that Info Box to the right is populated with correct information after loan approval is selected.
  cy.get("#root div.css-1k0dehn div:nth-child(2)")
    .contains("Test - The Donkey Kong Company")
    .should("be.visible");
  cy.get("#root div.css-1k0dehn div:nth-child(4)")
    .contains("Test - The Loan Agreement for Donkey Kong Co.")
    .should("be.visible");
  cy.get("#root div:nth-child(6)")
    .contains("Test - Loan Tranche for Donkey Kong Co")
    .should("be.visible");
  cy.get("#root div:nth-child(8)")
    .contains("25,000,000.00")
    .should("be.visible");
  cy.get("#root div:nth-child(10)").contains("10/9/2026").should("be.visible");
  cy.get("#root div:nth-child(12)")
    .contains("Starfish Bank")
    .should("be.visible");
  cy.get("#root div:nth-child(14)")
    .contains("Starfish Bank Fund A Facility")
    .should("be.visible");

  // Test that inclusion date picker works and does not contain blank value after input
  cy.get('[data-testid="CalendarIcon"]').click();
  cy.wait(300);
  cy.get(".MuiPickersDay-root").contains("15").click();
  cy.get('[data-testid="inclusion-date-picker"]').should("not.have.value", "");

  // Test that text box for outstanding pledged input works and contains value inputted
  cy.get("#outstanding-amount-field").click();
  cy.get("#outstanding-amount-field").type("10000000");
  cy.get("#outstanding-amount-field").should("have.value", "$10,000,000.00");

  // Test that text box for commitment amount pledged input works and contains value inputted
  cy.get("#commitment-amount-field").click();
  cy.get("#commitment-amount-field").type("10000000");
  cy.get("#commitment-amount-field").should("have.value", "$10,000,000.00");

  // Test the the collateral pledge saves and send a success message
  cy.get("#root div.css-1y67r5i button:nth-child(1)").click();
  cy.wait(500);
  cy.contains("Collateral Pledge Created Successfully").should("be.visible");
});