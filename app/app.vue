<template>
  <NuxtLayout :key="String($route.meta.layout ?? 'default')">
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
import { watch } from 'vue'
import { useRoute, useRouter } from '#imports'
import { dLog } from '~/plugins/debug-logger.client'

const route = useRoute()
const router = useRouter()
router.beforeEach((to, from) => {
  dLog('[ROUTER] nav', from.path, '→', to.path)
})
watch(
  () => route.fullPath,
  to => {
    dLog('[NAV] route changed to:', to)
    dLog('[NAV] route.name:', route.name)
    dLog('[NAV] route.meta (full):', JSON.stringify(route.meta))
    dLog('[NAV] layout key will be:', String(route.meta.layout ?? 'default'))
  }
)
</script>
