// ***********************************************************************
// *  ST-10 – Test Metric Updates - Info Box
// ***********************************************************************

it("fills out metric update form", function () {
  //Navigate to the collateral pledge page

  cy.visit("localhost:3000");
  cy.get('#root a[href="/performance/"]').click();
  cy.get('#root a[href="/performance/updatemetrics"]').click();

  // Test that autocomplete for borrower and contains value inputted
  cy.get("#autocomplete-borrower-name").click();
  cy.get("#autocomplete-borrower-name").type("Test - The Donkey Kong Company");
  cy.wait(200);
  cy.get("#autocomplete-borrower-name-option-0").click();
  cy.get("#autocomplete-borrower-name").should("have.value", "Test - The Donkey Kong Company");
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

  // Ensure that Info Box to the right is populated with correct information after loan tranche is selected.
  cy.get("#root div.css-1flyc9m").contains("10/25/2025").should("be.visible");
  cy.get("#root div.css-1pq0g67").contains("4.400000").should("be.visible");
  cy.get("#root div.css-ziijsz").contains("4.00000").should("be.visible");
  cy.get("#root div.css-11eceka").contains("3.000000").should("be.visible");
  cy.get("#root div:nth-child(10)").contains("98.000000%").should("be.visible");  
  cy.get("#root div:nth-child(12)").contains("$15,000,000.00").should("be.visible");
  cy.get("#root div:nth-child(14)").contains("No").should("be.visible");
  cy.get("#root div:nth-child(16)").contains("No").should("be.visible");
});
