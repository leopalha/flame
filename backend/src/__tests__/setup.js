// Setup file for Jest tests
// This file runs before each test file

// Mock environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-key-for-jest';
process.env.JWT_EXPIRES_IN = '1h';

// Silence console logs during tests (optional)
// global.console = {
//   ...console,
//   log: jest.fn(),
//   debug: jest.fn(),
//   info: jest.fn(),
//   warn: jest.fn(),
// };

// Global test utilities
global.testUtils = {
  generateUUID: () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  },

  mockUser: (overrides = {}) => ({
    id: global.testUtils.generateUUID(),
    nome: 'Test User',
    email: 'test@example.com',
    telefone: '11999999999',
    tipo: 'customer',
    ...overrides
  }),

  mockOrder: (overrides = {}) => ({
    id: global.testUtils.generateUUID(),
    orderNumber: Math.floor(Math.random() * 10000),
    status: 'pending',
    paymentStatus: 'pending',
    subtotal: 100.00,
    serviceFee: 10.00,
    total: 110.00,
    createdAt: new Date(),
    ...overrides
  })
};

// Cleanup after all tests
afterAll(async () => {
  // Add any global cleanup here
});
