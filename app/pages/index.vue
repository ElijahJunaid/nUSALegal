<template>
  <div class="min-h-screen bg-base-200" :data-theme="theme">
    <div class="navbar bg-base-100 shadow-lg px-6 py-6">
      <div class="navbar-start">
        <NuxtLink to="/" class="text-4xl font-bold text-primary normal-case">nUSA</NuxtLink>
        <NuxtLink
          to="/game"
          class="ml-6 text-3xl hover:scale-110 transition-transform"
          title="Play Game"
        >
          🎮
        </NuxtLink>
      </div>
    </div>

    <section class="p-8">
      <div class="w-full max-w-5xl mx-auto">
        <div class="text-center mb-10">
          <h1 class="text-5xl font-bold mb-3">nUSA</h1>
          <p class="text-lg opacity-70">Select a section to get started</p>
        </div>

        <div class="grid md:grid-cols-2 gap-8 mb-10">
          <NuxtLink to="/legal" class="section-card group">
            <div class="section-icon">⚖️</div>
            <h2 class="section-title">Legal</h2>
            <p class="section-desc">
              Courts, Bills, Laws, FRCP/FRCMP, Constitution &amp; Mock Trial
            </p>
          </NuxtLink>

          <NuxtLink to="/congress" class="section-card group">
            <div class="section-icon">🏛️</div>
            <h2 class="section-title">Congress</h2>
            <p class="section-desc">Senators, Representatives &amp; Congressional members</p>
          </NuxtLink>

          <NuxtLink to="/docal" class="section-card group">
            <div class="section-icon">📋</div>
            <h2 class="section-title">DOCAL</h2>
            <p class="section-desc">Department of Commerce and Labor</p>
          </NuxtLink>

          <NuxtLink to="/news" class="section-card group">
            <div class="section-icon">📰</div>
            <h2 class="section-title">News</h2>
            <p class="section-desc">Federal &amp; local news and announcements</p>
          </NuxtLink>

          <NuxtLink to="/parties" class="section-card group">
            <div class="section-icon">🎭</div>
            <h2 class="section-title">Parties</h2>
            <p class="section-desc">Forward Party &amp; Pioneer Party</p>
          </NuxtLink>

          <NuxtLink to="/un" class="section-card group">
            <div class="section-icon">🌐</div>
            <h2 class="section-title">United Nations</h2>
            <p class="section-desc">Dept. of State &amp; Diplomatic Relations</p>
          </NuxtLink>
        </div>

        <div class="card shadow-lg bg-base-100">
          <div class="card-body p-8 text-center">
            <p class="text-sm text-center">
              As of March 11th, 2026
              <br />
              Total Website Cost: too high
            </p>
            <p class="text-xs mt-4 text-center">
              &copy; 2024 nUSA Legal
              <br />
              THIS IS NOT REAL LIFE!
            </p>
          </div>
        </div>
      </div>
    </section>

    <button
      @click="toggleTheme"
      class="fixed bottom-4 left-4 btn btn-circle btn-primary text-2xl shadow-lg z-50"
    >
      <span v-if="theme === 'light'">☀️</span>
      <span v-else>🌙</span>
    </button>

    <ChatbotWidget />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeMount, onBeforeUnmount, onUnmounted } from 'vue'
import { dLog } from '~/plugins/debug-logger.client'

definePageMeta({
  layout: false
})

const theme = ref<'light' | 'dark'>('light')

onBeforeMount(() => {
  dLog('[HOME] onBeforeMount')
})

onMounted(() => {
  dLog('[HOME] onMounted')
})

onBeforeUnmount(() => {
  dLog('[HOME] onBeforeUnmount')
})

onUnmounted(() => {
  dLog('[HOME] onUnmounted')
})

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

useHead({
  title: 'nUSA Legal',
  meta: [
    {
      name: 'description',
      content: 'Your go-to source for legal information and resources in nUSA P.S ROBLOX ROLEPLAY.'
    }
  ]
})
</script>

<style scoped>
.section-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 2.5rem 2rem;
  border-radius: 1rem;
  background-color: oklch(var(--b1));
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  text-decoration: none;
  transition: all 0.2s ease;
  border: 2px solid transparent;
  cursor: pointer;
}

.section-card:hover {
  border-color: oklch(var(--p));
  transform: translateY(-4px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.15);
}

.section-icon {
  font-size: 3rem;
  line-height: 1;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: oklch(var(--bc));
}

.section-desc {
  font-size: 0.9rem;
  opacity: 0.65;
  text-align: center;
  color: oklch(var(--bc));
}
</style>
