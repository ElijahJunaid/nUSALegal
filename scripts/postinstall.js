import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isCI = process.env.CI === 'true';

const nitropackCorePath = path.join(__dirname, '../node_modules/nitropack/dist/core/index.mjs');
const nitropackCachePath = path.join(__dirname, '../node_modules/nitropack/dist/runtime/internal/cache.mjs');
const nitropackUtilsPath = path.join(__dirname, '../node_modules/nitropack/dist/runtime/internal/utils.mjs');
const nuxtNitroServerPath = path.join(__dirname, '../node_modules/@nuxt/nitro-server/dist/runtime/handlers/error.js');

// Patch Nitro's internal app to handle h3 v2 handlers
// TEMPORARILY DISABLED - wrapper causing 500 errors
/*
const nitroInternalAppPath = path.join(__dirname, '../node_modules/nitropack/dist/runtime/internal/app.mjs');
if (fs.existsSync(nitroInternalAppPath)) {
  let content = fs.readFileSync(nitroInternalAppPath, 'utf8');
  
  if (!content.includes('h3v2CompatWrapper')) {
    content = content.replace(
      /import \{ createApp \} from 'h3';/,
      "import { createApp, h3v2CompatWrapper } from 'h3';"
    );
    
    content = content.replace(
      /createApp\(([^)]*)\)/,
      "createApp($1, { handlerWrapper: h3v2CompatWrapper })"
    );
    
    fs.writeFileSync(nitroInternalAppPath, content);
    console.log('Patched Nitro internal app to handle h3 v2 handlers');
  }
}
*/

if (fs.existsSync(nitropackCorePath)) {
  let content = fs.readFileSync(nitropackCorePath, 'utf8');
  
  content = content.replace(
    /import \{ createError, getRequestURL, getRequestHeader, getResponseHeader, getRequestHeaders, setResponseHeaders, setResponseStatus, send, eventHandler, getRequestIP, toNodeListener, createApp, fromNodeMiddleware \} from 'h3';/,
    "import { createError, getRequestURL, getRequestHeader, getResponseHeader, getRequestHeaders, setResponseHeaders, setResponseStatus, eventHandler, getRequestIP, toNodeListener, createApp, fromNodeMiddleware } from 'h3';"
  );
  
  fs.writeFileSync(nitropackCorePath, content);
  console.log('Fixed h3 import in nitropack core');
}

if (fs.existsSync(nitropackCachePath)) {
  let content = fs.readFileSync(nitropackCachePath, 'utf8');
  
  content = content.replace(
    /import \{\s*defineEventHandler,\s*fetchWithEvent,\s*handleCacheHeaders,\s*isEvent,\s*splitCookiesString\s*\} from "h3";/,
    "import { defineEventHandler, fetchWithEvent, handleCacheHeaders, isEvent } from \"h3\";"
  );
  
  content = content.replace(
    /import \{\s*createEvent,\s*defineEventHandler,\s*fetchWithEvent,\s*handleCacheHeaders,\s*isEvent,\s*splitCookiesString\s*\} from "h3";/,
    "import { defineEventHandler, fetchWithEvent, handleCacheHeaders, isEvent } from \"h3\";"
  );
  
  fs.writeFileSync(nitropackCachePath, content);
  console.log('Fixed h3 import in nitropack cache');
}

if (fs.existsSync(nitropackUtilsPath)) {
  let content = fs.readFileSync(nitropackUtilsPath, 'utf8');
  
  content = content.replace(
    /import \{ splitCookiesString \} from "h3";/,
    "// import { splitCookiesString } from \"h3\"; // Removed - not available in h3 v2"
  );
  
  fs.writeFileSync(nitropackUtilsPath, content);
  console.log('Fixed h3 import in nitropack utils');
}

if (fs.existsSync(nuxtNitroServerPath)) {
  let content = fs.readFileSync(nuxtNitroServerPath, 'utf8');
  
  content = content.replace(
    /import \{ appendResponseHeader, getRequestHeaders, send, setResponseHeader, setResponseHeaders, setResponseStatus \} from "h3";/,
    "import { appendResponseHeader, getRequestHeaders, setResponseHeader, setResponseHeaders, setResponseStatus } from \"h3\";"
  );
  
  fs.writeFileSync(nuxtNitroServerPath, content);
  console.log('Fixed h3 import in @nuxt/nitro-server');
}

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