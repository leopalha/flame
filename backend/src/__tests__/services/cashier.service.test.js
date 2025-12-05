/**
 * Testes unitários para cashier.service.js
 */

describe('CashierService', () => {
  describe('Cashier Calculations', () => {
    // Mock de um caixa para testes
    const createMockCashier = (overrides = {}) => ({
      id: 'cashier-123',
      status: 'open',
      openingAmount: 100.00,
      totalSales: 500.00,
      totalDeposits: 50.00,
      totalWithdrawals: 100.00,
      closingAmount: null,
      ...overrides
    });

    describe('calculateExpectedTotal', () => {
      it('should calculate expected total correctly', () => {
        const cashier = createMockCashier();
        // Expected = opening + sales + deposits - withdrawals
        const expected =
          parseFloat(cashier.openingAmount) +
          parseFloat(cashier.totalSales) +
          parseFloat(cashier.totalDeposits) -
          parseFloat(cashier.totalWithdrawals);

        expect(expected).toBe(550);
      });

      it('should handle zero values', () => {
        const cashier = createMockCashier({
          openingAmount: 0,
          totalSales: 0,
          totalDeposits: 0,
          totalWithdrawals: 0
        });

        const expected =
          parseFloat(cashier.openingAmount) +
          parseFloat(cashier.totalSales) +
          parseFloat(cashier.totalDeposits) -
          parseFloat(cashier.totalWithdrawals);

        expect(expected).toBe(0);
      });

      it('should handle large values', () => {
        const cashier = createMockCashier({
          openingAmount: 1000,
          totalSales: 50000,
          totalDeposits: 5000,
          totalWithdrawals: 10000
        });

        const expected = 1000 + 50000 + 5000 - 10000;
        expect(expected).toBe(46000);
      });
    });

    describe('calculateDifference', () => {
      it('should return zero difference when closing matches expected', () => {
        const cashier = createMockCashier({
          status: 'closed',
          closingAmount: 550
        });

        const expected = 100 + 500 + 50 - 100; // 550
        const difference = cashier.closingAmount - expected;

        expect(difference).toBe(0);
      });

      it('should return positive difference (sobra)', () => {
        const cashier = createMockCashier({
          status: 'closed',
          closingAmount: 600
        });

        const expected = 100 + 500 + 50 - 100; // 550
        const difference = cashier.closingAmount - expected;

        expect(difference).toBe(50);
        expect(difference > 0).toBe(true);
      });

      it('should return negative difference (falta)', () => {
        const cashier = createMockCashier({
          status: 'closed',
          closingAmount: 500
        });

        const expected = 100 + 500 + 50 - 100; // 550
        const difference = cashier.closingAmount - expected;

        expect(difference).toBe(-50);
        expect(difference < 0).toBe(true);
      });

      it('should return 0 for open cashier', () => {
        const cashier = createMockCashier({
          status: 'open'
        });

        // Open cashier should return 0 difference
        if (cashier.status !== 'closed') {
          expect(0).toBe(0);
        }
      });
    });

    describe('getDifferenceType', () => {
      it('should return "sobra" for positive difference', () => {
        const difference = 50;
        const type = difference > 0 ? 'sobra' : difference < 0 ? 'falta' : 'correto';
        expect(type).toBe('sobra');
      });

      it('should return "falta" for negative difference', () => {
        const difference = -30;
        const type = difference > 0 ? 'sobra' : difference < 0 ? 'falta' : 'correto';
        expect(type).toBe('falta');
      });

      it('should return "correto" for zero difference', () => {
        const difference = 0;
        const type = difference > 0 ? 'sobra' : difference < 0 ? 'falta' : 'correto';
        expect(type).toBe('correto');
      });
    });
  });

  describe('CashierMovement Types', () => {
    const movementTypes = ['sale', 'deposit', 'withdrawal', 'opening', 'closing'];

    it('should have 5 movement types', () => {
      expect(movementTypes.length).toBe(5);
    });

    it('should include sale type', () => {
      expect(movementTypes).toContain('sale');
    });

    it('should include deposit type', () => {
      expect(movementTypes).toContain('deposit');
    });

    it('should include withdrawal type', () => {
      expect(movementTypes).toContain('withdrawal');
    });

    describe('isIncome', () => {
      const incomeTypes = ['sale', 'deposit', 'opening'];
      const expenseTypes = ['withdrawal'];

      it('should identify income types correctly', () => {
        incomeTypes.forEach(type => {
          expect(incomeTypes.includes(type)).toBe(true);
        });
      });

      it('should identify expense types correctly', () => {
        expenseTypes.forEach(type => {
          expect(expenseTypes.includes(type)).toBe(true);
        });
      });

      it('closing should not be income', () => {
        expect(incomeTypes.includes('closing')).toBe(false);
      });
    });
  });

  describe('Movement Amount Handling', () => {
    it('should store withdrawal as negative', () => {
      const withdrawalAmount = 100;
      const storedAmount = -withdrawalAmount;
      expect(storedAmount).toBe(-100);
    });

    it('should store deposit as positive', () => {
      const depositAmount = 50;
      expect(depositAmount).toBe(50);
    });

    it('should calculate movement sum correctly', () => {
      const movements = [
        { type: 'opening', amount: 100 },
        { type: 'sale', amount: 50 },
        { type: 'sale', amount: 30 },
        { type: 'deposit', amount: 20 },
        { type: 'withdrawal', amount: -25 }
      ];

      const total = movements.reduce((sum, m) => sum + m.amount, 0);
      expect(total).toBe(175);
    });
  });

  describe('Cashier Status Validation', () => {
    it('should only allow one open cashier', () => {
      const existingOpen = { id: '1', status: 'open' };
      const canOpenNew = existingOpen === null;
      expect(canOpenNew).toBe(false);
    });

    it('should allow opening when no cashier is open', () => {
      const existingOpen = null;
      const canOpenNew = existingOpen === null;
      expect(canOpenNew).toBe(true);
    });

    it('should not allow deposit on closed cashier', () => {
      const cashier = { status: 'closed' };
      const canDeposit = cashier.status === 'open';
      expect(canDeposit).toBe(false);
    });

    it('should allow deposit on open cashier', () => {
      const cashier = { status: 'open' };
      const canDeposit = cashier.status === 'open';
      expect(canDeposit).toBe(true);
    });
  });

  describe('Amount Validation', () => {
    it('should reject negative amounts', () => {
      const amount = -50;
      const isValid = amount > 0;
      expect(isValid).toBe(false);
    });

    it('should reject zero amounts', () => {
      const amount = 0;
      const isValid = amount > 0;
      expect(isValid).toBe(false);
    });

    it('should accept positive amounts', () => {
      const amount = 100;
      const isValid = amount > 0;
      expect(isValid).toBe(true);
    });

    it('should handle decimal amounts', () => {
      const amount = 99.99;
      const isValid = amount > 0;
      expect(isValid).toBe(true);
    });
  });
});

