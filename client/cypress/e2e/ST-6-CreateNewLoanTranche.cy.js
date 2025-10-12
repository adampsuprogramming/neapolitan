// ************************************************************************
// *  ST-6 – Test adding a New Loan Tranche Into the System             *
// ***********************************************************************

it("submits a new loan tranche creation form", function () {
  //Navigate to the loan tranche creation page
  cy.visit("localhost:3000");
  cy.get('#root [href="/transactions/"]').click();
  cy.get('#root [href="/transactions/loantranchetransactions"]').click();
  cy.get(
    '#root [href="/transactions/loantranchetransactions/loantranchecreate"]',
  ).click();

  // Test that text box for loan tranche name input works and contains value inputted
  cy.get("#tranche-name-input").click();
  const randomNumber = Math.floor(Math.random() * 10000000);
  const loanTrancheName = `Test Loan Tranche Name ST-6 #${randomNumber}`;
  cy.get("#tranche-name-input").type(loanTrancheName);
  cy.get("#tranche-name-input").should("have.value", loanTrancheName);

  // Test that autocomplete for borrower name input works and contains value inputted
  cy.get("#autocomplete-borrower-name").click();
  cy.get("#autocomplete-borrower-name").type("Test - The Donkey Kong Company");
  cy.get("#autocomplete-borrower-name-option-0").click();
  cy.get("#autocomplete-borrower-name").should(
    "have.value",
    "Test - The Donkey Kong Company",
  );

  // Test that autocomplete for loan agreement input works and contains value inputted
  cy.get("#autocomplete-loan-agreeements").click();
  cy.get("#autocomplete-loan-agreeements").type(
    "Test - The Loan Agreement for Donkey Kong Co.",
  );
  cy.get("#autocomplete-loan-agreeements-option-0").click();
  cy.get("#autocomplete-loan-agreeements").should(
    "have.value",
    "Test - The Loan Agreement for Donkey Kong Co.",
  );

  // Test that autocomplete for tranche type input works and contains value inputted
  cy.get("#autocomplete-tranche-type").click();
  cy.get("#autocomplete-tranche-type-option-0").click();
  cy.get("#autocomplete-tranche-type").should("have.value", "Term");

  // Test that autocomplete for lien type input works and contains value inputted
  cy.get("#autocomplete-lien-type").click();
  cy.get("#autocomplete-lien-type-option-0").click();
  cy.get("#autocomplete-lien-type").should("have.value", "First Lien");

  // Test that start date picker works and does not contain blank value after input
  cy.get('[data-testid="CalendarIcon"]').eq(0).click();
  cy.wait(300);
  cy.get(".MuiPickersDay-root").contains("15").click();
  cy.get('[data-testid="tranche-start-date-picker"]').should(
    "not.have.value",
    "",
  );

  // Test that maturity date picker works and does not contain blank value after input
  cy.get('[data-testid="CalendarIcon"]').eq(1).click();
  cy.wait(300);
  cy.get(".MuiPickersDay-root").contains("20").click();
  cy.get('[data-testid="tranche-maturity-date-picker"]').should(
    "not.have.value",
    "",
  );

  // Test that text box for ebitda input works and contains value inputted
  cy.get("#ebitda-ltm-textfield").click();
  cy.get("#ebitda-ltm-textfield").type("10000000");
  cy.get("#ebitda-ltm-textfield").should("have.value", "$10,000,000.00");

  // Test that text box for leverage ratio input works and contains value inputted
  cy.get("#leverage-ratio-textfield").click();
  cy.get("#leverage-ratio-textfield").type("4.5");
  cy.get("#leverage-ratio-textfield").should("have.value", "4.500000");

  // Test that text box for net leverage ratio input works and contains value inputted
  cy.get("#net-leverage-ratio-textfield").click();
  cy.get("#net-leverage-ratio-textfield").type("4.4");
  cy.get("#net-leverage-ratio-textfield").should("have.value", "4.400000");

  // Test that text box for interest coverage ratio input works and contains value inputted
  cy.get("#interest-coverage-ratio-textfield").click();
  cy.get("#interest-coverage-ratio-textfield").type("2.3645");
  cy.get("#interest-coverage-ratio-textfield").should("have.value", "2.364500");

  // Test that autocomplete for rate type input works and contains value inputted
  cy.get("#autocomplete-rate-type").click();
  cy.get("#autocomplete-rate-type-option-1").click();
  cy.get("#autocomplete-rate-type").should("have.value", "Floating Rate");

  // Test that text box for spread input works and contains value inputted
  cy.get("#spread-textfield").click();
  cy.get("#spread-textfield").type("4.514");
  cy.get("#spread-textfield").should("have.value", "4.514000%");

  // Test that text box for floor input works and contains value inputted
  cy.get("#floor-textfield").click();
  cy.get("#floor-textfield").type("1.5");
  cy.get("#floor-textfield").should("have.value", "1.500000%");

  // Test that autocomplete for reference rate input works and contains value inputted
  cy.get("#autocomplete-ref-rate-type").click();
  cy.get("#autocomplete-ref-rate-type-option-0").click();
  cy.get("#autocomplete-ref-rate-type").should("have.value", "LIBOR");

  // Test the the loan tranche saves and send a success message
  cy.get("#root div:nth-child(7) button:nth-child(1)").click();
  cy.wait(500);
  cy.contains("Loan Tranche Created Successfully").should("be.visible");
});
