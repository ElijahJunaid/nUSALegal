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
        <button @click="toggleMobileMenu" class="mobile-menu-toggle">☰</button>
        <div class="un-nav-links" :class="{ 'mobile-open': mobileMenuOpen }">
          <NuxtLink to="/un" class="un-nav-link">Home</NuxtLink>
          <NuxtLink to="/un/nations" class="un-nav-link active">Member Nations</NuxtLink>
          <NuxtLink to="/un/about" class="un-nav-link">About</NuxtLink>
        </div>
        <NuxtLink to="/" class="un-back-btn">← Back to nUSA</NuxtLink>
      </div>
    </nav>

    <div class="view-controls">
      <button @click="viewMode = '2d'" class="view-btn" :class="{ active: viewMode === '2d' }">
        🗺️ 2D Map
      </button>
      <button @click="viewMode = '3d'" class="view-btn" :class="{ active: viewMode === '3d' }">
        🌍 3D Globe
      </button>
    </div>

    <div v-show="viewMode === '2d'" class="map-container">
      <div class="map-legend">
        <span class="legend-item">
          <span class="legend-dot member"></span>
          Member
        </span>
        <span class="legend-item">
          <span class="legend-dot observer"></span>
          Observer
        </span>
        <span class="legend-item">
          <span class="legend-dot allied"></span>
          Allied
        </span>
        <span class="legend-item">
          <span class="legend-dot none"></span>
          Not a member
        </span>
      </div>

      <div ref="mapEl" class="un-map"></div>

      <div v-if="mapLoading" class="map-loading">
        <span>Loading map…</span>
      </div>
    </div>

    <div v-if="viewMode === '3d'" class="globe-view">
      <UnEarthGlobe />
    </div>

    <footer class="un-footer">
      <div class="un-footer-bottom">
        <p>&copy; 2024 nUSA Department of State · THIS IS NOT REAL LIFE!</p>
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
import { ref, onMounted, onUnmounted, onBeforeMount, onBeforeUnmount, watch } from 'vue'
import type { Map as LeafletMap, Path as LeafletPath, LeafletMouseEvent } from 'leaflet'
// import type { FeatureCollection } from 'geojson'
// @ts-ignore - Nuxt module alias
import { useTheme } from '~/composables/useTheme'
// @ts-ignore - Nuxt module alias
import { unNations } from '~/data/un-nations'
// @ts-ignore - Nuxt module alias
import { useRoute } from '#imports'
// @ts-ignore - Nuxt module alias
import { dLog } from '~/plugins/debug-logger.client'

// @ts-ignore - Nuxt auto-import
definePageMeta({
  layout: false
})

const { theme, toggleTheme } = useTheme()
const mobileMenuOpen = ref(false)
const route = useRoute()

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

// Close mobile menu when navigating
watch(
  () => route.path,
  () => {
    mobileMenuOpen.value = false
  }
)

onBeforeMount(() => dLog('[NATIONS] onBeforeMount — route:', route.fullPath))
onBeforeUnmount(() => dLog('[NATIONS] onBeforeUnmount'))
watch(
  () => route.fullPath,
  p => dLog('[NATIONS] internal route changed to:', p)
)
const viewMode = ref<'2d' | '3d'>('2d')

const mapEl = ref<HTMLElement | null>(null)
const mapLoading = ref(true)
let map: LeafletMap | null = null