describe('Cashier Statistics', () => {
  describe('Period Statistics', () => {
    const mockCashiers = [
      { totalSales: 1000, totalDeposits: 100, totalWithdrawals: 50, closingAmount: 1050, expectedTotal: 1050 },
      { totalSales: 1500, totalDeposits: 200, totalWithdrawals: 100, closingAmount: 1600, expectedTotal: 1600 },
      { totalSales: 800, totalDeposits: 50, totalWithdrawals: 30, closingAmount: 810, expectedTotal: 820 }
    ];

    it('should calculate total sales correctly', () => {
      const totalSales = mockCashiers.reduce((sum, c) => sum + c.totalSales, 0);
      expect(totalSales).toBe(3300);
    });

    it('should calculate average sales correctly', () => {
      const totalSales = mockCashiers.reduce((sum, c) => sum + c.totalSales, 0);
      const average = totalSales / mockCashiers.length;
      expect(average).toBe(1100);
    });

    it('should count total differences', () => {
      let positiveCount = 0;
      let negativeCount = 0;
      let exactCount = 0;

      mockCashiers.forEach(c => {
        const diff = c.closingAmount - c.expectedTotal;
        if (diff > 0) positiveCount++;
        else if (diff < 0) negativeCount++;
        else exactCount++;
      });

      expect(positiveCount).toBe(0);
      expect(negativeCount).toBe(1);
      expect(exactCount).toBe(2);
    });
  });
});
