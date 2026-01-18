<template>
    <NuxtLayout name="default">
        <template #sub-menu>
            <div class="sub-menu-container">
                <div class="card">
                    <div class="card-body">
                        <div class="sub-menu-list">
                            <button v-for="vol in courtsStore.availableVolumes" :key="vol.volume"
                                @click="setVolume(vol.volume)" class="btn" :class="{
                                    'btn-primary': courtsStore.selectedVolume === vol.volume,
                                    'btn-outline': courtsStore.selectedVolume !== vol.volume
                                }">
                                Volume {{ vol.volume }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </template>
        <template #default>
            <section>
                <div class="card shadow-xl rounded-3xl">
                    <div class="card-body">
                        
                        <div class="search form-control">
                            <input v-model="courtsStore.searchQuery" type="text"
                                placeholder="Search cases by title, description, type, docket, or citation..."
                                class="input-bordered" />
                        </div>

                        <div class="sub-menu-list-mobile">
                            <button v-for="vol in courtsStore.availableVolumes" :key="vol.volume"
                                @click="setVolume(vol.volume)" class="btn btn-sm" :class="{
                                    'btn-primary': courtsStore.selectedVolume === vol.volume,
                                    'btn-outline': courtsStore.selectedVolume !== vol.volume
                                }">
                                Volume {{ vol.volume }}
                            </button>
                        </div>

                        <h2 class="text-2xl font-bold text-center mb-6">{{ courtsStore.currentVolume?.title }}</h2>

                        <span v-if="loading" class="loading mx-auto"></span>
                        
                        <div v-else-if="courtsStore.currentVolume?.isEmpty" class="alert alert-info">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                class="h-6 w-6 shrink-0 stroke-current">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <span>{{ courtsStore.currentVolume?.emptyMessage }}</span>
                        </div>

                        <div v-else-if="courtsStore.filteredCases.length === 0" class="alert alert-warning">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                class="h-6 w-6 shrink-0 stroke-current">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z">
                                </path>
                            </svg>
                            <span>No cases found matching "{{ courtsStore.searchQuery }}"</span>
                        </div>

                        <div v-else class="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
                            <div v-for="(courtCase, index) in courtsStore.filteredCases" :key="index" class="card bg-base-100 shadow-md hover:shadow-xl transition-shadow duration-300">
                                <div class="card-body p-4 text-center">
                                    <h3 class="text-lg font-bold text-center" style="text-align: center;">{{ courtCase.title }}</h3>
                                    <p class="text-sm mb-4 text-center text-base-content">{{ courtCase.description }}</p>

                                    <div class="space-y-2 text-center">
                                        <div class="flex items-center justify-center gap-2">
                                            <span class="font-semibold text-sm">TYPE:</span>
                                            <span :class="{
                                                'badge-error': courtCase.type === 'CRIMINAL',
                                                'badge-info': courtCase.type === 'CIVIL' || courtCase.type === 'Civil'
                                            }">
                                                {{ courtCase.type }}
                                            </span>
                                        </div>

                                        <div class="flex items-center justify-center gap-2">
                                            <span class="font-semibold text-sm">DOCKET #:</span>
                                            <span>{{ courtCase.docket }}</span>
                                        </div>

                                        <div class="flex items-center justify-center gap-2">
                                            <span class="font-semibold text-sm">CITATION:</span>
                                            <span>{{ courtCase.citation }}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </template>
    </NuxtLayout>
</template>

<script lang="ts" setup>
import { useCourtsStore } from '~/stores/courts-store'

definePageMeta({
    layout: false
})

const courtsStore = useCourtsStore();

const { setVolume, fetchVolume } = courtsStore;
const { loading } = storeToRefs(courtsStore);

onMounted(() => fetchVolume(2))

useHead({
    title: 'Courts - nUSA Legal',
    meta: [
        {
            name: 'description',
            content: 'Your go-to source for legal information and resources in nUSA P.S ROBLOX ROLEPLAY.'
        },
        {
            property: 'og:title',
            content: 'nUSA Legal - Courts'
        },
        {
            property: 'og:description',
            content: 'Your go-to source for legal information and resources in nUSA P.S ROBLOX ROLEPLAY.'
        }
    ]
})
</script>