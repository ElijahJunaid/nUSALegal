<template>
  <div class="statistics-page">
    <div class="container">
      <h1>nUSA Legal Statistics</h1>
      <p class="subtitle">Analytics, trends, and performance metrics from the legal system</p>

      <div class="tabs">
        <button 
          v-for="tab in tabs" 
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="{ active: activeTab === tab.id }"
          class="tab-button"
        >
          {{ tab.label }}
        </button>
      </div>

      <div class="tab-content">
        <!-- Case Statistics Tab -->
        <div v-if="activeTab === 'cases'" class="stats-section">
          <h2>Case Statistics</h2>
          
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-value">{{ caseStats.totalCases }}</div>
              <div class="stat-label">Total Cases Filed</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">{{ caseStats.convictionRate }}%</div>
              <div class="stat-label">Conviction Rate</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">{{ caseStats.avgSentence }}</div>
              <div class="stat-label">Avg Sentence (months)</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">{{ caseStats.activeTrials }}</div>
              <div class="stat-label">Active Trials</div>
            </div>
          </div>

          <div class="chart-section">
            <h3>Most Common Charges</h3>
            <div class="chart-container">
              <div 
                v-for="charge in topCharges" 
                :key="charge.name"
                class="bar-chart-row"
              >
                <div class="charge-name">{{ charge.name }}</div>
                <div class="bar-wrapper">
                  <div 
                    class="bar" 
                    :style="{ width: charge.percentage + '%' }"
                  ></div>
                  <span class="bar-label">{{ charge.count }} cases</span>
                </div>
              </div>
            </div>
          </div>

          <div class="chart-section">
            <h3>Case Outcomes</h3>
            <div class="outcome-grid">
              <div 
                v-for="outcome in caseOutcomes" 
                :key="outcome.type"
                class="outcome-card"
                :style="{ borderColor: outcome.color }"
              >
                <div class="outcome-percentage" :style="{ color: outcome.color }">
                  {{ outcome.percentage }}%
                </div>
                <div class="outcome-label">{{ outcome.type }}</div>
                <div class="outcome-count">{{ outcome.count }} cases</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Legal Analytics Tab -->
        <div v-if="activeTab === 'analytics'" class="stats-section">
          <h2>Legal Analytics</h2>

          <div class="analytics-grid">
            <div class="analytics-card">
              <h3>Prosecution Success Rates by Department</h3>
              <div class="dept-stats">
                <div 
                  v-for="dept in departmentStats" 
                  :key="dept.name"
                  class="dept-row"
                >
                  <span class="dept-name">{{ dept.name }}</span>
                  <div class="progress-bar">
                    <div 
                      class="progress-fill" 
                      :style="{ width: dept.winRate + '%', background: dept.color }"
                    ></div>
                  </div>
                  <span class="dept-percentage">{{ dept.winRate }}%</span>
                </div>
              </div>
            </div>

            <div class="analytics-card">
              <h3>Common Defense Strategies</h3>
              <div class="defense-list">
                <div 
                  v-for="defense in commonDefenses" 
                  :key="defense.strategy"
                  class="defense-item"
                >
                  <div class="defense-header">
                    <span class="defense-name">{{ defense.strategy }}</span>
                    <span class="defense-success">{{ defense.successRate }}% success</span>
                  </div>
                  <div class="defense-usage">
                    Used {{ defense.timesUsed }} times
                  </div>
                </div>
              </div>
            </div>

            <div class="analytics-card full-width">
              <h3>Sentencing Trends</h3>
              <div class="trend-info">
                <p><strong>Average Sentence Length:</strong> {{ sentencingTrends.avgLength }} months</p>
                <p><strong>Most Common Sentence:</strong> {{ sentencingTrends.mostCommon }}</p>
                <p><strong>Plea Bargain Rate:</strong> {{ sentencingTrends.pleaRate }}%</p>
                <p><strong>Appeal Success Rate:</strong> {{ sentencingTrends.appealRate }}%</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Leaderboard Tab -->
        <div v-if="activeTab === 'leaderboard'" class="stats-section">
          <h2>Leaderboards</h2>

          <div class="leaderboard-grid">
            <div class="leaderboard-card">
              <h3>🏆 Top Prosecutors</h3>
              <div class="leaderboard-list">
                <div 
                  v-for="(attorney, index) in topProsecutors" 
                  :key="attorney.name"
                  class="leaderboard-item"
                  :class="{ 'top-three': index < 3 }"
                >
                  <span class="rank">{{ index + 1 }}</span>
                  <span class="attorney-name">{{ attorney.name }}</span>
                  <span class="attorney-stats">
                    {{ attorney.wins }}W - {{ attorney.losses }}L ({{ attorney.winRate }}%)
                  </span>
                </div>
              </div>
            </div>

            <div class="leaderboard-card">
              <h3>⚖️ Top Defense Attorneys</h3>
              <div class="leaderboard-list">
                <div 
                  v-for="(attorney, index) in topDefense" 
                  :key="attorney.name"
                  class="leaderboard-item"
                  :class="{ 'top-three': index < 3 }"
                >
                  <span class="rank">{{ index + 1 }}</span>
                  <span class="attorney-name">{{ attorney.name }}</span>
                  <span class="attorney-stats">
                    {{ attorney.wins }}W - {{ attorney.losses }}L ({{ attorney.winRate }}%)
                  </span>
                </div>
              </div>
            </div>

            <div class="leaderboard-card">
              <h3>👨‍⚖️ Most Active Judges</h3>
              <div class="leaderboard-list">
                <div 
                  v-for="(judge, index) in topJudges" 
                  :key="judge.name"
                  class="leaderboard-item"
                >
                  <span class="rank">{{ index + 1 }}</span>
                  <span class="attorney-name">{{ judge.name }}</span>
                  <span class="attorney-stats">{{ judge.casesPresided }} cases</span>
                </div>
              </div>
            </div>

            <div class="leaderboard-card">
              <h3>🔥 Most Active Departments</h3>
              <div class="leaderboard-list">
                <div 
                  v-for="(dept, index) in mostActiveDepts" 
                  :key="dept.name"
                  class="leaderboard-item"
                >
                  <span class="rank">{{ index + 1 }}</span>
                  <span class="attorney-name">{{ dept.name }}</span>
                  <span class="attorney-stats">{{ dept.casesFiled }} cases filed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

