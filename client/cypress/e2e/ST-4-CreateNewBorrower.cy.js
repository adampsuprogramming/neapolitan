// ************************************************************************
// *  ST-4 – Test adding a New Borrower Into the System                   *
// ************************************************************************

it("submits a new borrower form", function () {
  //Navigate to the borrower create page
  cy.visit("localhost:3000");
  cy.get('#root [href="/transactions/"]').click();
  cy.get('#root [href="/transactions/borrowertransactions"]').click();
  cy.get('#root [href="/transactions/borrowertransactions/borrowercreate"]').click();

  // Test that legal name input works and contains value inputted
  cy.get("#legal-name-input").click();
  const randomNumber = Math.floor(Math.random() * 10000000);
  const legalName = `Test Legal Name ST-4 #${randomNumber}`;
  cy.get("#legal-name-input").type(legalName);
  cy.get("#legal-name-input").should("have.value", legalName);

  // Test that short name input works and contains value inputted
  cy.get("#short-name-input").click();
  const shortName = `Test Short Name ST-4 #${randomNumber}`;
  cy.get("#short-name-input").type(shortName);
  cy.get("#short-name-input").should("have.value", shortName);

  // Test that autocomplete for corporate hq input works and contains value inputted
  cy.get("#autocomplete-corporate-hq").clear();
  cy.get("#autocomplete-corporate-hq").type("Western Eur");
  cy.get("#autocomplete-corporate-hq-option-0").click();
  cy.get("#autocomplete-corporate-hq").should("have.value", "Western Europe");

  // Test that autocomplete for revenue region input works and contains value inputted
  cy.get(
    'div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div > button > [data-testid="ArrowDropDownIcon"] > path',
  ).click();
  cy.get("#autocomplete-rev-region-option-3").click();
  cy.get("#autocomplete-rev-region").should("have.value", "South America");

  // Test that autocomplete for naics subsector input works and contains value inputted
  cy.get("#autocomplete-naics-subsector").click();
  cy.get("#autocomplete-naics-subsector").type("Electrical");
  cy.get("#autocomplete-naics-subsector-option-0").click();
  cy.get("#autocomplete-naics-subsector").should(
    "have.value",
    "335 - Electrical Equipment, Appliance, and Component Manufacturing",
  );

  // Test that the toggle switch works as expected
  cy.get("#public-borrower-switch").check();
  cy.get("#public-borrower-switch").should("be.checked");

  // Test that the ticker symbol toggle switch works as expected
  cy.get("#ticker-symbol").click();
  cy.get("#ticker-symbol").clear();
  cy.get("#ticker-symbol").type("ABC");
  cy.get("#ticker-symbol").should("have.value", "ABC");

  // Test the the borrower saves and send a success message
  cy.get("#root div:nth-child(3) > button:nth-child(1)").click();
  cy.wait(500);
  cy.contains("Borrower Created Successfully").should("be.visible");
});