onMounted(async () => {
  dLog('[NATIONS] onMounted')
  if (!mapEl.value) return

  const leaflet = await import('leaflet')
  const L = leaflet.default

  try {
    const linkEl = document.createElement('link')
    linkEl.rel = 'stylesheet'
    linkEl.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
    linkEl.crossOrigin = 'anonymous'
    linkEl.referrerPolicy = 'no-referrer'
    document.head.appendChild(linkEl)
    dLog('[NATIONS] Leaflet CSS loaded successfully')
  } catch (error) {
    console.error('[NATIONS] Failed to load Leaflet CSS:', error)
  }

  map = L.map(mapEl.value, {
    center: [0, 0],
    zoom: 2,
    minZoom: 2,
    maxZoom: 6,
    worldCopyJump: false,
    zoomControl: true,
    crs: L.CRS.EPSG3857,
    maxBounds: [
      [-85, -180],
      [85, 180]
    ],
    maxBoundsViscosity: 1.0,
    bounceAtZoomLimits: false,
    inertia: false,
    zoomSnap: 0.25,
    zoomDelta: 0.25
  })

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '', // Remove attribution
    subdomains: 'abc',
    maxZoom: 19,
    noWrap: true,
    bounds: [
      [-85.051, -180],
      [85.051, 180]
    ] as [[number, number], [number, number]]
  }).addTo(map)

  try {
    const topoRes = await fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
    if (!topoRes.ok) {
      throw new Error(`Failed to fetch world atlas data: ${topoRes.status}`)
    }
    const topology = await topoRes.json()
    const { feature } = await import('topojson-client')
    const geojson = feature(topology, topology.objects.countries)

    // Type definition for UN nations data
    type UNNation = {
      numericCode: number
      code: string
      name: string
      flag: string
      status: 'Member' | 'Observer' | 'Allied'
      owner: string
      leader: string
      capital?: string
      joined?: string

      [key: string]: unknown
    }

    const nationMap = new Map(unNations.map((n: UNNation) => [n.numericCode, n]))

    const STATUS_COLORS: Record<string, string> = {
      Member: 'var(--nusa-primary, #0099CC)',
      Observer: 'var(--nusa-success, #22c55e)',
      Allied: 'var(--nusa-warning, #f59e0b)'
    }

    const geoLayer = L.geoJSON(geojson, {
      style: feat => {
        const id = feat?.id != null ? Number(feat.id) : -1
        const nation = nationMap.get(id) as UNNation | undefined
        if (!nation)
          return {
            fillColor: 'var(--nusa-muted, #d1d5db)',
            fillOpacity: 0.65,
            color: 'var(--nusa-border, #b0b7c0)',
            weight: 0.5
          }
        return {
          fillColor: STATUS_COLORS[nation.status] ?? 'var(--nusa-primary, #0099CC)',
          fillOpacity: 0.75,
          color: 'var(--nusa-white, #ffffff)',
          weight: 0.5
        }
      },
      onEachFeature: (feat, layer) => {
        const id = feat?.id != null ? Number(feat.id) : -1
        const nation = nationMap.get(id) as UNNation | undefined

        layer.on('mouseover', function (this: LeafletPath) {
          this.setStyle({ fillOpacity: 0.95, weight: 1.5 })
        })
        layer.on('mouseout', function (this: LeafletPath) {
          geoLayer.resetStyle(this)
        })

        layer.on('click', (e: LeafletMouseEvent) => {
          let html: string
          if (nation) {
            const color = STATUS_COLORS[nation.status] ?? 'var(--nusa-muted, #6b7280)'
            html = `
              <div class="unp">
                <div class="unp-head">
                  <span class="unp-flag">${nation.flag}</span>
                  <span class="unp-name">${nation.name}</span>
                </div>
                <div class="unp-status" style="color:${color}">● ${nation.status}</div>
                <div class="unp-rows">
                  <div class="unp-row"><span class="unp-lbl">Owner</span><span class="unp-val">${nation.owner}</span></div>
                  <div class="unp-row"><span class="unp-lbl">Leader</span><span class="unp-val">${nation.leader}</span></div>
                  ${nation.capital ? `<div class="unp-row"><span class="unp-lbl">Capital</span><span class="unp-val">${nation.capital}</span></div>` : ''}
                  ${nation.joined ? `<div class="unp-row"><span class="unp-lbl">Joined</span><span class="unp-val">${nation.joined}</span></div>` : ''}
                </div>
              </div>`
          } else {
            html = `<div class="unp"><div class="unp-nonmember">🌐 Not a UN member nation</div></div>`
          }
          if (map) {
            L.popup({ maxWidth: 260, className: 'un-leaflet-popup' })
              .setLatLng(e.latlng)
              .setContent(html)
              .openOn(map)
          }
        })
      }
    }).addTo(map)
  } catch (error) {
    console.error('[NATIONS] Error loading map data:', error)
    dLog('[NATIONS] Error loading map data:', error)
    // Show error message to user
    if (mapEl.value) {
      mapEl.value.innerHTML =
        '<div style="padding: 2rem; text-align: center; color: #666;">Failed to load map data. Please refresh the page.</div>'
    }
  } finally {
    mapLoading.value = false
  }
})