definePageMeta({
  title: 'Statistics',
  description: 'Legal statistics, analytics, and leaderboards'
})

const activeTab = ref('cases')

const tabs = [
  { id: 'cases', label: 'Case Statistics' },
  { id: 'analytics', label: 'Legal Analytics' },
  { id: 'leaderboard', label: 'Leaderboards' }
]

const caseStats = ref({
  totalCases: 0,
  convictionRate: 0,
  avgSentence: 0,
  activeTrials: 0
})

const topCharges = ref([])
const caseOutcomes = ref([])
const departmentStats = ref([])
const commonDefenses = ref([])
const sentencingTrends = ref({
  avgLength: 0,
  mostCommon: '',
  pleaRate: 0,
  appealRate: 0
})
const topProsecutors = ref([])
const topDefense = ref([])
const topJudges = ref([])
const mostActiveDepts = ref([])

onMounted(async () => {
  try {
    const data = await $fetch('/api/statistics') as any
    
    caseStats.value = data.caseStats
    topCharges.value = data.topCharges
    caseOutcomes.value = data.caseOutcomes
    departmentStats.value = data.departmentStats
    commonDefenses.value = data.commonDefenses
    sentencingTrends.value = data.sentencingTrends
    topProsecutors.value = data.topProsecutors
    topDefense.value = data.topDefense
    topJudges.value = data.topJudges
    mostActiveDepts.value = data.mostActiveDepts
  } catch (error) {
    console.error('Failed to fetch statistics:', error)
  }
})
</script>

