// ***********************************************************************
// *  ST-11 – Test Metric Updates - Info Box
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
  cy.get("#autocomplete-loan-tranches-option-1").click();
  cy.wait(200);

  cy.get("#autocomplete-loan-tranches").should("have.value", "Test");
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

  // Test that text box for leverage ratio and contains value inputted
  cy.get("#leverage-ratio").click();
  cy.get("#leverage-ratio").type("4");
  cy.get("#leverage-ratio").should("have.value", "4.000000");

  // Test that text box for net leverage ratio and contains value inputted
  cy.get("#net-leverage-ratio").click();
  cy.get("#net-leverage-ratio").type("3.3925");
  cy.get("#net-leverage-ratio").should("have.value", "3.392500");

  // Test that text box for net leverage ratio and contains value inputted
  cy.get("#int-coverage-ratio").click();
  cy.get("#int-coverage-ratio").type("2.456789");
  cy.get("#int-coverage-ratio").should("have.value", "2.456789");

  // Test that text box for net leverage ratio and contains value inputted
  cy.get("#internal-val").click();
  cy.get("#internal-val").type("97.454");
  cy.get("#internal-val").should("have.value", "97.454000%");

  // Test that text box for ebtida and contains value inputted
  cy.get("#ebitda").click();
  cy.get("#ebitda").type("8000000.01");
  cy.get("#ebitda").should("have.value", "$8,000,000.01");

  cy.get(
    "#root form.css-1i7nkdp > div:nth-child(2) > div:nth-child(2) > button:nth-child(1)",
  ).click();

  cy.wait(500);
  cy.contains("Metric Update Successful").should("be.visible");
});
