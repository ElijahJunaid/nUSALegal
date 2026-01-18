<template>
  <div class="mock-trial-page">
    <ToastContainer />
    <ReconnectionDialog 
      :show="isReconnecting" 
      :attempts="reconnectAttempts" 
      :countdown="reconnectCountdown"
      @cancel="handleReconnectCancel"
    />
    <main id="main-content">
      <h1>Mock Trial Simulator</h1>
      <p>Experience an interactive court simulation with AI-powered roles. Choose your role and participate in a realistic trial proceeding.</p>

      <div v-if="!showLobby && !showTrialSetup && !showSimulation" class="mode-selection" role="navigation" aria-label="Trial mode selection">
        <button class="mode-button" @click="startSinglePlayer" :disabled="isLoading" aria-label="Start single player trial">
          Single Player
        </button>
        <button class="mode-button" @click="createLobby" :disabled="isLoading" aria-label="Create multiplayer lobby">
          <span v-if="!isLoading">Create Lobby</span>
          <span v-else class="loading">Creating...</span>
        </button>
        <div class="join-section">
          <input
            v-model="lobbyCodeInput"
            type="text"
            id="lobby-code"
            placeholder="Enter Lobby Code"
            maxlength="6"
            :class="{ 'input-error': lobbyCodeError }"
            :disabled="isLoading"
            @input="handleLobbyCodeInput"
            aria-label="Lobby code input"
            aria-describedby="lobby-code-error"
            :aria-invalid="!!lobbyCodeError"
            tabindex="0"
          />
          <button class="mode-button" @click="joinLobby" :disabled="isLoading || !lobbyCodeInput.trim()" aria-label="Join existing lobby">
            <span v-if="!isLoading">Join Lobby</span>
            <span v-else class="loading">Joining...</span>
          </button>
        </div>
        <span v-if="lobbyCodeError" class="error-message" id="lobby-code-error" role="alert">{{ lobbyCodeError }}</span>
      </div>

      <div v-if="showLobby" class="lobby-interface">
        <div class="lobby-header">
          <h2>Trial Lobby</h2>
          <div class="lobby-code-display">
            Lobby Code: <span>{{ lobbyCode }}</span>
          </div>
        </div>

        <div class="lobby-content">
          
          <div v-if="isLobbyLeader" class="lobby-settings">
            <div class="case-selection">
              <h3>Select Case Type</h3>
              <div class="toggle-buttons">
                <button
                  class="toggle-button"
                  :class="{ selected: selectedCaseType === 'criminal' }"
                  @click="selectCaseType('criminal')"
                >
                  Criminal
                </button>
                <button
                  class="toggle-button"
                  :class="{ selected: selectedCaseType === 'civil' }"
                  @click="selectCaseType('civil')"
                >
                  Civil
                </button>
              </div>
            </div>

            <div v-if="selectedCaseType" class="case-browser">
              <h3>Select Case</h3>
              <div v-if="availableCases.length > 0" class="case-list">
                <div
                  v-for="caseItem in availableCases"
                  :key="caseItem.id"
                  class="case-card"
                  :class="{ selected: selectedCase?.id === caseItem.id }"
                  @click="selectCase(caseItem)"
                >
                  <div class="case-card-header">
                    <h4>{{ caseItem.title }}</h4>
                    <span v-if="caseItem.difficulty" class="case-difficulty">{{ caseItem.difficulty }}</span>
                  </div>
                  <p class="case-description">{{ caseItem.description }}</p>
                  <div v-if="selectedCase?.id === caseItem.id" class="selected-badge">✓ Selected</div>
                </div>
              </div>
              <div v-else class="no-cases">
                <p>Loading cases...</p>
              </div>
            </div>

            <div v-if="!isLobbyLeader && selectedCase" class="selected-case-display">
              <h3>Selected Case</h3>
              <div class="case-card selected">
                <div class="case-card-header">
                  <h4>{{ selectedCase.title }}</h4>
                  <span v-if="selectedCase.difficulty" class="case-difficulty">{{ selectedCase.difficulty }}</span>
                </div>
                <p class="case-description">{{ selectedCase.description }}</p>
              </div>
            </div>
            <div v-if="!isLobbyLeader && !selectedCase" class="waiting-message">
              <p>⏳ Waiting for leader to select a case...</p>
            </div>
          </div>

          <div class="players-section">
            <div class="players-header">
              <h3>Players</h3>
              <div class="player-count">
                <span>{{ playerCount }}</span> / 5
              </div>
            </div>
            <div class="players-list">
              <div
                v-for="player in players"
                :key="player.name"
                class="player-item"
              >
                <div class="player-avatar">{{ player.name.charAt(0).toUpperCase() }}</div>
                <div class="player-info">
                  <span class="player-name">{{ player.name }}</span>
                  <span v-if="player.role" class="player-role">{{ player.role }}</span>
                  <span v-else class="player-role no-role">No role</span>
                </div>
                <span v-if="player.isLeader" class="leader-badge">👑</span>
              </div>
            </div>

            <div class="roles-header">
              <h3>Roles</h3>
              <div class="role-status">Click to claim</div>
            </div>
            <div class="role-list">
              <div
                v-for="role in availableRoles"
                :key="role.id"
                class="role-item"
                :class="{ claimed: role.claimedBy }"
                @click="claimRole(role.id)"
              >
                <div class="role-info">
                  <span class="role-name">{{ role.name }}</span>
                  <span class="role-description">{{ role.description }}</span>
                </div>
                <span class="player-name">{{ role.claimedBy || 'Unclaimed' }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="lobby-controls">
          <button
            class="start-button"
            :disabled="!canStartTrial || isLoading"
            @click="startTrialFromLobby"
          >
            <span v-if="!isLoading">Start Trial</span>
            <span v-else class="loading">Starting...</span>
          </button>
          <button class="leave-button" @click="leaveLobby" :disabled="isLoading">
            Leave Lobby
          </button>
        </div>
      </div>

      <form v-if="showTrialSetup" class="trial-setup" @submit.prevent="confirmSetup" role="form" aria-label="Trial setup form">
        <section class="selection-row visible">
          <h2>Select Case Type</h2>
          <div class="card-container">
            <div
              class="selection-card"
              :class="{ selected: setupCaseType === 'criminal' }"
              @click="setupCaseType = 'criminal'"
              role="button"
              tabindex="0"
              aria-label="Select criminal case type"
              @keypress.enter="setupCaseType = 'criminal'"
              @keypress.space="setupCaseType = 'criminal'"
            >
              <h3>Criminal Case</h3>
              <p>Government prosecution of an individual for alleged criminal conduct</p>
            </div>
            <div
              class="selection-card"
              :class="{ selected: setupCaseType === 'civil' }"
              @click="setupCaseType = 'civil'"
              role="button"
              tabindex="0"
              aria-label="Select civil case type"
              @keypress.enter="setupCaseType = 'civil'"
              @keypress.space="setupCaseType = 'civil'"
            >
              <h3>Civil Case</h3>
              <p>Dispute between parties seeking to resolve legal obligations</p>
            </div>
          </div>
        </section>

        <section
          class="selection-row"
          :class="{ visible: setupCaseType }"
        >
          <h2>Select Your Role</h2>
          <div class="card-container" :data-case-type="setupCaseType">
            <div
              class="selection-card"
              :class="{ selected: setupRole === 'judge' }"
              @click="setupRole = 'judge'"
            >
              <h3>Judge</h3>
              <p>Preside over the trial, make rulings on objections, and ensure proper court procedure</p>
            </div>
            <div
              class="selection-card criminal-role"
              :class="{ selected: setupRole === 'prosecutor' }"
              @click="setupRole = 'prosecutor'"
            >
              <h3>Prosecutor</h3>
              <p>Represent the government in criminal cases, present evidence, and examine witnesses</p>
            </div>
            <div
              class="selection-card civil-role"
              :class="{ selected: setupRole === 'plaintiff' }"
              @click="setupRole = 'plaintiff'"
            >
              <h3>Plaintiff</h3>
              <p>The party initiating the civil lawsuit, presents evidence to prove their case</p>
            </div>
            <div
              class="selection-card"
              :class="{ selected: setupRole === 'defense' }"
              @click="setupRole = 'defense'"
            >
              <h3>Defense</h3>
              <p>Represent the defendant, challenge evidence, and present defense arguments</p>
            </div>
            <div
              class="selection-card"
              :class="{ selected: setupRole === 'witness' }"
              @click="setupRole = 'witness'"
            >
              <h3>Witness</h3>
              <p>Provide testimony and respond to questioning from both sides</p>
            </div>
            <div
              class="selection-card center-card"
              :class="{ selected: setupRole === 'jury' }"
              @click="setupRole = 'jury'"
            >
              <h3>Jury</h3>
              <p>Listen to evidence and arguments, deliberate, and reach a verdict</p>
            </div>
          </div>
        </section>

        <div class="confirm-button-container">
          <button
            type="submit"
            class="confirm-button"
            :disabled="!setupCaseType || !setupRole || isLoading"
            aria-label="Begin trial"
          >
            <span v-if="!isLoading">Begin Trial</span>
            <span v-else class="loading">Starting...</span>
          </button>
        </div>
      </form>

      <div v-if="showTrialInterface" id="trial-interface">
        <div class="courtroom-container">
          <canvas id="renderCanvas" touch-action="none"></canvas>
          <div v-if="courtroomLoading" class="canvas-loading">
            Loading 3D courtroom...
          </div>
          <div v-if="courtroomError" class="canvas-error" role="alert">
            <span>Failed to load 3D courtroom</span>
            <button @click="initializeCourtroomScene()" class="error-retry-button" aria-label="Retry loading 3D courtroom">
              Retry
            </button>
          </div>
        </div>
      </div>

      <section v-if="showSimulation" class="simulation-area" :class="{ 'single-player': isSinglePlayer }">
        <div class="trial-content">
          
          <div class="case-info">
            <h2>Case Information</h2>
            <div id="case-details" v-html="caseDetailsHtml"></div>
          </div>

          <div v-if="currentTurn" class="turn-indicator">
            <strong>Current Turn:</strong> {{ currentTurn.charAt(0).toUpperCase() + currentTurn.slice(1) }}
            <span v-if="isMyTurn()" class="your-turn">👈 Your turn!</span>
          </div>

          <div v-if="evidenceList.length > 0" class="evidence-section">
            <h3>Evidence</h3>
            <div v-for="ev in evidenceList" :key="ev.id" class="evidence-item" :class="{ admitted: ev.admitted }">
              <p>{{ ev.description }}</p>
              <span class="evidence-status">{{ ev.admitted ? '✓ Admitted' : 'Pending' }}</span>
              <div v-if="setupRole === 'judge' && !ev.admitted" class="evidence-actions">
                <button @click="admitEvidence(ev.id)" class="btn-admit">Admit</button>
                <button @click="denyEvidence(ev.id)" class="btn-deny">Deny</button>
              </div>
            </div>
          </div>

          <div v-if="pendingObjections.length > 0" class="objections-section">
            <h3>Objections</h3>
            <div v-for="obj in pendingObjections" :key="obj.id" class="objection-item">
              <p><strong>{{ obj.type }}</strong> by {{ obj.madeBy }}</p>
              <span v-if="obj.ruling" class="ruling">{{ obj.ruling.toUpperCase() }}</span>
              <div v-if="setupRole === 'judge' && !obj.ruling" class="objection-actions">
                <button @click="ruleOnObjection(obj.id, true)" class="btn-sustain">Sustain</button>
                <button @click="ruleOnObjection(obj.id, false)" class="btn-overrule">Overrule</button>
              </div>
            </div>
          </div>

          <div v-if="verdictPhase" class="verdict-section">
            <h2>Jury Deliberation</h2>
            <p>Cast your verdict:</p>
            <div class="verdict-buttons">
              <button @click="castVote('guilty')" class="btn-verdict btn-guilty">
                {{ setupCaseType === 'criminal' ? 'Guilty' : 'Liable' }}
              </button>
              <button @click="castVote('not-guilty')" class="btn-verdict btn-not-guilty">
                {{ setupCaseType === 'criminal' ? 'Not Guilty' : 'Not Liable' }}
              </button>
            </div>
            <div v-if="finalVerdict" class="final-verdict">
              <h2>Final Verdict: {{ finalVerdict }}</h2>
              <button @click="endTrial()" class="btn-end-trial">End Trial</button>
            </div>
          </div>
        </div>

        <div class="trial-controls">
          
          <div id="interaction-area" class="interaction-area">
            <h3>Actions</h3>

            <div v-if="setupRole === 'judge'" class="role-actions">
              <button @click="performRoleAction('call-witness')" :disabled="!isMyTurn()" aria-label="Call witness to stand">Call Witness</button>
              <button @click="advanceTurn()" aria-label="Advance to next turn">Advance Turn</button>
            </div>

            <div v-if="setupRole === 'prosecutor' || setupRole === 'defense'" class="role-actions">
              <button @click="performRoleAction('examine-witness')" :disabled="!isMyTurn()" aria-label="Examine witness">Examine Witness</button>
              <div class="evidence-input-group">
                <input v-model="evidenceInput" type="text" placeholder="Describe evidence..." aria-label="Evidence description" />
                <button @click="performRoleAction('present-evidence')" :disabled="!isMyTurn()" aria-label="Present evidence">Present Evidence</button>
              </div>
              <div class="objection-buttons">
                <button v-for="objType in objectionTypes" :key="objType.id" 
                  @click="makeObjection(objType.label)" 
                  :disabled="!isMyTurn()"
                  class="btn-objection">
                  {{ objType.label }}
                </button>
              </div>
            </div>

            <div v-if="setupRole === 'witness'" class="role-actions">
              <button @click="performRoleAction('respond')" :disabled="!isMyTurn()" aria-label="Respond to question">Respond to Question</button>
            </div>

            <div v-if="setupRole === 'jury'" class="role-actions">
              <button @click="performRoleAction('deliberate')" aria-label="Begin jury deliberation">Begin Deliberation</button>
            </div>

            <button @click="endTrial()" class="btn-end-trial">End Trial</button>
          </div>

          <div id="chat-interface" class="chat-interface">
            <h3>Chat</h3>
            <div class="chat-messages" id="chat-messages">
              <div v-for="msg in chatMessages" :key="msg.id" class="chat-message">
                <strong>{{ msg.sender }}:</strong> {{ msg.content }}
              </div>
            </div>
            <div class="chat-input-container">
              <select v-model="chatRecipient" id="chat-recipient" class="chat-recipient" aria-label="Message recipient">
                <option value="all">Everyone</option>
                <option value="judge">Judge</option>
                <option value="prosecutor">Prosecutor</option>
                <option value="defense">Defense</option>
                <option value="witness">Witness</option>
                <option value="jury">Jury</option>
              </select>
              <input
                v-model="chatInput"
                type="text"
                id="chat-input"
                class="chat-input"
                placeholder="Type your message..."
                autocomplete="off"
              />
              <button id="chat-send" class="chat-send">Send</button>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useToast } from '~/composables/useToast'
