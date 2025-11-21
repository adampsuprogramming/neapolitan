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
  cy.get("#autocomplete-portfolio-name").type("A");
  cy.wait(200);
  cy.get("#autocomplete-portfolio-name-option-0").click();
  cy.get("#autocomplete-portfolio-name").should("have.value", "Fund A");
  cy.wait(200);
  
  // Test that autocomplete for facility contains value inputted
  cy.get("#autocomplete-facility-name").click();
  cy.get("#autocomplete-facility-name").type("Star");
  cy.get("#autocomplete-facility-name-option-0").click();
  cy.wait(200);
  cy.get("#autocomplete-facility-name").should("have.value", "Starfish Bank Fund A Facility");
  cy.wait(200);

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


  cy.get("#root div.css-1flyc9m")
    .invoke("text")
    .then((asOfDate) => {
      const dateText = asOfDate.trim();
      const [month, day, year] = dateText.split("/").map(Number);

      const fullYear = year < 100 ? 2000 + year : year;
      const date = new Date(fullYear, month - 1, day);
      date.setDate(date.getDate() + 1);

      const newMonth = String(date.getMonth() + 1).padStart(2, "0");
      const newDay = String(date.getDate()).padStart(2, "0");
      const newYear = date.getFullYear();
      const newDate = `${newMonth}/${newDay}/${newYear}`;

      cy.get('input[data-testid="change-date-picker"]').click({ force: true });
      cy.focused().clear().type(newDate);
      cy.get('[data-testid="change-date-picker"]').should("not.have.value", "");
    });

  // Test that text box for advance rate and contains value inputted
  cy.get("#advance-rate").click();
  cy.get("#advance-rate").type("70");
  cy.get("#advance-rate").should("have.value", "70.000000%");

  // Test that text box for valuation and contains value inputted
  cy.get("#valuation").click();
  cy.get("#valuation").type("90");
  cy.get("#valuation").should("have.value", "90.000000%");

  cy.get(
    "#root form.css-1i7nkdp > div:nth-child(2) > div:nth-child(2) > button:nth-child(1)",
  ).click();

  cy.wait(500);
  cy.contains("Bank Metric Update Successful").should("be.visible");
});
