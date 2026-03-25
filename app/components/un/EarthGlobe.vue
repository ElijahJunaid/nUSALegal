<template>
  <div class="globe-container" ref="container">
    <div v-if="loading" class="globe-loading">
      <div class="spinner"></div>
      <span>Loading the world...</span>
    </div>

    <transition name="popup-fade">
      <div v-if="selectedNation" class="globe-popup" @click.stop>
        <button class="globe-popup-close" @click="selectedNation = null" aria-label="Close">
          ✕
        </button>
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
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { unNations } from '~/data/un-nations'

type Nation = (typeof unNations)[0]

const container = ref<HTMLElement | null>(null)
const loading = ref(true)
const selectedNation = ref<Nation | null>(null)

const STATUS_COLORS: Record<string, string> = {
  Member: '#0099CC',
  Observer: '#22c55e',
  Allied: '#f59e0b'
}

function statusColor(s: string): string {
  return STATUS_COLORS[s] ?? '#6b7280'
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

  const [{ default: Globe }, topoRes, { feature }] = await Promise.all([
    import('globe.gl'),
    fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json').then(r => r.json()),
    import('topojson-client')
  ])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const geojson = feature(topoRes, topoRes.objects.countries) as any
  const nationMap = new Map(unNations.map(n => [n.numericCode, n]))

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let hoveredFeat: any = null

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function capColor(feat: any): string {
    if (feat === hoveredFeat) return 'rgba(255,255,255,0.55)'
    const nation = nationMap.get(Number(feat.id))
    if (!nation) return 'rgba(209,213,219,0.65)'
    return STATUS_COLORS[nation.status] ?? '#0099CC'
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function altitude(feat: any): number {
    return feat === hoveredFeat ? 0.025 : 0.01
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  globeInstance = (Globe as any)({ animateIn: false })
    .globeImageUrl('https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
    .backgroundImageUrl('https://unpkg.com/three-globe/example/img/night-sky.png')
    .polygonsData(geojson.features)
    .polygonCapColor(capColor)
    .polygonSideColor(() => 'rgba(0,0,0,0.12)')
    .polygonStrokeColor(() => 'rgba(255,255,255,0.35)')
    .polygonAltitude(altitude)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .polygonLabel((feat: any) => {
      const nation = nationMap.get(Number(feat.id))
      if (!nation) return '<div style="font:0.75rem sans-serif;color:#ccc">🌐 Not a UN member</div>'
      const c = STATUS_COLORS[nation.status] ?? '#6b7280'
      return `<div style="font:0.8rem sans-serif"><b>${nation.flag} ${nation.name}</b><br><span style="color:${c}">● ${nation.status}</span></div>`
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .onPolygonHover((feat: any) => {
      hoveredFeat = feat
      globeInstance.polygonCapColor(capColor).polygonAltitude(altitude)
      if (container.value) container.value.style.cursor = feat ? 'pointer' : 'default'
    })
    .width(w)
    .height(h)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .onPolygonClick((feat: any) => {
      const nation = nationMap.get(Number(feat.id))
      selectedNation.value = nation ?? {
        numericCode: -1,
        code: '',
        name: (feat.properties?.name as string) ?? 'Unknown Territory',
        flag: '🌐',
        status: 'Member' as const,
        owner: '—',
        leader: '—'
      }
    })(container.value)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const RO = (globalThis as any).ResizeObserver
  if (RO) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resizeObserver = new RO((entries: any[]) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect
        globeInstance?.width(width).height(height)
      }
    })
    resizeObserver.observe(container.value)
  }

  loading.value = false
})

onUnmounted(() => {
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
  top: 1rem;
  right: 1rem;
  z-index: 200;
  background: rgba(255, 255, 255, 0.96);
  border-radius: 0.625rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
  min-width: 200px;
  font-family: 'Segoe UI', sans-serif;
  overflow: hidden;
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
</style>
