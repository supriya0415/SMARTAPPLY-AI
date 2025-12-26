/**
 * Test Setup Configuration
 * Sets up testing environment for React components and services
 */

import '@testing-library/jest-dom';

// Mock import.meta for Jest environment
if (!globalThis.import) {
  Object.defineProperty(globalThis, 'import', {
    value: {
      meta: {
        env: {
          VITE_GEMINI_API_KEY: 'test-api-key-123',
          VITE_API_URL: 'http://localhost:3002',
          VITE_APP_TITLE: 'SmartApply AI Test',
          VITE_APP_DESCRIPTION: 'Test Environment',
          PROD: false,
          DEV: true,
          MODE: 'test'
        }
      }
    }
  });
}

// Mock window.matchMedia for responsive design tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock ResizeObserver for component tests
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock IntersectionObserver for lazy loading tests
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Suppress console warnings in tests unless explicitly needed
const originalConsole = global.console;
global.console = {
  ...originalConsole,
  warn: jest.fn(),
  error: jest.fn(),
  log: jest.fn(),
};

// Mock performance API for performance tests
Object.defineProperty(global, 'performance', {
  writable: true,
  value: {
    now: jest.fn(() => Date.now()),
    mark: jest.fn(),
    measure: jest.fn(),
    getEntriesByName: jest.fn(() => []),
    getEntriesByType: jest.fn(() => []),
  },
});

// Mock fetch for API tests
global.fetch = jest.fn();

// Mock URL.createObjectURL for file upload tests
global.URL.createObjectURL = jest.fn(() => 'mocked-url');
global.URL.revokeObjectURL = jest.fn();

// Setup cleanup after each test
afterEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
  sessionStorage.clear();
});