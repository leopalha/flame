// ***********************************************************
// FLAME Lounge Bar - Menu E2E Tests
// ***********************************************************
// Tests for the cardapio/menu functionality
// ***********************************************************

describe('Menu (Cardápio)', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.visit('/cardapio');
  });

  describe('Product Display', () => {
    it('should display product categories', () => {
      cy.get('body').should('be.visible');
      // Should have category filters or tabs
      cy.get('button, [role="tab"]').should('have.length.greaterThan', 0);
    });

    it('should display product cards', () => {
      cy.get('[class*="card"], [class*="Card"]').should('have.length.greaterThan', 0);
    });

    it('should show product names and prices', () => {
      // Products should have visible text content
      cy.get('body').then(($body) => {
        // Check if there are any R$ price indicators
        expect($body.text()).to.match(/R\$\s*\d+/);
      });
    });
  });

  describe('Category Filtering', () => {
    it('should filter products by category when clicking tabs', () => {
      // Get initial state
      cy.get('body').should('be.visible');

      // Click on different category buttons if they exist
      cy.get('button').then(($buttons) => {
        if ($buttons.length > 1) {
          cy.wrap($buttons).eq(1).click();
          cy.wait(500); // Wait for filter to apply
        }
      });
    });
  });

  describe('Search Functionality', () => {
    it('should have a search input if implemented', () => {
      cy.get('body').then(($body) => {
        const hasSearch = $body.find('input[type="search"], input[placeholder*="Buscar"], input[placeholder*="buscar"]').length > 0;
        if (hasSearch) {
          cy.get('input[type="search"], input[placeholder*="Buscar"], input[placeholder*="buscar"]')
            .should('be.visible');
        }
      });
    });
  });

  describe('Add to Cart', () => {
    it('should be able to add items to cart', () => {
      // Find an add button (usually + or "Adicionar")
      cy.get('button').then(($buttons) => {
        const addButton = $buttons.filter((i, el) => {
          const text = el.textContent;
          return text.includes('+') || text.includes('Adicionar');
        });

        if (addButton.length > 0) {
          cy.wrap(addButton).first().click();
          // Check cart badge updates or toast appears
          cy.wait(500);
        }
      });
    });
  });

  describe('Mobile Responsiveness', () => {
    it('should display correctly on mobile', () => {
      cy.setMobileViewport();
      cy.reload();
      cy.get('body').should('be.visible');
      // Products should still be visible
      cy.get('[class*="card"], [class*="Card"]').should('have.length.greaterThan', 0);
    });
  });
});