import { useLobbyConnection } from '~/composables/useLobbyConnection'
// import { useCourtroomScene } from '~/composables/useCourtroomScene'
import { useTrialState } from '~/composables/useTrialState'

const { success, error, warning, info } = useToast()
const lobbyConnection = useLobbyConnection()
// const courtroomScene = useCourtroomScene()
const trialState = useTrialState()

const {
  isConnected,
  isReconnecting,
  reconnectAttempts,
  reconnectCountdown,
  connectionStatus,
  lobbyState: connectedLobbyState
} = lobbyConnection

definePageMeta({
  title: 'Mock Trial Simulator',
  description: 'Interactive AI-powered mock trial simulator for nUSA Legal'
})

const showLobby = ref(false)
const showTrialSetup = ref(false)
const showSimulation = ref(false)
const showTrialInterface = ref(false)
const isSinglePlayer = ref(false)
const isLoading = ref(false)
const lobbyCodeError = ref('')

const lobbyCodeInput = ref('')
const lobbyCode = ref('')
const isLobbyLeader = ref(false)
const selectedCaseType = ref<'criminal' | 'civil' | null>(null)
const selectedCase = ref<any>(null)
const availableCases = ref<any[]>([])
const players = ref<Array<{ name: string; role: string | null; isLeader: boolean }>>([]) 
const playerCount = computed(() => players.value.length)

