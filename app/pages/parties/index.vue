<template>
  <div class="parties-wrapper">
    <nav class="parties-nav">
      <div class="parties-nav-inner">
        <NuxtLink to="/parties" class="parties-logo">
          <span class="parties-logo-icon">🎭</span>
          <div class="parties-logo-text">
            <span class="parties-logo-top">nUSA</span>
            <span class="parties-logo-bottom">Political Parties</span>
          </div>
        </NuxtLink>
        <NuxtLink to="/" class="parties-back-btn">← Back to nUSA</NuxtLink>
      </div>
    </nav>

    <section class="parties-hero">
      <div class="parties-hero-inner">
        <div class="parties-hero-icon">🎭</div>
        <p class="parties-hero-eyebrow">NIGHTGALADES'S UNITED STATES OF AMERICA</p>
        <h1 class="parties-hero-title">Political Parties</h1>
        <p class="parties-hero-desc">
          The two major political parties of the nUSA — select a party to learn more.
        </p>
      </div>
    </section>

    <section class="parties-section">
      <div class="parties-inner">
        <div class="parties-grid">
          <NuxtLink to="/parties/forward" class="party-card forward">
            <div class="party-card-icon">🔵</div>
            <h2 class="party-card-name">Forward Party</h2>
            <p class="party-card-tagline">Progress, unity, and a forward-looking nUSA.</p>
            <span class="party-card-btn forward-btn">View Party →</span>
          </NuxtLink>

          <NuxtLink to="/parties/pioneer" class="party-card pioneer">
            <div class="party-card-icon">🔴</div>
            <h2 class="party-card-name">Pioneer Party</h2>
            <p class="party-card-tagline">Tradition, strength, and pioneering nUSA values.</p>
            <span class="party-card-btn pioneer-btn">View Party →</span>
          </NuxtLink>
        </div>

        <div class="parties-note">
          <p>
            <strong>Note:</strong>
            Independents are not affiliated with either party and do not have a formal party page.
          </p>
        </div>
      </div>
    </section>

    <footer class="parties-footer">
      <div class="parties-footer-bottom">
        <p>&copy; 2024 nUSA Political Parties · THIS IS NOT REAL LIFE!</p>
      </div>
    </footer>

    <button
      @click="toggleTheme"
      class="theme-toggle"
      :title="theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'"
    >
      <span v-if="theme === 'light'">☀️</span>
      <span v-else>🌙</span>
    </button>

    <ChatbotWidget />
  </div>
</template>

<script lang="ts" setup>
import { useTheme } from '~/composables/useTheme'

const { theme, toggleTheme } = useTheme()

useHead({
  title: 'Political Parties - nUSA',
  meta: [
    {
      name: 'description',
      content: 'The two major political parties of nUSA — Forward and Pioneer.'
    }
  ]
})
</script>

<style scoped>
.parties-wrapper {
  min-height: 100vh;
  background: #f3f4f6;
  font-family: 'Segoe UI', sans-serif;
  display: flex;
  flex-direction: column;
}

