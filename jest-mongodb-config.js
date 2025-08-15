// Using CommonJS syntax for this config file is often more compatible with Jest runners
module.exports = {
  mongodbMemoryServerOptions: {
    binary: {
      // Pin to a specific, stable version of MongoDB
      version: '6.0.7',
      skipMD5: true,
    },
    // Ensure the instance starts automatically
    autoStart: false,
    instance: {},
  },
};
