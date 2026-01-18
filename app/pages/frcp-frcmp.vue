<template>
    <NuxtLayout name="default">
        <template #sub-menu>
            <div class="sub-menu-container">
                <div class="card">
                    <div class="card-body">
                        <div class="sub-menu-list">
                            <button @click="setSection('frcp')" class="btn" :class="{
                                'btn-primary': selectedSection === 'frcp',
                                'btn-outline': selectedSection !== 'frcp'
                            }">
                                FRCP
                            </button>
                            <button @click="setSection('frcmp')" class="btn" :class="{
                                'btn-primary': selectedSection === 'frcmp',
                                'btn-outline': selectedSection !== 'frcmp'
                            }">
                                FRCMP
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </template>
        <template #default>
            <section>
                <div class="card">
                    <div class="card-body">
                        
                        <div class="sub-menu-list-mobile">
                            <button @click="setSection('frcp')" class="btn" :class="{
                                'btn-primary': selectedSection === 'frcp',
                                'btn-outline': selectedSection !== 'frcp'
                            }">
                                FRCP
                            </button>
                            <button @click="setSection('frcmp')" class="btn" :class="{
                                'btn-primary': selectedSection === 'frcmp',
                                'btn-outline': selectedSection !== 'frcmp'
                            }">
                                FRCMP
                            </button>
                        </div>

                        <h2 class="section-title text-center">
                            {{ title }}
                        </h2>

                        <div class="search-filter">
                            
                            <div class="form-control flex-1">
                                <input v-model="searchQuery" type="text"
                                    :placeholder="selectedSection === 'frcp' ? 'Search FRCP...' : 'Search FRCMP...'"
                                    class="input input-bordered w-full" />
                            </div>

                            <div class="form-control w-full md:w-80">
                                <select v-model="filterType" class="select select-bordered w-full"
                                    @change="searchQuery = ''">
                                    <option value="all">All {{ selectedSection === 'frcp' ? 'FRCP' : 'FRCMP' }}</option>
                                    <template v-for="(filter, i) in filterList" :key="i">
                                        <option :value="i">{{ filter }}</option>
                                    </template>
                                </select>
                            </div>
                        </div>

                        <div>
                            
                            <div v-if="loading" class="flex justify-center">
                                <span class="loading"></span>
                            </div>
                            
                            <div v-else-if="filteredFederalRules.length === 0" class="alert alert-warning">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                    class="h-6 w-6 shrink-0 stroke-current">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z">
                                    </path>
                                </svg>
                                <span>No data found matching your search.</span>
                            </div>

                            <div v-else class="data-grid gap-4">
                                <template v-for="(data, index) in filteredFederalRules" :key="index">
                                    <div v-for="(dt, index) in data.data" :key="index"
                                        @click="showDetail = true; dataDetail = dt" class="card border border-base-300">
                                        <div class="card-body text-center">
                                            <h3 class="text-center font-bold text-xl">{{ dt.title }}</h3>
                                            <p class="text-center">{{ dt.excerp }}</p>
                                        </div>
                                    </div>
                                </template>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <LazyModal v-if="showDetail && (dataDetail != null)" :show="showDetail" max-width="max-w-3xl"
                @close="showDetail = false; dataDetail = null">
                <div class="data-detail text-center">
                    <h3 class="text-center font-bold text-xl">{{ dataDetail.title }}</h3>
                    <p class="font-bold text-center">{{ dataDetail.subtitle }}</p>
                    <p class="text-sm text-center" v-html="dataDetail.content"></p>
                </div>
            </LazyModal>

        </template>
    </NuxtLayout>
</template>

<script lang="ts" setup>

definePageMeta({
    layout: false
})

const FederalRulesStore = useFederalRulesStore();

const { setSection, fetchFRCP } = FederalRulesStore;
const { loading, selectedSection, searchQuery, filteredFederalRules, filterList, filterType } = storeToRefs(FederalRulesStore);

onMounted(fetchFRCP)

const title = computed<string>(() => {
    return selectedSection.value === 'frcp'
        ? 'Federal Rules of Civil Procedure'
        : 'Federal Rules of Criminal Procedure'
})

const showDetail = ref<boolean>(false);
const dataDetail = ref<FederalRules | null>(null);

useHead({
    title: 'FRCP/FRCMP - nUSA Legal',
    meta: [
        {
            name: 'description',
            content: 'Your go-to source for legal information and resources in nUSA P.S ROBLOX ROLEPLAY.'
        },
        {
            property: 'og:title',
            content: 'nUSA Legal - FRCP/FRCMP'
        },
        {
            property: 'og:description',
            content: 'Your go-to source for legal information and resources in nUSA P.S ROBLOX ROLEPLAY.'
        }
    ]
})
</script>