.parties-nav {
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.parties-nav-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.parties-logo {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  text-decoration: none;
}

.parties-logo-icon {
  font-size: 1.4rem;
}

.parties-logo-text {
  display: flex;
  flex-direction: column;
  line-height: 1.1;
}

.parties-logo-top {
  font-size: 0.65rem;
  font-weight: 700;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.parties-logo-bottom {
  font-size: 0.85rem;
  font-weight: 700;
  color: #374151;
}

.parties-back-btn {
  padding: 0.4rem 1rem;
  background: #374151;
  color: #ffffff;
  border-radius: 0.375rem;
  font-size: 0.8rem;
  font-weight: 600;
  text-decoration: none;
  white-space: nowrap;
  transition: background 0.15s;
}

.parties-back-btn:hover {
  background: #1f2937;
  text-decoration: none;
  color: #fff;
}

.parties-hero {
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  padding: 4rem 1.5rem 3.5rem;
  text-align: center;
}

.parties-hero-inner {
  max-width: 600px;
  margin: 0 auto;
}

.parties-hero-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.parties-hero-eyebrow {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  color: #94a3b8;
  text-transform: uppercase;
  margin-bottom: 0.75rem;
}

.parties-hero-title {
  font-size: 2.75rem;
  font-weight: 800;
  color: #ffffff;
  line-height: 1.1;
  margin-bottom: 1rem;
}

.parties-hero-desc {
  font-size: 1rem;
  color: #cbd5e1;
  line-height: 1.7;
}

.parties-section {
  flex: 1;
  padding: 3rem 1.5rem;
}

.parties-inner {
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.parties-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.party-card {
  background: #ffffff;
  border-radius: 0.875rem;
  padding: 2.25rem 1.75rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.85rem;
  text-decoration: none;
  border: 2px solid transparent;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.08);
  transition:
    box-shadow 0.15s,
    transform 0.15s,
    border-color 0.15s;
}

.party-card:hover {
  transform: translateY(-3px);
  text-decoration: none;
}

.party-card.forward {
  border-color: #bfdbfe;
}

.party-card.forward:hover {
  box-shadow: 0 8px 24px rgba(59, 130, 246, 0.18);
  border-color: #3b82f6;
}

.party-card.pioneer {
  border-color: #fecaca;
}

.party-card.pioneer:hover {
  box-shadow: 0 8px 24px rgba(239, 68, 68, 0.18);
  border-color: #ef4444;
}

.party-card-icon {
  font-size: 2.5rem;
}

.party-card-name {
  font-size: 1.35rem;
  font-weight: 800;
  color: #1f2937;
}

.party-card-tagline {
  font-size: 0.875rem;
  color: #6b7280;
  line-height: 1.5;
}

.party-card-btn {
  margin-top: 0.5rem;
  padding: 0.55rem 1.5rem;
  border-radius: 0.5rem;
  font-size: 0.85rem;
  font-weight: 700;
}

.forward-btn {
  background: #eff6ff;
  color: #1d4ed8;
}

.party-card.forward:hover .forward-btn {
  background: #1d4ed8;
  color: #ffffff;
}

.pioneer-btn {
  background: #fef2f2;
  color: #b91c1c;
}

.party-card.pioneer:hover .pioneer-btn {
  background: #b91c1c;
  color: #ffffff;
}

.parties-note {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 0.9rem 1.25rem;
  font-size: 0.85rem;
  color: #6b7280;
  text-align: center;
}

.parties-note strong {
  color: #374151;
}

.parties-footer {
  background: #1e293b;
}

.parties-footer-bottom {
  max-width: 1100px;
  margin: 0 auto;
  padding: 1.25rem 1.5rem;
  font-size: 0.78rem;
  color: #4b5563;
  text-align: center;
}

@media (max-width: 600px) {
  .parties-grid {
    grid-template-columns: 1fr;
  }

  .parties-hero-title {
    font-size: 2rem;
  }
}

.theme-toggle {
  position: fixed;
  bottom: 1rem;
  left: 1rem;
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 50%;
  border: none;
  background: #374151;
  color: #fff;
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
  z-index: 200;
  transition: background 0.2s;
}
.theme-toggle:hover {
  background: #4b5563;
}

[data-theme='dark'] .parties-wrapper {
  background: #111827;
}
[data-theme='dark'] .parties-nav {
  background: #1f2937;
  border-color: #374151;
}
[data-theme='dark'] .parties-logo-bottom {
  color: #d1d5db;
}
[data-theme='dark'] .parties-back-btn {
  background: #4b5563;
}
[data-theme='dark'] .parties-section {
  background: #111827;
}
[data-theme='dark'] .party-card {
  background: #1f2937;
  border-color: #374151;
}
[data-theme='dark'] .party-card-name {
  color: #f3f4f6;
}
[data-theme='dark'] .party-card-tagline {
  color: #9ca3af;
}
[data-theme='dark'] .parties-note {
  background: #1f2937;
  border-color: #374151;
  color: #9ca3af;
}
[data-theme='dark'] .parties-footer {
  background: #0d1117;
}
[data-theme='dark'] .parties-footer-bottom {
  color: #6b7280;
}
</style>
