<template>
    <NuxtLink :to="to" class="btn btn-xl">
        <slot />
    </NuxtLink>
</template>

<script lang="ts" setup>
defineProps<{
    to: string
}>()
</script>