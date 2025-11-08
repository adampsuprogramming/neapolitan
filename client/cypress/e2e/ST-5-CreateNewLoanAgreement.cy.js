// ************************************************************************
// *  ST-5 – Test adding a New Loan Agreement Into the System             *
// ************************************************************************

it("submits a new loan agreement form", function () {
  //Navigate to the borrower create page
  cy.visit("localhost:3000");
  cy.get('#root [href="/transactions/"]').click();
  cy.get('#root [href="/transactions/loanagreementtransactions"]').click();
  cy.get('#root [href="/transactions/loanagreementtransactions/loanagreementcreate"]').click();

  // Test that autocomplete for borrower name input works and contains value inputted
  cy.get("#borrower-name").type("Test - The Donkey Kong Company");
  cy.get("#borrower-name").click();
  cy.get("#borrower-name-option-0").click();
  cy.get("#borrower-name").should("have.value", "Test - The Donkey Kong Company");

  // Test that loan agreement input title works and contains value inputted
  cy.get("#loan-agreement-title-input").click();
  const randomNumber = Math.floor(Math.random() * 10000000);
  const loanAgreementName = `Test Loan Agreement Name ST-5 #${randomNumber}`;
  cy.get("#loan-agreement-title-input").type(loanAgreementName);
  cy.get("#loan-agreement-title-input").should("have.value", loanAgreementName);

  // Test that agreement date picker works and does not contain blank value after input
  cy.get('[data-testid="CalendarIcon"]').eq(0).click();
  cy.wait(300);
  cy.get(".MuiPickersDay-root").contains("15").click();
  cy.get('[data-testid="agreement-date-picker"]').should("not.have.value", "");

  // Test the the loan agreement saves and send a success message
  cy.get("#root .css-1c2z43s button:nth-child(1)").click();
  cy.wait(500);
  cy.contains("Loan Agreement Created Successfully").should("be.visible");
});
