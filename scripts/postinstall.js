#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isCI = process.env.CI === 'true';

// Fix the h3 import issues in nitropack
const nitropackCorePath = path.join(__dirname, '../node_modules/nitropack/dist/core/index.mjs');
const nitropackCachePath = path.join(__dirname, '../node_modules/nitropack/dist/runtime/internal/cache.mjs');
const nitropackUtilsPath = path.join(__dirname, '../node_modules/nitropack/dist/runtime/internal/utils.mjs');
const nuxtNitroServerPath = path.join(__dirname, '../node_modules/@nuxt/nitro-server/dist/runtime/handlers/error.js');

// Fix core/index.mjs - remove 'send' from h3 import
if (fs.existsSync(nitropackCorePath)) {
  let content = fs.readFileSync(nitropackCorePath, 'utf8');
  
  // Remove 'send' from the h3 import
  content = content.replace(
    /import \{ createError, getRequestURL, getRequestHeader, getResponseHeader, getRequestHeaders, setResponseHeaders, setResponseStatus, send, eventHandler, getRequestIP, toNodeListener, createApp, fromNodeMiddleware \} from 'h3';/,
    "import { createError, getRequestURL, getRequestHeader, getResponseHeader, getRequestHeaders, setResponseHeaders, setResponseStatus, eventHandler, getRequestIP, toNodeListener, createApp, fromNodeMiddleware } from 'h3';"
  );
  
  fs.writeFileSync(nitropackCorePath, content);
  console.log('Fixed h3 import in nitropack core');
}

// Fix cache.mjs - remove 'createEvent' and 'splitCookiesString' from h3 import
if (fs.existsSync(nitropackCachePath)) {
  let content = fs.readFileSync(nitropackCachePath, 'utf8');
  
  // Remove 'createEvent' and 'splitCookiesString' from the h3 import
  content = content.replace(
    /import \{\s*defineEventHandler,\s*fetchWithEvent,\s*handleCacheHeaders,\s*isEvent,\s*splitCookiesString\s*\} from "h3";/,
    "import { defineEventHandler, fetchWithEvent, handleCacheHeaders, isEvent } from \"h3\";"
  );
  
  // Also handle the original case with createEvent
  content = content.replace(
    /import \{\s*createEvent,\s*defineEventHandler,\s*fetchWithEvent,\s*handleCacheHeaders,\s*isEvent,\s*splitCookiesString\s*\} from "h3";/,
    "import { defineEventHandler, fetchWithEvent, handleCacheHeaders, isEvent } from \"h3\";"
  );
  
  fs.writeFileSync(nitropackCachePath, content);
  console.log('Fixed h3 import in nitropack cache');
}

// Fix utils.mjs - remove 'splitCookiesString' from h3 import
if (fs.existsSync(nitropackUtilsPath)) {
  let content = fs.readFileSync(nitropackUtilsPath, 'utf8');
  
  // Remove 'splitCookiesString' from the h3 import
  content = content.replace(
    /import \{ splitCookiesString \} from "h3";/,
    "// import { splitCookiesString } from \"h3\"; // Removed - not available in h3 v2"
  );
  
  fs.writeFileSync(nitropackUtilsPath, content);
  console.log('Fixed h3 import in nitropack utils');
}

// Fix @nuxt/nitro-server error.js - remove 'send' from h3 import
if (fs.existsSync(nuxtNitroServerPath)) {
  let content = fs.readFileSync(nuxtNitroServerPath, 'utf8');
  
  // Remove 'send' from the h3 import
  content = content.replace(
    /import \{ appendResponseHeader, getRequestHeaders, send, setResponseHeader, setResponseHeaders, setResponseStatus \} from "h3";/,
    "import { appendResponseHeader, getRequestHeaders, setResponseHeader, setResponseHeaders, setResponseStatus } from \"h3\";"
  );
  
  fs.writeFileSync(nuxtNitroServerPath, content);
  console.log('Fixed h3 import in @nuxt/nitro-server');
}

// Fix all other files with problematic h3 imports
function fixH3ImportsInDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) return;
  
  const files = fs.readdirSync(dirPath, { withFileTypes: true });
  
  for (const file of files) {
    const fullPath = path.join(dirPath, file.name);
    
    if (file.isDirectory()) {
      fixH3ImportsInDirectory(fullPath);
    } else if (file.name.endsWith('.mjs') || file.name.endsWith('.js')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let modified = false;
      
      // Remove 'send' from any h3 import
      if (content.includes('send') && content.includes('from "h3"')) {
        const originalContent = content;
        content = content.replace(
          /import \{([^}]*)send,([^}]*)\} from "h3";/g,
          (match, before, after) => {
            const cleanBefore = before.replace(/\s*,\s*$/, '').trim();
            const cleanAfter = after.replace(/^\s*,\s*/, '').trim();
            const imports = [cleanBefore, cleanAfter].filter(Boolean).join(', ');
            return `import { ${imports} } from "h3";`;
          }
        );
        
        if (content !== originalContent) {
          fs.writeFileSync(fullPath, content);
          console.log(`Fixed h3 import in ${fullPath}`);
          modified = true;
        }
      }
      
      // Remove 'createEvent' from any h3 import
      if (content.includes('createEvent') && content.includes('from "h3"')) {
        const originalContent = content;
        content = content.replace(
          /import \{([^}]*)createEvent,([^}]*)\} from "h3";/g,
          (match, before, after) => {
            const cleanBefore = before.replace(/\s*,\s*$/, '').trim();
            const cleanAfter = after.replace(/^\s*,\s*/, '').trim();
            const imports = [cleanBefore, cleanAfter].filter(Boolean).join(', ');
            return `import { ${imports} } from "h3";`;
          }
        );
        
        if (content !== originalContent) {
          fs.writeFileSync(fullPath, content);
          console.log(`Fixed createEvent import in ${fullPath}`);
          modified = true;
        }
      }
      
      // Remove 'splitCookiesString' from any h3 import
      if (content.includes('splitCookiesString') && content.includes('from "h3"')) {
        const originalContent = content;
        content = content.replace(
          /import \{([^}]*)splitCookiesString,([^}]*)\} from "h3";/g,
          (match, before, after) => {
            const cleanBefore = before.replace(/\s*,\s*$/, '').trim();
            const cleanAfter = after.replace(/^\s*,\s*/, '').trim();
            const imports = [cleanBefore, cleanAfter].filter(Boolean).join(', ');
            return `import { ${imports} } from "h3";`;
          }
        );
        
        // Also handle single import case
        content = content.replace(
          /import \{ splitCookiesString \} from "h3";/g,
          "// import { splitCookiesString } from \"h3\"; // Removed - not available in h3 v2"
        );
        
        if (content !== originalContent) {
          fs.writeFileSync(fullPath, content);
          console.log(`Fixed splitCookiesString import in ${fullPath}`);
          modified = true;
        }
      }
    }
  }
}

// Fix all h3 imports in nitropack and @nuxt directories
fixH3ImportsInDirectory(path.join(__dirname, '../node_modules/nitropack'));
fixH3ImportsInDirectory(path.join(__dirname, '../node_modules/@nuxt/nitro-server'));

if (isCI) {
  console.log('Skipping nuxt prepare in CI');
} else {
  console.log('Running nuxt prepare...');
  try {
    execSync('nuxt prepare', { stdio: 'inherit' });
    console.log('Nuxt prepare completed successfully');
  } catch (error) {
    console.error('Nuxt prepare failed:', error.message);
    process.exit(1);
  }
}
