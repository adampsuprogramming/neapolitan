// ***********************************************************************
// *  ST-12 – Record Payments Received
// ***********************************************************************

it("fills out payments update form", function () {
  //Navigate to the collateral pledge page

  cy.visit("localhost:3000/transactions/paymentsreceived/");

  // Test that autocomplete for portfolio and contains value inputted
  cy.get("#autocomplete-portfolio-name").click();
  cy.get("#autocomplete-portfolio-name").type("Fund B");
  cy.wait(200);
  cy.get("#autocomplete-portfolio-name-option-0").click();
  cy.get("#autocomplete-portfolio-name").should("have.value", "Fund B");
  cy.wait(200);

  // Test that autocomplete for facility name works and contains value inputted
  cy.get("#autocomplete-facility-name").click();
  cy.get("#autocomplete-facility-name").type("Katamari");
  cy.get("#autocomplete-facility-name-option-0").click();
  cy.wait(200);

  cy.get("#autocomplete-facility-name").should(
    "have.value",
    "Katamari Facility",
  );
  cy.wait(200);

  // Test that inclusion date picker works and does not contain blank value after input
  cy.get('[data-testid="CalendarIcon"]').click();
  cy.wait(300);
  cy.get(".MuiPickersDay-root").contains("30").click();
  cy.wait(300);
  cy.get('[data-testid="payment-date-picker"]').should("not.have.value", "");

  // Test that first box for principal received works and contains value inputted
  cy.get("tr:nth-child(1) #new-principal-received").click();
  cy.get("tr:nth-child(1) #new-principal-received").type("1");
  cy.get("tr:nth-child(1) #new-principal-received").should(
    "have.value",
    "$1.00",
  );

  // Test that first box for principal received works and contains value inputted
  cy.get("tr:nth-child(1) #new-interest-received").click();
  cy.get("tr:nth-child(1) #new-interest-received").type("2500");
  cy.get("tr:nth-child(1) #new-interest-received").should(
    "have.value",
    "$2,500.00",
  );

  // Test that last box for principal received works and contains value inputted
  cy.get("tr:nth-child(5) #new-principal-received").click();
  cy.get("tr:nth-child(5) #new-principal-received").type("2");
  cy.get("tr:nth-child(5) #new-principal-received").should(
    "have.value",
    "$2.00",
  );

  // Test that last box for interest received works and contains value inputted
  cy.get("tr:nth-child(5) #new-interest-received").click();
  cy.get("tr:nth-child(5) #new-interest-received").type("500");
  cy.get("tr:nth-child(5) #new-interest-received").should(
    "have.value",
    "$500.00",
  );

  // Click on save button
  cy.get("#root div.css-13v8muf button:nth-child(1)").click();

  cy.wait(500);
  cy.contains("Payments Successfully Posted").should("be.visible");
});
