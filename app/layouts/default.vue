<template>
  <div class="drawer drawer-end">
    <input id="nusalegal-drawer" type="checkbox" class="drawer-toggle" />
    <div class="drawer-content">
      <div class="navbar custom-navbar">
        <div class="navbar-left">
          <NuxtLink to="/" class="app-name">{{ brandName }}</NuxtLink>
          <NuxtLink to="/game" class="game-icon" title="Play Game">🎮</NuxtLink>
        </div>

        <template v-if="!isHome">
          <div class="navbar-right">
            <div class="hidden lg:flex">
              <NuxtLink v-for="(menu, i) in menus" :key="i" :to="menu.to" class="nav-link">
                {{ menu.label }}
              </NuxtLink>
            </div>

            <div class="flex lg:hidden">
              <label for="nusalegal-drawer" aria-label="open sidebar" class="menu-toggle">
                <img src="/svg/menu.svg" alt="Menu" />
              </label>
            </div>
          </div>
        </template>
      </div>

      <div class="flex-1 p-6 flex gap-6 min-h-[calc(100vh-4rem)]">
        <div class="max-lg:hidden w-[30%] xl:w-[20%]">
          <slot name="sub-menu" />
        </div>

        <div class="w-full lg:w-[70%] xl:w-[60%] overflow-x-auto">
          <slot name="default" />
        </div>

        <div class="max-lg:hidden w-[20%]"></div>
      </div>
      <footer class="footer">
        <div class="footer-content">
          <div class="footer-section">
            <p class="footer-copyright">&copy; 2024 nUSA Legal</p>
            <p class="footer-disclaimer">THIS IS NOT REAL LIFE!</p>
          </div>
          <div class="footer-links">
            <a href="/legal" class="footer-link">Legal Resources</a>
            <a href="/game" class="footer-link">Games</a>
            <a href="/about" class="footer-link">About</a>
          </div>
        </div>
      </footer>

      <button
        @click="toggleTheme"
        @keydown.enter="toggleTheme"
        @keydown.space="toggleTheme"
        class="theme-toggle"
        aria-label="Toggle theme"
        :aria-pressed="theme === 'dark'"
      >
        <span v-if="theme === 'light'">☀️</span>
        <span v-else>🌙</span>
      </button>

      <ChatbotWidget />
    </div>
    <div class="drawer-side">
      <label for="nusalegal-drawer" aria-label="close sidebar" class="drawer-overlay"></label>
      <ul class="menu text-white!">
        <label for="nusalegal-drawer" aria-label="close sidebar" class="menu-toggle">
          <img src="/svg/close.svg" alt="Close" />
        </label>
        <template v-for="(menu, i) in menus" :key="i">
          <li>
            <NuxtLink :to="menu.to">{{ menu.label }}</NuxtLink>
          </li>
        </template>
      </ul>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router'
import { computed, ref, onMounted } from 'vue'

const route = useRoute()

const isHome = computed(() => route?.path == '/')

const brandName = computed(() => {
  if (!route?.path) return 'nUSA'
  if (route.path.startsWith('/legal')) return 'nUSA Legal'
  if (route.path.startsWith('/congress')) return 'nUSA Congress'
  if (route.path.startsWith('/docal')) return 'nUSA DOCAL'
  if (route.path.startsWith('/news')) return 'nUSA News'
  return 'nUSA'
})

interface Menu {
  to: string
  label: string
}

const sectionMenus: Menu[] = [
  {
    label: 'Legal',
    to: '/legal'
  },
  {
    label: 'Congress',
    to: '/congress'
  },
  {
    label: 'DOCAL',
    to: '/docal'
  },
  {
    label: 'News',
    to: '/news'
  }
]

const legalMenus: Menu[] = [
  {
    label: 'Courts',
    to: '/legal/courts'
  },
  {
    label: 'Bills',
    to: '/legal/bills'
  },
  {
    label: 'FRCP/FRCMP',
    to: '/legal/frcp-frcmp'
  },
  {
    label: 'Laws',
    to: '/legal/laws'
  },
  {
    label: 'Constitution',
    to: '/legal/constitution'
  },
  {
    label: 'Mock Trial',
    to: '/legal/mock-trial'
  }
]

