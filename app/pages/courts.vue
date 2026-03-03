<template>
    <NuxtLayout name="default">
        <template #sub-menu>
            <div class="sub-menu-container">
                <div class="card">
                    <div class="card-body">
                        <div v-if="courtType === 'selection'" class="sub-menu-list">
                            <button @click="courtType = 'scotus'" class="btn btn-primary">
                                Supreme Court
                            </button>
                            <button @click="courtType = 'district'" class="btn btn-primary">
                                District Court
                            </button>
                        </div>

                        <div v-else-if="courtType === 'scotus'" class="sub-menu-list">
                            <button @click="courtType = 'selection'" class="btn btn-outline">
                                ← Back
                            </button>
                            <button v-for="vol in courtsStore.availableVolumes" :key="vol.volume"
                                @click="setVolume(vol.volume)" class="btn" :class="{
                                    'btn-primary': courtsStore.selectedVolume === vol.volume,
                                    'btn-outline': courtsStore.selectedVolume !== vol.volume
                                }">
                                Volume {{ vol.volume }}
                            </button>
                        </div>

                        <div v-else-if="courtType === 'district'" class="sub-menu-list">
                            <button @click="courtType = 'selection'" class="btn btn-outline">
                                ← Back
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
                        
                        <div v-if="courtType === 'selection'" class="selection-screen">
                            <h1 class="text-4xl font-bold text-center mb-4">Court Cases</h1>
                            <p class="text-center text-lg mb-8">Select which court to browse:</p>
                            
                            <div class="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
                                <button @click="courtType = 'scotus'" class="court-selection-card">
                                    <div class="text-6xl mb-4">🏛️</div>
                                    <h2 class="text-2xl font-bold mb-2">Supreme Court</h2>
                                    <p class="text-sm opacity-80">Browse landmark SCOTUS decisions</p>
                                </button>
                                
                                <button @click="courtType = 'district'" class="court-selection-card">
                                    <div class="text-6xl mb-4">⚖️</div>
                                    <h2 class="text-2xl font-bold mb-2">District Court</h2>
                                    <p class="text-sm opacity-80">View trial records and case archive</p>
                                </button>
                            </div>
                        </div>

                        <div v-else-if="courtType === 'scotus'">
                        
                        <div class="search form-control">
                            <input v-model="courtsStore.searchQuery" type="text"
                                placeholder="Search Supreme Court cases by title, description, type, docket, or citation..."
                                class="input-bordered" />
                        </div>

                        <div class="sub-menu-list-mobile">
                            <button @click="courtType = 'selection'" class="btn btn-sm btn-outline">
                                ← Back
                            </button>
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
                            <div v-for="(courtCase, index) in courtsStore.filteredCases" :key="index" 
                                @click="openCaseModal(courtCase)"
                                class="card bg-base-100 shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer">
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

                        <div v-else-if="courtType === 'district'">
                            <div class="search form-control">
                                <input v-model="districtSearchQuery" type="text"
                                    placeholder="Search district court cases by case number, parties, charge, or judge..."
                                    class="input-bordered" />
                            </div>

                            <div class="sub-menu-list-mobile">
                                <button @click="courtType = 'selection'" class="btn btn-sm btn-outline">
                                    ← Back
                                </button>
                            </div>

                            <h2 class="text-2xl font-bold text-center mb-6">District Court Case Archive</h2>

                            <span v-if="loadingDistrict" class="loading mx-auto"></span>

                            <div v-else-if="filteredDistrictCases.length === 0" class="alert alert-warning">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                    class="h-6 w-6 shrink-0 stroke-current">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z">
                                    </path>
                                </svg>
                                <span>No cases found matching "{{ districtSearchQuery }}"</span>
                            </div>

                            <div v-else class="grid gap-4 lg:grid-cols-1 xl:grid-cols-2">
                                <div v-for="(courtCase, index) in filteredDistrictCases" :key="index"
                                    @click="openDistrictCaseModal(courtCase)"
                                    class="card bg-base-100 shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer">
                                    <div class="card-body p-4">
                                        <h3 class="text-lg font-bold">{{ courtCase.title }}</h3>
                                        <div class="space-y-2 text-sm">
                                            <div class="flex items-center gap-2">
                                                <span class="font-semibold">Case #:</span>
                                                <span>{{ courtCase.caseNumber }}</span>
                                            </div>
                                            <div class="flex items-center gap-2">
                                                <span class="font-semibold">Charge:</span>
                                                <span>{{ courtCase.charge }}</span>
                                            </div>
                                            <div class="flex items-center gap-2">
                                                <span class="font-semibold">Outcome:</span>
                                                <span :class="{
                                                    'badge-error': courtCase.outcome === 'Guilty',
                                                    'badge-success': courtCase.outcome === 'Not Guilty',
                                                    'badge-info': courtCase.outcome === 'Dismissed'
                                                }" class="badge">
                                                    {{ courtCase.outcome }}
                                                </span>
                                            </div>
                                            <div class="flex items-center gap-2">
                                                <span class="font-semibold">Judge:</span>
                                                <span>{{ courtCase.judge }}</span>
                                            </div>
                                            <div class="flex items-center gap-2">
                                                <span class="font-semibold">Date:</span>
                                                <span>{{ new Date(courtCase.date).toLocaleDateString() }}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <LazyModal v-if="showCaseDetail && selectedCase" :show="showCaseDetail" max-width="max-w-4xl"
                @close="closeCaseModal">
                <div class="case-detail-modal">
                    <div class="text-center mb-6">
                        <h2 class="text-2xl font-bold mb-2">{{ selectedCase.title }}</h2>
                        <div class="flex items-center justify-center gap-4 mb-4">
                            <span class="badge" :class="{
                                'badge-error': selectedCase.type === 'CRIMINAL',
                                'badge-info': selectedCase.type === 'CIVIL' || selectedCase.type === 'Civil'
                            }">
                                {{ selectedCase.type }}
                            </span>
                            <span class="text-sm"><strong>Docket:</strong> {{ selectedCase.docket }}</span>
                            <span class="text-sm"><strong>Citation:</strong> {{ selectedCase.citation }}</span>
                        </div>
                    </div>

                    <div class="divider">RULING</div>

                    <div class="bg-base-200 p-6 rounded-lg">
                        <p class="text-lg text-center leading-relaxed">{{ selectedCase.ruling || selectedCase.description }}</p>
                    </div>
                </div>
            </LazyModal>

            <LazyModal v-if="showDistrictCaseDetail && selectedDistrictCase" :show="showDistrictCaseDetail" max-width="max-w-4xl"
                @close="closeDistrictCaseModal">
                <div class="case-detail-modal">
                    <div class="text-center mb-6">
                        <h2 class="text-2xl font-bold mb-2">{{ selectedDistrictCase.title }}</h2>
                        <div class="flex items-center justify-center gap-4 mb-4 flex-wrap">
                            <span class="badge" :class="{
                                'badge-error': selectedDistrictCase.outcome === 'Guilty',
                                'badge-success': selectedDistrictCase.outcome === 'Not Guilty',
                                'badge-info': selectedDistrictCase.outcome === 'Dismissed'
                            }">
                                {{ selectedDistrictCase.outcome }}
                            </span>
                            <span class="text-sm"><strong>Case #:</strong> {{ selectedDistrictCase.caseNumber }}</span>
                            <span class="text-sm"><strong>Date:</strong> {{ new Date(selectedDistrictCase.date).toLocaleDateString() }}</span>
                        </div>
                    </div>

                    <div class="grid md:grid-cols-2 gap-4 mb-6">
                        <div>
                            <p class="text-sm mb-2"><strong>Plaintiff:</strong> {{ selectedDistrictCase.plaintiff }}</p>
                            <p class="text-sm mb-2"><strong>Defendant:</strong> {{ selectedDistrictCase.defendant }}</p>
                            <p class="text-sm mb-2"><strong>Charge:</strong> {{ selectedDistrictCase.charge }}</p>
                        </div>
                        <div>
                            <p class="text-sm mb-2"><strong>Judge:</strong> {{ selectedDistrictCase.judge }}</p>
                            <p class="text-sm mb-2"><strong>Prosecutor:</strong> {{ selectedDistrictCase.prosecutor }}</p>
                            <p class="text-sm mb-2"><strong>Defense Attorney:</strong> {{ selectedDistrictCase.defense }}</p>
                        </div>
                    </div>

                    <div class="divider">CASE SUMMARY</div>

                    <div class="bg-base-200 p-6 rounded-lg mb-4">
                        <p class="leading-relaxed">{{ selectedDistrictCase.summary }}</p>
                    </div>

                    <div v-if="selectedDistrictCase.sentence !== 'N/A'" class="alert alert-info">
                        <strong>Sentence:</strong> {{ selectedDistrictCase.sentence }}
                    </div>
                </div>
            </LazyModal>
        </template>
    </NuxtLayout>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useCourtsStore } from '~/stores/courts-store'

