<template>
  <div class="globe-container" ref="container" @click="handleContainerClick">
    <div ref="globeMount" class="globe-mount"></div>
    <div v-if="loading" class="globe-loading">
      <div class="spinner"></div>
      <span>Loading the world...</span>
    </div>
    <div v-show="clickIndicator" class="click-indicator" :style="clickIndicatorStyle"></div>
    <div v-show="selectedNation" class="globe-popup" :style="popupStyle" @click.stop>
      <template v-if="selectedNation">
        <button class="globe-popup-close" @click="closePopup" aria-label="Close">✕</button>
        <div class="unp-head">
          <span class="unp-flag">{{ selectedNation.flag }}</span>
          <span class="unp-name">{{ selectedNation.name }}</span>
        </div>
        <div class="unp-status" :style="{ color: statusColor(selectedNation.status) }">
          ● {{ selectedNation.status }}
        </div>
        <div class="unp-rows">
          <div class="unp-row">
            <span class="unp-lbl">Owner</span>
            <span class="unp-val">{{ selectedNation.owner }}</span>
          </div>
          <div class="unp-row">
            <span class="unp-lbl">Leader</span>
            <span class="unp-val">{{ selectedNation.leader }}</span>
          </div>
          <div v-if="selectedNation.capital" class="unp-row">
            <span class="unp-lbl">Capital</span>
            <span class="unp-val">{{ selectedNation.capital }}</span>
          </div>
          <div v-if="selectedNation.joined" class="unp-row">
            <span class="unp-lbl">Joined</span>
            <span class="unp-val">{{ selectedNation.joined }}</span>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'

// @ts-ignore - Nuxt module alias
import { unNations } from '~/data/un-nations'

// @ts-ignore - Nuxt module alias
import { dLog, dWarn } from '~/plugins/debug-logger.client'

type Nation = (typeof unNations)[0]
type GeoJsonFeature = {
  id: string | number
  properties?: {
    name?: string
  }
}

type GlobeEvent = {
  originalEvent?: {
    clientX: number
    clientY: number
  }
  clientX?: number
  clientY?: number
}

const container = ref<HTMLElement | null>(null)
const globeMount = ref<HTMLElement | null>(null)
const loading = ref(true)
const selectedNation = ref<Nation | null>(null)
const popupPosition = ref({ x: 0, y: 0 })
const popupStyle = ref({})
const clickIndicator = ref(false)
const clickIndicatorStyle = ref({})

// Performance optimization: timeout variables
let hoverTimeout: ReturnType<typeof setTimeout> | null = null
let resizeTimeout: ReturnType<typeof setTimeout> | null = null

const STATUS_COLORS: Record<string, string> = {
  Member: '#0099CC',
  Observer: '#22c55e',
  Allied: '#f59e0b'
}

function statusColor(s: string): string {
  return STATUS_COLORS[s] ?? '#6b7280'
}

// Calculate popup position near mouse cursor within viewport bounds
function calculatePopupPosition(mouseX: number, mouseY: number, popupElement?: HTMLElement) {
  if (!container.value) return { x: 0, y: 0 }

  const containerRect = container.value.getBoundingClientRect()

  // Get actual popup dimensions or use defaults
  let popupWidth = 220
  let popupHeight = 200

  if (popupElement) {
    const popupRect = popupElement.getBoundingClientRect()
    popupWidth = popupRect.width || 220
    popupHeight = popupRect.height || 200
  }

  const margin = 15 // Margin from viewport edges

  // Convert mouse coordinates to container-relative coordinates
  // Account for scroll position
  const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop

  const relativeX = mouseX - containerRect.left + scrollLeft
  const relativeY = mouseY - containerRect.top + scrollTop

  // Default position: top-right of cursor
  let x = relativeX + 15
  let y = relativeY - popupHeight / 2

  // Smart positioning: ensure popup stays within container bounds
  // Check right edge
  if (x + popupWidth > containerRect.width) {
    x = relativeX - popupWidth - 15 // Place to left of cursor
  }

  // Check left edge
  if (x < margin) {
    x = margin
  }

  // Check top edge
  if (y < margin) {
    y = margin
  }

  // Check bottom edge
  if (y + popupHeight > containerRect.height - margin) {
    y = containerRect.height - popupHeight - margin
  }

  dLog('[POPUP] Calculated position:', {
    x,
    y,
    mouseX,
    mouseY,
    containerWidth: containerRect.width,
    containerHeight: containerRect.height,
    popupWidth,
    popupHeight
  })

  return { x, y }
}

// Close popup and reset position
function closePopup() {
  selectedNation.value = null
  popupStyle.value = {}
  clickIndicator.value = false
}

