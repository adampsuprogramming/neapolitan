// ***********************************************************************
// *  ST-15 – Test Bank Metric Updates - Info Box
// ***********************************************************************

it("fills out bank metric update form", function () {
  //Navigate to the collateral pledge page

  cy.visit("localhost:3000");
  cy.get('#root a[href="/performance/"]').click();
  cy.get('#root a[href="/performance/updatebankmetrics"]').click();

  // Test that autocomplete for portfolio and contains value inputted
  cy.get("#autocomplete-portfolio-name").click();
  cy.get("#autocomplete-portfolio-name").type("C");
  cy.wait(200);
  cy.get("#autocomplete-portfolio-name-option-0").click();
  cy.get("#autocomplete-portfolio-name").should("have.value", "Fund C");
  cy.wait(200);

  // Test that autocomplete for facility contains value inputted
  cy.get("#autocomplete-facility-name").click();
  cy.get("#autocomplete-facility-name").type("Skyrim");
  cy.get("#autocomplete-facility-name-option-0").click();
  cy.wait(200);
  cy.get("#autocomplete-facility-name").should("have.value", "Skyrim Debt Facility");
  cy.wait(200);

  // Test that autocomplete for borrower and contains value inputted
  cy.get("#autocomplete-borrower-name").click();
  cy.get("#autocomplete-borrower-name").type("Butter");
  cy.wait(200);
  cy.get("#autocomplete-borrower-name-option-0").click();
  cy.get("#autocomplete-borrower-name").should("have.value", "Buttercup & Bramble Ltd.");
  cy.wait(200);

  // Test that autocomplete for loan agreements works and contains value inputted
  cy.get("#autocomplete-loan-agreeements").click();
  cy.get("#autocomplete-loan-agreeements-option-0").click();
  cy.wait(200);

  cy.get("#autocomplete-loan-agreeements").should(
    "have.value",
    "Senior Secured Term Loan Agreement - Buttercup & Bramble Ltd.",
  );
  cy.wait(200);

  // Test that autocomplete for loan tranche works and contains value inputted
  cy.get("#autocomplete-loan-tranches").click();
  cy.get("#autocomplete-loan-tranches-option-0").click();
  cy.wait(200);

  cy.get("#autocomplete-loan-tranches").should("have.value", "Senior Secured Term Loan");
  cy.wait(200);

  // Ensure that Info Box to the right is populated with correct information after loan tranche is selected.
  cy.get("#root div.css-1flyc9m").contains("6/10/2025").should("be.visible");
  cy.get("#root div.css-12bs833").contains("57.500000%").should("be.visible");
  cy.get("#root div.css-12moils").contains("90.000000%").should("be.visible");
});
