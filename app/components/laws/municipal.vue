<template>
    <div>
        <div v-if="loading" class="flex justify-center">
            <span class="loading"></span>
        </div>
        <div v-else-if="filteredMunicipal.length === 0" class="alert alert-warning">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                class="h-6 w-6 shrink-0 stroke-current">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z">
                </path>
            </svg>
            <span>No data found matching your search.</span>
        </div>

        <div v-else class="grid gap-4">
            <template v-for="(data, index) in filteredMunicipal" :key="index">
                <div class="data-group">
                    <div class="text-center">
                        <h3 class="text-center">{{ data.label }}</h3>
                    </div>
                </div>
                <div v-for="(dt, index) in data.data" :key="index" @click="$emit('show-detail', dt)" class="data-list border border-base-300 h-fit">
                    <div class="text-center">
                        <h3 class="text-center font-bold text-xl">{{ dt.title }}</h3>
                        <p class="text-center" v-html="dt.excerp.replace(/&lt;br&gt;/g, '<br>').replace(/&amp;lt;br&amp;gt;/g, '<br>').replace(/\n\n/g, '<br><br>').replace(/\n/g, '<br>')"></p>
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>

<script lang="ts" setup>
defineEmits(['show-detail'])

const LawsStore = useLawsStore();
const { loading, filteredMunicipal } = storeToRefs(LawsStore);
</script>