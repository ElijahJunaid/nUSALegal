import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const isCI = process.env.CI === 'true'

try {
  const nitropackCorePath = path.join(__dirname, '../node_modules/nitropack/dist/core/index.mjs')
  const nitropackCachePath = path.join(
    __dirname,
    '../node_modules/nitropack/dist/runtime/internal/cache.mjs'
  )
  const nitropackUtilsPath = path.join(
    __dirname,
    '../node_modules/nitropack/dist/runtime/internal/utils.mjs'
  )
  const nuxtNitroServerPath = path.join(
    __dirname,
    '../node_modules/@nuxt/nitro-server/dist/runtime/handlers/error.js'
  )

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
    let content = fs.readFileSync(nitropackCorePath, 'utf8')

    content = content.replace(
      /import \{ createError, getRequestURL, getRequestHeader, getResponseHeader, getRequestHeaders, setResponseHeaders, setResponseStatus, send, eventHandler, getRequestIP, toNodeListener, createApp, fromNodeMiddleware \} from 'h3';/,
      "import { createError, getRequestURL, getRequestHeader, getResponseHeader, getRequestHeaders, setResponseHeaders, setResponseStatus, eventHandler, getRequestIP, toNodeListener, createApp, fromNodeMiddleware } from 'h3';"
    )

    fs.writeFileSync(nitropackCorePath, content)
    console.log('Fixed h3 import in nitropack core')
  }

  if (fs.existsSync(nitropackCachePath)) {
    let content = fs.readFileSync(nitropackCachePath, 'utf8')

    content = content.replace(
      /import \{\s*defineEventHandler,\s*fetchWithEvent,\s*handleCacheHeaders,\s*isEvent,\s*splitCookiesString\s*\} from "h3";/,
      'import { defineEventHandler, fetchWithEvent, handleCacheHeaders, isEvent } from "h3";'
    )

    content = content.replace(
      /import \{\s*createEvent,\s*defineEventHandler,\s*fetchWithEvent,\s*handleCacheHeaders,\s*isEvent,\s*splitCookiesString\s*\} from "h3";/,
      'import { defineEventHandler, fetchWithEvent, handleCacheHeaders, isEvent } from "h3";'
    )

    fs.writeFileSync(nitropackCachePath, content)
    console.log('Fixed h3 import in nitropack cache')
  }

  if (fs.existsSync(nitropackUtilsPath)) {
    let content = fs.readFileSync(nitropackUtilsPath, 'utf8')

    content = content.replace(
      /import \{ splitCookiesString \} from "h3";/,
      '// import { splitCookiesString } from "h3"; // Removed - not available in h3 v2'
    )

    // Inject inline splitCookiesString if it's called but not yet defined.
    // Idempotent: skipped if function is already present (e.g. re-run after first install).
    if (
      content.includes('splitCookiesString') &&
      !content.includes('function splitCookiesString')
    ) {
      const inlineSplitCookiesString = `
// Inline implementation: h3 v2 no longer exports splitCookiesString
function splitCookiesString(cookiesString) {
  if (Array.isArray(cookiesString)) {
    return cookiesString.flatMap((c) => splitCookiesString(c));
  }
  if (typeof cookiesString !== "string") {
    return [];
  }
  const cookiesStrings = [];
  let pos = 0, start, ch, lastComma, nextStart, cookiesSeparatorFound;
  function skipWhitespace() {
    while (pos < cookiesString.length && /\\s/.test(cookiesString.charAt(pos))) { pos += 1; }
    return pos < cookiesString.length;
  }
  function notSpecialChar() {
    ch = cookiesString.charAt(pos);
    return ch !== "=" && ch !== ";" && ch !== ",";
  }
  while (pos < cookiesString.length) {
    start = pos;
    cookiesSeparatorFound = false;
    while (skipWhitespace()) {
      ch = cookiesString.charAt(pos);
      if (ch === ",") {
        lastComma = pos; pos += 1; skipWhitespace(); nextStart = pos;
        while (pos < cookiesString.length && notSpecialChar()) { pos += 1; }
        if (pos < cookiesString.length && cookiesString.charAt(pos) === "=") {
          cookiesSeparatorFound = true;
          pos = nextStart;
          cookiesStrings.push(cookiesString.substring(start, lastComma));
          start = pos;
        } else { pos = lastComma + 1; }
      } else { pos += 1; }
    }
    if (!cookiesSeparatorFound || pos >= cookiesString.length) {
      cookiesStrings.push(cookiesString.substring(start, cookiesString.length));
    }
  }
  return cookiesStrings;
}
`
      content = content.replace(
        'export function normalizeCookieHeader(',
        inlineSplitCookiesString + 'export function normalizeCookieHeader('
      )
    }

    fs.writeFileSync(nitropackUtilsPath, content)
    console.log('Fixed h3 import in nitropack utils')
  }

  if (fs.existsSync(nuxtNitroServerPath)) {
    let content = fs.readFileSync(nuxtNitroServerPath, 'utf8')

    content = content.replace(
      /import \{ appendResponseHeader, getRequestHeaders, send, setResponseHeader, setResponseHeaders, setResponseStatus \} from "h3";/,
      'import { appendResponseHeader, getRequestHeaders, setResponseHeader, setResponseHeaders, setResponseStatus } from "h3";'
    )

    fs.writeFileSync(nuxtNitroServerPath, content)
    console.log('Fixed h3 import in @nuxt/nitro-server')
  }

  function fixH3ImportsInDirectory(dirPath) {
    if (!fs.existsSync(dirPath)) return

    const files = fs.readdirSync(dirPath, { withFileTypes: true })

    for (const file of files) {
      const fullPath = path.join(dirPath, file.name)

      if (file.isDirectory()) {
        fixH3ImportsInDirectory(fullPath)
      } else if (file.name.endsWith('.mjs') || file.name.endsWith('.js')) {
        let content = fs.readFileSync(fullPath, 'utf8')

        if (content.includes('send') && content.includes('from "h3"')) {
          const originalContent = content
          content = content.replace(
            /import \{([^}]*)send,([^}]*)\} from "h3";/g,
            (match, before, after) => {
              const cleanBefore = before.replace(/\s*,\s*$/, '').trim()
              const cleanAfter = after.replace(/^\s*,\s*/, '').trim()
              const imports = [cleanBefore, cleanAfter].filter(Boolean).join(', ')
              return `import { ${imports} } from "h3";`
            }
          )

          if (content !== originalContent) {
            fs.writeFileSync(fullPath, content)
            console.log(`Fixed h3 import in ${fullPath}`)
          }
        }

        if (content.includes('createEvent') && content.includes('from "h3"')) {
          const originalContent = content
          content = content.replace(
            /import \{([^}]*)createEvent,([^}]*)\} from "h3";/g,
            (match, before, after) => {
              const cleanBefore = before.replace(/\s*,\s*$/, '').trim()
              const cleanAfter = after.replace(/^\s*,\s*/, '').trim()
              const imports = [cleanBefore, cleanAfter].filter(Boolean).join(', ')
              return `import { ${imports} } from "h3";`
            }
          )

          if (content !== originalContent) {
            fs.writeFileSync(fullPath, content)
            console.log(`Fixed createEvent import in ${fullPath}`)
          }
        }

        if (content.includes('splitCookiesString') && content.includes('from "h3"')) {
          const originalContent = content
          content = content.replace(
            /import \{([^}]*)splitCookiesString,([^}]*)\} from "h3";/g,
            (match, before, after) => {
              const cleanBefore = before.replace(/\s*,\s*$/, '').trim()
              const cleanAfter = after.replace(/^\s*,\s*/, '').trim()
              const imports = [cleanBefore, cleanAfter].filter(Boolean).join(', ')
              return `import { ${imports} } from "h3";`
            }
          )

          content = content.replace(
            /import \{ splitCookiesString \} from "h3";/g,
            '// import { splitCookiesString } from "h3"; // Removed - not available in h3 v2'
          )

          if (content !== originalContent) {
            fs.writeFileSync(fullPath, content)
            console.log(`Fixed splitCookiesString import in ${fullPath}`)
          }
        }
      }
    }
  }

  fixH3ImportsInDirectory(path.join(__dirname, '../node_modules/nitropack'))
  fixH3ImportsInDirectory(path.join(__dirname, '../node_modules/@nuxt/nitro-server'))

  // Patch call sites: send() was removed in h3 v2. Nitro's defineNitroErrorHandler
  // sends the return value automatically, so returning the body directly is correct.
  const nitropackErrorDevPath = path.join(
    __dirname,
    '../node_modules/nitropack/dist/runtime/internal/error/dev.mjs'
  )
  if (fs.existsSync(nitropackErrorDevPath)) {
    let content = fs.readFileSync(nitropackErrorDevPath, 'utf8')
    const original = content
    content = content.replace(
      'return send(\n      event,\n      typeof res.body === "string" ? res.body : JSON.stringify(res.body, null, 2)\n    );',
      'return typeof res.body === "string" ? res.body : JSON.stringify(res.body, null, 2);'
    )
    if (content !== original) {
      fs.writeFileSync(nitropackErrorDevPath, content)
      console.log('Fixed send() call in nitropack error/dev.mjs')
    }
  }

  const nitropackErrorProdPath = path.join(
    __dirname,
    '../node_modules/nitropack/dist/runtime/internal/error/prod.mjs'
  )
  if (fs.existsSync(nitropackErrorProdPath)) {
    let content = fs.readFileSync(nitropackErrorProdPath, 'utf8')
    const original = content
    content = content.replace(/return send\(event,\s*(JSON\.stringify[^)]+\))\);/, 'return $1;')
    if (content !== original) {
      fs.writeFileSync(nitropackErrorProdPath, content)
      console.log('Fixed send() call in nitropack error/prod.mjs')
    }
  }

  if (isCI) {
    console.log('Skipping nuxt prepare in CI')
  } else {
    console.log('Running nuxt prepare...')
    try {
      execSync('nuxt prepare', { stdio: 'inherit' })
      console.log('Nuxt prepare completed successfully')
    } catch (error) {
      console.warn('Nuxt prepare failed (non-fatal):', error.message)
    }
  }
} catch (error) {
  console.warn('h3 fallback patch encountered an error (non-fatal):', error.message)
}
