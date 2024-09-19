import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test
  // environment
  dir: './',
});

// Add any custom config to be passed to Jest
/** @type {import('jest').Config} */
const config = {
  /*
   * Add more setup options before each test is run
   */

  // Setup files to run before the test framework is installed in the environment
  setupFiles: ['<rootDir>/src/app/lib/testing/textcoderPolyfill.js'],
  // Setup files to run after the test framework has been installed in the environment.
  // setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],

  testEnvironment: 'jest-environment-jsdom',
  testPathIgnorePatterns: ['/node_modules/', '<rootDir>/src/e2e'],
  resetMocks: true,
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which
// is async
export default createJestConfig(config);
