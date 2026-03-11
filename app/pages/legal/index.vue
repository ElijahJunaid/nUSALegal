<template>
  <div class="min-h-screen bg-base-200" :data-theme="theme">
    <div class="navbar bg-base-100 shadow-lg px-6 py-6">
      <div class="navbar-start">
        <NuxtLink to="/" class="text-4xl font-bold text-primary normal-case">nUSA Legal</NuxtLink>
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
      <div class="w-full max-w-4xl mx-auto">
        <div class="card shadow-xl bg-base-100 mb-8">
          <div class="card-body p-8">
            <EnhancedSearch />
          </div>
        </div>

        <div class="card shadow-xl bg-base-100 mb-8">
          <div class="card-body p-12">
            <h3 class="text-2xl font-bold text-center mb-6">Legal Navigation</h3>
            <div class="grid md:grid-cols-2 gap-8">
              <ButtonLink class="btn-accent" to="/legal/courts">Courts</ButtonLink>
              <ButtonLink class="btn-accent" to="/legal/bills">Bills</ButtonLink>
              <ButtonLink class="btn-accent" to="/legal/frcp-frcmp">FRCP/FRCMP</ButtonLink>
              <ButtonLink class="btn-accent" to="/legal/laws">Laws</ButtonLink>
              <ButtonLink class="btn-accent col-span-full" to="/legal/constitution">
                Constitution
              </ButtonLink>
              <ButtonLink class="btn-accent col-span-full" to="/legal/mock-trial">
                Mock Trial
              </ButtonLink>
              <ButtonLink class="btn-primary col-span-full" to="/legal/resources">
                Resources
              </ButtonLink>
            </div>
          </div>
        </div>

        <div class="card shadow-lg bg-base-100">
          <div class="card-body p-8 text-center">
            <p class="text-sm text-center">
              As of August 4th, 2025 (before april)
              <br />
              Total Website Cost: $995.13
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
import { ref, onMounted } from 'vue'
import ButtonLink from '~/components/button-link.vue'

definePageMeta({
  layout: false
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

useHead({
  title: 'Legal - nUSA Legal',
  meta: [
    {
      name: 'description',
      content: 'Your go-to source for legal information and resources in nUSA P.S ROBLOX ROLEPLAY.'
    }
  ]
})
</script>