// Handle container click - close popup if clicking outside
function handleContainerClick(event: MouseEvent) {
  // Check if click was outside the popup
  const popupElement = event.target as HTMLElement
  if (!popupElement.closest('.globe-popup')) {
    closePopup()
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let globeInstance: any = null
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let resizeObserver: any = null

onMounted(async () => {
  if (!container.value) return
  await nextTick()

  const w = container.value.clientWidth
  const h = container.value.clientHeight

  // Optimize data loading - load in parallel with processing
  const [{ default: Globe }, topoRes, { feature }] = await Promise.all([
    import('globe.gl'),
    fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json').then(r => r.json()),
    import('topojson-client')
  ])

  // Process geojson data in chunks to avoid blocking
  const geojson = feature(topoRes, topoRes.objects.countries)
  const nationMap = new Map(unNations.map((n: Nation) => [n.numericCode, n]))

  // Cache color calculations to avoid repeated lookups
  const colorCache = new Map<string, string>()
  let hoveredFeat: GeoJsonFeature | null = null

  function capColor(feat: GeoJsonFeature): string {
    const featId = String(feat.id)
    if (feat === hoveredFeat) return 'rgba(255,255,255,0.55)'

    // Use cache for color calculations
    if (colorCache.has(featId)) {
      return colorCache.get(featId)!
    }

    const nation = nationMap.get(Number(feat.id)) as Nation | undefined
    const color = nation ? (STATUS_COLORS[nation.status] ?? '#0099CC') : 'rgba(209,213,219,0.65)'
    colorCache.set(featId, color)
    return color
  }

  function altitude(feat: GeoJsonFeature): number {
    return feat === hoveredFeat ? 0.025 : 0.01
  }

  // Debounce hover events to reduce processing
  const debouncedHover = (feat: GeoJsonFeature | null) => {
    if (hoverTimeout) clearTimeout(hoverTimeout)
    hoverTimeout = setTimeout(() => {
      hoveredFeat = feat
      globeInstance.polygonCapColor(capColor).polygonAltitude(altitude)
      if (container.value) container.value.style.cursor = feat ? 'pointer' : 'default'
    }, 16) // ~60fps
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  globeInstance = (Globe as any)({ animateIn: false })
    .globeImageUrl('https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
    .backgroundImageUrl('https://unpkg.com/three-globe/example/img/night-sky.png')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .polygonsData((geojson as any).features)
    .polygonCapColor(capColor)
    .polygonSideColor(() => 'rgba(0,0,0,0.12)')
    .polygonStrokeColor(() => 'rgba(255,255,255,0.35)')
    .polygonAltitude(altitude)
    .polygonLabel((feat: GeoJsonFeature) => {
      const nation = nationMap.get(Number(feat.id)) as Nation | undefined
      if (!nation) return '<div style="font:0.75rem sans-serif;color:#ccc">🌐 Not a UN member</div>'
      const c = STATUS_COLORS[nation.status] ?? '#6b7280'
      return `<div style="font:0.8rem sans-serif"><b>${nation.flag} ${nation.name}</b><br><span style="color:${c}">● ${nation.status}</span></div>`
    })
    .onPolygonHover(debouncedHover)
    .width(w)
    .height(h)(globeMount.value)

  // Register click handler after mount so THREE.js raycasting is fully wired

  globeInstance.onPolygonClick(async (feat: GeoJsonFeature | null, event: GlobeEvent) => {
    if (!feat) return

    const nation = nationMap.get(Number(feat.id)) as Nation | undefined
    dLog('[GLOBE] polygon clicked, feat.id=', feat.id, 'nation=', nation?.name)

    // Optimize coordinate calculation
    const getMouseCoordinates = () => {
      if (event && event.originalEvent) {
        return { x: event.originalEvent.clientX, y: event.originalEvent.clientY }
      } else if (event && typeof event.clientX === 'number') {
        return { x: event.clientX, y: event.clientY }
      } else {
        const globalEvent = window.event as MouseEvent | undefined
        return { x: globalEvent?.clientX || 0, y: globalEvent?.clientY || 0 }
      }
    }

    const { x: mouseX, y: mouseY } = getMouseCoordinates()
    dLog('[GLOBE] Mouse coordinates:', { mouseX, mouseY })

    // Show click indicator for debugging
    if (container.value) {
      const containerRect = container.value.getBoundingClientRect()
      const relativeX = mouseX - containerRect.left
      const relativeY = (mouseY || 0) - containerRect.top

      clickIndicator.value = true
      clickIndicatorStyle.value = {
        position: 'absolute',
        left: `${relativeX - 5}px`,
        top: `${relativeY - 5}px`
      }

      // Hide click indicator after 1 second
      setTimeout(() => {
        clickIndicator.value = false
      }, 1000)
    }

    // Calculate popup position near mouse cursor
    const popupPositionResult = calculatePopupPosition(mouseX, mouseY || 0)
    popupPosition.value = popupPositionResult
    popupStyle.value = {
      position: 'absolute',
      left: `${popupPositionResult.x}px`,
      top: `${popupPositionResult.y}px`
    }

    selectedNation.value = nation
      ? { ...nation }
      : {
          numericCode: -1,
          code: '',
          name: (feat.properties?.name as string) ?? 'Unknown Territory',
          flag: '🌐',
          status: 'Member' as const,
          owner: '—',
          leader: '—'
        }
    dLog('[GLOBE] selectedNation set to:', selectedNation.value?.name)
    dLog('[GLOBE] container children count:', container.value?.childElementCount)

    // Optimize popup positioning - use requestAnimationFrame for smooth updates
    const raf =
      (
        globalThis as typeof globalThis & {
          requestAnimationFrame?: (cb: (time: number) => void) => number
        }
      ).requestAnimationFrame || ((cb: (time: number) => void) => setTimeout(cb, 16))
    raf(async () => {
      await nextTick()
      const popupEls = document.querySelectorAll('.globe-popup')

      if (popupEls.length > 0) {
        const popupEl = popupEls[0] as HTMLElement

        // Recalculate position with actual popup dimensions
        const correctedPosition = calculatePopupPosition(mouseX, mouseY || 0, popupEl)
        popupStyle.value = {
          position: 'absolute',
          left: `${correctedPosition.x}px`,
          top: `${correctedPosition.y}px`
        }

        dLog('[POPUP] DOM inspection after position correction:')
        const cs = window.getComputedStyle(popupEl)
        const rect = popupEl.getBoundingClientRect()
        dLog('[POPUP:CSS] display:', cs.display)
        dLog('[POPUP:CSS] visibility:', cs.visibility)
        dLog('[POPUP:CSS] opacity:', cs.opacity)
        dLog('[POPUP:CSS] z-index:', cs.zIndex)
        dLog('[POPUP:CSS] position:', cs.position)
        dLog(
          '[POPUP:RECT] top:',
          rect.top,
          'left:',
          rect.left,
          'width:',
          rect.width,
          'height:',
          rect.height
        )

        // Walk parent chain for overflow / clip-path
        let parent = popupEl.parentElement
        let depth = 0
        while (parent && depth < 5) {
          const pcs = window.getComputedStyle(parent)
          dLog(
            `[POPUP:PARENT depth=${depth}]`,
            parent.className || parent.tagName,
            '| overflow:',
            pcs.overflow,
            '| clip-path:',
            pcs.clipPath,
            '| z-index:',
            pcs.zIndex,
            '| position:',
            pcs.position
          )
          parent = parent.parentElement
          depth++
        }
      } else {
        dWarn(
          '[POPUP:DOM] popup NOT in DOM after nextTick — v-if is false or template not re-rendering'
        )
        dLog('[POPUP:DOM] selectedNation.value at nextTick:', selectedNation.value?.name ?? null)
      }
    })
  })

  // Optimize resize observer with throttling
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const RO = (globalThis as any).ResizeObserver
  if (RO) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resizeObserver = new RO((entries: any[]) => {
      if (resizeTimeout) clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(() => {
        for (const entry of entries) {
          const { width, height } = entry.contentRect
          globeInstance?.width(width).height(height)
        }
      }, 100) // Throttle resize events
    })
    resizeObserver.observe(globeMount.value)
  }

  loading.value = false
})

onUnmounted(() => {
  // Clean up timeouts
  if (hoverTimeout) clearTimeout(hoverTimeout)
  if (resizeTimeout) clearTimeout(resizeTimeout)

  resizeObserver?.disconnect()
  if (globeInstance) {
    try {
      globeInstance.renderer()?.dispose()
      globeInstance.renderer()?.forceContextLoss()
    } catch {
      // noop
    }
    globeInstance = null
  }
})
</script>

<style scoped>
.globe-container {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  background: #000c1d;
  clip-path: inset(0);
}

.globe-mount {
  position: absolute;
  inset: 0;
}

.globe-loading {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  color: #60a5fa;
  z-index: 10;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(96, 165, 250, 0.15);
  border-top: 4px solid #60a5fa;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.globe-popup {
  position: absolute;
  z-index: 200;
  background: rgba(255, 255, 255, 0.96);
  border-radius: 0.625rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
  min-width: 200px;
  font-family: 'Segoe UI', sans-serif;
  overflow: hidden;
  pointer-events: auto;
  transition: opacity 0.2s ease;
}

.globe-popup-close {
  position: absolute;
  top: 0.4rem;
  right: 0.5rem;
  background: none;
  border: none;
  font-size: 0.8rem;
  color: #6b7280;
  cursor: pointer;
  line-height: 1;
}

.unp-head {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 2rem 0.4rem 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.unp-flag {
  font-size: 1.4rem;
  line-height: 1;
}
.unp-name {
  font-size: 0.95rem;
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

.popup-fade-enter-active,
.popup-fade-leave-active {
  transition:
    opacity 0.2s,
    transform 0.2s;
}

.popup-fade-enter-from,
.popup-fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

[data-theme='dark'] .globe-popup {
  background: rgba(31, 41, 55, 0.97);
  border: 1px solid #374151;
}

[data-theme='dark'] .unp-head {
  border-color: #374151;
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
[data-theme='dark'] .globe-popup-close {
  color: #9ca3af;
}

.click-indicator {
  position: absolute;
  width: 10px;
  height: 10px;
  background: rgba(255, 0, 0, 0.8);
  border-radius: 50%;
  border: 2px solid #fff;
  z-index: 300;
  pointer-events: none;
  animation: pulse 1s ease-out;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
  }
}
</style>
