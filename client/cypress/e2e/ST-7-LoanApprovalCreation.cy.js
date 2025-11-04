// ************************************************************************
// *  ST-7 – Test adding a New Loan Approval Into the System             *
// ***********************************************************************

it("submits a new loan approval creation form", function () {
  //Navigate to the loan approval creation page
  cy.visit("localhost:3000");
  cy.get('#root a[href="/transactions/"]').click();
  cy.get('#root a[href="/transactions/loanapprovaltransactions"]').click();
  cy.get('#root a[href="/transactions/loanapprovaltransactions/loanapprovalcreate"]').click();

  // Test that autocomplete for borrower name input works and contains value inputted
  cy.get("#autocomplete-borrower-name").click();
  cy.get("#autocomplete-borrower-name").type("Test - The Donkey Kong Company");
  cy.get("#autocomplete-borrower-name-option-0").click();
  cy.get("#autocomplete-borrower-name").should("have.value", "Test - The Donkey Kong Company");

  // Test that autocomplete for loan agreement input works and contains value inputted
  cy.get("#autocomplete-loan-agreeements").click();
  cy.get("#autocomplete-loan-agreeements").type("Test - The Loan Agreement for Donkey Kong Co.");
  cy.get("#autocomplete-loan-agreeements-option-0").click();
  cy.get("#autocomplete-loan-agreeements").should(
    "have.value",
    "Test - The Loan Agreement for Donkey Kong Co.",
  );

  // Test that autocomplete for loan tranche input works and contains value inputted
  cy.get("#autocomplete-loan-tranches").click();
  cy.get("#autocomplete-loan-tranches").type("Test - Loan Tranche for Donkey Kong Co");
  cy.get("#autocomplete-loan-tranches-option-0").click();
  cy.get("#autocomplete-loan-tranches").should(
    "have.value",
    "Test - Loan Tranche for Donkey Kong Co",
  );

  // Test that autocomplete for lender name works and contains value inputted
  cy.get("#autocomplete-lender-name").click();
  cy.get("#autocomplete-lender-name").type("manat");
  cy.get("#autocomplete-lender-name-option-0").click();
  cy.get("#autocomplete-lender-name").should("have.value", "Manatee Bank");

  // Test that autocomplete for facility name works and contains value inputted
  cy.get("#autocomplete-facilities").click();
  cy.get("#autocomplete-facilities").type("Fund B");
  cy.get("#autocomplete-facilities-option-0").click();
  cy.get("#autocomplete-facilities").should("have.value", "Manatee Bank Fund B Facility");

  // Test that approval date picker works and does not contain blank value after input
  cy.get('[data-testid="CalendarIcon"]').eq(0).click();
  cy.wait(300);
  cy.get(".MuiPickersDay-root").contains("15").click();
  cy.get('[data-testid="tranche-approval-date-picker"]').should("not.have.value", "");

  // Test that approval expiration date picker works and does not contain blank value after input
  cy.get('[data-testid="CalendarIcon"]').eq(1).click();
  cy.wait(300);
  cy.get(".MuiPickersDay-root").contains("20").click();
  cy.get('[data-testid="tranche-approval-expiration-picker"]').should("not.have.value", "");

  // Test that text box for approved amount input works and contains value inputted
  cy.get("#approved-amount-textfield").click();
  cy.get("#approved-amount-textfield").type("20000000");
  cy.get("#approved-amount-textfield").should("have.value", "$20,000,000.00");

  // Test that text box for approved ebitda input works and contains value inputted
  cy.get("#approved-ebitda-textfield").click();
  cy.get("#approved-ebitda-textfield").type("10000000");
  cy.get("#approved-ebitda-textfield").should("have.value", "$10,000,000.00");

  // Test that text box for approved leverage input works and contains value inputted
  cy.get("#leverage-ratio-textfield").click();
  cy.get("#leverage-ratio-textfield").type("5");
  cy.get("#leverage-ratio-textfield").should("have.value", "5.000000");

  // Test that text box for interest coverage ratio input works and contains value inputted
  cy.get("#interest-coverage-ratio-textfield").click();
  cy.get("#interest-coverage-ratio-textfield").type("2.15");
  cy.get("#interest-coverage-ratio-textfield").should("have.value", "2.150000");

  // Test that text box for approved net leverage input works and contains value inputted
  cy.get("#net-leverage-ratio-textfield").click();
  cy.get("#net-leverage-ratio-textfield").type("4.95");
  cy.get("#net-leverage-ratio-textfield").should("have.value", "4.950000");

  // Test that text box for approved advance rate input works and contains value inputted
  cy.get("#approved-advance-rate-textfield").click();
  cy.get("#approved-advance-rate-textfield").type("60");
  cy.get("#approved-advance-rate-textfield").should("have.value", "60.000000%");

  // Test that text box for approved value input works and contains value inputted
  cy.get("#approved-value-textfield").click();
  cy.get("#approved-value-textfield").type("99.1");
  cy.get("#approved-value-textfield").should("have.value", "99.100000%");

  // Test the the loan approval saves and send a success message
  cy.get("#root div:nth-child(5) button:nth-child(1)").click();
  cy.wait(500);
  cy.contains("Loan Approval Created Successfully").should("be.visible");
});
