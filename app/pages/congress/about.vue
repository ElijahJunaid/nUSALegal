<template>
  <div class="loc-wrapper">
    <nav class="loc-nav">
      <div class="loc-nav-inner">
        <NuxtLink to="/congress" class="loc-logo">
          <span class="loc-logo-icon">🏛️</span>
          <div class="loc-logo-text">
            <span class="loc-logo-top">nUSA</span>
            <span class="loc-logo-bottom">Library of Congress</span>
          </div>
        </NuxtLink>
        <div class="loc-nav-links">
          <NuxtLink to="/congress" class="loc-nav-link">Home</NuxtLink>
          <NuxtLink to="/congress/database" class="loc-nav-link">Congress Database</NuxtLink>
          <NuxtLink to="/congress/former-members" class="loc-nav-link">Former Members</NuxtLink>
          <NuxtLink to="/congress/about" class="loc-nav-link active">About</NuxtLink>
        </div>
        <NuxtLink to="/" class="loc-back-btn">← Back to nUSA</NuxtLink>
      </div>
    </nav>

    <div class="about-page">
      <div class="about-inner">
        <div class="about-icon">🏛️</div>
        <h1 class="about-title">About the Library of Congress</h1>
        <p class="about-eyebrow">NIGHTGALADES'S UNITED STATES OF AMERICA</p>
        <div class="about-card">
          <h2 class="about-card-title">What is the nUSA Library of Congress?</h2>
          <p class="about-card-text">
            The nUSA Library of Congress is a community-maintained database tracking current and
            former members of the Nightgalades's United States of America Congress. It serves as the
            unofficial public record for the nUSA legislative branch.
          </p>
        </div>
        <div class="about-card">
          <h2 class="about-card-title">Disclaimer</h2>
          <p class="about-card-text">
            This database is maintained by community members and is not affiliated with any official
            government body. All information reflects the nUSA Roblox roleplay community.
            <strong>THIS IS NOT REAL LIFE!</strong>
          </p>
        </div>
        <NuxtLink to="/congress" class="about-back">← Back to Library of Congress</NuxtLink>
      </div>
    </div>

    <footer class="loc-footer">
      <div class="loc-footer-bottom">
        <p>&copy; 2024 nUSA Library of Congress · THIS IS NOT REAL LIFE!</p>
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
  title: 'About - nUSA Library of Congress',
  meta: [{ name: 'description', content: 'About the nUSA Library of Congress community database.' }]
})
</script>

<style scoped>
.loc-wrapper {
  min-height: 100vh;
  background: #f3f4f6;
  font-family: 'Segoe UI', sans-serif;
  display: flex;
  flex-direction: column;
}

.loc-nav {
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.loc-nav-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  height: 56px;
  display: flex;
  align-items: center;
  gap: 2rem;
}

.loc-logo {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  text-decoration: none;
  flex-shrink: 0;
}

.loc-logo-icon {
  font-size: 1.4rem;
}

.loc-logo-text {
  display: flex;
  flex-direction: column;
  line-height: 1.1;
}

.loc-logo-top {
  font-size: 0.65rem;
  font-weight: 700;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.loc-logo-bottom {
  font-size: 0.85rem;
  font-weight: 700;
  color: #1e3a5f;
}

.loc-nav-links {
  display: flex;
  gap: 0.25rem;
  flex: 1;
}

.loc-nav-link {
  padding: 0.35rem 0.85rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  color: #374151;
  text-decoration: none;
  transition: background 0.15s;
}

.loc-nav-link:hover {
  background: #f3f4f6;
  color: #1e3a5f;
  text-decoration: none;
}

.loc-nav-link.active {
  color: #1e3a5f;
  font-weight: 600;
  background: #eff6ff;
}

.loc-back-btn {
  margin-left: auto;
  padding: 0.4rem 1rem;
  background: #1e3a5f;
  color: #ffffff;
  border-radius: 0.375rem;
  font-size: 0.8rem;
  font-weight: 600;
  text-decoration: none;
  white-space: nowrap;
  transition: background 0.15s;
}

.loc-back-btn:hover {
  background: #2d5282;
  text-decoration: none;
  color: #fff;
}

.about-page {
  flex: 1;
  padding: 4rem 1.5rem;
}

.about-inner {
  max-width: 680px;
  margin: 0 auto;
  text-align: center;
}

.about-icon {
  font-size: 3.5rem;
  margin-bottom: 1rem;
}

.about-title {
  font-size: 2rem;
  font-weight: 800;
  color: #1e3a5f;
  margin-bottom: 0.5rem;
}

.about-eyebrow {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  color: #f59e0b;
  text-transform: uppercase;
  margin-bottom: 2rem;
}

.about-card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 1.5rem;
  margin-bottom: 1rem;
  text-align: left;
}

.about-card-title {
  font-size: 1rem;
  font-weight: 700;
  color: #1e3a5f;
  margin-bottom: 0.6rem;
}

.about-card-text {
  font-size: 0.9rem;
  color: #4b5563;
  line-height: 1.7;
}

.about-back {
  display: inline-block;
  margin-top: 1.5rem;
  font-size: 0.875rem;
  color: #1e3a5f;
  font-weight: 600;
  text-decoration: none;
}

.about-back:hover {
  text-decoration: underline;
}

.loc-footer {
  background: #0d1b2a;
}

.loc-footer-bottom {
  max-width: 1100px;
  margin: 0 auto;
  padding: 1.25rem 1.5rem;
  font-size: 0.78rem;
  color: #4b5563;
  text-align: center;
}

@media (max-width: 768px) {
  .loc-nav-links {
    display: none;
  }
}
</style>
