// ***********************************************************
// FLAME Lounge Bar - Custom Cypress Commands
// ***********************************************************

// Login command - simulates user login
Cypress.Commands.add('login', (phone = '21999999999', code = '123456') => {
  cy.visit('/login');
  cy.get('input[name="phone"]').type(phone);
  cy.get('button[type="submit"]').click();

  // Wait for SMS code step
  cy.get('input[name="code"]', { timeout: 10000 }).should('be.visible');
  cy.get('input[name="code"]').type(code);
  cy.get('button[type="submit"]').click();

  // Wait for redirect
  cy.url().should('not.include', '/login');
});

// Mock login - set auth token directly in localStorage
Cypress.Commands.add('mockLogin', (user = {}) => {
  const defaultUser = {
    id: 'test-user-id',
    nome: 'Usuário Teste',
    email: 'teste@flame.com',
    celular: '21999999999',
    role: 'cliente',
    loyaltyTier: 'bronze',
    cashbackBalance: 50.00,
    ...user
  };

  const authState = {
    state: {
      user: defaultUser,
      token: 'mock-jwt-token',
      isAuthenticated: true,
    },
    version: 0,
  };

  window.localStorage.setItem('flame-auth', JSON.stringify(authState));
});

// Add item to cart
Cypress.Commands.add('addToCart', (productName) => {
  cy.visit('/cardapio');
  cy.contains(productName).parents('[data-testid="product-card"]').within(() => {
    cy.get('button').contains('+').click();
  });
});

// Clear cart
Cypress.Commands.add('clearCart', () => {
  window.localStorage.removeItem('flame-cart');
});

// Check toast message
Cypress.Commands.add('checkToast', (message) => {
  cy.get('[role="status"]', { timeout: 5000 })
    .should('be.visible')
    .and('contain', message);
});

// Wait for API response
Cypress.Commands.add('waitForApi', (alias, timeout = 10000) => {
  cy.wait(alias, { timeout });
});

// Intercept API calls
Cypress.Commands.add('interceptApi', (method, path, response, alias) => {
  cy.intercept(method, `${Cypress.env('apiUrl')}${path}`, response).as(alias);
});

// Check page loads without errors
Cypress.Commands.add('checkPageLoads', (url) => {
  cy.visit(url);
  cy.get('body').should('be.visible');
  cy.get('[data-testid="error-boundary"]').should('not.exist');
});

// Mobile viewport
Cypress.Commands.add('setMobileViewport', () => {
  cy.viewport(375, 667); // iPhone SE size
});

// Tablet viewport
Cypress.Commands.add('setTabletViewport', () => {
  cy.viewport(768, 1024); // iPad size
});

// Desktop viewport
Cypress.Commands.add('setDesktopViewport', () => {
  cy.viewport(1280, 720);
});
