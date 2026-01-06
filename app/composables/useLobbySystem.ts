import { ref } from 'vue'

export interface Player {
  name: string
  role: string | null
  isLeader: boolean
  lastSeen: number
}

export function useLobbySystem() {
  const isConnected = ref(false)
  const lobbyCode = ref('')
  const isLeader = ref(false)
  const connectedPlayers = ref<Map<string, Player>>(new Map())
  const selectedCase = ref<{ type: string; index: number } | null>(null)
  const claimedRoles = ref<Map<string, string>>(new Map()) 
  
  const HEARTBEAT_INTERVAL = 5000
  const PLAYER_TIMEOUT = 15000
  
  let heartbeatInterval: ReturnType<typeof setInterval> | null = null
  let lastHeartbeat = Date.now()

  function connect(code: string, asLeader: boolean) {
    lobbyCode.value = code
    isLeader.value = asLeader
    isConnected.value = true

    connectedPlayers.value.set('You', {
      name: 'You',
      role: null,
      isLeader: asLeader,
      lastSeen: Date.now()
    })
    
    startHeartbeat()

    console.log(`${asLeader ? 'Created' : 'Joined'} lobby: ${code}`)
  }

  function disconnect() {
    stopHeartbeat()
    isConnected.value = false
    connectedPlayers.value.clear()
    claimedRoles.value.clear()

    console.log('Disconnected from lobby')
  }

  function startHeartbeat() {
    heartbeatInterval = setInterval(() => {
      
      lastHeartbeat = Date.now()
      checkPlayersActivity()
    }, HEARTBEAT_INTERVAL)
  }

  function stopHeartbeat() {
    if (heartbeatInterval) {
      clearInterval(heartbeatInterval)
      heartbeatInterval = null
    }
  }

  function checkPlayersActivity() {
    const now = Date.now()
    for (const [playerName, data] of connectedPlayers.value.entries()) {
      if (now - data.lastSeen > PLAYER_TIMEOUT && playerName !== 'You') {
        connectedPlayers.value.delete(playerName)
        console.log(`Player ${playerName} disconnected due to inactivity`)
      }
    }
  }

  function claimRole(role: string) {
    
    const currentOwner = claimedRoles.value.get(role)
    if (currentOwner && currentOwner !== 'You') {
      throw new Error(`Role ${role} is already claimed by ${currentOwner}`)
    }

    for (const [r, owner] of claimedRoles.value.entries()) {
      if (owner === 'You') {
        claimedRoles.value.delete(r)
      }
    }

    claimedRoles.value.set(role, 'You')

    const player = connectedPlayers.value.get('You')
    if (player) {
      player.role = role
    }

    console.log(`Claimed role: ${role}`)
  }

  function releaseRole(role: string) {
    if (claimedRoles.value.get(role) === 'You') {
      claimedRoles.value.delete(role)
      
      const player = connectedPlayers.value.get('You')
      if (player) {
        player.role = null
      }

      console.log(`Released role: ${role}`)
    }
  }

  function selectCase(type: string, index: number) {
    if (!isLeader.value) {
      console.warn('Only lobby leader can select case')
      return
    }
    
    selectedCase.value = { type, index }

    console.log(`Selected case: ${type} #${index}`)
  }

  function onPlayerJoin(playerName: string) {
    connectedPlayers.value.set(playerName, {
      name: playerName,
      role: null,
      isLeader: false,
      lastSeen: Date.now()
    })
  }

  function onPlayerLeave(playerName: string) {
    connectedPlayers.value.delete(playerName)

    for (const [role, owner] of claimedRoles.value.entries()) {
      if (owner === playerName) {
        claimedRoles.value.delete(role)
      }
    }
  }

  function onRoleClaim(playerName: string, role: string) {
    
    const previousOwner = claimedRoles.value.get(role)
    if (previousOwner && previousOwner !== playerName) {
      const player = connectedPlayers.value.get(previousOwner)
      if (player) {
        player.role = null
      }
    }

    claimedRoles.value.set(role, playerName)

    const player = connectedPlayers.value.get(playerName)
    if (player) {
      player.role = role
    }
  }

  function onCaseSelect(type: string, index: number) {
    selectedCase.value = { type, index }
  }

  return {
    isConnected,
    lobbyCode,
    isLeader,
    connectedPlayers,
    selectedCase,
    claimedRoles,
    connect,
    disconnect,
    claimRole,
    releaseRole,
    selectCase,
    onPlayerJoin,
    onPlayerLeave,
    onRoleClaim,
    onCaseSelect
  }
}