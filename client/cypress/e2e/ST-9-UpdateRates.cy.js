// ***********************************************************************
// *  ST-9 – Test Rate Updates
// ***********************************************************************

it("fills out rate update form", function () {
  //Navigate to the collateral pledge page

  cy.visit("localhost:3000");
  cy.get('#root a[href="/performance/"]').click();
  cy.get('#root a[href="/performance/updaterates"]').click();

  // Test that autocomplete for borrower and contains value inputted
  cy.get("#autocomplete-borrower-name").click();
  cy.get("#autocomplete-borrower-name").type("Test - The Donkey Kong Company");
  cy.wait(200);
  cy.get("#autocomplete-borrower-name-option-0").click();
  cy.get("#autocomplete-borrower-name").should(
    "have.value",
    "Test - The Donkey Kong Company",
  );
  cy.wait(200);

  // Test that autocomplete for loan agreements works and contains value inputted
  cy.get("#autocomplete-loan-agreeements").click();
  cy.get("#autocomplete-loan-agreeements-option-0").click();
  cy.wait(200);

  cy.get("#autocomplete-loan-agreeements").should(
    "have.value",
    "Test - The Loan Agreement for Donkey Kong Co.",
  );
  cy.wait(200);

  // Test that autocomplete for loan tranche works and contains value inputted
  cy.get("#autocomplete-loan-tranches").click();
  cy.get("#autocomplete-loan-tranches-option-0").click();
  cy.wait(200);

  cy.get("#autocomplete-loan-tranches").should(
    "have.value",
    "Test - Loan Tranche for Donkey Kong Co",
  );
  cy.wait(200);

  // Ensure that Info Box to the right is populated with correct information after loan approval is selected.
  cy.get("#root div.css-1aegatr div:nth-child(2)")
    .contains("10/9/2025")
    .should("be.visible");
  cy.get("#root div.css-u0gk6s").contains("Floating").should("be.visible");
  cy.get("#root div.css-1aegatr div:nth-child(6)")
    .contains("N/A")
    .should("be.visible");
  cy.get("#root div:nth-child(8)").contains("5.000000%").should("be.visible");
  cy.get("#root div:nth-child(10)").contains("5.000000%").should("be.visible");
  cy.get("#root div:nth-child(12)").contains("LIBOR").should("be.visible");

  // Test that inclusion date picker works and does not contain blank value after input
  cy.get('[data-testid="CalendarIcon"]').click();
  cy.wait(300);
  cy.get(".MuiPickersDay-root").contains("15").click();
  cy.get('[data-testid="change-date-picker"]').should("not.have.value", "");

  // Test that autocomplete for rate type works and contains value inputted
  cy.get("#autocomplete-rate-type").click();
  cy.get("#autocomplete-rate-type-option-1").click();
  cy.wait(200);

  cy.get("#autocomplete-rate-type").should("have.value", "Floating Rate");
  cy.wait(200);

  // Test that text box for spread and contains value inputted
  cy.get("#spread-textfield").click();
  cy.get("#spread-textfield").type("4");
  cy.get("#spread-textfield").should("have.value", "4.000000%");

  // Test that text box for floor and contains value inputted
  cy.get("#floor-textfield").click();
  cy.get("#floor-textfield").type("5.2525");
  cy.get("#floor-textfield").should("have.value", "5.252500%");

  // Test that autocomplete for ref rate type works and contains value inputted
  cy.get("#autocomplete-ref-rate-type").click();
  cy.get("#autocomplete-ref-rate-type-option-0").click();
  cy.wait(200);

  cy.get("#autocomplete-ref-rate-type").should("have.value", "LIBOR");
  cy.wait(200);
});