const setupCaseType = ref<'criminal' | 'civil' | null>(null)
const setupRole = ref<string | null>(null)

const courtroomLoading = ref(false)
const courtroomError = ref(false)

const caseDetailsHtml = ref('')

const chatMessages = ref<Array<{ id: string; sender: string; content: string; timestamp: number }>>([])  
const chatInput = ref('')
const chatRecipient = ref('all')

const currentTurn = ref<string | null>(null)
const turnOrder = ['judge', 'prosecutor', 'defense', 'witness', 'jury']

const evidenceList = ref<Array<{ id: string; description: string; submittedBy: string; admitted: boolean }>>([])  
const evidenceInput = ref('')

const objectionTypes = [
  { id: 'hearsay', label: 'Hearsay' },
  { id: 'relevance', label: 'Irrelevant' },
  { id: 'leading', label: 'Leading Question' },
  { id: 'speculation', label: 'Speculation' },
  { id: 'argumentative', label: 'Argumentative' }
]
const pendingObjections = ref<Array<{ id: string; type: string; reason: string; madeBy: string; ruling: string | null }>>([])  

const verdictPhase = ref(false)
const verdictVotes = ref<Record<string, 'guilty' | 'not-guilty' | null>>({})
const finalVerdict = ref<string | null>(null)

const availableRoles = ref<Array<{ id: string; name: string; description: string; claimedBy: string | null }>>([
  { id: 'judge', name: 'Judge', description: 'Oversee the trial and make rulings', claimedBy: null },
  { id: 'prosecutor', name: 'Prosecutor', description: 'Present the case against the defendant', claimedBy: null },
  { id: 'defense', name: 'Defense', description: 'Defend the accused', claimedBy: null },
  { id: 'witness', name: 'Witness', description: 'Testify about case events', claimedBy: null },
  { id: 'jury', name: 'Jury', description: 'Decide the verdict', claimedBy: null }
])

const canStartTrial = computed(() => {
  
  return selectedCase.value && availableRoles.value.some((r: any) => r.claimedBy === 'You')
})

function startSinglePlayer() {
  showTrialSetup.value = true
  isSinglePlayer.value = true
}

async function createLobby() {
  isLoading.value = true
  
  const code = generateLobbyCode()
  lobbyCode.value = code

  const connected = await lobbyConnection.connect(code, 'You', true)
  
  if (connected) {
    isLobbyLeader.value = true
    showLobby.value = true

    players.value = [{
      name: 'You',
      role: null,
      isLeader: true
    }]
    
    success(`Lobby created! Code: ${lobbyCode.value}`)
  } else {
    error('Failed to create lobby')
  }
  
  isLoading.value = false
}

function handleLobbyCodeInput() {
  lobbyCodeInput.value = lobbyCodeInput.value.toUpperCase()
  lobbyCodeError.value = ''
}

async function joinLobby() {
  
  if (!lobbyCodeInput.value.trim()) {
    lobbyCodeError.value = 'Lobby code is required'
    error('Please enter a lobby code')
    return
  }
  
  if (lobbyCodeInput.value.length !== 6) {
    lobbyCodeError.value = 'Lobby code must be 6 characters'
    error('Lobby code must be exactly 6 characters')
    return
  }
  
  lobbyCodeError.value = ''
  isLoading.value = true
  
  const code = lobbyCodeInput.value.toUpperCase()
  lobbyCode.value = code

  const connected = await lobbyConnection.connect(code, 'You', false)
  
  if (connected) {
    isLobbyLeader.value = false
    showLobby.value = true

    players.value = [
      { name: 'Host', role: null, isLeader: true },
      { name: 'You', role: null, isLeader: false }
    ]
    
    success('Joined lobby successfully!')
  } else {
    error('Failed to join lobby')
  }
  
  isLoading.value = false
}

function leaveLobby() {
  
  lobbyConnection.disconnect()
  
  showLobby.value = false
  lobbyCode.value = ''
  lobbyCodeInput.value = ''
  selectedCaseType.value = null
  selectedCase.value = null
  availableCases.value = []
  players.value = []
  availableRoles.value.forEach((role: any) => role.claimedBy = null)
  
  info('Left the lobby')
}

function generateLobbyCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase()
}

