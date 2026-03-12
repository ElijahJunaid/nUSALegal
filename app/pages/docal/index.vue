<template>
  <div class="docal-wrapper">
    <!-- Navbar -->
    <nav class="docal-nav">
      <div class="docal-nav-inner">
        <NuxtLink to="/docal" class="docal-logo">
          <span class="docal-logo-icon">📋</span>
          <div class="docal-logo-text">
            <span class="docal-logo-top">nUSA</span>
            <span class="docal-logo-bottom">Dept. of Commerce &amp; Labor</span>
          </div>
        </NuxtLink>
        <div class="docal-nav-links">
          <NuxtLink to="/docal" class="docal-nav-link active">Home</NuxtLink>
          <NuxtLink to="/docal/businesses" class="docal-nav-link">Business Database</NuxtLink>
          <NuxtLink to="/docal/about" class="docal-nav-link">About</NuxtLink>
        </div>
        <NuxtLink to="/" class="docal-back-btn">← Back to nUSA</NuxtLink>
      </div>
    </nav>

    <!-- Hero -->
    <section class="docal-hero">
      <div class="docal-hero-inner">
        <div class="docal-hero-icon">📋</div>
        <p class="docal-hero-eyebrow">NIGHTGALADES'S UNITED STATES OF AMERICA</p>
        <h1 class="docal-hero-title">Department of Commerce and Labor</h1>
        <p class="docal-hero-desc">
          Regulating commerce, supporting businesses, and protecting the workforce of nUSA. The
          Department of Commerce and Labor serves as the principal agency for economic development
          and worker rights.
        </p>
        <NuxtLink to="/docal/businesses" class="docal-db-btn">📊 Business Database</NuxtLink>
      </div>
      <div class="docal-hero-wave">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="#f3f4f6" />
        </svg>
      </div>
    </section>

    <!-- Info Cards -->
    <section class="docal-info">
      <div class="docal-info-inner">
        <div class="docal-info-card">
          <div class="docal-info-icon">🏪</div>
          <h2 class="docal-info-title">Commerce Division</h2>
          <p class="docal-info-text">
            The Commerce Division oversees the registration, licensing, and regulation of businesses
            operating within nUSA. It maintains the official business registry, enforces commercial
            standards, and promotes economic growth across all states and territories.
          </p>
          <ul class="docal-info-list">
            <li>Business registration &amp; licensing</li>
            <li>Commercial standards enforcement</li>
            <li>Economic development initiatives</li>
            <li>Trade regulation &amp; oversight</li>
          </ul>
        </div>
        <div class="docal-info-card">
          <div class="docal-info-icon">👷</div>
          <h2 class="docal-info-title">Labor Division</h2>
          <p class="docal-info-text">
            The Labor Division is responsible for protecting the rights of workers, enforcing
            employment laws, and ensuring fair labor practices throughout nUSA. It sets workplace
            standards and mediates disputes between employers and employees.
          </p>
          <ul class="docal-info-list">
            <li>Worker rights &amp; protections</li>
            <li>Employment law enforcement</li>
            <li>Workplace safety standards</li>
            <li>Labor dispute mediation</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="docal-footer">
      <div class="docal-footer-inner">
        <div class="docal-footer-col">
          <div class="docal-footer-logo">
            <span>📋</span>
            <div>
              <p class="docal-footer-logo-title">nUSA Dept. of Commerce &amp; Labor</p>
              <p class="docal-footer-logo-sub">
                Nightgalades's United States of America — unofficial community department resource.
              </p>
            </div>
          </div>
        </div>
        <div class="docal-footer-col">
          <p class="docal-footer-heading">QUICK LINKS</p>
          <NuxtLink to="/docal" class="docal-footer-link">Home</NuxtLink>
          <NuxtLink to="/docal/businesses" class="docal-footer-link">Business Database</NuxtLink>
          <NuxtLink to="/docal/about" class="docal-footer-link">About</NuxtLink>
        </div>
      </div>
      <div class="docal-footer-bottom">
        <p>&copy; 2024 nUSA DOCAL · THIS IS NOT REAL LIFE!</p>
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

definePageMeta({
  layout: false
})

const { theme, toggleTheme } = useTheme()

useHead({
  title: 'DOCAL - nUSA',
  meta: [
    {
      name: 'description',
      content: 'Department of Commerce and Labor — nUSA official department resource.'
    }
  ]
})
</script>

<style scoped>
.docal-wrapper {
  min-height: 100vh;
  background: #f3f4f6;
  font-family: 'Segoe UI', sans-serif;
}

/* Navbar */
.docal-nav {
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.docal-nav-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  height: 56px;
  display: flex;
  align-items: center;
  gap: 2rem;
}

.docal-logo {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  text-decoration: none;
  flex-shrink: 0;
}

.docal-logo-icon {
  font-size: 1.4rem;
}

.docal-logo-text {
  display: flex;
  flex-direction: column;
  line-height: 1.1;
}

