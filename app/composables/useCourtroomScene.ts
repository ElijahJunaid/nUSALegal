import { ref, onUnmounted } from 'vue'

export interface RolePositions {
  judge: any
  prosecutor: any
  defense: any
  witness: any
  jury: any
  spectator: any
}

export function useCourtroomScene() {
  const canvas = ref<HTMLCanvasElement | null>(null)
  const engine = ref<any>(null)
  const scene = ref<any>(null)
  const camera = ref<any>(null)
  const isInitialized = ref(false)
  const isLoading = ref(false)
  const hasError = ref(false)
  const babylonScriptsLoaded = ref(false)
  
  const avatars = ref<Record<string, any>>({})
  const localPlayerId = ref<string | null>(null)
  const playerRole = ref<string | null>(null)
  const rolePositions = ref<RolePositions | null>(null)
  const chatBubbles = ref<Record<string, any>>({})
  
  const inputMap = ref<Record<string, boolean>>({})
  const movementEnabled = ref(false)

  async function loadBabylonScripts(): Promise<void> {
    if (babylonScriptsLoaded.value) {
      return Promise.resolve()
    }
    
    return new Promise((resolve, reject) => {
      
      if (typeof (window as any).BABYLON !== 'undefined' && 
          (window as any).BABYLON.SceneLoader && 
          (window as any).BABYLON.SceneLoader.RegisterPlugin) {
        babylonScriptsLoaded.value = true
        resolve()
        return
      }
      
      const loadScript = (url: string) => {
        return new Promise<void>((resolveScript, rejectScript) => {
          const script = document.createElement('script')
          script.src = url
          script.async = false
          
          script.onload = () => resolveScript()
          script.onerror = () => rejectScript(new Error(`Failed to load script: ${url}`))
          
          document.head.appendChild(script)
        })
      }
      
      loadScript('https://cdn.jsdelivr.net/npm/babylonjs@6.23.0/babylon.js')
        .then(() => loadScript('https://cdn.jsdelivr.net/npm/babylonjs-loaders@6.23.0/babylonjs.loaders.min.js'))
        .then(() => loadScript('https://cdn.jsdelivr.net/npm/babylonjs-loaders@6.23.0/babylon.glTF2FileLoader.js'))
        .then(() => {
          babylonScriptsLoaded.value = true
          resolve()
        })
        .catch(reject)
    })
  }

  async function initialize(canvasId: string): Promise<boolean> {
    if (isInitialized.value) return true
    
    canvas.value = document.getElementById(canvasId) as HTMLCanvasElement
    if (!canvas.value) {
      console.error(`Canvas element with ID '${canvasId}' not found`)
      return false
    }
    
    try {
      const BABYLON = (window as any).BABYLON
      engine.value = new BABYLON.Engine(canvas.value, true)
      isInitialized.value = true
      return true
    } catch (error) {
      console.error('Error initializing Babylon engine:', error)
      return false
    }
  }

  async function createScene(): Promise<any> {
    isLoading.value = true
    hasError.value = false
    
    const BABYLON = (window as any).BABYLON
    
    if (typeof BABYLON === 'undefined') {
      console.error("Babylon.js is not loaded. Attempting to load scripts again.")
      await loadBabylonScripts()
      
      if (typeof (window as any).BABYLON === 'undefined') {
        console.error("Failed to load Babylon.js after retry.")
        hasError.value = true
        isLoading.value = false
        return null
      }
    }
    
    scene.value = new BABYLON.Scene(engine.value)
    scene.value.clearColor = new BABYLON.Color3(0.2, 0.2, 0.3)

    camera.value = new BABYLON.ArcRotateCamera(
      "camera",
      0,
      Math.PI / 2.5,
      50,
      BABYLON.Vector3.Zero(),
      scene.value
    )
    camera.value.setPosition(new BABYLON.Vector3(0, 20, -50))
    camera.value.attachControl(canvas.value, true)

    const hemisphericLight = new BABYLON.HemisphericLight(
      "hemisphericLight",
      new BABYLON.Vector3(0, 1, 0),
      scene.value
    )
    hemisphericLight.intensity = 0.7
    
    const directionalLight = new BABYLON.DirectionalLight(
      "directionalLight",
      new BABYLON.Vector3(0, -1, 1),
      scene.value
    )
    directionalLight.position = new BABYLON.Vector3(0, 20, -20)
    directionalLight.intensity = 0.5
    
    const light2 = new BABYLON.DirectionalLight(
      "light2",
      new BABYLON.Vector3(1, -1, 1),
      scene.value
    )
    light2.intensity = 0.8
    light2.position = new BABYLON.Vector3(-20, 20, -20)
    
    const light3 = new BABYLON.PointLight(
      "light3",
      new BABYLON.Vector3(0, 10, 0),
      scene.value
    )
    light3.intensity = 0.3

    try {
      if (BABYLON.SceneLoader.IsPluginForExtensionAvailable('.glb')) {
        BABYLON.SceneLoader.ImportMesh(
          "",
          "/models/",
          "law_court.glb",
          scene.value,
          (meshes: any[]) => {
            if (meshes && meshes.length > 0) {
              const rootMesh = meshes[0]
              rootMesh.scaling = new BABYLON.Vector3(1, 1, 1)
              rootMesh.position = new BABYLON.Vector3(0, 0, 0)
              
              console.info("3D model loaded successfully with " + meshes.length + " meshes")
              isLoading.value = false
            }
          },
          null,
          (sceneObj: any, message: string, exception: any) => {
            const errorMsg = exception ? exception.message || String(exception) : message || 'Unknown error'
            console.error("Error loading 3D model:", errorMsg)
            hasError.value = true
            isLoading.value = false
          }
        )
      } else {
        console.error("GLTF loader plugin is not available")
        hasError.value = true
        isLoading.value = false
      }
    } catch (error: any) {
      console.error("Error in scene creation:", error?.message || String(error))
      hasError.value = true
      isLoading.value = false
    }

    rolePositions.value = {
      judge: new BABYLON.Vector3(0, 1, 5),
      prosecutor: new BABYLON.Vector3(-5, 1, 0),
      defense: new BABYLON.Vector3(5, 1, 0),
      witness: new BABYLON.Vector3(0, 1, -5),
      jury: new BABYLON.Vector3(-8, 1, 5),
      spectator: new BABYLON.Vector3(0, 1, -10)
    }

    const ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 50, height: 50}, scene.value)
    ground.position.y = 0
    ground.receiveShadows = true
    
    const groundMaterial = new BABYLON.StandardMaterial("groundMaterial", scene.value)
    groundMaterial.diffuseColor = new BABYLON.Color3(0.2, 0.2, 0.2)
    ground.material = groundMaterial
    
    camera.value.setTarget(BABYLON.Vector3.Zero())
    camera.value.radius = 10
    
    return scene.value
  }

  function createAvatar(playerId: string, role: string, options: { name: string; isLocal: boolean }) {
    const BABYLON = (window as any).BABYLON
    if (!scene.value || !rolePositions.value) return
    
    const avatar = BABYLON.MeshBuilder.CreateSphere(
      `avatar-${playerId}`,
      { diameter: 2 },
      scene.value
    )
    
    const position = (rolePositions.value as any)[role] || rolePositions.value.spectator
    avatar.position = position.clone()

    const material = new BABYLON.StandardMaterial(`material-${playerId}`, scene.value)
    const roleColors: Record<string, any> = {
      judge: new BABYLON.Color3(0.5, 0, 0.5), 
      prosecutor: new BABYLON.Color3(0, 0, 1), 
      defense: new BABYLON.Color3(1, 0, 0), 
      witness: new BABYLON.Color3(0, 1, 0), 
      jury: new BABYLON.Color3(1, 1, 0) 
    }
    material.diffuseColor = roleColors[role] || new BABYLON.Color3(0.5, 0.5, 0.5)
    avatar.material = material
    
    avatars.value[playerId] = {
      mesh: avatar,
      role,
      name: options.name
    }
    
    if (options.isLocal) {
      localPlayerId.value = playerId
      playerRole.value = role
    }
  }

  function run() {
    if (!engine.value) return
    
    engine.value.runRenderLoop(() => {
      if (scene.value) {
        scene.value.render()
      }
    })
    
    window.addEventListener('resize', () => {
      if (engine.value) {
        engine.value.resize()
      }
    })
  }

  function dispose() {
    
    Object.keys(chatBubbles.value).forEach(key => {
      if (chatBubbles.value[key]) {
        chatBubbles.value[key].dispose()
      }
    })
    chatBubbles.value = {}
    
    if (scene.value) {
      scene.value.dispose()
    }
    if (engine.value) {
      engine.value.dispose()
    }
  }

  function showChatBubble(playerId: string, message: string) {
    const BABYLON = (window as any).BABYLON
    if (!scene.value || !avatars.value[playerId]) return
    
    const avatar = avatars.value[playerId]

    if (chatBubbles.value[playerId]) {
      chatBubbles.value[playerId].dispose()
      delete chatBubbles.value[playerId]
    }

    const plane = BABYLON.MeshBuilder.CreatePlane(
      `chatBubble-${playerId}`,
      { width: 4, height: 1 },
      scene.value
    )

    plane.position = avatar.mesh.position.clone()
    plane.position.y += 3

    plane.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL

    const texture = new BABYLON.DynamicTexture(
      `chatTexture-${playerId}`,
      { width: 512, height: 128 },
      scene.value,
      false
    )
    
    const ctx = texture.getContext()
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
    ctx.fillRect(0, 0, 512, 128)

    texture.drawText(
      message.length > 40 ? message.substring(0, 37) + '...' : message,
      null,
      null,
      'bold 32px Arial',
      'white',
      'transparent',
      true
    )

    const material = new BABYLON.StandardMaterial(
      `chatMaterial-${playerId}`,
      scene.value
    )
    material.diffuseTexture = texture
    material.emissiveColor = new BABYLON.Color3(1, 1, 1)
    material.backFaceCulling = false
    plane.material = material

    chatBubbles.value[playerId] = plane

    let alpha = 1
    const fadeInterval = setInterval(() => {
      alpha -= 0.02
      if (alpha <= 0) {
        clearInterval(fadeInterval)
        if (chatBubbles.value[playerId]) {
          chatBubbles.value[playerId].dispose()
          delete chatBubbles.value[playerId]
        }
      } else {
        material.alpha = alpha
      }
    }, 100)
  }

  onUnmounted(() => {
    dispose()
  })

  return {
    canvas,
    engine,
    scene,
    camera,
    isLoading,
    hasError,
    isInitialized,
    avatars,
    localPlayerId,
    playerRole,
    rolePositions,
    loadBabylonScripts,
    initialize,
    createScene,
    createAvatar,
    run,
    dispose,
    showChatBubble
  }
}