// ***********************************************************************
// *  ST-14 – Test Rollforward Report Generation                         *
// ***********************************************************************

it("accepts parameters and generates a rollforward report", function () {
  //Navigate to the rollforward page
  cy.visit("localhost:3000");
  cy.get('#root a[href="/reporting/"]').click();
  cy.get('#root a[href="/reporting/rollforward"]').click();

  // Test that autocomplete for portfolio contains value inputted
  cy.get("#autocomplete-portfolio-name").click();
  cy.get("#autocomplete-portfolio-name").type("Fund C");
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

  // Choose Start Date
  cy.get('input[data-testid="start-date-picker"]').click({ force: true });
  cy.focused().clear().type("01/01/2025");
  cy.wait(200);

  // Choose End Date
  cy.get('input[data-testid="end-date-picker"]').click({ force: true });
  cy.focused().clear().type("10/31/2025");
  cy.wait(200);

  // Toggle Funds Flow Switch On
  cy.get("#funds-flow-switch").check();
  cy.get("#funds-flow-switch").should("be.checked");

  // Input current outstandings
  cy.get("#current-outstandings-textfield").click();
  cy.get("#current-outstandings-textfield").type("32000000");
  cy.get("#current-outstandings-textfield").should("have.value", "$32,000,000.00");

  // Input interest expense due
  cy.get("#interest-expense-due").click();
  cy.get("#interest-expense-due").type("125458");
  cy.get("#interest-expense-due").should("have.value", "$125,458.00");

  // Click on submit button
  cy.get("#root div:nth-child(4) > button:nth-child(1)").click();
  cy.wait(2000);

  // Verify correct information is displayed on Rollforward of Outstandings
  cy.get("#root div:nth-child(2) > table > tbody > tr:nth-child(2) > td:nth-child(3) > span")
    .contains("12,500,000")
    .should("be.visible");
  cy.get(
    "#root div:nth-child(2) > table > tbody > tr:nth-child(8) > td:nth-child(6) > span",
  ).scrollIntoView();
  cy.get("#root div:nth-child(2) > table > tbody > tr:nth-child(8) > td:nth-child(6) > span")
    .contains("58,035,000")
    .should("be.visible");

  // Verify correct information is displayed on Rollforward of Value
  cy.get("#root div:nth-child(5) tr:nth-child(4) td:nth-child(5) span")
    .contains("-3,245,300")
    .should("be.visible");
  cy.get("#root div:nth-child(5) tr:nth-child(8) td:nth-child(6) span")
    .contains("49,034,000")
    .should("be.visible");

  // Verify correct information is displayed on Rollforward of Total Availability
  cy.get("#root div:nth-child(8) tr:nth-child(3) td:nth-child(4) span")
    .contains("-965,250")
    .should("be.visible");
  cy.get("#root div:nth-child(8) tr:nth-child(4) td:nth-child(6) span")
    .contains("529,125")
    .should("be.visible");

  // Verify correct information is displayed on Additional Data
  cy.get("#root div:nth-child(11) tr:nth-child(2) td:nth-child(3)")
    .contains("0.00%")
    .should("be.visible");
  cy.get("#root div:nth-child(11) tr:nth-child(3) td:nth-child(6)")
    .contains("55.00%")
    .should("be.visible");

  // Verify correct information is displayed on Funds Flow
  cy.get("#root div:nth-child(12) span").contains("3,042,833").should("be.visible");
  cy.get("#root div:nth-child(13) span").contains("7,772,667").should("be.visible");
});