.docal-logo-top {
  font-size: 0.65rem;
  font-weight: 700;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.docal-logo-bottom {
  font-size: 0.85rem;
  font-weight: 700;
  color: #0f4c5c;
}

.docal-nav-links {
  display: flex;
  gap: 0.25rem;
  flex: 1;
}

.docal-nav-link {
  padding: 0.35rem 0.85rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  color: #374151;
  text-decoration: none;
  transition: background 0.15s;
}

.docal-nav-link:hover {
  background: #f0fdfa;
  color: #0f4c5c;
  text-decoration: none;
}

.docal-nav-link.active {
  color: #0f4c5c;
  font-weight: 600;
  background: #f0fdfa;
}

.docal-back-btn {
  margin-left: auto;
  padding: 0.4rem 1rem;
  background: #0f4c5c;
  color: #ffffff;
  border-radius: 0.375rem;
  font-size: 0.8rem;
  font-weight: 600;
  text-decoration: none;
  white-space: nowrap;
  transition: background 0.15s;
}

.docal-back-btn:hover {
  background: #0e6b82;
  text-decoration: none;
  color: #fff;
}

/* Hero */
.docal-hero {
  background: linear-gradient(135deg, #0f2137 0%, #0f4c5c 60%, #0f2137 100%);
  padding: 5rem 1.5rem 0;
  position: relative;
  text-align: center;
}

.docal-hero-inner {
  max-width: 700px;
  margin: 0 auto;
  padding-bottom: 4rem;
}

.docal-hero-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.docal-hero-eyebrow {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  color: #5eead4;
  text-transform: uppercase;
  margin-bottom: 0.75rem;
}

.docal-hero-title {
  font-size: 2.75rem;
  font-weight: 800;
  color: #ffffff;
  line-height: 1.1;
  margin-bottom: 1.25rem;
}

.docal-hero-desc {
  font-size: 1rem;
  color: #cbd5e1;
  line-height: 1.75;
  margin-bottom: 2.25rem;
}

.docal-db-btn {
  display: inline-block;
  padding: 0.8rem 2.25rem;
  background: #14b8a6;
  color: #ffffff;
  border-radius: 0.5rem;
  font-weight: 700;
  font-size: 1rem;
  text-decoration: none;
  transition:
    background 0.15s,
    transform 0.15s;
  box-shadow: 0 4px 14px rgba(20, 184, 166, 0.4);
}

.docal-db-btn:hover {
  background: #0d9488;
  transform: translateY(-2px);
  text-decoration: none;
  color: #fff;
}

.docal-hero-wave {
  width: 100%;
  line-height: 0;
}

.docal-hero-wave svg {
  display: block;
  width: 100%;
  height: 80px;
}

/* Info */
.docal-info {
  padding: 3.5rem 1.5rem;
  background: #f3f4f6;
}

.docal-info-inner {
  max-width: 1000px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.docal-info-card {
  background: #ffffff;
  border-radius: 0.75rem;
  padding: 2rem;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
}

.docal-info-icon {
  font-size: 2.25rem;
  margin-bottom: 0.75rem;
}

.docal-info-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: #0f4c5c;
  margin-bottom: 0.75rem;
}

.docal-info-text {
  font-size: 0.875rem;
  color: #4b5563;
  line-height: 1.7;
  margin-bottom: 1rem;
}

.docal-info-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.docal-info-list li {
  font-size: 0.825rem;
  color: #374151;
  padding-left: 1.1rem;
  position: relative;
}

.docal-info-list li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: #14b8a6;
  font-weight: 700;
}

/* Footer */
.docal-footer {
  background: #0f2137;
  color: #9ca3af;
  padding: 3rem 1.5rem 0;
}

.docal-footer-inner {
  max-width: 1100px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2.5rem;
  padding-bottom: 2.5rem;
  border-bottom: 1px solid #0f4c5c;
}

.docal-footer-logo {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  font-size: 1.25rem;
}

.docal-footer-logo-title {
  font-size: 0.9rem;
  font-weight: 700;
  color: #f3f4f6;
  margin-bottom: 0.35rem;
}

.docal-footer-logo-sub {
  font-size: 0.78rem;
  line-height: 1.5;
  color: #6b7280;
}

.docal-footer-heading {
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: #9ca3af;
  text-transform: uppercase;
  margin-bottom: 0.75rem;
}

.docal-footer-link {
  display: block;
  font-size: 0.82rem;
  color: #6b7280;
  text-decoration: none;
  margin-bottom: 0.4rem;
  transition: color 0.15s;
}

.docal-footer-link:hover {
  color: #f3f4f6;
  text-decoration: none;
}

.docal-footer-bottom {
  max-width: 1100px;
  margin: 0 auto;
  padding: 1.25rem 0;
  font-size: 0.78rem;
  color: #4b5563;
  text-align: center;
}

@media (max-width: 768px) {
  .docal-nav-links {
    display: none;
  }

  .docal-hero-title {
    font-size: 2rem;
  }

  .docal-info-inner {
    grid-template-columns: 1fr;
  }

  .docal-footer-inner {
    grid-template-columns: 1fr;
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
  background: #0f4c5c;
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
  background: #0f5f70;
}

[data-theme='dark'] .docal-wrapper {
  background: #111827;
}
[data-theme='dark'] .docal-nav {
  background: #1f2937;
  border-color: #374151;
}
[data-theme='dark'] .docal-nav-link {
  color: #d1d5db;
}
[data-theme='dark'] .docal-nav-link:hover,
[data-theme='dark'] .docal-nav-link.active {
  color: #fff;
}
[data-theme='dark'] .docal-back-btn {
  background: #0f4c5c;
}
[data-theme='dark'] .docal-info {
  background: #111827;
}
[data-theme='dark'] .docal-info-card {
  background: #1f2937;
  border-color: #374151;
}
[data-theme='dark'] .docal-info-title {
  color: #5eead4;
}
[data-theme='dark'] .docal-info-text {
  color: #d1d5db;
}
[data-theme='dark'] .docal-footer {
  background: #0a1520;
}
[data-theme='dark'] .docal-footer-bottom {
  color: #6b7280;
}
</style>
