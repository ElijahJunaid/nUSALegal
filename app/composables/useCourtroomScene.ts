import { ref, onUnmounted } from 'vue'
import { dLog, dError } from '~/plugins/debug-logger.client'

interface BabylonVector3 {
  x: number
  y: number
  z: number
  clone(): BabylonVector3
}

interface BabylonColor3 {
  r: number
  g: number
  b: number
}

interface BabylonTextureContext {
  fillStyle: string
  fillRect(x: number, y: number, width: number, height: number): void
}

interface BabylonTexture {
  getContext(): BabylonTextureContext
  drawText(
    text: string,
    x: number | null,
    y: number | null,
    font: string,
    color: string,
    clearColor: string,
    invertY: boolean
  ): void
}

interface BabylonMaterial {
  diffuseColor: BabylonColor3
  emissiveColor: BabylonColor3
  backFaceCulling: boolean
  alpha: number
  diffuseTexture: BabylonTexture | null
}

interface BabylonMesh {
  position: BabylonVector3
  scaling: BabylonVector3
  receiveShadows: boolean
  material: BabylonMaterial | null
  billboardMode: number
  dispose(): void
}

interface BabylonLight {
  intensity: number
  position: BabylonVector3
}

interface BabylonEngine {
  runRenderLoop(callback: () => void): void
  resize(): void
  dispose(): void
}

interface BabylonScene {
  clearColor: BabylonColor3
  render(): void
  dispose(): void
}

interface BabylonCamera {
  setPosition(vector: BabylonVector3): void
  attachControl(canvas: HTMLCanvasElement, preventDefault: boolean): void
  setTarget(vector: BabylonVector3): void
  radius: number
}

interface BabylonSceneLoader {
  IsPluginForExtensionAvailable(extension: string): boolean
  ImportMesh(
    meshesNames: string,
    rootUrl: string,
    sceneFilename: string,
    scene: BabylonScene,
    onSuccess: (meshes: BabylonMesh[]) => void,
    onProgress: null,
    onError: (scene: BabylonScene, message: string, exception: Error | null) => void
  ): void
  RegisterPlugin?: unknown
}

interface BabylonMeshBuilder {
  CreateSphere(name: string, options: { diameter: number }, scene: BabylonScene): BabylonMesh
  CreateGround(
    name: string,
    options: { width: number; height: number },
    scene: BabylonScene
  ): BabylonMesh
  CreatePlane(
    name: string,
    options: { width: number; height: number },
    scene: BabylonScene
  ): BabylonMesh
}

interface BabylonNamespace {
  Engine: new (canvas: HTMLCanvasElement, antialias: boolean) => BabylonEngine
  Scene: new (engine: BabylonEngine) => BabylonScene
  ArcRotateCamera: new (
    name: string,
    alpha: number,
    beta: number,
    radius: number,
    target: BabylonVector3,
    scene: BabylonScene
  ) => BabylonCamera
  HemisphericLight: new (
    name: string,
    direction: BabylonVector3,
    scene: BabylonScene
  ) => BabylonLight
  DirectionalLight: new (
    name: string,
    direction: BabylonVector3,
    scene: BabylonScene
  ) => BabylonLight
  PointLight: new (name: string, position: BabylonVector3, scene: BabylonScene) => BabylonLight
  Color3: new (r: number, g: number, b: number) => BabylonColor3
  Vector3: {
    Zero(): BabylonVector3
    new (x: number, y: number, z: number): BabylonVector3
  }
  StandardMaterial: new (name: string, scene: BabylonScene) => BabylonMaterial
  DynamicTexture: new (
    name: string,
    options: { width: number; height: number },
    scene: BabylonScene,
    generateMipMaps: boolean
  ) => BabylonTexture
  MeshBuilder: BabylonMeshBuilder
  Mesh: { BILLBOARDMODE_ALL: number }
  SceneLoader: BabylonSceneLoader
}

type BabylonWindow = typeof window & { BABYLON?: BabylonNamespace }

export interface RolePositions {
  judge: BabylonVector3
  prosecutor: BabylonVector3
  defense: BabylonVector3
  witness: BabylonVector3
  jury: BabylonVector3
  spectator: BabylonVector3
}

interface Avatar {
  mesh: BabylonMesh
  role: string
  name: string
}

