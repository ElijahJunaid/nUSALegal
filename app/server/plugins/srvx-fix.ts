export default defineNitroPlugin((nitroApp) => {
  // Patch for srvx/node import issue in Netlify environment
  if (process.env.NETLIFY || process.env.NETLIFY_BUILD) {
    // Add a require hook to handle srvx/node imports
    const Module = require('module');
    const originalRequire = Module.prototype.require;
    
    Module.prototype.require = function(id) {
      if (id === 'srvx/node') {
        return originalRequire.call(this, 'srvx/dist/adapters/node.mjs');
      }
      return originalRequire.apply(this, arguments);
    };
  }
});