async function selectCaseType(type: 'criminal' | 'civil') {
  selectedCaseType.value = type
  selectedCase.value = null
  availableCases.value = []

  try {
    const response = await $fetch(`/api/mock-trial/cases?type=${type}`)
    if (response.success) {
      availableCases.value = response.cases
      info(`Loaded ${response.cases.length} ${type} cases`)
    }
  } catch (error) {
    console.error('Failed to load cases:', error)
    availableCases.value = []
    warning('Failed to load cases. Please try again.')
  }

}

function selectCase(caseItem: any) {
  selectedCase.value = caseItem

  lobbyConnection.selectCase(caseItem)
  
  success(`Selected: ${caseItem.title}`)
}

function claimRole(roleId: string): void {
  const role = availableRoles.value.find((r: any) => r.id === roleId)
  if (!role) return
  
  if (role.claimedBy && role.claimedBy !== 'You') {
    warning(`This role is already claimed by ${role.claimedBy}`)
    return
  }

  const previousRole = availableRoles.value.find((r: any) => r.claimedBy === 'You')
  availableRoles.value.forEach((r: any) => {
    if (r.claimedBy === 'You') r.claimedBy = null
  })

  role.claimedBy = 'You'

  const player = players.value.find((p: any) => p.name === 'You')
  if (player) {
    player.role = role.name
  }

  lobbyConnection.claimRole(roleId, role.name)
  
  if (previousRole) {
    info(`Switched from ${previousRole.name} to ${role.name}`)
  } else {
    success(`Claimed ${role.name} role!`)
  }
}

function startTrialFromLobby() {
  if (!canStartTrial.value) {
    error('Please select a case and claim a role before starting')
    return
  }
  
  isLoading.value = true

  const trialData = lobbyConnection.startTrial()
  
  setTimeout(() => {
    showLobby.value = false
    showTrialInterface.value = true
    showSimulation.value = true
    isLoading.value = false
    
    success('Trial started! Good luck!')
    
  }, 600)
}

async function confirmSetup() {
  
  if (!setupCaseType.value) {
    error('Please select a case type')
    return
  }
  
  if (!setupRole.value) {
    error('Please select a role')
    return
  }
  
  isLoading.value = true
  
  try {
    
    const response = await $fetch(`/api/mock-trial/random-case?type=${setupCaseType.value}`)
    
    if (response.success && response.case) {
      
      caseDetailsHtml.value = generateCaseDetailsHtml(response.case, setupRole.value, setupCaseType.value)

      showTrialSetup.value = false
      showTrialInterface.value = true
      showSimulation.value = true
      
      success(`Starting ${response.case.title}!`)

      setTimeout(() => {
        initializeCourtroomScene()
      }, 100)
    } else {
      error('Failed to load case data')
    }
  } catch (err) {
    console.error('Error loading case:', err)
    error('Failed to start trial. Please try again.')
  } finally {
    isLoading.value = false
  }
}

function generateCaseDetailsHtml(caseData: any, role: string, caseType: string): string {
  let html = `
    <p><strong>Case Type:</strong> ${caseType.charAt(0).toUpperCase()}${caseType.slice(1)}</p>
    <p><strong>Your Role:</strong> ${role.charAt(0).toUpperCase()}${role.slice(1)}</p>
    <p><strong>Title:</strong> ${caseData.title}</p>
    <p><strong>Description:</strong> ${caseData.description}</p>
    <p><strong>Facts:</strong> ${caseData.facts}</p>
  `
  
  if (caseData.statute) {
    html += `<p><strong>Statute:</strong> ${caseData.statute}</p>`
  }
  
  html += `<p><strong>Difficulty:</strong> ${caseData.difficulty}</p>`

  if (caseData.roles && caseData.roles[role]) {
    const roleData = caseData.roles[role]
    
    html += '<div class="role-info">'
    
    if (roleData.objectives && roleData.objectives.length > 0) {
      html += '<h3>Your Role Objectives:</h3><ul>'
      roleData.objectives.forEach((obj: string) => {
        html += `<li>${obj}</li>`
      })
      html += '</ul>'
    }
    
    if (roleData.key_arguments && roleData.key_arguments.length > 0) {
      html += '<h3>Key Arguments:</h3><ul>'
      roleData.key_arguments.forEach((arg: string) => {
        html += `<li>${arg}</li>`
      })
      html += '</ul>'
    }
    
    if (roleData.key_decisions && roleData.key_decisions.length > 0) {
      html += '<h3>Key Decisions:</h3><ul>'
      roleData.key_decisions.forEach((dec: string) => {
        html += `<li>${dec}</li>`
      })
      html += '</ul>'
    }
    
    html += '</div>'
  }
  
  return html
}

async function initializeCourtroomScene() {
  courtroomLoading.value = true
  courtroomError.value = false
  
  try {
    
    // await courtroomScene.loadBabylonScripts()
    // const initialized = await courtroomScene.initialize('renderCanvas')
    // if (!initialized) {
    //   throw new Error('Failed to initialize Babylon engine')
    // }
    // await courtroomScene.createScene()
    // if (setupRole.value) {
    //   courtroomScene.createAvatar('local-player', setupRole.value, {
    //     name: 'You',
    //     isLocal: true
    //   })
    // }
    // courtroomScene.run()
    console.log('3D courtroom temporarily disabled')
    
    courtroomLoading.value = false
    success('3D courtroom loaded successfully!')
  } catch (err) {
    console.error('Error initializing courtroom:', err)
    courtroomLoading.value = false
    courtroomError.value = true
    error('Failed to load 3D courtroom')
  }
}

function handleReconnectCancel() {
  lobbyConnection.disconnect()
  showLobby.value = false
  showTrialSetup.value = false
  showSimulation.value = false
  warning('Reconnection cancelled - returned to lobby selection')
}

function sendChatMessage() {
  if (!chatInput.value.trim()) return
  
  const message = {
    id: `msg-${Date.now()}`,
    sender: setupRole.value || 'Unknown',
    content: chatInput.value.trim(),
    timestamp: Date.now()
  }
  
  chatMessages.value.push(message)

  // if (courtroomScene.showChatBubble) {
  //   courtroomScene.showChatBubble('local-player', message.content)
  // }
  
  chatInput.value = ''

  nextTick(() => {
    const chatContainer = document.getElementById('chat-messages')
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight
    }
  })

}

function handleChatKeypress(event: KeyboardEvent) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    sendChatMessage()
  }
}

function performRoleAction(action: string) {
  switch (action) {
    case 'call-witness':
      info('Calling witness to the stand...')
      advanceTurn()
      break
    case 'examine-witness':
      info('Examining witness...')
      advanceTurn()
      break
    case 'present-evidence':
      if (evidenceInput.value.trim()) {
        addEvidence(evidenceInput.value.trim())
        evidenceInput.value = ''
      } else {
        warning('Please describe the evidence')
      }
      break
    case 'object':
      warning('Select objection type')
      break
    case 'respond':
      info('Responding to question...')
      advanceTurn()
      break
    case 'deliberate':
      verdictPhase.value = true
      info('Jury deliberation phase started')
      break
    default:
      info(`Performing action: ${action}`)
  }
}

