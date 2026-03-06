import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import pluginTypeScript from '@typescript-eslint/eslint-plugin'
import parserTypeScript from '@typescript-eslint/parser'
import vueParser from 'vue-eslint-parser'
import prettierConfig from 'eslint-config-prettier'
import prettierPlugin from 'eslint-plugin-prettier'

export default [
  js.configs.recommended,
  prettierConfig,
  {
    files: ['**/*.{js,mjs,cjs,ts,vue}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        console: 'readonly',
        process: 'readonly',
        defineProps: 'readonly',
        defineEmits: 'readonly',
        defineExpose: 'readonly',
        withDefaults: 'readonly',
        defineNuxtRouteMiddleware: 'readonly',
        useRuntimeConfig: 'readonly',
        navigateTo: 'readonly',
        abortNavigation: 'readonly',
        createError: 'readonly',
        showError: 'readonly',
        clearError: 'readonly',
        $fetch: 'readonly',
        useNuxtApp: 'readonly',
        Buffer: 'readonly',
        TextDecoder: 'readonly',
        TextEncoder: 'readonly',
        fetch: 'readonly',
        URL: 'readonly',
        URLSearchParams: 'readonly',
        AbortSignal: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        NodeJS: 'readonly'
      }
    },
    plugins: {
      '@typescript-eslint': pluginTypeScript,
      prettier: prettierPlugin
    },
    rules: {
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'prefer-const': 'error',
      'no-var': 'error',
      'prettier/prettier': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_'
        }
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off'
    }
  },
  {
    files: ['app/**/*.{ts,vue}', 'app/plugins/**/*.ts'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        console: 'readonly',
        process: 'readonly',
        defineProps: 'readonly',
        defineEmits: 'readonly',
        defineExpose: 'readonly',
        withDefaults: 'readonly',
        defineNuxtRouteMiddleware: 'readonly',
        useRuntimeConfig: 'readonly',
        navigateTo: 'readonly',
        abortNavigation: 'readonly',
        createError: 'readonly',
        showError: 'readonly',
        clearError: 'readonly',
        $fetch: 'readonly',
        useNuxtApp: 'readonly',
        window: 'readonly',
        document: 'readonly',
        localStorage: 'readonly',
        sessionStorage: 'readonly',
        navigator: 'readonly',
        location: 'readonly',
        history: 'readonly',
        Event: 'readonly',
        MouseEvent: 'readonly',
        KeyboardEvent: 'readonly',
        HTMLElement: 'readonly',
        HTMLInputElement: 'readonly',
        HTMLCanvasElement: 'readonly',
        HTMLImageElement: 'readonly',
        XMLHttpRequest: 'readonly',
        WebSocket: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        NodeJS: 'readonly',
        definePageMeta: 'readonly',
        useHead: 'readonly',
        onMounted: 'readonly',
        computed: 'readonly',
        watch: 'readonly',
        alert: 'readonly'
      }
    }
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: parserTypeScript,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        project: false
      }
    },
    plugins: {
      '@typescript-eslint': pluginTypeScript
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_'
        }
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off'
    }
  },
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: parserTypeScript,
        ecmaVersion: 2022,
        sourceType: 'module'
      }
    },
    plugins: {
      vue: pluginVue,
      '@typescript-eslint': pluginTypeScript,
      prettier: prettierPlugin
    },
    rules: {
      'vue/multi-word-component-names': 'off',
      'vue/no-v-html': 'warn',
      'vue/require-default-prop': 'off',
      'vue/require-explicit-emits': 'off',
      'prettier/prettier': 'error'
    }
  },
  {
    files: ['postcss.config.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module'
    }
  },
  {
    files: ['scripts/**/*.js', '*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'commonjs',
      globals: {
        console: 'readonly',
        process: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        module: 'readonly',
        require: 'readonly',
        exports: 'readonly',
        global: 'readonly'
      }
    }
  },
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      '.nuxt/**',
      '.output/**',
      '.env*',
      '!.env.example',
      'coverage/**',
      '**/*.min.js',
      '**/*.min.css',
      'public/**',
      'health-check-results.txt',
      'server/bills/**',
      '**/*.d.ts',
      '.vscode/**',
      '.husky/**',
      '.windsurf/**',
      'eslint.config.js',
      'scripts/dev-health-check.cjs',
      'server/data/**',
      '**/*.pdf',
      '**/*.doc',
      '**/*.docx',
      '**/*.xls',
      '**/*.xlsx',
      '**/*.ppt',
      '**/*.pptx',
      '**/*.zip',
      '**/*.tar',
      '**/*.gz',
      '**/*.rar'
    ]
  }
]
