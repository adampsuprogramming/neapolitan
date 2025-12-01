// ***********************************************************************
// *  ST-20 – Test Balance Report                                        *
// ***********************************************************************

it("generates balance report", function () {
  cy.visit("localhost:3000");
  cy.get('#root a[href="/reporting/"]').click();
  cy.get('#root a[href="/reporting/assetbalancereport"]').click();

  // Test that autocomplete for portfolio and contains value inputted
  cy.get("#autocomplete-portfolio-name").click();
  cy.get("#autocomplete-portfolio-name").type("Fund D");
  cy.wait(200);
  cy.get("#autocomplete-portfolio-name-option-0").click();
  cy.get("#autocomplete-portfolio-name").should("have.value", "Fund D");
  cy.wait(200);

  // Choose Date to Test Values
  cy.get('input[data-testid="as-of-date-picker"]').click({ force: true });
  cy.focused().clear().type("10/31/2025{esc}");
  cy.wait(500);

  cy.get("#root div:nth-child(4) button:nth-child(1)").click();

  cy.get("#root th:nth-child(1)").contains("Tranche Name").should("be.visible");
  cy.get("#root th:nth-child(2)").contains("Kratos Facility").should("be.visible");
  cy.get("#root th:nth-child(3)").contains("Witcher Facility").should("be.visible");
  cy.get("#root th:nth-child(4)").contains("Total").should("be.visible");

  cy.get("#root tr:nth-child(1) td:nth-child(1)").contains("The Gabe Company").should("be.visible");
  cy.get("#root tr:nth-child(1) td:nth-child(2) span").contains("9,000,000").should("be.visible");
  cy.get("#root tr:nth-child(1) td:nth-child(3) span").contains("6,750,000").should("be.visible");
  cy.get("#root tr:nth-child(1) td:nth-child(4) span").contains("15,750,000").should("be.visible");

  cy.get("#root tr:nth-child(2) td:nth-child(1)")
    .contains("The Tycho Company")
    .should("be.visible");
  cy.get("#root tr:nth-child(2) td:nth-child(2) span").contains("18,500,000").should("be.visible");
  cy.get("#root tr:nth-child(2) td:nth-child(3) span").contains("0").should("be.visible");
  cy.get("#root tr:nth-child(2) td:nth-child(4) span").contains("18,500,000").should("be.visible");

  cy.get("#root tr:nth-child(3) td:nth-child(1)").contains("Total").should("be.visible");
  cy.get("#root tr:nth-child(3) td:nth-child(2) span").contains("27,500,000").should("be.visible");
  cy.get("#root tr:nth-child(3) td:nth-child(3) span").contains("6,750,000").should("be.visible");
  cy.get("#root tr:nth-child(3) td:nth-child(4) span").contains("34,250,000").should("be.visible");
});