function advanceTurn() {
  if (!currentTurn.value) {
    currentTurn.value = turnOrder[0] || null
    return
  }
  
  const currentIndex = turnOrder.indexOf(currentTurn.value)
  const nextIndex = (currentIndex + 1) % turnOrder.length
  currentTurn.value = turnOrder[nextIndex] || null
  
  info(`Turn: ${currentTurn.value}`)
}

function isMyTurn() {
  return currentTurn.value === setupRole.value
}

function addEvidence(description: string) {
  const evidence = {
    id: `ev-${Date.now()}`,
    description,
    submittedBy: setupRole.value || 'Unknown',
    admitted: false
  }
  
  evidenceList.value.push(evidence)
  success('Evidence submitted for judge review')
}

function admitEvidence(evidenceId: string) {
  if (setupRole.value !== 'judge') {
    warning('Only the judge can admit evidence')
    return
  }
  
  evidenceList.value.forEach((e: any) => {
    if (e.id === evidenceId) {
      e.admitted = true
      console.log(`Evidence ${evidenceId} admitted`)
    }
  })
}

function denyEvidence(evidenceId: string) {
  if (setupRole.value !== 'judge') {
    warning('Only the judge can deny evidence')
    return
  }
  
  evidenceList.value = evidenceList.value.filter((e: any) => e.id !== evidenceId)
  info('Evidence denied')
}

// ...

function makeObjection(type: string) {
  const objection = {
    id: `obj-${Date.now()}`,
    type,
    reason: type,
    madeBy: setupRole.value || 'Unknown',
    ruling: null
  }
  
  pendingObjections.value.push(objection)
  info(`Objection: ${type}`)
}

// ...

function ruleOnObjection(objectionId: string, sustained: boolean) {
  if (setupRole.value !== 'judge') {
    warning('Only the judge can rule on objections')
    return
  }
  
  pendingObjections.value.forEach((o: any) => {
    if (o.id === objectionId) {
      o.ruling = sustained ? 'sustained' : 'overruled'
      console.log(`Objection ${objectionId} ${o.ruling}`)
    }
  })
}

// ...

function castVote(vote: 'guilty' | 'not-guilty') {
  if (setupRole.value !== 'jury' && setupRole.value !== 'judge') {
    warning('Only jury members can vote')
    return
  }
  
  const playerId = 'local-player'
  verdictVotes.value[playerId] = vote
  success(`Vote cast: ${vote}`)

  if (isSinglePlayer.value) {
    finalizeVerdict()
  }
}

function finalizeVerdict() {
  const votes = Object.values(verdictVotes.value)
  const guiltyVotes = votes.filter(v => v === 'guilty').length
  const notGuiltyVotes = votes.filter(v => v === 'not-guilty').length
  
  if (guiltyVotes > notGuiltyVotes) {
    finalVerdict.value = setupCaseType.value === 'criminal' ? 'Guilty' : 'Liable'
  } else {
    finalVerdict.value = setupCaseType.value === 'criminal' ? 'Not Guilty' : 'Not Liable'
  }
  
  success(`Final verdict: ${finalVerdict.value}`)
}

function endTrial() {
  
  showTrialInterface.value = false
  showSimulation.value = false
  showTrialSetup.value = false
  showLobby.value = false

  setupCaseType.value = null
  setupRole.value = null
  caseDetailsHtml.value = ''
  chatMessages.value = []
  evidenceList.value = []
  pendingObjections.value = []
  verdictPhase.value = false
  verdictVotes.value = {}
  finalVerdict.value = null
  currentTurn.value = null

  // if (courtroomScene) {
  //   courtroomScene.dispose()
  // }
  success('Trial ended')
}

// ...

watch(showSimulation, (newValue: boolean) => {
  if (newValue && !currentTurn.value) {
    currentTurn.value = turnOrder[0] || null
    currentTurn.value = 'judge'
    info('Trial session started. Judge has the floor.')
  }
})

onMounted(() => {
  const chatInputEl = document.getElementById('chat-input')
  if (chatInputEl) {
    chatInputEl.addEventListener('keypress', handleChatKeypress as any)
  }
  
  const chatSendBtn = document.getElementById('chat-send')
  if (chatSendBtn) {
    chatSendBtn.addEventListener('click', sendChatMessage)
  }
})
</script>

<style scoped>

:root {
  --primary-color: #333;
  --secondary-color: #666;
  --background-color: #e0f7fa;
  --card-background: #fff;
  --text-color: #333;
  --link-color: #0066cc;
  --link-hover: #007BFF;
  --shadow-color: rgba(0, 0, 0, 0.1);
  --hover-shadow: rgba(0, 0, 0, 0.2);
  --accent-blue: #0066cc;
  --accent-light: #e3f2fd;
  --border-color: #999;
  --selected-bg: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
}

[data-theme='dark'] {
  --primary-color: #00d4ff;
  --secondary-color: #66b3ff;
  --background-color: transparent;
  --card-background: rgba(30, 30, 30, 0.8);
  --text-color: #e0e0e0;
  --link-color: #00d4ff;
  --link-hover: #66b3ff;
  --shadow-color: rgba(0, 212, 255, 0.2);
  --hover-shadow: rgba(0, 212, 255, 0.3);
  --accent-blue: #00d4ff;
  --border-color: #00d4ff;
}

.mock-trial-page {
  min-height: 100vh;
  background-color: var(--background-color);
  color: var(--text-color);
}

[data-theme='dark'] .mock-trial-page {
  background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 50%, #0f0f0f 100%);
}

main {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
  text-align: center;
}

main h1, main h2, main h3 {
  color: var(--text-color);
}

[data-theme='dark'] main h1 {
  color: var(--accent-blue);
  text-shadow: 0 0 20px rgba(0, 212, 255, 0.5);
}

[data-theme='dark'] main h2, [data-theme='dark'] main h3 {
  color: var(--secondary-color);
}

.mode-selection {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin: 2rem 0;
}

.mode-button {
  background-color: var(--card-background);
  border: 2px solid var(--border-color);
  color: var(--text-color);
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 300px;
  width: 100%;
  max-width: 500px;
}

.mode-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px var(--shadow-color);
  border-color: var(--accent-blue);
}

.mode-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

[data-theme='dark'] .mode-button {
  border-color: var(--border-color);
  box-shadow: 0 0 10px rgba(0, 212, 255, 0.1);
}

[data-theme='dark'] .mode-button:hover {
  box-shadow: 0 0 20px var(--accent-blue);
}

.join-section {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  align-items: center;
  justify-content: center;
}

.join-section .mode-button {
  min-width: auto;
  width: auto;
  max-width: none;
}

#lobby-code {
  padding: 1rem;
  border: 2px solid var(--border-color);
  border-radius: 8px;
  background-color: var(--card-background);
  color: var(--text-color);
  font-size: 1.1rem;
  text-align: center;
  letter-spacing: 2px;
  width: 250px;
}

