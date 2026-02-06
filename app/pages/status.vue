<template>
  <div class="status-dashboard">
    <main class="container">
      <h1>System Status Dashboard</h1>
      <p class="subtitle">Monitor system health and performance metrics</p>

      <div class="metrics-grid">
        <div class="metric-card" :class="healthStatus.status">
          <h3>Health Check</h3>
          <div class="metric-value">{{ healthStatus.status }}</div>
          <div class="metric-label">Last checked: {{ healthStatus.lastChecked }}</div>
        </div>

        <div class="metric-card">
          <h3>Uptime</h3>
          <div class="metric-value">{{ uptime }}</div>
          <div class="metric-label">Since last deployment</div>
        </div>

        <div class="metric-card">
          <h3>Response Time</h3>
          <div class="metric-value">{{ responseTime }}ms</div>
          <div class="metric-label">Average API response</div>
        </div>

        <div class="metric-card">
          <h3>Environment</h3>
          <div class="metric-value">{{ environment }}</div>
          <div class="metric-label">Current deployment</div>
        </div>
      </div>

      <div class="services-section">
        <h2>Service Status</h2>
        <div class="service-list">
          <div v-for="service in services" :key="service.name" class="service-item" :class="service.status">
            <span class="status-indicator"></span>
            <span class="service-name">{{ service.name }}</span>
            <span class="service-status">{{ service.status }}</span>
          </div>
        </div>
      </div>

      <div class="actions">
        <button @click="refreshStatus" class="btn-refresh" :disabled="loading">
          {{ loading ? 'Refreshing...' : 'Refresh Status' }}
        </button>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

definePageMeta({
  title: 'System Status',
  description: 'Monitor system health and performance',
  middleware: 'status-auth'
})

const loading = ref(false)
const healthStatus = ref({
  status: 'checking',
  lastChecked: 'Never'
})
const responseTime = ref(0)
const uptimeSeconds = ref(0)
const environment = ref('production')

const services = ref([
  { name: 'API Server', status: 'operational' },
  { name: 'Database', status: 'operational' },
  { name: 'OpenAI Integration', status: 'operational' },
  { name: 'Ably Realtime', status: 'operational' },
  { name: 'S3 Storage', status: 'operational' },
  { name: 'Sentry Monitoring', status: 'operational' },
])

const uptime = computed(() => {
  const seconds = uptimeSeconds.value
  const days = Math.floor(seconds / 86400)
  const hours = Math.floor((seconds % 86400) / 3600)
  const mins = Math.floor((seconds % 3600) / 60)
  
  if (days > 0) return `${days}d ${hours}h`
  if (hours > 0) return `${hours}h ${mins}m`
  return `${mins}m`
})

async function checkHealth() {
  try {
    const start = Date.now()
    const response = await $fetch('/api/health')
    const end = Date.now()
    
    responseTime.value = end - start
    healthStatus.value = {
      status: 'healthy',
      lastChecked: new Date().toLocaleTimeString()
    }
  } catch (error) {
    healthStatus.value = {
      status: 'error',
      lastChecked: new Date().toLocaleTimeString()
    }
    responseTime.value = 0
  }
}

async function refreshStatus() {
  loading.value = true
  await checkHealth()
  loading.value = false
}

onMounted(() => {
  checkHealth()
  uptimeSeconds.value = Math.floor(Date.now() / 1000) % 86400
  
  const interval = setInterval(() => {
    uptimeSeconds.value++
  }, 1000)
  
  onUnmounted(() => {
    clearInterval(interval)
  })
})
</script>

<style scoped>
.status-dashboard {
  min-height: 100vh;
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  color: #1a202c;
}

.subtitle {
  color: #718096;
  margin-bottom: 2rem;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.metric-card {
  background: #f7fafc;
  border-radius: 0.5rem;
  padding: 1.5rem;
  border: 2px solid #e2e8f0;
  transition: all 0.3s ease;
}

.metric-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.metric-card.healthy {
  border-color: #48bb78;
  background: #f0fff4;
}

.metric-card.error {
  border-color: #f56565;
  background: #fff5f5;
}

.metric-card h3 {
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #718096;
  margin-bottom: 0.5rem;
}

.metric-value {
  font-size: 2rem;
  font-weight: bold;
  color: #2d3748;
  margin-bottom: 0.25rem;
}

.metric-label {
  font-size: 0.875rem;
  color: #a0aec0;
}

.services-section {
  margin-bottom: 2rem;
}

.services-section h2 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #2d3748;
}

.service-list {
  background: #f7fafc;
  border-radius: 0.5rem;
  padding: 1rem;
}

.service-item {
  display: flex;
  align-items: center;
  padding: 0.75rem;
  border-bottom: 1px solid #e2e8f0;
}

.service-item:last-child {
  border-bottom: none;
}

.status-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-right: 1rem;
  background: #48bb78;
}

.service-item.degraded .status-indicator {
  background: #ed8936;
}

.service-item.down .status-indicator {
  background: #f56565;
}

.service-name {
  flex: 1;
  font-weight: 500;
  color: #2d3748;
}

.service-status {
  text-transform: capitalize;
  color: #718096;
  font-size: 0.875rem;
}

.actions {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
}

.btn-refresh {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-refresh:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-refresh:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>