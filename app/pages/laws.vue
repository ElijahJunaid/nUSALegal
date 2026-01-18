<template>
    <NuxtLayout name="default">
        <template #sub-menu>
            <div class="sub-menu-container">
                <div class="card">
                    <div class="card-body">
                        <div class="sub-menu-list">
                            <button @click="setSection('federal')" class="btn" :class="{
                                'btn-primary': selectedSection === 'federal',
                                'btn-outline': selectedSection !== 'federal'
                            }">
                                Federal
                            </button>
                            <button @click="setSection('eo')" class="btn" :class="{
                                'btn-primary': selectedSection === 'eo',
                                'btn-outline': selectedSection !== 'eo'
                            }">
                                EO
                            </button>
                            <button @click="setSection('municipal')" class="btn" :class="{
                                'btn-primary': selectedSection === 'municipal',
                                'btn-outline': selectedSection !== 'municipal'
                            }">
                                Municipal
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
                            <button @click="setSection('federal')" class="btn" :class="{
                                'btn-primary': selectedSection === 'federal',
                                'btn-outline': selectedSection !== 'federal'
                            }">
                                Federal
                            </button>
                            <button @click="setSection('eo')" class="btn" :class="{
                                'btn-primary': selectedSection === 'eo',
                                'btn-outline': selectedSection !== 'eo'
                            }">
                                EO
                            </button>
                            <button @click="setSection('municipal')" class="btn" :class="{
                                'btn-primary': selectedSection === 'municipal',
                                'btn-outline': selectedSection !== 'municipal'
                            }">
                                Municipal
                            </button>
                        </div>

                        <h2 class="section-title text-center">
                            {{ title }}
                        </h2>

                        <div class="search-filter">
                            
                            <div class="form-control flex-1">
                                <input v-model="searchQuery" type="text" :placeholder="`Search ${title}...`"
                                    class="input input-bordered w-full" />
                            </div>

                            <div v-if="selectedSection == 'municipal'" class="form-control w-full md:w-80">
                                <select v-model="filterType" class="select select-bordered w-full"
                                    @change="searchQuery = ''">
                                    <option value="all">All Municipal Criminal Code</option>
                                    <template v-for="(filter, i) in filterMunicipalList" :key="i">
                                        <option :value="i">{{ filter }}</option>
                                    </template>
                                </select>
                            </div>
                        </div>

                        <LawsFederalEo v-if="['federal', 'eo'].includes(selectedSection)"
                            @show-detail="(dt: Law) => { showDetail = true; dataDetail = dt }" />

                        <LawsMunicipal v-else @show-detail="(dt: Law) => { showDetail = true; dataDetail = dt }" />
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
const LawsStore = useLawsStore();

definePageMeta({
    layout: false
})

const { setSection, fetchFederal } = LawsStore;
const { selectedSection, searchQuery, filterType, filterMunicipalList } = storeToRefs(LawsStore);

onMounted(fetchFederal)

const showDetail = ref<boolean>(false);
const dataDetail = ref<Law | null>(null);

const title = computed<string>(() => {
    return selectedSection.value === 'federal'
        ? 'Federal Criminal Code'
        : selectedSection.value === 'eo'
            ? 'Executive Orders'
            : 'Municipal Criminal Code'
})

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