<style scoped>
.statistics-page {
  min-height: 100vh;
  padding: 2rem;
  background: linear-gradient(135deg, #1e3a8a 0%, #3730a3 100%);
}

.container {
  max-width: 1400px;
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
  text-align: center;
}

.subtitle {
  color: #718096;
  text-align: center;
  margin-bottom: 2rem;
}

.tabs {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 2px solid #e2e8f0;
}

.tab-button {
  padding: 0.75rem 1.5rem;
  background: none;
  border: none;
  border-bottom: 3px solid transparent;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  color: #64748b;
  transition: all 0.3s ease;
}

.tab-button:hover {
  color: #1e3a8a;
}

.tab-button.active {
  color: #1e3a8a;
  border-bottom-color: #1e3a8a;
}

.stats-section h2 {
  font-size: 2rem;
  margin-bottom: 1.5rem;
  color: #1a202c;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.stat-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  border-radius: 0.5rem;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.stat-value {
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 0.875rem;
  opacity: 0.9;
}

.chart-section {
  margin-bottom: 3rem;
}

.chart-section h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #2d3748;
}

.chart-container {
  background: #f7fafc;
  padding: 1.5rem;
  border-radius: 0.5rem;
}

.bar-chart-row {
  display: grid;
  grid-template-columns: 150px 1fr;
  gap: 1rem;
  align-items: center;
  margin-bottom: 1rem;
}

.charge-name {
  font-weight: 500;
  color: #2d3748;
}

.bar-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.bar {
  height: 30px;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.bar-label {
  font-size: 0.875rem;
  color: #64748b;
  white-space: nowrap;
}

.outcome-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1.5rem;
}

.outcome-card {
  background: white;
  border: 3px solid;
  padding: 1.5rem;
  border-radius: 0.5rem;
  text-align: center;
}

.outcome-percentage {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.outcome-label {
  font-size: 1rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.25rem;
}

.outcome-count {
  font-size: 0.875rem;
  color: #64748b;
}

.analytics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
}

.analytics-card {
  background: #f7fafc;
  padding: 1.5rem;
  border-radius: 0.5rem;
}

.analytics-card.full-width {
  grid-column: 1 / -1;
}

.analytics-card h3 {
  font-size: 1.25rem;
  margin-bottom: 1rem;
  color: #2d3748;
}

.dept-stats {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.dept-row {
  display: grid;
  grid-template-columns: 120px 1fr 60px;
  gap: 1rem;
  align-items: center;
}

.dept-name {
  font-weight: 500;
  color: #2d3748;
}

.progress-bar {
  height: 24px;
  background: #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  transition: width 0.3s ease;
}

.dept-percentage {
  font-weight: 600;
  color: #2d3748;
  text-align: right;
}

.defense-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.defense-item {
  padding: 1rem;
  background: white;
  border-radius: 0.5rem;
  border-left: 4px solid #3b82f6;
}

.defense-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.defense-name {
  font-weight: 600;
  color: #2d3748;
}

.defense-success {
  color: #10b981;
  font-weight: 600;
}

.defense-usage {
  font-size: 0.875rem;
  color: #64748b;
}

.trend-info {
  background: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
}

.trend-info p {
  margin: 0.75rem 0;
  color: #2d3748;
}

.leaderboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
}

.leaderboard-card {
  background: #f7fafc;
  padding: 1.5rem;
  border-radius: 0.5rem;
}

.leaderboard-card h3 {
  font-size: 1.25rem;
  margin-bottom: 1rem;
  color: #2d3748;
}

.leaderboard-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.leaderboard-item {
  display: grid;
  grid-template-columns: 40px 1fr auto;
  gap: 1rem;
  align-items: center;
  padding: 0.75rem;
  background: white;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
}

.leaderboard-item:hover {
  transform: translateX(4px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.leaderboard-item.top-three {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  font-weight: 600;
}

.rank {
  font-size: 1.25rem;
  font-weight: bold;
  color: #1e3a8a;
  text-align: center;
}

.attorney-name {
  color: #2d3748;
}

.attorney-stats {
  color: #64748b;
  font-size: 0.875rem;
  white-space: nowrap;
}

@media (max-width: 768px) {
  .analytics-grid {
    grid-template-columns: 1fr;
  }
  
  .leaderboard-grid {
    grid-template-columns: 1fr;
  }
  
  .tabs {
    flex-direction: column;
  }
}
</style>
