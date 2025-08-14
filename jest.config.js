
// jest.config.js



  




  // jest.config.js

/** @type {import('jest').Config} */
const config = {
    // Add this empty transform object
    transform: {},
    
    testEnvironment: 'node',
    // Note: I see a small typo in your original config ('tests' vs 'test').
    // I've corrected it here to match your file structure.
    setupFilesAfterEnv: ['./test/setup.js'],
    testMatch: ['**/test/**/*.test.js'],
    testTimeout: 30000,
    clearMocks: true, 
  };
  
  export default config;
  
  