onUnmounted(() => {
  dLog('[NATIONS] onUnmounted')
  if (map) {
    map.remove()
    map = null
  }
})

// @ts-ignore - useHead auto-import
useHead({
  title: 'Member Nations - nUSA United Nations',
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { name: 'referrer', content: 'no-referrer-when-downgrade' },
    {
      'http-equiv': 'Content-Security-Policy',
      content:
        "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' blob: https://cdn.jsdelivr.net https://unpkg.com; style-src 'self' 'unsafe-inline' https://unpkg.com https://*.tile.openstreetmap.org https://*.basemaps.cartocdn.com; img-src 'self' data: blob: https://unpkg.com https://*.tile.openstreetmap.org https://*.basemaps.cartocdn.com; font-src 'self' data:; connect-src 'self' blob: ws: wss: https://cdn.jsdelivr.net https://*.basemaps.cartocdn.com; worker-src 'self' blob:; "
    }
  ]
})
</script>

<style scoped>
.un-wrapper {
  height: 100vh;
  background: #f3f4f6;
  font-family: 'Segoe UI', sans-serif;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
}

.un-nav {
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  position: relative;
  z-index: 400;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  flex-shrink: 0;
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
  text-decoration: none !important;
  color: #1f2937 !important;
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

.view-controls {
  position: fixed;
  top: 68px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 500;
  display: flex;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(8px);
  padding: 0.25rem;
  border-radius: 0.75rem;
  border: 1px solid #e5e7eb;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.view-btn {
  padding: 0.5rem 1rem;
  border: none;
  background: transparent;
  border-radius: 0.5rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: #4b5563;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.view-btn:hover {
  background: #f3f4f6;
  color: #111827;
}

.view-btn.active {
  background: #003e73;
  color: #ffffff;
}

.map-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  position: relative;
}

.globe-view {
  flex: 1;
  width: 100%;
  min-height: 0;
  position: relative;
  /* Performance optimizations */
  will-change: transform;
  contain: layout style paint;
  /* Reduce repaints */
  backface-visibility: hidden;
  transform: translateZ(0);
  background: #000c1d;
  overflow: hidden;
}

/* 3D Globe performance optimizations */
.globe-view canvas {
  border-color: #374151;
}

[data-theme='dark'] .view-controls {
  background: rgba(31, 41, 55, 0.9);
  border-color: #374151;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

[data-theme='dark'] .view-btn {
  color: #9ca3af;
}

[data-theme='dark'] .view-btn:hover {
  background: #374151;
  color: #e5e7eb;
}

[data-theme='dark'] .view-btn.active {
  background: #003e73;
  color: #ffffff;
}

.map-legend {
  position: absolute;
  top: 10px;
  right: 1rem;
  z-index: 450;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 0.5rem 0.85rem;
  display: flex;
  gap: 1rem;
  font-size: 0.78rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(4px);
}
.legend-item {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  color: #374151;
  font-weight: 500;
}
.legend-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
}
.legend-dot.member {
  background: #0099cc;
}
.legend-dot.observer {
  background: #22c55e;
}
.legend-dot.allied {
  background: #f59e0b;
}
.legend-dot.none {
  background: #d1d5db;
  border: 1px solid #9ca3af;
}

.un-map {
  flex: 1;
  width: 100%;
  min-height: 0;
}

.map-loading {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 600;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 0.5rem;
  padding: 1rem 1.5rem;
  font-size: 0.875rem;
  color: #003e73;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
}

.un-footer {
  background: #001f3f;
  flex-shrink: 0;
}
.un-footer-bottom {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0.75rem 1.5rem;
  font-size: 0.75rem;
  color: #4b5563;
  text-align: center;
}

.theme-toggle {
  position: fixed;
  bottom: 1rem;
  left: 1rem;
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 50%;
  border: none;
  background: #003e73;
  color: #fff;
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
  z-index: 600;
  transition: background 0.2s;
}
.theme-toggle:hover {
  background: #0057a3;
}

