import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

// Cleanup after each test
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

// Mock environment variables for tests
process.env.API_KEY = 'test-api-key';
process.env.DB_NAME = 'test_db';
process.env.DB_USER = 'test_user';
process.env.DB_PASS = 'test_password';
process.env.DB_HOST = 'localhost';
process.env.DB_PORT = '3306';

// Mock PrismJS for tests
const mockPrism = {
  highlight: vi.fn((code) => code),
  languages: {
    javascript: {},
    typescript: {},
    jsx: {},
    tsx: {},
    php: {},
    sql: {},
    yaml: {},
    bash: {},
  },
  highlightAll: vi.fn(),
};

(global as any).Prism = mockPrism;

vi.mock('prismjs', () => ({
  default: mockPrism,
}));


// Global test utilities can be added here
