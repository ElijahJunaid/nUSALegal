<template>
    <div>
        <div v-if="loading" class="flex justify-center">
            <span class="loading"></span>
        </div>

        <div v-else-if="error" class="alert alert-error">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round"
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{{ error }}</span>
        </div>

        <div v-else-if="filteredData.length === 0" class="alert alert-warning">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                class="h-6 w-6 shrink-0 stroke-current">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z">
                </path>
            </svg>
            <span>No VIPs found matching your search.</span>
        </div>

        <div v-else class="grid">
            <div v-for="vip in filteredData" :key="vip.userId" class="card">
                <figure>
                    <div class="avatar">
                        <div>
                            <div v-if="vip.isLoading" class="skeleton w-32 h-32 rounded-full"></div>
                            <img v-else :src="vip.avatar.imageUrl" :alt="vip.user.username" @error="handleImageError"
                                loading="lazy" />
                        </div>
                    </div>
                </figure>
                <div class="card-body text-center">
                    <div v-if="vip.isLoading" class="skeleton h-8 w-32 mb-2 mx-auto"></div>
                    <h2 v-else class="card-title text-xl text-center">{{ vip.user.username }}</h2>

                    <p class="vip-name text-center">ID: {{ vip.userId }}</p>
                    <div class="divider my-2"></div>
                    <div class="text-center">{{ vip.title }}</div>
                    <p class="vip-reason text-center">{{ vip.reason }}</p>

                    <div v-if="vip.hasError && !vip.isLoading" class="badge mx-auto">
                        Limited info available
                    </div>

                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
    search: string
}>()

defineEmits(['reset_search'])

const ResourceVIPStore = useResourceVIPStore();

const { filteredData, loading, error } = storeToRefs(ResourceVIPStore);
const { get } = ResourceVIPStore;

watchEffect(() => {
    ResourceVIPStore.searchQuery = props.search;
})
onMounted(get)

const handleImageError = (event: Event) => {
    const target = event.target as HTMLImageElement;
    target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzMzMzMzMyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjE4IiBmaWxsPSIjZmZmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+VklQPC90ZXh0Pjwvc3ZnPg==';
}

</script>