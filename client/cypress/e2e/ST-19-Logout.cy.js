// ***********************************************************************
// *  ST-19 – Test Auth0 Logout Success After Logging In                 *
// ***********************************************************************

it("logs out from Auth0", function () {
  cy.visit("localhost:3000");
  cy.get("#root h3 a").click();
  cy.origin("https://dev-kafa4sjwg3snbngt.us.auth0.com", () => {
    cy.get("#username").type(Cypress.env("auth0_test_email"));
    cy.get("#password").type(Cypress.env("auth0_test_password"), { log: false });
    cy.get('button[type="submit"]').click();
  });

  cy.contains("Welcome to Neapolitan", { timeout: 15000 }).should("be.visible");

  cy.contains("log out").scrollIntoView().click();

  cy.contains("Log In").scrollIntoView().should("be.visible");
});