#lobby-code::placeholder {
  color: #999;
  opacity: 1;
  font-weight: 500;
}

:root #lobby-code {
  border-color: #0066cc;
  box-shadow: 0 2px 6px rgba(0, 102, 204, 0.2);
}

:root #lobby-code:focus {
  outline: none;
  border-color: #0066cc;
  box-shadow: 0 4px 12px rgba(0, 102, 204, 0.4);
  border-width: 3px;
}

#lobby-code.input-error {
  border-color: #ef4444 !important;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.2) !important;
}

[data-theme='dark'] #lobby-code.input-error {
  border-color: #ef4444 !important;
  box-shadow: 0 0 20px rgba(239, 68, 68, 0.4) !important;
}

.mode-selection .error-message {
  font-size: 0.85rem;
  color: #ef4444;
  font-weight: 500;
  animation: fadeIn 0.2s ease;
  margin-top: -0.5rem;
}

[data-theme='dark'] .error-message {
  color: #fca5a5;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

[data-theme='dark'] #lobby-code {
  border-color: var(--border-color);
  box-shadow: 0 0 10px rgba(0, 212, 255, 0.2);
}

[data-theme='dark'] #lobby-code:focus {
  outline: none;
  border-color: var(--accent-blue);
  box-shadow: 0 0 20px var(--accent-blue);
}

[data-theme='dark'] #lobby-code::placeholder {
  color: #66b3ff;
  opacity: 0.7;
}

.hidden {
  display: none !important;
}

.lobby-interface {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
}

.lobby-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.lobby-code-display {
  background-color: var(--card-background);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: 2px solid var(--border-color);
  font-family: monospace;
  font-size: 1.2rem;
}

[data-theme='dark'] .lobby-code-display {
  border-color: var(--accent-blue);
  box-shadow: 0 0 15px rgba(0, 212, 255, 0.3);
}

[data-theme='dark'] .lobby-code-display span {
  color: var(--accent-blue);
  font-weight: bold;
}

.lobby-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
}

@media (max-width: 800px) {
  .lobby-content {
    grid-template-columns: 1fr;
  }
}

.toggle-buttons {
  display: flex;
  gap: 1rem;
  margin: 1rem 0;
}

.toggle-button {
  flex: 1;
  padding: 1rem;
  border: 2px solid var(--border-color);
  background-color: var(--card-background);
  color: var(--text-color);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

:root .toggle-button:hover {
  border-color: var(--accent-blue);
  box-shadow: 0 2px 8px rgba(0, 102, 204, 0.2);
}

.toggle-button.selected {
  border-color: var(--accent-blue);
  border-width: 3px;
  box-shadow: 0 0 20px var(--accent-blue);
  background: linear-gradient(135deg, var(--card-background) 0%, rgba(0, 212, 255, 0.1) 100%);
  font-weight: bold;
  transform: scale(1.05);
}

:root .toggle-button.selected {
  background: var(--selected-bg);
  box-shadow: 0 4px 12px rgba(0, 102, 204, 0.4);
  color: #0066cc;
  position: relative;
}

:root .toggle-button.selected::before {
  content: '✓';
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #0066cc;
  font-size: 1.5rem;
  font-weight: bold;
}

:root .toggle-button.selected {
  padding-right: 3rem;
}

[data-theme='dark'] .toggle-button.selected {
  background: linear-gradient(135deg, rgba(30, 30, 30, 0.9) 0%, rgba(0, 212, 255, 0.15) 100%);
}

.role-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.role-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: var(--card-background);
  border: 2px solid var(--border-color);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.role-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px var(--shadow-color);
}

:root .role-item:hover {
  border-color: var(--accent-blue);
  box-shadow: 0 6px 16px rgba(0, 102, 204, 0.2);
}

.role-item.claimed:hover {
  transform: scale(1.02);
}

.role-item.claimed {
  border-color: var(--accent-blue);
  border-width: 3px;
  box-shadow: 0 0 20px var(--accent-blue);
  background: linear-gradient(135deg, var(--card-background) 0%, rgba(0, 212, 255, 0.1) 100%);
  transform: scale(1.02);
}

:root .role-item.claimed {
  background: var(--selected-bg);
  box-shadow: 0 4px 12px rgba(0, 102, 204, 0.4), inset 0 0 0 3px var(--accent-blue);
}

:root .role-item.claimed .role-name {
  color: #0066cc;
}

:root .role-item.claimed::before {
  content: '✓';
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #0066cc;
  font-size: 1.5rem;
  font-weight: bold;
  background: white;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  box-shadow: 0 2px 6px rgba(0, 102, 204, 0.3);
}

:root .role-item.claimed .role-info {
  margin-left: 40px;
}

[data-theme='dark'] .role-item.claimed {
  background: linear-gradient(135deg, rgba(30, 30, 30, 0.9) 0%, rgba(0, 212, 255, 0.15) 100%);
}

.role-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.role-name {
  font-weight: bold;
}

.role-description {
  font-size: 0.9rem;
  color: var(--secondary-color);
}

.lobby-controls {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.start-button,
.leave-button {
  background-color: var(--card-background);
  color: var(--text-color);
  padding: 1rem 3rem;
  border: 2px solid var(--border-color);
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

[data-theme='dark'] .start-button,
[data-theme='dark'] .leave-button {
  border-color: var(--accent-blue);
  box-shadow: 0 0 10px rgba(0, 212, 255, 0.2);
}

.start-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.start-button:not(:disabled):hover,
.leave-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px var(--shadow-color);
}

[data-theme='dark'] .start-button:not(:disabled):hover,
[data-theme='dark'] .leave-button:hover {
  box-shadow: 0 0 25px var(--accent-blue);
  border-color: var(--accent-blue);
}

.trial-setup {
  display: flex;
  flex-direction: column;
  gap: 3rem;
  margin-top: 2rem;
}

.selection-row {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  text-align: center;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.3s ease;
  pointer-events: none;
}

.selection-row.visible {
  opacity: 1;
  transform: translateY(0);
  pointer-events: all;
}

.card-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.selection-card.center-card:only-of-type,
.card-container:has(.selection-card:nth-child(6):last-child) .center-card {
  grid-column: 1 / -1;
  max-width: 300px;
  margin: 0 auto;
  width: 100%;
}

.selection-card {
  background-color: var(--card-background);
  border: 2px solid var(--border-color);
  border-radius: 8px;
  padding: 1.5rem;
  text-align: center;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
}

.selection-card.selected {
  border-color: var(--accent-blue);
  border-width: 3px;
  box-shadow: 0 0 20px var(--accent-blue), 0 0 0 2px var(--accent-blue);
  transform: translateY(-2px) scale(1.02);
  background: linear-gradient(135deg, var(--card-background) 0%, rgba(0, 212, 255, 0.1) 100%);
}

:root .selection-card.selected {
  background: var(--selected-bg);
  box-shadow: 0 8px 16px rgba(0, 102, 204, 0.3), 0 0 0 3px var(--accent-blue);
  border-color: var(--accent-blue);
}

.selection-card.selected::after {
  content: '✓';
  position: absolute;
  top: 10px;
  right: 10px;
  color: var(--accent-blue);
  font-size: 2rem;
  font-weight: bold;
  text-shadow: 0 0 10px var(--accent-blue);
}

:root .selection-card.selected::before {
  content: '';
  position: absolute;
  top: -3px;
  left: -3px;
  right: -3px;
  bottom: -3px;
  background: var(--accent-blue);
  border-radius: 8px;
  z-index: -1;
  opacity: 0.3;
}

:root .selection-card.selected::after {
  color: #0066cc;
  text-shadow: 0 2px 4px rgba(0, 102, 204, 0.5);
  background: white;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 102, 204, 0.3);
}

