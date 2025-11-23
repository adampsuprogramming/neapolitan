// ***********************************************************************
// *  ST-18 – Test Auth0 Login and user profile selection                *
// ***********************************************************************

it("test", function () {
  cy.visit("localhost:3000");
  cy.get("#root h3 a").click();
  cy.origin("https://dev-kafa4sjwg3snbngt.us.auth0.com", () => {
    cy.get("#username").type(Cypress.env("auth0_test_email"));
    cy.get("#password").type(Cypress.env("auth0_test_password"), { log: false });
    cy.get('button[type="submit"]').click();
  });
  cy.url({timeout: 10000}).should("include", "localhost:3000");
  cy.contains("Welcome to Neapolitan", { timeout: 10000}).should("be.visible");

  cy.contains("neapolitandebtsoftware@gmail.com").scrollIntoView().click();

  cy.contains("User Profile").scrollIntoView().should("be.visible");
});
