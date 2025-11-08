// ************************************************************************
// *  ST-3 – Test System Navigation                                       *
// ************************************************************************

it("Displays the correct navigation pages while navigating through the System", function () {
  cy.visit("localhost:3000");
  cy.get('#root [href="/borrowingbase/"]').click();
  cy.get('#root [href="/borrowingbase/borrowbasecalcview"]').click();
  cy.contains("Placeholder for Borrowing Base Calculation View").should("be.visible");
  cy.get('#root [href="/borrowingbase/borrowbasecovenantview"]').click();
  cy.contains("Placeholder for Borrowing Base Covenant View").should("be.visible");
  cy.get('#root [href="/transactions/"]').click();
  cy.get('#root [href="/transactions/borrowertransactions"]').click();
  cy.get('#root [href="/transactions/borrowertransactions/borrowermodify"]').click();
  cy.contains("Placeholder for Borrower Modify").should("be.visible");
  cy.get('#root [href="/transactions/borrowertransactions/borrowerdelete"]').click();
  cy.contains("Placeholder for Borrower Delete").should("be.visible");
  cy.get('#root [href="/transactions/loanagreementtransactions"]').click();
  cy.get('#root [href="/transactions/loanagreementtransactions/loanagreementmodify"]').click();
  cy.contains("Placeholder for Loan Agreement Modify").should("be.visible");
  cy.get('#root [href="/transactions/loanagreementtransactions/loanagreementdelete"]').click();
  cy.contains("Placeholder for Loan Agreement Delete").should("be.visible");
  cy.get('#root [href="/transactions/loantranchetransactions"]').click();
  cy.get('#root [href="/transactions/loantranchetransactions/loantranchemodify"]').click();
  cy.contains("Placeholder for Loan Tranche Modify").should("be.visible");
  cy.get('#root [href="/transactions/loantranchetransactions/loantranchedelete"]').click();
  cy.contains("Placeholder for Loan Tranche Delete").should("be.visible");
  cy.get('#root [href="/transactions/loanapprovaltransactions"]').click();
  cy.get('#root [href="/transactions/loanapprovaltransactions/loanapprovalmodify"]').click();
  cy.contains("Placeholder for Loan Approval Modify").should("be.visible");
  cy.get('#root [href="/transactions/loanapprovaltransactions/loanapprovaldelete"]').click();
  cy.contains("Placeholder for Loan Approval Delete").should("be.visible");
  cy.get('#root [href="/transactions/collateralpledgetransactions"]').click();
  cy.get(
    '#root [href="/transactions/collateralpledgetransactions/collateralpledgeremove"]',
  ).click();
  cy.contains("Placeholder for Collateral Pledge Remove").should("be.visible");
  cy.get('#root [href="/reporting/"]').click();
  cy.get('#root [href="/reporting/otherreporting"]').click();
  cy.contains("Placeholder for Other Reporting").should("be.visible");
  cy.get('#root [href="/dashboard/"]').click();
  cy.contains("Placeholder for Dashboard").should("be.visible");
  cy.get('#root [href="/configuration/"]').click();
  cy.get('#root [href="/configuration/configfacility"]').click();
  cy.get('#root [href="/configuration/configfacility/debtfacilitymodify"]').click();
  cy.contains("Placeholder for Debt Facility Modification").should("be.visible");
  cy.get('#root [href="/configuration/configfacility/debtfacilitydelete"]').click();
  cy.contains("Placeholder for Debt Facility Deletion").should("be.visible");
  cy.get('#root [href="/configuration/configbank"]').click();
  cy.contains("Placeholder for Bank Configuration").should("be.visible");
  cy.get('#root [href="/configuration/configportfolio"]').click();
  cy.contains("Placeholder for Portfolio Configuration").should("be.visible");
});
