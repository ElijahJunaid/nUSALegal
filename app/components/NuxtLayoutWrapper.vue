<template>
  <div>
    <slot />
  </div>
</template>

<script setup lang="ts">
// Safe wrapper for pages that don't use the default layout
// This component bypasses NuxtLayout to avoid hydration errors when layout: false
</script>
