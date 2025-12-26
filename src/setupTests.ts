// Jest setup file for testing environment
// This file is run before each test file

// Mock environment variables for testing
process.env.VITE_GEMINI_API_KEY = 'test-api-key-123'
process.env.VITE_API_URL = 'http://localhost:3002'

// Mock import.meta for Jest environment
Object.defineProperty(globalThis, 'import', {
  value: {
    meta: {
      env: {
        VITE_GEMINI_API_KEY: 'test-api-key-123',
        VITE_API_URL: 'http://localhost:3002',
        VITE_APP_TITLE: 'SmartApply AI Test',
        VITE_APP_DESCRIPTION: 'Test Environment',
        PROD: false,
        DEV: true
      }
    }
  }
})

// Global test utilities and mocks can be added here
global.console = {
  ...console,
  // Suppress console.log in tests unless needed
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn()
}