definePageMeta({
    layout: false
})

const courtsStore = useCourtsStore();

const { setVolume, fetchVolume } = courtsStore;
const { loading } = storeToRefs(courtsStore);

const courtType = ref<'selection' | 'scotus' | 'district'>('selection')

const showCaseDetail = ref(false);
const selectedCase = ref<any>(null);

const openCaseModal = (courtCase: any) => {
    selectedCase.value = courtCase;
    showCaseDetail.value = true;
};

const closeCaseModal = () => {
    showCaseDetail.value = false;
    selectedCase.value = null;
};

const districtCases = ref<any[]>([])
const loadingDistrict = ref(false)
const districtSearchQuery = ref('')
const showDistrictCaseDetail = ref(false)
const selectedDistrictCase = ref<any>(null)

const filteredDistrictCases = computed(() => {
    if (!districtSearchQuery.value.trim()) {
        return districtCases.value
    }
    
    const query = districtSearchQuery.value.toLowerCase()
    return districtCases.value.filter(c => 
        c.title.toLowerCase().includes(query) ||
        c.caseNumber.toLowerCase().includes(query) ||
        c.charge.toLowerCase().includes(query) ||
        c.judge.toLowerCase().includes(query) ||
        c.prosecutor.toLowerCase().includes(query) ||
        c.defense.toLowerCase().includes(query) ||
        c.outcome.toLowerCase().includes(query)
    )
})

const openDistrictCaseModal = (courtCase: any) => {
    selectedDistrictCase.value = courtCase
    showDistrictCaseDetail.value = true
}

const closeDistrictCaseModal = () => {
    showDistrictCaseDetail.value = false
    selectedDistrictCase.value = null
}

const fetchDistrictCases = async () => {
    loadingDistrict.value = true
    try {
        const tokenResponse = await $fetch<{ token: string; expiresIn: string }>('/api/auth/token', {
            method: 'POST',
            body: { endpoint: 'district-court' }
        })
        districtCases.value = await $fetch('/api/district-court', {
            headers: {
                Authorization: `Bearer ${tokenResponse.token}`
            }
        })
    } catch (error) {
        console.error('Error fetching district court cases:', error)
    } finally {
        loadingDistrict.value = false
    }
}

onMounted(() => {
    fetchVolume(2)
    fetchDistrictCases()
})

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

<style scoped>
.selection-screen {
  padding: 2rem 0;
}

.court-selection-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 3rem 2rem;
  border-radius: 1rem;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  width: 100%;
}

.court-selection-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
}

[data-theme='dark'] .court-selection-card {
  background: linear-gradient(135deg, #1e3a8a 0%, #3730a3 100%);
}
</style>