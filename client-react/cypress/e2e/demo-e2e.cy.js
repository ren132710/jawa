/// <reference types="cypress" />
describe('smoke test vite and cypress', () => {
  it('should visit and count should be zero', () => {
    cy.visit('/');

    // two ways to test an element attr
    cy.get('[data-test="place-search"]')
      .invoke('attr', 'placeholder')
      .should('eq', 'Weather at your places');
    cy.get('[data-test="place-search"]').should(
      'have.attr',
      'placeholder',
      'Weather at your places'
    );
    // open menu
    cy.get('[data-test="hamburger"]').click();

    // menu should be open
    cy.get('[data-test="menu"]').should('be.visible');

    // close menu
    cy.get('[data-test="menu-blanket"]').click();

    // menu should be closed
    cy.get('[data-test="menu"]').should('not.be.visible');
  });
});