const menus = computed<Menu[]>(() => {
  if (route.path.startsWith('/legal/')) return legalMenus
  return sectionMenus
})

const theme = ref<'light' | 'dark'>('light')

onMounted(() => {
  const savedTheme = localStorage.getItem('nusalegal-theme') as 'light' | 'dark' | null
  theme.value = savedTheme || 'light'
  document.documentElement.setAttribute('data-theme', theme.value)
})

const toggleTheme = () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
  localStorage.setItem('nusalegal-theme', theme.value)
  document.documentElement.setAttribute('data-theme', theme.value)
}
</script>

<style scoped>
.drawer-content {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.navbar.custom-navbar {
  background-color: rgba(51, 51, 51, 0.95);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  padding: 1rem 1.5rem;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.navbar-left {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-shrink: 0;
}

/* .navbar-right {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-shrink: 0;
}

.navbar-right>div {
  display: flex;
  gap: 0.75rem;
  align-items: center;
} */

.nav-link {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  transition: all 0.2s ease;
  white-space: nowrap;
  font-weight: 500;
}

.nav-link:hover {
  background-color: var(--color-shadow-hover);
  color: var(--color-accent-hover);
  transform: scale(1.05);
}

[data-theme='dark'] .nav-link {
  color: var(--color-accent-hover);
}

[data-theme='dark'] .nav-link:hover {
  color: var(--color-accent);
  background-color: var(--color-shadow-hover);
}

.app-name {
  font-size: 2rem;
  font-weight: 700;
  text-transform: none;
  white-space: nowrap;
  color: white;
  text-decoration: none;
  transition: all 0.3s ease;
}

.app-name:hover {
  color: var(--color-navbar-hover);
  text-decoration: underline;
  transform: scale(1.05);
}

.game-icon {
  font-size: 2rem;
  transition: transform 0.2s;
  white-space: nowrap;
  text-decoration: none;
}

.game-icon:hover {
  transform: scale(1.1);
}

.menu {
  background-color: rgba(51, 51, 51, 0.95) !important;
  color: oklch(var(--bc));
  min-height: 100%;
  width: 20rem;
  padding: 1rem;
}

.theme-toggle {
  position: fixed;
  bottom: 1rem;
  left: 1rem;
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background-color: oklch(var(--p));
  color: oklch(var(--pc));
  font-size: 1.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  z-index: 50;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.theme-toggle:hover {
  transform: scale(1.05);
}

.menu-toggle {
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 0.25rem;
}

.menu-toggle img {
  width: 28px;
  height: 28px;
}

.footer {
  background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
  border-top: 1px solid #374151;
  padding: 2rem 0;
  margin-top: auto;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 2rem;
}

.footer-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.footer-copyright {
  color: var(--color-text-inverse);
  font-size: 0.875rem;
  font-weight: 500;
  margin: 0;
}

.footer-disclaimer {
  color: var(--color-text-secondary);
  font-size: 0.75rem;
  font-style: italic;
  margin: 0;
}

.footer-links {
  display: flex;
  gap: 2rem;
  align-items: center;
}

.footer-link {
  color: var(--color-text-secondary);
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  transition: color 0.2s ease;
}

.footer-link:hover {
  color: var(--color-info);
  text-decoration: underline;
}

/* Light mode improvements */
@media (prefers-color-scheme: light) {
  .footer {
    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
    border-top: 1px solid #cbd5e1;
  }

  .footer-copyright {
    color: #1f2937;
  }

  .footer-disclaimer {
    color: #64748b;
  }

  .footer-link {
    color: #475569;
  }

  .footer-link:hover {
    color: #2563eb;
  }
}

/* Dark mode footer */
[data-theme='dark'] .footer {
  background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
  border-top: 1px solid #374151;
}

[data-theme='dark'] .footer-copyright {
  color: #f3f4f6;
}

[data-theme='dark'] .footer-disclaimer {
  color: #9ca3af;
}

[data-theme='dark'] .footer-link {
  color: #d1d5db;
}

[data-theme='dark'] .footer-link:hover {
  color: #60a5fa;
}

/* Responsive design */
@media (max-width: 768px) {
  .footer-content {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }

  .footer-links {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>
