// ***********************************************************************
// *  ST-16 – Test Dashboard Display                                     *
// ***********************************************************************

it("fills out dashboard form, submits, and verifies categories display", function () {
  //Navigate to the collateral pledge page

  cy.visit("localhost:3000");
  cy.get('#root a[href="/dashboard/"]').click();

  // Test that autocomplete for portfolio and contains value inputted
  cy.get("#autocomplete-portfolio-name").click();
  cy.get("#autocomplete-portfolio-name").type("C");
  cy.wait(200);
  cy.get("#autocomplete-portfolio-name-option-0").click();
  cy.get("#autocomplete-portfolio-name").should("have.value", "Fund C");
  cy.wait(200);

  // Test that autocomplete for facility contains value inputted
  cy.get("#autocomplete-facility-name").click();
  cy.get("#autocomplete-facility-name").type("Sky");
  cy.get("#autocomplete-facility-name-option-0").click();
  cy.wait(200);
  cy.get("#autocomplete-facility-name").should("have.value", "Skyrim Debt Facility");
  cy.wait(200);

  // Choose Date to Test Values
  cy.get('input[data-testid="as-of-date-picker"]').click({ force: true });
  cy.focused().clear().type("09/30/2025{esc}");
  cy.wait(500);

  cy.get("#root div:nth-child(4) button:nth-child(1)").click();

  cy.wait(500);
  cy.contains("Value by Lien Type").should("be.visible");
  cy.contains("First Lien").should("be.visible");
  cy.contains("Second Lien").should("be.visible");

  cy.contains("Value by NAICS Subsector").should("be.visible");
  cy.contains("Construction of Buildings").should("be.visible");
  cy.contains("Food Services and Drinking Places").should("be.visible");
  cy.contains("Computer and Electronic Product Manufacturing").should("be.visible");
  cy.contains(
    "Securities, Commodity Contracts, and Other Financial Investments and Related Activities",
  ).should("be.visible");

  cy.contains("Value by Corporate HQ").should("be.visible");
  cy.contains("United States").should("be.visible");
  cy.contains("South America").should("be.visible");
  cy.contains("Western Europe").should("be.visible");
  cy.contains("Sub-Saharan Africa").should("be.visible");

  cy.contains("Value by Primary Revenue Region").should("be.visible");
  cy.contains("Canada").should("be.visible");
  cy.contains("South America").should("be.visible");
  cy.contains("Western Europe").should("be.visible");
  cy.contains("Sub-Saharan Africa").should("be.visible");
  cy.contains("United States").should("be.visible");

  cy.contains("Value by Public/Private").should("be.visible");
  cy.contains("Public").should("be.visible");
  cy.contains("Private").should("be.visible");
});
