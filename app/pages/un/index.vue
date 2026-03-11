<template>
  <div class="un-wrapper">
    <nav class="un-nav">
      <div class="un-nav-inner">
        <NuxtLink to="/un" class="un-logo">
          <span class="un-logo-icon">🌐</span>
          <div class="un-logo-text">
            <span class="un-logo-top">nUSA</span>
            <span class="un-logo-bottom">United Nations</span>
          </div>
        </NuxtLink>
        <div class="un-nav-links">
          <NuxtLink to="/un" class="un-nav-link active">Home</NuxtLink>
          <NuxtLink to="/un/nations" class="un-nav-link">Member Nations</NuxtLink>
          <NuxtLink to="/un/about" class="un-nav-link">About</NuxtLink>
        </div>
        <NuxtLink to="/" class="un-back-btn">← Back to nUSA</NuxtLink>
      </div>
    </nav>

    <!-- Hero -->
    <section class="un-hero">
      <div class="un-hero-inner">
        <div class="un-hero-icon">🌐</div>
        <p class="un-hero-eyebrow">NIGHTGALADES'S UNITED STATES OF AMERICA</p>
        <h1 class="un-hero-title">United Nations</h1>
        <p class="un-hero-desc">
          The nUSA Department of State manages the nation's foreign policy, international diplomacy,
          and participation in the United Nations body.
        </p>
        <NuxtLink to="/un/nations" class="un-cta-btn">🌍 View Member Nations</NuxtLink>
      </div>
      <div class="un-hero-wave">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="#f3f4f6" />
        </svg>
      </div>
    </section>

    <!-- Info Cards -->
    <section class="un-info">
      <div class="un-info-inner">
        <div class="un-info-card">
          <div class="un-info-icon">🏛️</div>
          <h2 class="un-info-title">Department of State</h2>
          <p class="un-info-text">
            The nUSA Department of State is the principal federal agency responsible for conducting
            foreign policy and managing international relations on behalf of Nightgalades's United
            States of America. It oversees diplomatic missions, treaties, and bilateral relations
            with other nations.
          </p>
          <ul class="un-info-list">
            <li>Foreign policy management</li>
            <li>Diplomatic missions &amp; embassies</li>
            <li>Treaty negotiation &amp; ratification</li>
            <li>Bilateral &amp; multilateral relations</li>
          </ul>
        </div>
        <div class="un-info-card">
          <div class="un-info-icon">🌐</div>
          <h2 class="un-info-title">UN Membership</h2>
          <p class="un-info-text">
            nUSA holds membership in the United Nations body, participating in international
            resolutions, peacekeeping efforts, and multilateral agreements. The Department of State
            manages nUSA's UN delegation and represents national interests on the world stage.
          </p>
          <ul class="un-info-list">
            <li>UN General Assembly participation</li>
            <li>Security Council engagement</li>
            <li>International resolutions &amp; voting</li>
            <li>Peacekeeping &amp; humanitarian efforts</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="un-footer">
      <div class="un-footer-inner">
        <div class="un-footer-col">
          <div class="un-footer-logo">
            <span>🌐</span>
            <div>
              <p class="un-footer-logo-title">nUSA United Nations</p>
              <p class="un-footer-logo-sub">
                Nightgalades's United States of America — unofficial community resource.
              </p>
            </div>
          </div>
        </div>
        <div class="un-footer-col">
          <p class="un-footer-heading">QUICK LINKS</p>
          <NuxtLink to="/un" class="un-footer-link">Home</NuxtLink>
          <NuxtLink to="/un/nations" class="un-footer-link">Member Nations</NuxtLink>
          <NuxtLink to="/un/about" class="un-footer-link">About</NuxtLink>
        </div>
      </div>
      <div class="un-footer-bottom">
        <p>&copy; 2024 nUSA Department of State · THIS IS NOT REAL LIFE!</p>
      </div>
    </footer>

    <ChatbotWidget />
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'

definePageMeta({ layout: false })

onMounted(() => {
  document.documentElement.setAttribute('data-theme', 'light')
})

useHead({
  title: 'United Nations - nUSA',
  meta: [
    {
      name: 'description',
      content:
        'nUSA Department of State and United Nations — diplomatic relations and foreign policy.'
    }
  ]
})
</script>

<style scoped>
.un-wrapper {
  min-height: 100vh;
  background: #f3f4f6;
  font-family: 'Segoe UI', sans-serif;
}

/* Navbar */
.un-nav {
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.un-nav-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  height: 56px;
  display: flex;
  align-items: center;
  gap: 2rem;
}

.un-logo {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  text-decoration: none;
  flex-shrink: 0;
}

.un-logo-icon {
  font-size: 1.4rem;
}

.un-logo-text {
  display: flex;
  flex-direction: column;
  line-height: 1.1;
}

