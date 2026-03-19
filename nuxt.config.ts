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
    build: {
      sourcemap: false
    },
    server: {
      hmr: {
        clientPort: 8888
      }
    }
  },
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
    ]
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
