<template>
  <div class="roblox-check-page">
    <div class="search-container" style="width: 90%;">
      <h1>Roblox User Background Check</h1>
      <div class="search-input-group">
        <input 
          v-model="username" 
          type="text" 
          placeholder="Enter Roblox username"
          @keypress.enter="checkUser"
        >
        <button class="search-button" @click="checkUser" role="button">Search</button>
      </div>
      <div v-if="loading" class="loading">Searching...</div>
      <div v-if="error" class="error">{{ error }}</div>
      <div v-if="result" id="result">
        <h2>Background Check Results for {{ result.name }}</h2>
        <div class="assessment-section">
          <h3>Background Check Results</h3>
          <p>
            <strong>Hiring Status:</strong> 
            <span :style="{ color: getStatusColor(assessments.hiring.result) }">
              {{ assessments.hiring.result }}
            </span>
            <br>
            <small>{{ assessments.hiring.reason }}</small>
          </p>
          <p>
            <strong>EOS Compliance:</strong> 
            <span :style="{ color: getStatusColor(assessments.eos.result) }">
              {{ assessments.eos.result }}
            </span>
            <br>
            <small>{{ assessments.eos.reason }}</small>
          </p>
          <p>
            <strong>Ban Status:</strong> 
            <span :style="{ color: getStatusColor(assessments.ban.result) }">
              {{ assessments.ban.result }}
            </span>
            <br>
            <small>{{ assessments.ban.reason }}</small>
          </p>
        </div>
        <button 
          class="profile-toggle" 
          :class="{ open: showProfile }"
          @click="toggleProfile" 
          role="button"
        >
          {{ showProfile ? 'Hide Profile' : 'View Full Profile' }}
        </button>
        <div v-if="showProfile" class="profile-section" style="display: block;">
          <h3>Profile Information</h3>
          <p><strong>Display Name:</strong> {{ result.display_name }}</p>
          <p><strong>Account Created:</strong> {{ accountAge.date }} ({{ accountAge.ageString }} old)</p>
          <p><strong>Account Status:</strong> {{ result.is_banned ? 'BANNED' : 'Active' }}</p>
          <p><strong>Friends Count:</strong> {{ result.friends_count }}</p>
          <p><strong>Badges:</strong> <span class="badge-count">{{ result.badges_count }}</span></p>
          <p><strong>Description:</strong> {{ result.description || 'No description' }}</p>
          <p><strong>Groups:</strong></p>
          <ul class="group-list">
            <li v-for="(group, index) in result.groups" :key="index">
              {{ group.group_name }} ({{ group.role_name }})
            </li>
          </ul>
          <p><a :href="`https://www.roblox.com/users/${result.userId}/profile`" target="_blank">View Roblox Profile</a></p>
        </div>
      </div>
    </div>
    <button 
      class="theme-toggle" 
      @click="toggleTheme" 
      :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'" 
      role="button"
    >
      {{ isDark ? '☀️' : '🌙' }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

const username = ref('')
const loading = ref(false)
const error = ref('')
const result = ref<any>(null)
const showProfile = ref(false)
const isDark = ref(false)

interface Assessment {
  result: string
  reason: string
}

const assessments = ref<{
  hiring: Assessment
  eos: Assessment
  ban: Assessment
}>({
  hiring: { result: '', reason: '' },
  eos: { result: '', reason: '' },
  ban: { result: '', reason: '' }
})

const accountAge = computed(() => {
  if (!result.value?.created) return { date: '', ageString: '' }
  
  const created = new Date(result.value.created)
  const createdDate = created.toLocaleDateString()
  const now = new Date()
  const ageInDays = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24))
  const ageInYears = Math.floor(ageInDays / 365)
  const ageString = ageInYears > 0 ? `${ageInYears} years` : `${ageInDays} days`
  
  return { date: createdDate, ageString }
})

async function checkUser() {
  if (!username.value.trim()) {
    error.value = 'Please enter a username'
    return
  }

  loading.value = true
  error.value = ''
  result.value = null
  showProfile.value = false

  try {
    const response = await $fetch(`/api/robloxcheck?username=${encodeURIComponent(username.value)}`)
    result.value = response

    assessments.value.hiring = await hiringAssessment(response)
    assessments.value.eos = eosAssessment(response)
    assessments.value.ban = banAssessment(response)
  } catch (err: any) {
    error.value = err.statusCode === 404 ? 'User not found' : 'Error checking user'
  } finally {
    loading.value = false
  }
}

