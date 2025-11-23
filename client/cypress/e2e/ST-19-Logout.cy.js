// ***********************************************************************
// *  ST-19 – Test Auth0 Logout Success After Logging In                 *
// ***********************************************************************

it("test", function () {
  cy.visit("localhost:3000");
  cy.get("#root h3 a").click();
  cy.origin("https://dev-kafa4sjwg3snbngt.us.auth0.com", () => {
    cy.get("#username").type(Cypress.env("auth0_test_email"));
    cy.get("#password").type(Cypress.env("auth0_test_password"), { log: false });
    cy.get('button[type="submit"]').click();
  });
  cy.url().should("include", "localhost:3000");
  cy.contains("Welcome to Neapolitan").should("be.visible");

  cy.contains("log out").scrollIntoView().click();

  cy.contains("Log In").scrollIntoView().should("be.visible");
});
