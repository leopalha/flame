// ***********************************************************
// FLAME Lounge Bar - Navigation E2E Tests
// ***********************************************************
// Tests for basic navigation and page loading
// ***********************************************************

describe('Navigation', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
  });

  describe('Public Pages', () => {
    it('should load the homepage', () => {
      cy.visit('/');
      cy.get('h1').should('exist');
      cy.contains('FLAME').should('be.visible');
    });

    it('should load the menu page', () => {
      cy.visit('/cardapio');
      cy.contains('Cardápio').should('be.visible');
    });

    it('should load the concept page', () => {
      cy.visit('/conceito');
      cy.get('h1').should('exist');
    });

    it('should load the programming page', () => {
      cy.visit('/programacao');
      cy.get('body').should('be.visible');
    });

    it('should load the terms page', () => {
      cy.visit('/termos');
      cy.contains('Termos').should('be.visible');
    });

    it('should load the login page', () => {
      cy.visit('/login');
      cy.get('input').should('exist');
    });

    it('should load the register page', () => {
      cy.visit('/register');
      cy.get('input').should('exist');
    });
  });

  describe('Header Navigation', () => {
    it('should navigate from home to menu', () => {
      cy.visit('/');
      cy.get('nav').contains('Cardápio').click();
      cy.url().should('include', '/cardapio');
    });

    it('should show logo that links to home', () => {
      cy.visit('/cardapio');
      cy.get('header').find('a').first().click();
      cy.url().should('eq', Cypress.config().baseUrl + '/');
    });
  });

  describe('Mobile Navigation', () => {
    beforeEach(() => {
      cy.setMobileViewport();
    });

    it('should show bottom navigation on mobile', () => {
      cy.visit('/');
      cy.get('nav').should('be.visible');
    });

    it('should navigate using bottom nav', () => {
      cy.visit('/');
      cy.get('nav a[href="/cardapio"]').click();
      cy.url().should('include', '/cardapio');
    });
  });

  describe('404 Page', () => {
    it('should show 404 for non-existent pages', () => {
      cy.visit('/pagina-que-nao-existe', { failOnStatusCode: false });
      cy.contains('404').should('be.visible');
    });
  });
});