[data-theme='dark'] .selection-card.selected {
  background: linear-gradient(135deg, rgba(30, 30, 30, 0.9) 0%, rgba(0, 212, 255, 0.15) 100%);
}

.selection-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px var(--shadow-color);
}

.selection-card.selected:hover {
  transform: translateY(-2px) scale(1.02);
}

:root .selection-card:hover {
  border-color: var(--accent-blue);
  box-shadow: 0 6px 16px rgba(0, 102, 204, 0.2);
}

.civil-role,
.criminal-role {
  display: none;
}

[data-case-type="civil"] .civil-role {
  display: block;
}

[data-case-type="criminal"] .criminal-role {
  display: block;
}

.confirm-button-container {
  text-align: center;
  margin-top: 2rem;
}

.confirm-button {
  background-color: var(--card-background);
  color: var(--text-color);
  padding: 1rem 3rem;
  border: 2px solid var(--border-color);
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

[data-theme='dark'] .confirm-button {
  border-color: var(--accent-blue);
  box-shadow: 0 0 10px rgba(0, 212, 255, 0.2);
}

.confirm-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.confirm-button:not(:disabled):hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px var(--shadow-color);
}

[data-theme='dark'] .confirm-button:not(:disabled):hover {
  box-shadow: 0 0 25px var(--accent-blue);
  border-color: var(--accent-blue);
}

.courtroom-container {
  width: 100%;
  height: 600px;
  position: relative;
  background-color: #000;
  border-radius: 8px;
  overflow: hidden;
}

#renderCanvas {
  width: 100%;
  height: 100%;
  touch-action: none;
}

.canvas-loading,
.canvas-error {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 1.2rem;
  text-align: center;
}

.canvas-error {
  color: #ff6b6b;
}

.simulation-area {
  padding: 2rem;
  max-width: 1600px;
  margin: 0 auto;
}

.turn-indicator {
  background-color: var(--card-background);
  border: 2px solid var(--border-color);
  padding: 1rem;
  margin: 1rem 0;
  border-radius: 8px;
  text-align: center;
}

.your-turn {
  color: var(--accent-blue);
  font-weight: bold;
  margin-left: 0.5rem;
}

.evidence-section, .objections-section, .verdict-section {
  background-color: var(--card-background);
  border: 2px solid var(--border-color);
  padding: 1.5rem;
  margin: 1rem 0;
  border-radius: 8px;
}

.evidence-item, .objection-item {
  background: rgba(0, 0, 0, 0.02);
  padding: 1rem;
  margin: 0.5rem 0;
  border-radius: 6px;
  border: 1px solid var(--border-color);
}

.evidence-item.admitted {
  border-color: green;
  background: rgba(0, 255, 0, 0.05);
}

.evidence-status {
  color: var(--secondary-color);
  font-size: 0.9rem;
  margin-left: 1rem;
}

.evidence-actions, .objection-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.btn-admit, .btn-sustain {
  background: #28a745;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.btn-deny, .btn-overrule {
  background: #dc3545;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.ruling {
  color: var(--accent-blue);
  font-weight: bold;
  margin-left: 1rem;
}

.verdict-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin: 1.5rem 0;
}

