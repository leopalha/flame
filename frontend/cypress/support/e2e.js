// ***********************************************************
// FLAME Lounge Bar - Cypress E2E Support File
// ***********************************************************
// This file runs before every test file.
// You can use it to add custom commands, global overrides, etc.
// ***********************************************************

import './commands';

// Prevent uncaught exceptions from failing tests
Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from failing the test
  console.log('Uncaught exception:', err.message);
  return false;
});

// Log test info to console
beforeEach(() => {
  cy.log(`Running: ${Cypress.currentTest.title}`);
});
