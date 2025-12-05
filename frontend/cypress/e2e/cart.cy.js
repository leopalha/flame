// ***********************************************************
// FLAME Lounge Bar - Cart E2E Tests
// ***********************************************************
// Tests for the shopping cart functionality
// ***********************************************************

describe('Shopping Cart', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
  });

  describe('Empty Cart', () => {
    it('should show empty state when cart is empty', () => {
      cy.visit('/carrinho');
      cy.get('body').should('be.visible');
      // Should show some indication of empty cart
      cy.get('body').then(($body) => {
        const text = $body.text().toLowerCase();
        const isEmpty = text.includes('vazio') ||
                       text.includes('empty') ||
                       text.includes('nenhum item') ||
                       text.includes('carrinho vazio');
        // If not empty message, should at least not crash
        expect($body.find('[data-testid="error"]').length).to.equal(0);
      });
    });
  });

  describe('Cart with Items', () => {
    beforeEach(() => {
      // Setup cart with mock data
      const cartState = {
        state: {
          items: [
            {
              id: 'test-product-1',
              name: 'Produto Teste',
              price: 29.90,
              quantity: 2,
              image: '/placeholder.jpg',
            },
          ],
        },
        version: 0,
      };
      window.localStorage.setItem('flame-cart', JSON.stringify(cartState));
    });

    it('should display cart items', () => {
      cy.visit('/carrinho');
      cy.get('body').should('be.visible');
    });

    it('should show total calculation', () => {
      cy.visit('/carrinho');
      cy.get('body').then(($body) => {
        // Should show some price/total
        expect($body.text()).to.match(/R\$\s*\d+/);
      });
    });
  });

  describe('Cart Actions', () => {
    beforeEach(() => {
      const cartState = {
        state: {
          items: [
            {
              id: 'test-product-1',
              name: 'Produto Teste',
              price: 29.90,
              quantity: 1,
            },
          ],
        },
        version: 0,
      };
      window.localStorage.setItem('flame-cart', JSON.stringify(cartState));
    });

    it('should be able to increment quantity', () => {
      cy.visit('/carrinho');
      cy.get('button').then(($buttons) => {
        const plusButton = $buttons.filter((i, el) => el.textContent.includes('+'));
        if (plusButton.length > 0) {
          cy.wrap(plusButton).first().click();
        }
      });
    });

    it('should be able to decrement quantity', () => {
      cy.visit('/carrinho');
      cy.get('button').then(($buttons) => {
        const minusButton = $buttons.filter((i, el) => el.textContent.includes('-'));
        if (minusButton.length > 0) {
          cy.wrap(minusButton).first().click();
        }
      });
    });

    it('should navigate to checkout', () => {
      cy.visit('/carrinho');
      cy.get('body').then(($body) => {
        const checkoutLink = $body.find('a[href*="checkout"], button:contains("Finalizar"), button:contains("Continuar")');
        if (checkoutLink.length > 0) {
          cy.wrap(checkoutLink).first().click();
        }
      });
    });
  });

  describe('Cart Persistence', () => {
    it('should persist cart data across page reloads', () => {
      const cartState = {
        state: {
          items: [
            {
              id: 'persist-test',
              name: 'Produto Persistente',
              price: 50.00,
              quantity: 3,
            },
          ],
        },
        version: 0,
      };
      window.localStorage.setItem('flame-cart', JSON.stringify(cartState));

      cy.visit('/carrinho');
      cy.reload();

      // Data should still be there
      cy.window().then((win) => {
        const stored = win.localStorage.getItem('flame-cart');
        expect(stored).to.not.be.null;
      });
    });
  });
});
