const fs = require('fs');
const path = require('path');

// Fix the h3 import issue in nitropack
const nitropackCorePath = path.join(__dirname, '../node_modules/nitropack/dist/core/index.mjs');

if (fs.existsSync(nitropackCorePath)) {
  let content = fs.readFileSync(nitropackCorePath, 'utf8');
  
  // Remove 'send' from the h3 import
  content = content.replace(
    /import \{ createError, getRequestURL, getRequestHeader, getResponseHeader, getRequestHeaders, setResponseHeaders, setResponseStatus, send, eventHandler, getRequestIP, toNodeListener, createApp, fromNodeMiddleware \} from 'h3';/,
    "import { createError, getRequestURL, getRequestHeader, getResponseHeader, getRequestHeaders, setResponseHeaders, setResponseStatus, eventHandler, getRequestIP, toNodeListener, createApp, fromNodeMiddleware } from 'h3';"
  );
  
  fs.writeFileSync(nitropackCorePath, content);
  console.log('Fixed h3 import in nitropack');
}