async function hiringAssessment(data: any): Promise<Assessment> {
  const created = new Date(data.created)
  const now = new Date()
  const ageInDays = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24))

  if (data.is_banned) return { result: 'DO NOT HIRE', reason: 'Tier 1: Account is banned' }
  if (ageInDays < 30) return { result: 'DO NOT HIRE', reason: 'Tier 1: Account too new' }
  if (data.friends_count < 5) return { result: 'CAUTION', reason: 'Tier 1: Limited social activity' }

  try {
    const userId = String(data.id || '')
    
    if (userId && /^[0-9]+$/.test(userId)) {
      const banResponse = await $fetch<{ result: string; reason: string }>('/api/check-nusa-bans', {
        method: 'POST',
        body: { userId }
      })
      
      if (banResponse && banResponse.result === 'DO NOT HIRE') {
        return { result: banResponse.result, reason: banResponse.reason }
      }
    }
  } catch (error) {
    
  }

  if (!data.nusa_info) return { result: 'DO NOT HIRE', reason: 'Tier 2: Not a member of nUSA' }
  if (data.federal_prisoner) return { result: 'DO NOT HIRE', reason: 'Tier 2: Federal Prisoner in nUSA' }
  if (data.group_bans.hasLimitedRanks) return { result: 'DO NOT HIRE', reason: 'Tier 2: Has too many high ranks in agencies' }
  if (data.group_bans.tooManyGroups) return { result: 'DO NOT HIRE', reason: `Tier 2: Member of too many agencies: (${data.group_bans.limitedGroupCount})` }
  if (data.trello_checks.hasSevereBans) return { result: 'DO NOT HIRE', reason: 'Tier 2: Found in severe property ban list' }
  if (data.group_bans.has_minor_bans) return { result: 'CAUTION', reason: 'Tier 2: Member of cautioned group' }
  if (data.trello_checks.has_blacklists) return { result: 'CAUTION', reason: 'Tier 2: Department blacklist found' }
  if (data.group_bans.has_severe_bans) return { result: 'DO NOT HIRE', reason: 'Tier 2: Member of banned group' }
  if (data.trello_checks.has_bans) return { result: 'DO NOT HIRE', reason: 'Tier 2: Property ban found' }
  if (data.trello_checks.hasMinorBans) return { result: 'CAUTION', reason: 'Tier 2: Found in minor property ban list' }

  return { result: 'CONSIDER HIRING', reason: 'All background checks passed' }
}

function eosAssessment(data: any): Assessment {
  const suspiciousGroups = data.groups.some((g: any) =>
    g.group_name.toLowerCase().includes('hack') ||
    g.group_name.toLowerCase().includes('exploit')
  )
  if (suspiciousGroups) return { result: 'WARNING', reason: 'Membership in suspicious groups' }
  return { result: 'PASS', reason: 'No obvious EOS violations detected' }
}

function banAssessment(data: any): Assessment {
  if (data.is_banned) return { result: 'BANNED', reason: 'Account currently banned' }
  return { result: 'CLEAN', reason: 'No current bans' }
}

function getStatusColor(status: string): string {
  switch (status) {
    case 'DO NOT HIRE':
    case 'BANNED':
    case 'WARNING':
      return '#d32f2f'
    case 'CAUTION':
      return '#ff9800'
    case 'CONSIDER HIRING':
    case 'PASS':
    case 'CLEAN':
      return '#2e7d32'
    default:
      return '#000000'
  }
}

function toggleProfile() {
  showProfile.value = !showProfile.value
}

function toggleTheme() {
  isDark.value = !isDark.value
  const newTheme = isDark.value ? 'dark' : 'light'
  document.documentElement.setAttribute('data-theme', newTheme)
  localStorage.setItem('theme', newTheme)
}

onMounted(() => {
  
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme) {
    isDark.value = savedTheme === 'dark'
    document.documentElement.setAttribute('data-theme', savedTheme)
  }
})
</script>

<style scoped>
.roblox-check-page {
  min-height: 100vh;
  padding: 2rem;
}

.search-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background: var(--bg-secondary, #f5f5f5);
  border-radius: 8px;
}

.search-container h1,
.search-container h2,
.search-container h3 {
  text-align: center;
}

.search-input-group {
  display: flex;
  gap: 1rem;
  margin: 1.5rem 0;
}

.search-input-group input {
  flex: 1;
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.search-button {
  padding: 0.75rem 2rem;
  background: #2e7d32;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

.search-button:hover {
  background: #1b5e20;
}

.loading {
  text-align: center;
  padding: 1rem;
  color: #666;
}

.error {
  padding: 1rem;
  background: #ffebee;
  color: #c62828;
  border-radius: 4px;
  margin: 1rem 0;
}

.assessment-section {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  margin: 1rem 0;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.assessment-section h3 {
  margin-top: 0;
}

.assessment-section p {
  margin: 1rem 0;
}

.profile-toggle {
  width: 100%;
  padding: 0.75rem;
  background: #1976d2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  margin: 1rem 0;
}

.profile-toggle:hover {
  background: #1565c0;
}

.profile-section {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  margin-top: 1rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.profile-section h3 {
  margin-top: 0;
}

.group-list {
  list-style-type: disc;
  padding-left: 2rem;
}

.group-list li {
  margin: 0.5rem 0;
}

.badge-count {
  font-weight: bold;
  color: #1976d2;
}

.theme-toggle {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: none;
  background: #1976d2;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0,0,0,0.3);
  z-index: 1000;
}

.theme-toggle:hover {
  background: #1565c0;
}

[data-theme="dark"] .search-container {
  background: #2d2d2d;
  color: #fff;
}

[data-theme="dark"] .assessment-section,
[data-theme="dark"] .profile-section {
  background: #1e1e1e;
  color: #fff;
}

[data-theme="dark"] .search-input-group input {
  background: #1e1e1e;
  color: #fff;
  border-color: #444;
}

[data-theme="dark"] .error {
  background: #5d1f1f;
  color: #ffcdd2;
}
</style>