export function useCourtroomScene() {
  const canvas = ref<HTMLCanvasElement | null>(null)
  const engine = ref<BabylonEngine | null>(null)
  const scene = ref<BabylonScene | null>(null)
  const camera = ref<BabylonCamera | null>(null)
  const isInitialized = ref(false)
  const isLoading = ref(false)
  const hasError = ref(false)
  const babylonScriptsLoaded = ref(false)

  const avatars = ref<Record<string, Avatar>>({})
  const localPlayerId = ref<string | null>(null)
  const playerRole = ref<string | null>(null)
  const rolePositions = ref<RolePositions | null>(null)
  const chatBubbles = ref<Record<string, BabylonMesh>>({})

  const _inputMap = ref<Record<string, boolean>>({})
  const _movementEnabled = ref(false)

  async function loadBabylonScripts(): Promise<void> {
    if (babylonScriptsLoaded.value) {
      return Promise.resolve()
    }

    return new Promise((resolve, reject) => {
      const babylonWin = window as BabylonWindow
      if (
        typeof babylonWin.BABYLON !== 'undefined' &&
        babylonWin.BABYLON?.SceneLoader &&
        babylonWin.BABYLON?.SceneLoader.RegisterPlugin
      ) {
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
        .then(() =>
          loadScript(
            'https://cdn.jsdelivr.net/npm/babylonjs-loaders@6.23.0/babylonjs.loaders.min.js'
          )
        )
        .then(() =>
          loadScript(
            'https://cdn.jsdelivr.net/npm/babylonjs-loaders@6.23.0/babylon.glTF2FileLoader.js'
          )
        )
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
      dError(`Canvas element with ID '${canvasId}' not found`)
      return false
    }

    try {
      const BABYLON = (window as BabylonWindow).BABYLON!
      engine.value = new BABYLON.Engine(canvas.value, true)
      isInitialized.value = true
      return true
    } catch (error) {
      dError('Error initializing Babylon engine:', error)
      return false
    }
  }

  async function createScene(): Promise<BabylonScene | null> {
    isLoading.value = true
    hasError.value = false

    const BABYLON = (window as BabylonWindow).BABYLON

    if (typeof BABYLON === 'undefined') {
      dError('Babylon.js is not loaded. Attempting to load scripts again.')
      await loadBabylonScripts()

      if (typeof (window as BabylonWindow).BABYLON === 'undefined') {
        dError('Failed to load Babylon.js after retry.')
        hasError.value = true
        isLoading.value = false
        return null
      }
    }

    scene.value = new BABYLON.Scene(engine.value)
    scene.value.clearColor = new BABYLON.Color3(0.2, 0.2, 0.3)

    camera.value = new BABYLON.ArcRotateCamera(
      'camera',
      0,
      Math.PI / 2.5,
      50,
      BABYLON.Vector3.Zero(),
      scene.value
    )
    camera.value.setPosition(new BABYLON.Vector3(0, 20, -50))
    camera.value.attachControl(canvas.value, true)

    const hemisphericLight = new BABYLON.HemisphericLight(
      'hemisphericLight',
      new BABYLON.Vector3(0, 1, 0),
      scene.value
    )
    hemisphericLight.intensity = 0.7

    const directionalLight = new BABYLON.DirectionalLight(
      'directionalLight',
      new BABYLON.Vector3(0, -1, 1),
      scene.value
    )
    directionalLight.position = new BABYLON.Vector3(0, 20, -20)
    directionalLight.intensity = 0.5

    const light2 = new BABYLON.DirectionalLight(
      'light2',
      new BABYLON.Vector3(1, -1, 1),
      scene.value
    )
    light2.intensity = 0.8
    light2.position = new BABYLON.Vector3(-20, 20, -20)

    const light3 = new BABYLON.PointLight('light3', new BABYLON.Vector3(0, 10, 0), scene.value)
    light3.intensity = 0.3

    try {
      if (BABYLON.SceneLoader.IsPluginForExtensionAvailable('.glb')) {
        BABYLON.SceneLoader.ImportMesh(
          '',
          '/models/',
          'law_court.glb',
          scene.value,
          (meshes: BabylonMesh[]) => {
            if (meshes && meshes.length > 0) {
              const rootMesh = meshes[0]
              rootMesh.scaling = new BABYLON.Vector3(1, 1, 1)
              rootMesh.position = new BABYLON.Vector3(0, 0, 0)

              dLog('3D model loaded successfully with ' + meshes.length + ' meshes')
              isLoading.value = false
            }
          },
          null,
          (_sceneObj: BabylonScene, message: string, exception: Error | null) => {
            const errorMsg = exception
              ? exception.message || String(exception)
              : message || 'Unknown error'
            dError('Error loading 3D model:', errorMsg)
            hasError.value = true
            isLoading.value = false
          }
        )
      } else {
        dError('GLTF loader plugin is not available')
        hasError.value = true
        isLoading.value = false
      }
    } catch (error: unknown) {
      dError('Error in scene creation:', error instanceof Error ? error.message : String(error))
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

    const ground = BABYLON.MeshBuilder.CreateGround(
      'ground',
      { width: 50, height: 50 },
      scene.value
    )
    ground.position.y = 0
    ground.receiveShadows = true

    const groundMaterial = new BABYLON.StandardMaterial('groundMaterial', scene.value)
    groundMaterial.diffuseColor = new BABYLON.Color3(0.2, 0.2, 0.2)
    ground.material = groundMaterial

    camera.value.setTarget(BABYLON.Vector3.Zero())
    camera.value.radius = 10

    return scene.value
  }

  function createAvatar(
    playerId: string,
    role: string,
    options: { name: string; isLocal: boolean }
  ) {
    const BABYLON = (window as BabylonWindow).BABYLON!
    if (!scene.value || !rolePositions.value) return

    const avatar = BABYLON.MeshBuilder.CreateSphere(
      `avatar-${playerId}`,
      { diameter: 2 },
      scene.value
    )

    const position =
      rolePositions.value[role as keyof RolePositions] || rolePositions.value.spectator
    avatar.position = position.clone()

    const material = new BABYLON.StandardMaterial(`material-${playerId}`, scene.value)
    const roleColors: Record<string, BabylonColor3> = {
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
    const BABYLON = (window as BabylonWindow).BABYLON!
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

    const material = new BABYLON.StandardMaterial(`chatMaterial-${playerId}`, scene.value)
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
