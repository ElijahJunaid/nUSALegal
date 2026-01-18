<template>
    <div>
        <div v-if="loading" class="flex justify-center">
            <span class="loading"></span>
        </div>
        <div v-else-if="filteredData.length === 0" class="alert alert-warning">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                class="h-6 w-6 shrink-0 stroke-current">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z">
                </path>
            </svg>
            <span>No data found matching your search.</span>
        </div>

        <div v-else>
            <div class="card">
                <div class="card-body text-center">
                    <table class="table text-center">
                        <tbody>
                            <tr v-for="(dt, index) in filteredData" :key="index">
                                <th class="text-center">{{ dt.title }}</th>
                                <td class="text-center">{{ dt.description }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
    search: string
}>()

const DefinitionStore = useDefinitionStore();

const { filteredData, loading } = storeToRefs(DefinitionStore);
const { get } = DefinitionStore;

watchEffect(() => {
    DefinitionStore.searchQuery = props.search;
})

onMounted(get)

onUnmounted(() => {
    console.log('unmounted definition')
})

</script>