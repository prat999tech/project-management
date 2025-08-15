/** @type {import('jest').Config} */
const config = {
  testEnvironment: 'node',
  // Tell Jest to run our setup file before executing the tests.
  setupFilesAfterEnv: ['./test/setup.js'],
  // Increase the global timeout to 60 seconds to allow for slow DB startup
  testTimeout: 60000,
  clearMocks: true,
};

export default config;
