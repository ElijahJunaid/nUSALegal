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
            <div class="office-group form-control">
                <select v-model="filterType" class="select select-bordered w-full" @change="$emit('reset_search')">
                    <option value="all">All Office</option>
                    <template v-for="(filter, i) in officeGroupList" :key="i">
                        <option :value="filter">{{ filter }}</option>
                    </template>
                </select>
            </div>

            <div class="office-card">
                <div class="card-body">
                    <template v-for="office in filteredData">
                        <div>
                            <div>{{ office.label }}</div>
                            <table class="table" v-if="office.data.length">
                                <tbody>
                                    <tr v-for="(dt, index) in office.data" :key="index">
                                        <td>
                                            <p>{{ dt.title }}</p>
                                            <p>{{ dt.description }}</p>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { emit } from 'process';

const props = defineProps<{
    search: string
}>()

defineEmits(['reset_search'])
const ResourceOfficeStore = useResourceOfficeStore();

const { filteredData, officeGroupList, loading, filterType } = storeToRefs(ResourceOfficeStore);
const { get } = ResourceOfficeStore;

watchEffect(() => {
    ResourceOfficeStore.searchQuery = props.search;
})

onMounted(get)

</script>