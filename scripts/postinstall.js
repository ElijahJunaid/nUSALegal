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

    content = content.replace(
      '      const event = createEvent(reqProxy, resProxy);',
      '      const event = Object.create(Object.getPrototypeOf(incomingEvent), Object.getOwnPropertyDescriptors(incomingEvent));\n      event.node = { ...incomingEvent.node, req: reqProxy, res: resProxy };'
    )

    if (
      content.includes('splitCookiesString') &&
      !content.includes('function splitCookiesString')
    ) {
      const polyfill = `\n// Inline polyfill: splitCookiesString removed in h3 v2\nfunction splitCookiesString(cookiesString) {\n  if (Array.isArray(cookiesString)) { return cookiesString.flatMap((c) => splitCookiesString(c)); }\n  if (typeof cookiesString !== "string") { return []; }\n  const cookiesStrings = [];\n  let pos = 0, start, ch, lastComma, nextStart, cookiesSeparatorFound;\n  function skipWhitespace() { while (pos < cookiesString.length && /\\s/.test(cookiesString.charAt(pos))) { pos += 1; } return pos < cookiesString.length; }\n  function notSpecialChar() { ch = cookiesString.charAt(pos); return ch !== "=" && ch !== ";" && ch !== ","; }\n  while (pos < cookiesString.length) {\n    start = pos; cookiesSeparatorFound = false;\n    while (skipWhitespace()) {\n      ch = cookiesString.charAt(pos);\n      if (ch === ",") {\n        lastComma = pos; pos += 1; skipWhitespace(); nextStart = pos;\n        while (pos < cookiesString.length && notSpecialChar()) { pos += 1; }\n        if (pos < cookiesString.length && cookiesString.charAt(pos) === "=") {\n          cookiesSeparatorFound = true; pos = nextStart;\n          cookiesStrings.push(cookiesString.substring(start, lastComma)); start = pos;\n        } else { pos = lastComma + 1; }\n      } else { pos += 1; }\n    }\n    if (!cookiesSeparatorFound || pos >= cookiesString.length) { cookiesStrings.push(cookiesString.substring(start, cookiesString.length)); }\n  }\n  return cookiesStrings;\n}\n`
      content = content.replace(/^(import \{[^}]+\} from "h3";)/m, `$1${polyfill}`)
    }

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

  const _sendShim =
    'function send(event, body) { var res = event && event.node && event.node.res; if (res && !res.writableEnded) { res.end(typeof body === "string" || (typeof Buffer !== "undefined" && Buffer.isBuffer(body)) ? body : String(body)); } }'

  // Inject send() shim into nitropack/dist/runtime/internal/renderer.mjs
  // fixH3ImportsInDirectory removes send from imports but call sites remain — this is the ECONNRESET root cause
  const nitropackRendererPath = path.join(
    __dirname,
    '../node_modules/nitropack/dist/runtime/internal/renderer.mjs'
  )
  if (fs.existsSync(nitropackRendererPath)) {
    let content = fs.readFileSync(nitropackRendererPath, 'utf8')
    const original = content
    if (!content.includes('function send(event, body)')) {
      content = content.replace(/^(export function defineRenderHandler)/m, `${_sendShim}\n$1`)
    }
    if (content !== original) {
      fs.writeFileSync(nitropackRendererPath, content)
      console.log('Injected send() shim into nitropack/dist/runtime/internal/renderer.mjs')
    }
  }

  // Inject send() shim into @nuxt/nitro-server error.mjs (h3 v2 removed send(); shim writes via node res)
  const nuxtNitroServerMjsPath = path.join(
    __dirname,
    '../node_modules/@nuxt/nitro-server/dist/runtime/handlers/error.mjs'
  )
  if (fs.existsSync(nuxtNitroServerMjsPath)) {
    let content = fs.readFileSync(nuxtNitroServerMjsPath, 'utf8')
    const original = content
    if (!content.includes('function send(event, body)')) {
      content = content.replace(
        /^(export default \(async function errorhandler)/m,
        `${_sendShim}\n$1`
      )
    }
    if (content !== original) {
      fs.writeFileSync(nuxtNitroServerMjsPath, content)
      console.log('Injected send() shim into @nuxt/nitro-server error.mjs')
    }
  }

  // Inject send() shim into nitropack/dist/runtime/error.mjs (send never imported there)
  const nitropackRuntimeErrorPath = path.join(
    __dirname,
    '../node_modules/nitropack/dist/runtime/error.mjs'
  )
  if (fs.existsSync(nitropackRuntimeErrorPath)) {
    let content = fs.readFileSync(nitropackRuntimeErrorPath, 'utf8')
    const original = content
    if (!content.includes('function send(event, body)')) {
      content = content.replace(/^(export default defineNitroErrorHandler)/m, `${_sendShim}\n$1`)
    }
    if (content !== original) {
      fs.writeFileSync(nitropackRuntimeErrorPath, content)
      console.log('Injected send() shim into nitropack/dist/runtime/error.mjs')
    }
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

  // Patch h3 v2 utilities to be backwards-compatible with h3 v1-style events.
  // nitropack bundles its own h3 v1.15.10 and uses it to create events where
  // event.req is a Node.js IncomingMessage (not a Web Request). h3 v2 utilities
  // like getRequestHeader / getQuery expect a Web Request on event.req and crash.
  const h3DistDir = path.join(__dirname, '../node_modules/h3/dist')
  if (fs.existsSync(h3DistDir)) {
    const h3Files = fs
      .readdirSync(h3DistDir)
      .filter(f => f.endsWith('.mjs') && !f.startsWith('_') && f !== 'tracing.mjs')
    for (const fname of h3Files) {
      const fpath = path.join(h3DistDir, fname)
      let content = fs.readFileSync(fpath, 'utf8')
      if (!content.includes('function getRequestHeader')) continue

      const original = content

      // Patch getRequestHeader: fall back to plain object headers when event.req
      // is a Node.js IncomingMessage (no Headers.get() method).
      content = content.replace(
        'function getRequestHeader(event, name) {\n\treturn event.req.headers.get(name) || void 0;\n}',
        'function getRequestHeader(event, name) {\n\tif (typeof event.req?.headers?.get === "function") {\n\t\treturn event.req.headers.get(name) || void 0;\n\t}\n\treturn event.node?.req?.headers?.[name.toLowerCase()] || event.req?.headers?.[name.toLowerCase()] || void 0;\n}'
      )

      // Patch getQuery: fall back to node req url (path-only) with a synthetic base
      // when event.url is absent and event.req.url is not a full URL.
      content = content.replace(
        'function getQuery(event) {\n\treturn parseQuery((event.url || new URL(event.req.url)).search.slice(1));\n}',
        'function getQuery(event) {\n\tif (event.url) return parseQuery(event.url.search.slice(1));\n\tconst rawUrl = event.req?.url || event.node?.req?.url || "/";\n\tconst base = rawUrl.startsWith("http") ? undefined : "http://localhost";\n\treturn parseQuery(new URL(rawUrl, base).search.slice(1));\n}'
      )

      // Patch readBody: three-way fallback for h3 v1 events where event.req is not a Web Request.
      // Case A (fresh install): replaces original h3 v2 readBody.
      // Case B (upgrade): replaces previous partial patch on already-patched dev machine.
      const _readBodyImproved =
        'async function readBody(event) {\n\tlet text;\n\tif (typeof event.req?.text === "function") {\n\t\ttext = await event.req.text();\n\t} else if (event.req?.body && typeof event.req.body.getReader === "function") {\n\t\ttext = await new Response(event.req.body).text();\n\t} else {\n\t\tconst _nodeReq = event.node?.req || event.req;\n\t\tif (_nodeReq && typeof _nodeReq.on === "function") {\n\t\t\ttext = await new Promise((resolve, reject) => { const _chunks = []; _nodeReq.on("data", (c) => _chunks.push(c)); _nodeReq.on("end", () => resolve(Buffer.concat(_chunks.map((c) => Buffer.isBuffer(c) ? c : Buffer.from(c))).toString("utf-8"))); _nodeReq.on("error", reject); });\n\t\t} else {\n\t\t\treturn undefined;\n\t\t}\n\t}\n\tif (!text) return;\n\tconst _readBodyCT = typeof event.req?.headers?.get === "function" ? event.req.headers.get("content-type") || "" : event.node?.req?.headers?.["content-type"] || event.req?.headers?.["content-type"] || "";\n\tif (_readBodyCT.startsWith("application/x-www-form-urlencoded")) return parseURLEncodedBody(text);'
      content = content.replace(
        'async function readBody(event) {\n\tconst text = await event.req.text();\n\tif (!text) return;\n\tif ((event.req.headers.get("content-type") || "").startsWith("application/x-www-form-urlencoded")) return parseURLEncodedBody(text);',
        _readBodyImproved
      )
      content = content.replace(
        'async function readBody(event) {\n\tlet text;\n\tif (typeof event.req?.text === "function") {\n\t\ttext = await event.req.text();\n\t} else if (event.req?.body) {\n\t\ttext = await new Response(event.req.body).text();\n\t} else {\n\t\treturn undefined;\n\t}\n\tif (!text) return;\n\tconst _readBodyCT = typeof event.req?.headers?.get === "function" ? event.req.headers.get("content-type") || "" : event.node?.req?.headers?.["content-type"] || event.req?.headers?.["content-type"] || "";\n\tif (_readBodyCT.startsWith("application/x-www-form-urlencoded")) return parseURLEncodedBody(text);',
        _readBodyImproved
      )

      if (content !== original) {
        fs.writeFileSync(fpath, content)
        console.log(`Patched h3 v2 event compatibility in ${fname}`)
      }
    }
  }

  // Patch @typescript-eslint peer dep range to support TypeScript 6+
  const tsEslintPackages = [
    '../node_modules/@typescript-eslint/eslint-plugin/package.json',
    '../node_modules/@typescript-eslint/parser/package.json',
    '../node_modules/@typescript-eslint/typescript-estree/package.json',
    '../node_modules/@typescript-eslint/type-utils/package.json'
  ]
  for (const pkgRelPath of tsEslintPackages) {
    const pkgPath = path.join(__dirname, pkgRelPath)
    if (!fs.existsSync(pkgPath)) continue
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'))
    let changed = false
    if (pkg.peerDependencies?.typescript && pkg.peerDependencies.typescript.includes('<6.0.0')) {
      pkg.peerDependencies.typescript = pkg.peerDependencies.typescript.replace('<6.0.0', '<7.0.0')
      changed = true
    }
    if (
      pkg.peerDependenciesMeta?.typescript &&
      pkg.peerDependencies?.typescript?.includes('<6.0.0')
    ) {
      pkg.peerDependencies.typescript = pkg.peerDependencies.typescript.replace('<6.0.0', '<7.0.0')
      changed = true
    }
    if (changed) {
      fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2))
      console.log(`Patched TypeScript peer dep range in ${path.basename(path.dirname(pkgPath))}`)
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
