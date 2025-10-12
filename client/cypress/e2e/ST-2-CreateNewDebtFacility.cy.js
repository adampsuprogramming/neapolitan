// ************************************************************************
// *  ST-2 – Test adding a Debt Facility Into the System                  *
// ************************************************************************

it("submits a new facility form and receives confirmation", function () {
  // Navigate to the new facility page
  cy.visit("localhost:3000");
  cy.get('#root [href="/configuration/"]').click();
  cy.get('#root [href="/configuration/configfacility"]').click();
  cy.get(
    '#root [href="/configuration/configfacility/debtfacilitycreate"]',
  ).click();

  // Test that Facility Name input works and contains value inputted
  cy.get("#facility-name-input").click();
  const randomNumber = Math.floor(Math.random() * 10000000);
  const facilityName = `Test Facility ST-2 #${randomNumber}`;
  cy.get("#facility-name-input").type(facilityName);
  cy.get("#facility-name-input").should("have.value", facilityName);

  // Just click on the 15th of the current month and asserting that the calendar worked
  // using cypress with MUI month and date navigation is incredibly difficult.

  cy.get('[data-testid="CalendarIcon"]').eq(0).click();
  cy.wait(300);
  cy.get(".MuiPickersDay-root").contains("15").click();
  cy.get(".row-2-new-debt-facility input").eq(0).should("not.have.value", "");

  // Just click on the 20th of the current month and asserting that the calendar worked
  // using cypress with MUI month and date navigation is incredibly difficult.

  cy.get('[data-testid="CalendarIcon"]').eq(1).click();
  cy.wait(300);
  cy.get(".MuiPickersDay-root").contains("20").click();
  cy.get(".row-2-new-debt-facility input").eq(1).should("not.have.value", "");

  // Test that Commitment Amount input works and contains value inputted
  cy.get("#commitment-amount-field").click();
  cy.get("#commitment-amount-field").clear();
  cy.get("#commitment-amount-field").type("500000000");
  cy.get("#commitment-amount-field").should("have.value", "$500,000,000.00");

  // Test that Commitment Amount input works and contains value inputted
  cy.get("#overall-rate-switch").check();
  cy.get("#overall-rate-switch").should("be.checked");

  // Test that maximum advance rate input works and contains value inputted

  cy.get("#max-advance-rate-field").click();
  cy.get("#max-advance-rate-field").clear();
  cy.get("#max-advance-rate-field").type("60");
  cy.get("#max-advance-rate-field").should("have.value", "60.000000%");

  // Test that asset-by-asset advance rate switch works
  cy.get("#asset-by-asset-advance-rate-switch").check();
  cy.get("#asset-by-asset-advance-rate-switch").should("be.checked");

  // Test that first lien advance rate input works and contains value inputted

  cy.get("#first-lien-rate-textfield").click();
  cy.get("#first-lien-rate-textfield").clear();
  cy.get("#first-lien-rate-textfield").type("70");
  cy.get("#first-lien-rate-textfield").should("have.value", "70.000000%");

  // Test that second lien advance rate input works and contains value inputted

  cy.get("#second-lien-rate-textfield").click();
  cy.get("#second-lien-rate-textfield").clear();
  cy.get("#second-lien-rate-textfield").type("45");
  cy.get("#second-lien-rate-textfield").should("have.value", "45.000000%");

  // Test that mezzanine advance rate input works and contains value inputted

  cy.get("#mezzanine-rate-textfield").click();
  cy.get("#mezzanine-rate-textfield").clear();
  cy.get("#mezzanine-rate-textfield").type("20");
  cy.get("#mezzanine-rate-textfield").should("have.value", "20.000000%");

  // Test that minimum equity switch works

  cy.get("#min-equity-switch").check();
  cy.get("#min-equity-switch").should("be.checked");

  // Test that minimum equity amount input works and contains value inputted

  cy.get("#min-equity-textfield").click();
  cy.get("#min-equity-textfield").clear();
  cy.get("#min-equity-textfield").type("100000000");
  cy.get("#min-equity-textfield").should("have.value", "$100,000,000.00");

  // Test that the autocomplete lender name works as intended and contains value inputted
  cy.get("#autocomplete-lender-name").click();
  cy.get("#autocomplete-lender-name").clear();
  cy.get("#autocomplete-lender-name").type("sn");
  cy.get("#autocomplete-lender-name-option-0").click();
  cy.get("#autocomplete-lender-name").should("have.value", "Snorkel Bank");

  // Test that the autocomplete fund name works as intended and contains value inputted
  cy.get("#autocomplete-portfolio-name").click();
  cy.get("#autocomplete-portfolio-name").clear();
  cy.get("#autocomplete-portfolio-name").type("fun");
  cy.get("#autocomplete-portfolio-name-option-0").click();
  cy.get("#autocomplete-portfolio-name").should("have.value", "Fund A");

  // Test that the data saves in the database correctly and returns the proper message upon saving.
  cy.get("#root div:nth-child(5) button:nth-child(1)").click();
  cy.wait(500);
  cy.contains("Facility Created Successfully").should("be.visible");
});