.btn-verdict {
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: bold;
  border-radius: 8px;
  border: 2px solid;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-guilty {
  background: #dc3545;
  color: white;
  border-color: #dc3545;
}

.btn-not-guilty {
  background: #28a745;
  color: white;
  border-color: #28a745;
}

.btn-verdict:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.final-verdict {
  text-align: center;
  padding: 2rem;
  background: var(--accent-blue);
  color: white;
  border-radius: 8px;
  margin-top: 1rem;
}

.interaction-area {
  background-color: var(--card-background);
  border: 2px solid var(--border-color);
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.role-actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.role-actions button {
  background-color: var(--card-background);
  border: 2px solid var(--border-color);
  color: var(--text-color);
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
}

.role-actions button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px var(--shadow-color);
  border-color: var(--accent-blue);
}

.role-actions button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.evidence-input-group {
  display: flex;
  gap: 0.5rem;
}

.evidence-input-group input {
  flex: 1;
  padding: 0.75rem;
  border: 2px solid var(--border-color);
  border-radius: 6px;
  background-color: var(--card-background);
  color: var(--text-color);
}

.objection-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.btn-objection {
  background: #ff9800;
  color: white;
  border: none !important;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
}

.btn-objection:hover:not(:disabled) {
  background: #f57c00;
}

.btn-end-trial {
  background: #6c757d;
  color: white;
  border: 2px solid #6c757d;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  margin-top: 1rem;
  width: 100%;
}

.btn-end-trial:hover {
  background: #5a6268;
  border-color: #5a6268;
}

.chat-messages {
  height: 300px;
  overflow-y: auto;
  background: rgba(0, 0, 0, 0.02);
  padding: 1rem;
  border-radius: 6px;
  margin-bottom: 1rem;
}

.chat-message {
  margin-bottom: 0.75rem;
  padding: 0.5rem;
  background: var(--card-background);
  border-radius: 4px;
}

.chat-message strong {
  color: var(--accent-blue);
}

.chat-input-container {
  display: flex;
  gap: 0.5rem;
}

.chat-recipient {
  padding: 0.75rem;
  border: 2px solid var(--border-color);
  border-radius: 6px;
  background-color: var(--card-background);
  color: var(--text-color);
}

.chat-input {
  flex: 1;
  padding: 0.75rem;
  border: 2px solid var(--border-color);
  border-radius: 6px;
  background-color: var(--card-background);
  color: var(--text-color);
}

.chat-send {
  background-color: var(--accent-blue);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.chat-send:hover {
  background-color: var(--link-hover);
  transform: translateY(-2px);
}

[data-theme='dark'] .turn-indicator {
  border-color: var(--accent-blue);
  box-shadow: 0 0 15px rgba(0, 212, 255, 0.2);
}

[data-theme='dark'] .evidence-section,
[data-theme='dark'] .objections-section,
[data-theme='dark'] .verdict-section {
  border-color: var(--accent-blue);
  box-shadow: 0 0 10px rgba(0, 212, 255, 0.1);
}

[data-theme='dark'] .evidence-item,
[data-theme='dark'] .objection-item {
  background: rgba(0, 212, 255, 0.05);
  border-color: rgba(0, 212, 255, 0.2);
}

[data-theme='dark'] .chat-messages {
  background: rgba(0, 212, 255, 0.05);
}

[data-theme='dark'] .chat-message {
  border: 1px solid rgba(0, 212, 255, 0.2);
}

[data-theme='dark'] .interaction-area {
  border-color: var(--accent-blue);
  box-shadow: 0 0 10px rgba(0, 212, 255, 0.1);
}

@media (max-width: 768px) {
  .lobby-content {
    grid-template-columns: 1fr;
  }
  
  .card-container {
    grid-template-columns: 1fr;
  }
  
  .mode-button {
    width: 100%;
    max-width: none;
  }
  
  .join-section {
    flex-direction: column;
    width: 100%;
  }
  
  .join-section .mode-button {
    width: 100%;
  }
  
  #lobby-code {
    width: 100%;
  }
  
  .courtroom-container {
    height: 400px;
  }
  
  .simulation-area {
    padding: 1rem;
  }
  
  .trial-content,
  .trial-controls {
    width: 100%;
  }
  
  .chat-input-container {
    flex-wrap: wrap;
  }
  
  .chat-recipient {
    width: 100%;
  }
  
  .objection-buttons {
    flex-direction: column;
  }
  
  .verdict-buttons {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  main h1 {
    font-size: 1.5rem;
  }
  
  .mode-button {
    font-size: 1rem;
    padding: 0.75rem 1.5rem;
  }
  
  .selection-card {
    padding: 1rem;
  }
  
  .chat-messages {
    height: 200px;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideIn {
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes scaleIn {
  from {
    transform: scale(0.8);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.mode-selection {
  animation: fadeIn 0.5s ease;
}

.lobby-interface {
  animation: fadeIn 0.6s ease;
}

.trial-setup {
  animation: fadeIn 0.5s ease;
}

.simulation-area {
  animation: fadeIn 0.6s ease;
}

.chat-message {
  animation: slideIn 0.3s ease;
}

.evidence-item,
.objection-item {
  animation: fadeIn 0.4s ease;
}

.turn-indicator {
  animation: scaleIn 0.3s ease;
}

.verdict-section {
  animation: scaleIn 0.5s ease;
}

.mode-button,
.role-item,
.selection-card,
.toggle-button,
.case-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.simulation-area.single-player {
  position: fixed;
  top: 70px;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--background-color);
  z-index: 100;
  overflow-y: auto;
}

.canvas-error {
  padding: 2rem;
  background: rgba(255, 107, 107, 0.1);
  border: 2px solid #ff6b6b;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.canvas-error::before {
  content: '⚠️';
  font-size: 3rem;
}

.error-retry-button {
  background: #ff6b6b;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
}

.error-retry-button:hover {
  background: #ff5252;
  transform: translateY(-2px);
}

*:focus-visible {
  outline: 3px solid var(--accent-blue);
  outline-offset: 2px;
}

[data-theme='dark'] *:focus-visible {
  outline-color: #00d4ff;
  box-shadow: 0 0 0 3px rgba(0, 212, 255, 0.3);
}

.keyboard-hint {
  font-size: 0.85rem;
  color: var(--secondary-color);
  font-style: italic;
  margin-top: 0.5rem;
}

@media (prefers-contrast: high) {
  .mode-button,
  .selection-card,
  .role-item {
    border-width: 3px;
  }
  
  .mode-button:hover,
  .selection-card:hover,
  .role-item:hover {
    border-width: 4px;
  }
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.trial-content {
  display: grid;
  gap: 1.5rem;
}

.trial-controls {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: 1fr;
}

@media (min-width: 1200px) {
  .simulation-area:not(.single-player) {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 2rem;
  }
}

.trial-content {
  display: grid;
  grid-template-columns: minmax(300px, 1fr);
  gap: 2rem;
  margin-bottom: 2rem;
}

.case-info {
  background-color: var(--card-background);
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 4px var(--shadow-color);
}

.case-info h2 {
  color: var(--primary-color);
  margin-bottom: 1rem;
}

.case-browser, .selected-case-display {
  margin-top: 2rem;
}

.case-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-height: 400px;
  overflow-y: auto;
  padding-right: 0.5rem;
}

.case-card {
  background-color: var(--card-background);
  border: 2px solid var(--border-color);
  border-radius: 8px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.case-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px var(--shadow-color);
  border-color: var(--accent-blue);
}

.case-card.selected {
  border-color: var(--accent-blue);
  border-width: 3px;
  box-shadow: 0 4px 12px rgba(0, 102, 204, 0.3);
  background: var(--selected-bg);
}

[data-theme='dark'] .case-card.selected {
  background: linear-gradient(135deg, rgba(30, 30, 30, 0.9) 0%, rgba(0, 212, 255, 0.15) 100%);
  box-shadow: 0 0 20px rgba(0, 212, 255, 0.3);
}

.case-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.case-card-header h4 {
  margin: 0;
  font-size: 1.1rem;
  color: var(--text-color);
}

[data-theme='dark'] .case-card-header h4 {
  color: var(--primary-color);
}

.case-difficulty {
  background: var(--accent-blue);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 600;
}

.case-description {
  margin: 0;
  font-size: 0.95rem;
  color: var(--secondary-color);
  line-height: 1.5;
  text-align: left;
}

.selected-badge {
  margin-top: 0.5rem;
  display: inline-block;
  background: var(--accent-blue);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 600;
}

.no-cases, .waiting-message {
  text-align: center;
  padding: 2rem;
  color: var(--secondary-color);
  font-style: italic;
}

.players-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.player-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1rem;
  background-color: var(--card-background);
  border: 2px solid var(--border-color);
  border-radius: 8px;
  transition: all 0.3s ease;
}

.player-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--accent-blue) 0%, var(--link-hover) 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.2rem;
  flex-shrink: 0;
}

[data-theme='dark'] .player-avatar {
  background: linear-gradient(135deg, #00d4ff 0%, #0099cc 100%);
  box-shadow: 0 0 15px rgba(0, 212, 255, 0.4);
}

.player-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex: 1;
}

.player-name {
  font-weight: 600;
  color: var(--text-color);
  font-size: 1rem;
}

.player-role {
  font-size: 0.85rem;
  color: var(--accent-blue);
  font-weight: 500;
}

.player-role.no-role {
  color: var(--secondary-color);
  font-style: italic;
}

.leader-badge {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.players-header, .roles-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.role-status {
  font-size: 0.9rem;
  color: var(--secondary-color);
  font-style: italic;
}

.case-list::-webkit-scrollbar {
  width: 8px;
}

.case-list::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 4px;
}

.case-list::-webkit-scrollbar-thumb {
  background: var(--accent-blue);
  border-radius: 4px;
}

.case-list::-webkit-scrollbar-thumb:hover {
  background: var(--link-hover);
}

[data-theme='dark'] .case-list::-webkit-scrollbar-track {
  background: rgba(0, 212, 255, 0.1);
}
</style>