[data-theme='dark'] .un-wrapper {
  background: #111827;
}
[data-theme='dark'] .un-nav {
  background: #1f2937;
  border-color: #374151;
}
[data-theme='dark'] .un-nav-link {
  color: #d1d5db;
}

[data-theme='dark'] .un-nav-link:hover {
  background: #374151;
  color: #60a5fa;
}

[data-theme='dark'] .un-nav-link.active {
  color: #60a5fa;
  background: #1e3a8a;
}
[data-theme='dark'] .un-back-btn {
  background: #003e73;
}
[data-theme='dark'] .map-legend {
  background: rgba(31, 41, 55, 0.92);
  border-color: #374151;
  color: #d1d5db;
}
[data-theme='dark'] .legend-item {
  color: #d1d5db;
}
[data-theme='dark'] .un-footer {
  background: #020b14;
}
[data-theme='dark'] .un-footer-bottom {
  color: #6b7280;
}

@media (max-width: 768px) {
  .un-nav-links {
    display: none;
  }
  .map-legend {
    gap: 0.5rem;
    font-size: 0.7rem;
    top: 64px;
  }
}
</style>

<style>
.un-leaflet-popup .leaflet-popup-content-wrapper {
  border-radius: 0.625rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.18);
  padding: 0;
  overflow: hidden;
  font-family: 'Segoe UI', sans-serif;
}
.un-leaflet-popup .leaflet-popup-content {
  margin: 0;
  width: auto !important;
}
.un-leaflet-popup .leaflet-popup-tip-container {
  margin-top: -1px;
}
.unp {
  min-width: 200px;
}
.unp-head {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem 0.4rem;
  border-bottom: 1px solid #e5e7eb;
}
.unp-flag {
  font-size: 1.4rem;
  line-height: 1;
}
.unp-name {
  font-size: 0.975rem;
  font-weight: 700;
  color: #111827;
}
.unp-status {
  padding: 0.3rem 1rem;
  font-size: 0.8rem;
  font-weight: 600;
}
.unp-rows {
  padding: 0.4rem 1rem 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}
.unp-row {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  font-size: 0.8rem;
}
.unp-lbl {
  color: #6b7280;
  flex-shrink: 0;
}
.unp-val {
  color: #1f2937;
  font-weight: 500;
  text-align: right;
}
.unp-nonmember {
  padding: 0.75rem 1rem;
  font-size: 0.85rem;
  color: #6b7280;
}

[data-theme='dark'] .un-wrapper {
  background: #111827;
  color: #e5e7eb;
}
[data-theme='dark'] .un-nav {
  background: #1f2937;
  border-color: #374151;
}
[data-theme='dark'] .un-logo {
  color: #e5e7eb !important;
}
[data-theme='dark'] .un-logo-top {
  color: #9ca3af;
}
[data-theme='dark'] .un-logo-bottom {
  color: #60a5fa;
}
[data-theme='dark'] .un-nav-link {
  color: #d1d5db;
}
[data-theme='dark'] .un-nav-link:hover {
  background: #374151;
  color: #60a5fa;
}
[data-theme='dark'] .un-nav-link.active {
  color: #60a5fa;
  background: #1e3a8a;
}
[data-theme='dark'] .un-back-btn {
  background: #1e3a8a;
  color: #e5e7eb;
}
[data-theme='dark'] .un-map {
  background: #111827;
}
[data-theme='dark'] .map-legend {
  background: #1f2937;
  border-color: #374151;
  color: #d1d5db;
}
[data-theme='dark'] .legend-dot {
  border-color: #374151;
}
[data-theme='dark'] .un-footer {
  background: #111827;
}
[data-theme='dark'] .un-footer-bottom {
  color: #9ca3af;
}
[data-theme='dark'] .unp {
  background: #1f2937;
  border: 1px solid #374151;
  color: #e5e7eb;
}
[data-theme='dark'] .unp-flag {
  background: #374151;
  color: #e5e7eb;
}
[data-theme='dark'] .unp-name {
  color: #e5e7eb;
}
[data-theme='dark'] .unp-lbl {
  color: #9ca3af;
}
[data-theme='dark'] .unp-val {
  color: #d1d5db;
}
[data-theme='dark'] .unp-nonmember {
  color: #9ca3af;
}
</style>
