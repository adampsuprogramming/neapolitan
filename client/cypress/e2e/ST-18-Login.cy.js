// ***********************************************************************
// *  ST-18 – Test Auth0 Login and user profile selection                *
// ***********************************************************************

it("logins to Auth0", function () {
  cy.visit("localhost:3000");
  cy.contains("Log In").click()
  cy.origin("https://dev-kafa4sjwg3snbngt.us.auth0.com", () => {
    cy.get("#username").type(Cypress.env("auth0_test_email"));
    cy.get("#password").type(Cypress.env("auth0_test_password"), { log: false });
    cy.get('button[type="submit"]').click();
  });

  cy.contains("Welcome to", { timeout: 15000 }).should("be.visible");

  cy.contains("neapolitandebtsoftware@gmail.com").scrollIntoView().click();

  cy.contains("User Profile").scrollIntoView().should("be.visible");
});
