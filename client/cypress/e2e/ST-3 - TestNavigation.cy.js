it('Displays the correct navigation pages while navigating through the System', function() {
  cy.visit('localhost:3000')
  cy.get('#root [href="/borrowingbase/"]').click();
  cy.get('#root [href="/borrowingbase/borrowbasecalcview"]').click();
  cy.contains('Placeholder for Borrowing Base Calculation View').should('be.visible');
  cy.get('#root [href="/borrowingbase/borrowbasecovenantview"]').click();
  cy.contains('Placeholder for Borrowing Base Covenant View').should('be.visible');
  cy.get('#root [href="/transactions/"]').click();
  cy.contains('Placeholder for Transactions').should('be.visible');
  cy.get('#root [href="/performance/"]').click();
  cy.contains('Placeholder for Performance').should('be.visible');
  cy.get('#root [href="/reporting/"]').click();
  cy.contains('Placeholder for Reporting').should('be.visible');
  cy.get('#root [href="/dashboard/"]').click();
  cy.contains('Placeholder for Dashboard').should('be.visible');
  cy.get('#root [href="/configuration/"]').click();
  cy.get('#root [href="/configuration/configfacility"]').click();
  cy.get('#root [href="/configuration/configfacility/debtfacilitymodify"]').click();
  cy.contains('Placeholder for Debt Facility Modification').should('be.visible');
  cy.get('#root [href="/configuration/configfacility/debtfacilitydelete"]').click();
  cy.contains('Placeholder for Debt Facility Deletion').should('be.visible');
  cy.get('#root [href="/configuration/configbank"]').click();
  cy.contains('Placeholder for Bank Configuration').should('be.visible');
  cy.get('#root [href="/configuration/configportfolio"]').click();
  cy.contains('Placeholder for Portfolio Configuration').should('be.visible');
  
});