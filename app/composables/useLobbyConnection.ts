import { ref, computed, onUnmounted } from 'vue'
import { useToast } from '~/composables/useToast'
import * as Ably from 'ably'

export interface LobbyPlayer {
  id: string
  name: string
  role: string | null
  isLeader: boolean
  lastSeen: number
}

export interface LobbyState {
  lobbyCode: string
  selectedCaseType: 'criminal' | 'civil' | null
  selectedCase: any
  players: LobbyPlayer[]
  roles: { [key: string]: string | null }
}

export function useLobbyConnection() {
  const { success, error, warning, info } = useToast()

  let ably: any | null = null
  let channel: any | null = null
  let clientId: string | null = null

  const isConnected = ref(false)
  const isConnecting = ref(false)
  const isReconnecting = ref(false)
  const reconnectAttempts = ref(0)
  const reconnectCountdown = ref(10)

  let heartbeatInterval: NodeJS.Timeout | null = null
  let activityCheckInterval: NodeJS.Timeout | null = null
  let reconnectTimeout: NodeJS.Timeout | null = null
  let reconnectCountdownInterval: NodeJS.Timeout | null = null

  const lobbyState = ref<LobbyState>({
    lobbyCode: '',
    selectedCaseType: null,
    selectedCase: null,
    players: [],
    roles: {}
  })

  const connectionStatus = computed(() => {
    if (isReconnecting.value) return 'reconnecting'
    if (isConnecting.value) return 'connecting'
    if (isConnected.value) return 'connected'
    return 'disconnected'
  })

  async function connect(lobbyCode: string, playerName: string, isLeader: boolean) {
    isConnecting.value = true
    
    try {
      
      ably = new Ably.Realtime({ authUrl: '/api/ably-auth' })
      channel = ably.channels.get(`lobby:${lobbyCode}`)

      await new Promise((resolve, reject) => {
        ably.connection.on('connected', () => {
          clientId = ably.auth.clientId
          resolve(true)
        })
        ably.connection.on('failed', reject)
        setTimeout(() => reject(new Error('Connection timeout')), 10000)
      })
      
      lobbyState.value.lobbyCode = lobbyCode
      lobbyState.value.players = [{
        id: clientId || 'local',
        name: playerName,
        role: null,
        isLeader,
        lastSeen: Date.now()
      }]
      
      isConnected.value = true
      isConnecting.value = false

      channel.subscribe('player-joined', onPlayerJoined)
      channel.subscribe('player-left', onPlayerLeft)
      channel.subscribe('role-claimed', onRoleClaimed)
      channel.subscribe('case-selected', onCaseSelected)
      channel.subscribe('trial-start', onTrialStart)
      channel.subscribe('heartbeat', onHeartbeat)

      await channel.publish('player-joined', {
        id: clientId,
        name: playerName,
        isLeader,
        timestamp: Date.now()
      })

      startHeartbeat()

      startActivityMonitoring()
      
      success('Connected to lobby')
      
      return true
    } catch (err) {
      console.error('Failed to connect to lobby:', err)
      isConnecting.value = false
      error('Failed to connect to lobby')
      return false
    }
  }

  function disconnect() {
    stopHeartbeat()
    stopActivityMonitoring()
    stopReconnection()

    if (channel && clientId) {
      channel.publish('player-left', {
        id: clientId,
        timestamp: Date.now()
      })
    }

    if (channel) {
      channel.unsubscribe()
      channel = null
    }
    
    if (ably) {
      ably.close()
      ably = null
    }
    
    clientId = null
    isConnected.value = false
    lobbyState.value = {
      lobbyCode: '',
      selectedCaseType: null,
      selectedCase: null,
      players: [],
      roles: {}
    }
    
    info('Disconnected from lobby')
  }

  function startHeartbeat() {
    if (heartbeatInterval) return
    
    heartbeatInterval = setInterval(() => {
      if (!isConnected.value) return

      const localPlayer = lobbyState.value.players.find(p => p.id === clientId)
      if (localPlayer) {
        localPlayer.lastSeen = Date.now()
      }

      if (channel && clientId) {
        channel.publish('heartbeat', {
          playerId: clientId,
          timestamp: Date.now()
        })
      }
    }, 5000)
  }

  function stopHeartbeat() {
    if (heartbeatInterval) {
      clearInterval(heartbeatInterval)
      heartbeatInterval = null
    }
  }

  function startActivityMonitoring() {
    if (activityCheckInterval) return
    
    activityCheckInterval = setInterval(() => {
      if (!isConnected.value) return
      
      const now = Date.now()
      const TIMEOUT = 15000 

      lobbyState.value.players = lobbyState.value.players.filter(player => {
        const isInactive = now - player.lastSeen > TIMEOUT
        
        if (isInactive && player.id !== clientId) {
          warning(`${player.name} disconnected (timeout)`)

          if (player.role) {
            lobbyState.value.roles[player.role] = null
          }
          
          return false
        }
        
        return true
      })
    }, 5000)
  }

  function stopActivityMonitoring() {
    if (activityCheckInterval) {
      clearInterval(activityCheckInterval)
      activityCheckInterval = null
    }
  }

  async function attemptReconnect() {
    if (isReconnecting.value || reconnectAttempts.value >= 3) return
    
    isReconnecting.value = true
    reconnectAttempts.value++
    reconnectCountdown.value = 10
    
    info(`Reconnecting... (${reconnectAttempts.value}/3)`)

    reconnectCountdownInterval = setInterval(() => {
      reconnectCountdown.value--
      
      if (reconnectCountdown.value <= 0) {
        stopReconnection()
        isReconnecting.value = false
        error('Reconnection failed - returning to lobby selection')
        
      }
    }, 1000)

    reconnectTimeout = setTimeout(async () => {
      const success = await connect(
        lobbyState.value.lobbyCode,
        'You',
        false
      )
      
      if (success) {
        isReconnecting.value = false
        reconnectAttempts.value = 0
        stopReconnection()
      } else if (reconnectAttempts.value < 3) {
        
        isReconnecting.value = false
        setTimeout(() => attemptReconnect(), 2000)
      } else {
        isReconnecting.value = false
        error('Failed to reconnect after 3 attempts')
      }
    }, 3000)
  }

  function stopReconnection() {
    if (reconnectTimeout) {
      clearTimeout(reconnectTimeout)
      reconnectTimeout = null
    }
    
    if (reconnectCountdownInterval) {
      clearInterval(reconnectCountdownInterval)
      reconnectCountdownInterval = null
    }
  }

  function onConnectionLost() {
    isConnected.value = false
    warning('Connection lost - attempting to reconnect...')
    attemptReconnect()
  }

  function onPlayerJoined(message: any) {
    const { id, name, isLeader } = message.data

    if (id === clientId) return
    
    const existingPlayer = lobbyState.value.players.find(p => p.id === id)
    if (!existingPlayer) {
      lobbyState.value.players.push({
        id,
        name,
        role: null,
        isLeader,
        lastSeen: Date.now()
      })
      info(`${name} joined the lobby`)
    }
  }
  
  function onPlayerLeft(message: any) {
    const { id } = message.data
    
    const player = lobbyState.value.players.find(p => p.id === id)
    if (player) {
      lobbyState.value.players = lobbyState.value.players.filter(p => p.id !== id)

      if (player.role) {
        lobbyState.value.roles[player.role] = null
      }
      
      warning(`${player.name} left the lobby`)
    }
  }
  
  function onRoleClaimed(message: any) {
    const { playerId, playerName, roleId, roleName } = message.data

    const player = lobbyState.value.players.find(p => p.id === playerId)
    if (player) {
      
      if (player.role) {
        lobbyState.value.roles[player.role] = null
      }
      
      player.role = roleName
      lobbyState.value.roles[roleId] = playerName
      
      if (playerId !== clientId) {
        info(`${playerName} claimed ${roleName}`)
      }
    }
  }
  
  function onCaseSelected(message: any) {
    const { case: selectedCase } = message.data
    lobbyState.value.selectedCase = selectedCase
    
    if (message.clientId !== clientId) {
      info(`Case selected: ${selectedCase.title}`)
    }
  }
  
  function onTrialStart(message: any) {

    if (message.clientId !== clientId) {
      info('Trial is starting!')
    }
  }
  
  function onHeartbeat(message: any) {
    const { playerId, timestamp } = message.data
    
    const player = lobbyState.value.players.find(p => p.id === playerId)
    if (player) {
      player.lastSeen = timestamp
    }
  }

  function claimRole(roleId: string, roleName: string) {
    
    const localPlayer = lobbyState.value.players.find(p => p.id === clientId)
    if (localPlayer) {
      
      if (localPlayer.role) {
        lobbyState.value.roles[localPlayer.role] = null
      }

      localPlayer.role = roleName
      lobbyState.value.roles[roleId] = localPlayer.name
    }

    if (channel && clientId) {
      channel.publish('role-claimed', {
        playerId: clientId,
        playerName: localPlayer?.name || 'Unknown',
        roleId,
        roleName
      })
    }
  }

  function selectCase(caseItem: any) {
    lobbyState.value.selectedCase = caseItem

    if (channel) {
      channel.publish('case-selected', {
        case: caseItem
      })
    }
  }

  function startTrial() {
    
    if (channel) {
      channel.publish('trial-start', {
        case: lobbyState.value.selectedCase,
        roles: lobbyState.value.roles,
        timestamp: Date.now()
      })
    }
    
    return {
      case: lobbyState.value.selectedCase,
      roles: lobbyState.value.roles
    }
  }

  onUnmounted(() => {
    disconnect()
  })
  
  return {
    
    isConnected,
    isConnecting,
    isReconnecting,
    reconnectAttempts,
    reconnectCountdown,
    connectionStatus,
    lobbyState,

    connect,
    disconnect,
    claimRole,
    selectCase,
    startTrial,
    onConnectionLost,
    attemptReconnect
  }
}