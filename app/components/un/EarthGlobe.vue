<template>
  <div class="globe-container" ref="container">
    <div v-if="loading" class="globe-loading">
      <div class="spinner"></div>
      <span>Loading the world...</span>
    </div>
    <canvas ref="canvas" v-show="!loading"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { dError } from '~/plugins/debug-logger.client'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const container = ref<HTMLElement | null>(null)
const canvas = ref<HTMLCanvasElement | null>(null)
const loading = ref(true)

let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let controls: OrbitControls
let frameId: number
let model: THREE.Group | null = null

const initThree = () => {
  if (!container.value || !canvas.value) return

  scene = new THREE.Scene()

  const width = container.value.clientWidth
  const height = container.value.clientHeight
  camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000)
  camera.position.z = 1

  renderer = new THREE.WebGLRenderer({
    canvas: canvas.value,
    antialias: true,
    alpha: true
  })
  renderer.setSize(width, height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setClearColor(0x000000, 0)

  const ambientLight = new THREE.AmbientLight(0xffffff, 2.0)
  scene.add(ambientLight)

  const sunLight = new THREE.DirectionalLight(0xffffff, 1.4)
  sunLight.position.set(5, 3, 5)
  scene.add(sunLight)

  const fillLight = new THREE.DirectionalLight(0xffffff, 0.4)
  fillLight.position.set(-5, -3, -5)
  scene.add(fillLight)

  controls = new OrbitControls(camera, canvas.value)
  controls.enableDamping = true
  controls.dampingFactor = 0.05
  controls.rotateSpeed = 0.5
  controls.enablePan = false
  controls.enableZoom = true
  controls.minDistance = 1.5
  controls.maxDistance = 6
  controls.autoRotate = true
  controls.autoRotateSpeed = 0.5

  const loader = new GLTFLoader()
  loader.load(
    '/models/earth.glb',
    gltf => {
      model = gltf.scene

      const box = new THREE.Box3().setFromObject(model)
      const center = box.getCenter(new THREE.Vector3())
      const size = box.getSize(new THREE.Vector3())

      const maxDim = Math.max(size.x, size.y, size.z)
      const scale = 1.0 / maxDim
      model.scale.set(scale, scale, scale)

      model.position.sub(center.multiplyScalar(scale))

      scene.add(model)
      loading.value = false
    },
    _xhr => {
      // Optional: progress
      // console.log((_xhr.loaded / _xhr.total * 100) + '% loaded')
    },
    error => {
      dError('Error loading the model earth.glb:', error)
      loading.value = false
    }
  )

  const handleResize = () => {
    if (!container.value) return
    const w = container.value.clientWidth
    const h = container.value.clientHeight
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    renderer.setSize(w, h)
  }
  window.addEventListener('resize', handleResize)

  const animate = () => {
    frameId = window.requestAnimationFrame(animate)
    controls.update()
    renderer.render(scene, camera)
  }
  animate()

  // Cleanup reference for resize listener
  // @ts-ignore: custom property on window
  window._globeResize = handleResize
}

onMounted(() => {
  setTimeout(initThree, 100)
})

onUnmounted(() => {
  window.cancelAnimationFrame(frameId)
  // @ts-ignore: custom property on window
  if (window._globeResize) {
    // @ts-ignore: custom property on window
    window.removeEventListener('resize', window._globeResize)
  }

  if (renderer) {
    renderer.dispose()
  }
  if (scene) {
    scene.traverse(object => {
      if (object instanceof THREE.Mesh) {
        object.geometry.dispose()
        if (Array.isArray(object.material)) {
          object.material.forEach(m => m.dispose())
        } else {
          object.material.dispose()
        }
      }
    })
  }
})
</script>

<style scoped>
.globe-container {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle at center, rgba(0, 62, 115, 0.1) 0%, transparent 70%);
}

canvas {
  width: 100% !important;
  height: 100% !important;
  cursor: grab;
}

canvas:active {
  cursor: grabbing;
}

.globe-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  color: #003e73;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(0, 62, 115, 0.1);
  border-top: 4px solid #003e73;
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

[data-theme='dark'] .globe-loading {
  color: #60a5fa;
}

[data-theme='dark'] .spinner {
  border-color: rgba(96, 165, 250, 0.1);
  border-top-color: #60a5fa;
}
</style>
