import tailwindcss from '@tailwindcss/vite'
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@pinia/nuxt', '@nuxtjs/i18n'],
  i18n: {
    defaultLocale: 'en',
    locales: [{ code: 'en', language: 'en-US' }]
  },
  srcDir: 'app/',
  css: ['~/assets/css/main.css'],
  vite: {
    // @ts-ignore: dual-Vite version type mismatch between Nuxt internals and node_modules/vite
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: [
        '@vue/devtools-core',
        '@vue/devtools-kit',
        'web-vitals',
        '@sentry/vue',
        'dompurify',
        'marked',
        'marked-highlight',
        'highlight.js',
        'jspdf',
        'lucide-vue-next',
        'leaflet',
        'topojson-client',
        'globe.gl',
        'ably'
      ]
    },
    css: {
      postcss: {
        plugins: [
          {
            postcssPlugin: 'suppress-modern-css-warnings',
            // DaisyUI v5 uses mod()/round(to-zero,...) which PostCSS lexer cannot parse.
            // These are valid modern CSS but PostCSS emits noisy lexical warnings for them.
            // @ts-ignore: PostCSS plugin OnceExit typing
            OnceExit(
              _: unknown,
              { result }: { result: { messages: { type: string; text?: string }[] } }
            ) {
              result.messages = result.messages.filter(
                msg => !(msg.type === 'warning' && msg.text?.includes('Lexical error'))
              )
            }
          }
        ]
      }
    },
    build: {
      sourcemap: false
    },
    server: {
      hmr: {
        // When running through Netlify Dev proxy (port 8888 → 3001), tell the browser
        // to connect the HMR WebSocket to 8888 so it goes through the proxy.
        clientPort: process.env.NETLIFY || process.env.NETLIFY_DEV ? 8888 : undefined,
        host: '127.0.0.1'
      }
    }
  },
  // @ts-ignore — nitro dropped from NuxtConfig type in nuxt 4.4.2 + TypeScript 6 (type regression, config is valid)
  nitro: {
    preset: 'netlify',
    devServer: {
      watch: []
    },
    serverAssets: [
      {
        baseName: 'prisma',
        dir: 'prisma'
      }
    ],
    routeRules: {
      '/**': {
        headers: {
          'Content-Security-Policy':
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' blob: https://p.trellocdn.com https://cdn.jsdelivr.net; connect-src 'self' blob: ws: wss: https://o4510700106416128.ingest.us.sentry.io https://www.nusa.gg https://api.nusa.gg https://users.roblox.com https://www.roblox.com https://ingesteer.services-prod.nsvcs.net https://cdn.jsdelivr.net https://*.basemaps.cartocdn.com https://main.realtime.ably.net https://main.fallback.ably-realtime.com https://main.a.fallback.ably-realtime.com https://main.c.fallback.ably-realtime.com https://rest.ably.io https://realtime.ably.io; worker-src 'self' blob:; default-src 'self'; style-src 'self' 'unsafe-inline' https://unpkg.com; img-src 'self' data: blob: https://unpkg.com https://*.tile.openstreetmap.org https://*.basemaps.cartocdn.com https://tr.rbxcdn.com https://www.roblox.com https://cdn.discordapp.com https://images.roblox.com; font-src 'self' data:; frame-src 'self' https: data:; frame-ancestors 'self'; base-uri 'self'; form-action 'self'"
        }
      }
    }
  },
  typescript: {
    strict: false
  },
  app: {
    head: {
      meta: [
        {
          'http-equiv': 'X-Content-Type-Options',
          content: 'nosniff'
        },
        {
          'http-equiv': 'X-XSS-Protection',
          content: '1; mode=block'
        },
        {
          'http-equiv': 'Content-Security-Policy',
          content:
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' blob: https://p.trellocdn.com https://cdn.jsdelivr.net; connect-src 'self' blob: ws: wss: https://o4510700106416128.ingest.us.sentry.io https://www.nusa.gg https://api.nusa.gg https://users.roblox.com https://www.roblox.com https://ingesteer.services-prod.nsvcs.net https://cdn.jsdelivr.net https://*.basemaps.cartocdn.com https://main.realtime.ably.net https://main.fallback.ably-realtime.com https://main.a.fallback.ably-realtime.com https://main.c.fallback.ably-realtime.com https://rest.ably.io https://realtime.ably.io; worker-src 'self' blob:; default-src 'self'; style-src 'self' 'unsafe-inline' https://unpkg.com; img-src 'self' data: blob: https://unpkg.com https://*.tile.openstreetmap.org https://*.basemaps.cartocdn.com https://tr.rbxcdn.com https://www.roblox.com https://cdn.discordapp.com https://images.roblox.com; font-src 'self' data:; frame-src 'self' https: data:; base-uri 'self'; form-action 'self'"
        }
      ],
      link: [
        { rel: 'preconnect', href: 'https://api.openai.com' },
        { rel: 'preconnect', href: 'https://cdn.jsdelivr.net' },
        { rel: 'dns-prefetch', href: 'https://realtime.ably.io' },
        { rel: 'dns-prefetch', href: 'https://rest.ably.io' }
      ]
    }
  },
  runtimeConfig: {
    tokenSecret: process.env.TOKEN_SECRET || '',
    tokenExpiry: process.env.TOKEN_EXPIRY || '5',
    allowedOrigins: process.env.ALLOWED_ORIGINS || '',
    openaiApiKey: process.env.OPENAI_API_KEY || '',
    vectorStoreId: process.env.VECTOR_STORE_ID || '',
    assistantId: process.env.ASSISTANT_ID || '',
    tavilyApiKey: process.env.TAVILY_API_KEY || '',
    trelloApiKey: process.env.TRELLO_API_KEY || '',
    trelloToken: process.env.TRELLO_TOKEN || '',
    nusaApiKey: process.env.NUSA_API_KEY || '',
    public: {
      isShutdown: false,
      shutdownPage: '/shutdown',
      statusAdminKey: process.env.STATUS_ADMIN_KEY || '',
      sentryDsn: process.env.NUXT_PUBLIC_SENTRY_DSN || '',
      environment: process.env.NUXT_PUBLIC_ENVIRONMENT || process.env.NODE_ENV || 'production',
      sentrySampleRate: parseFloat(process.env.NUXT_PUBLIC_SENTRY_SAMPLE_RATE || '1.0')
    }
  }
})
