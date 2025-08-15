// jest.config.cjs
/** @type {import('jest').Config} */
const config = {
  transform: {},
  testEnvironment: 'node',
  preset: '@shelf/jest-mongodb',
  setupFilesAfterEnv: ['./test/setup.js'],
  testTimeout: 60000, 
  clearMocks: true,
  testMatch: [
    '**/test/unit/**/*.test.js',
    '**/test/integration/**/*.test.js',
  ],
  // Add this section to force the download of a specific binary
  'mongodb-memory-server': {
    binary: {
      os: 'linux',
      arch: 'x64',
      version: '6.0.4', // Choose a version that is compatible with your RHEL-based OS
      // A version for RHEL 8 or 9 should work for modern Fedora versions
      // You may need to experiment with the version number
    },
  },
};

module.exports = config;