.un-logo-top {
  font-size: 0.65rem;
  font-weight: 700;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.un-logo-bottom {
  font-size: 0.85rem;
  font-weight: 700;
  color: #003e73;
}

.un-nav-links {
  display: flex;
  gap: 0.25rem;
  flex: 1;
}

.un-nav-link {
  padding: 0.35rem 0.85rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  color: #374151;
  text-decoration: none;
  transition: background 0.15s;
}

.un-nav-link:hover {
  background: #e8f0fe;
  color: #003e73;
  text-decoration: none;
}

.un-nav-link.active {
  color: #003e73;
  font-weight: 600;
  background: #e8f0fe;
}

.un-back-btn {
  margin-left: auto;
  padding: 0.4rem 1rem;
  background: #003e73;
  color: #ffffff;
  border-radius: 0.375rem;
  font-size: 0.8rem;
  font-weight: 600;
  text-decoration: none;
  white-space: nowrap;
  transition: background 0.15s;
}

.un-back-btn:hover {
  background: #005299;
  text-decoration: none;
  color: #fff;
}

/* Hero */
.un-hero {
  background: linear-gradient(135deg, #001f3f 0%, #003e73 55%, #001f3f 100%);
  padding: 5rem 1.5rem 0;
  position: relative;
  text-align: center;
}

.un-hero-inner {
  max-width: 680px;
  margin: 0 auto;
  padding-bottom: 4rem;
}

.un-hero-icon {
  font-size: 3.5rem;
  margin-bottom: 1rem;
}

.un-hero-eyebrow {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  color: #7dd3fc;
  text-transform: uppercase;
  margin-bottom: 0.75rem;
}

.un-hero-title {
  font-size: 3rem;
  font-weight: 800;
  color: #ffffff;
  line-height: 1.1;
  margin-bottom: 1.25rem;
}

.un-hero-desc {
  font-size: 1rem;
  color: #bae6fd;
  line-height: 1.75;
  margin-bottom: 2.25rem;
}

.un-cta-btn {
  display: inline-block;
  padding: 0.8rem 2rem;
  background: #0ea5e9;
  color: #ffffff;
  border-radius: 0.5rem;
  font-weight: 700;
  font-size: 1rem;
  text-decoration: none;
  transition:
    background 0.15s,
    transform 0.15s;
  box-shadow: 0 4px 14px rgba(14, 165, 233, 0.4);
}

.un-cta-btn:hover {
  background: #0284c7;
  transform: translateY(-2px);
  text-decoration: none;
  color: #fff;
}

.un-hero-wave {
  width: 100%;
  line-height: 0;
}

.un-hero-wave svg {
  display: block;
  width: 100%;
  height: 80px;
}

/* Info */
.un-info {
  padding: 3.5rem 1.5rem;
  background: #f3f4f6;
}

.un-info-inner {
  max-width: 1000px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.un-info-card {
  background: #ffffff;
  border-radius: 0.75rem;
  padding: 2rem;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
}

.un-info-icon {
  font-size: 2.25rem;
  margin-bottom: 0.75rem;
}

.un-info-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: #003e73;
  margin-bottom: 0.75rem;
}

.un-info-text {
  font-size: 0.875rem;
  color: #4b5563;
  line-height: 1.7;
  margin-bottom: 1rem;
}

.un-info-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.un-info-list li {
  font-size: 0.825rem;
  color: #374151;
  padding-left: 1.1rem;
  position: relative;
}

.un-info-list li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: #0ea5e9;
  font-weight: 700;
}

/* Footer */
.un-footer {
  background: #001f3f;
  color: #9ca3af;
  padding: 3rem 1.5rem 0;
}

.un-footer-inner {
  max-width: 1100px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2.5rem;
  padding-bottom: 2.5rem;
  border-bottom: 1px solid #003e73;
}

.un-footer-logo {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  font-size: 1.25rem;
}

.un-footer-logo-title {
  font-size: 0.9rem;
  font-weight: 700;
  color: #f3f4f6;
  margin-bottom: 0.35rem;
}

.un-footer-logo-sub {
  font-size: 0.78rem;
  line-height: 1.5;
  color: #6b7280;
}

.un-footer-heading {
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: #9ca3af;
  text-transform: uppercase;
  margin-bottom: 0.75rem;
}

.un-footer-link {
  display: block;
  font-size: 0.82rem;
  color: #6b7280;
  text-decoration: none;
  margin-bottom: 0.4rem;
  transition: color 0.15s;
}

.un-footer-link:hover {
  color: #f3f4f6;
  text-decoration: none;
}

.un-footer-bottom {
  max-width: 1100px;
  margin: 0 auto;
  padding: 1.25rem 0;
  font-size: 0.78rem;
  color: #4b5563;
  text-align: center;
}

@media (max-width: 768px) {
  .un-nav-links {
    display: none;
  }

  .un-hero-title {
    font-size: 2.1rem;
  }

  .un-info-inner {
    grid-template-columns: 1fr;
  }

  .un-footer-inner {
    grid-template-columns: 1fr;
  }
}
</style>
