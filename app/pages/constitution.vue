<template>
    <NuxtLayout name="default">
        <template #sub-menu>
            <div class="sub-menu-container">
                <div class="card">
                    <div class="card-body">
                        <div class="sub-menu-list">
                            <button @click="setSection('constitution')" class="btn" :class="{
                                'btn-primary': selectedSection === 'constitution',
                                'btn-outline': selectedSection !== 'constitution'
                            }">
                                Constitution
                            </button>
                            <button @click="setSection('constitution-amendments')" class="btn" :class="{
                                'btn-primary': selectedSection === 'constitution-amendments',
                                'btn-outline': selectedSection !== 'constitution-amendments'
                            }">
                                Constitution Amendments
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
                            <button @click="setSection('constitution')" class="btn" :class="{
                                'btn-primary': selectedSection === 'constitution',
                                'btn-outline': selectedSection !== 'constitution'
                            }">
                                Constitution
                            </button>
                            <button @click="setSection('constitution-amendments')" class="btn" :class="{
                                'btn-primary': selectedSection === 'constitution-amendments',
                                'btn-outline': selectedSection !== 'constitution-amendments'
                            }">
                                Constitution Amendments
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
                        </div>

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

                            <div v-else class="grid gap-4">
                                <div v-for="(dt, index) in filteredData" :key="index"
                                    @click="dataDetail = dt; handleClick()" class="card border border-base-300">
                                    <div class="card-body text-center">
                                        <div class="text-center">
                                            <h3 class="text-center font-bold text-xl">{{ dt.title }}</h3>
                                            <div class="text-center">
                                                <p class="text-center"><strong>Description:</strong> {{ dt.description }}</p>
                                            </div>
                                            <button v-if="dt.hasArticle" class="btn">Read Article</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <LazyModal v-if="showDetail && (dataDetail != null)" :show="showDetail" max-width="max-w-3xl"
                @close="showDetail = false; dataDetail = null">
                <div class="detail-modal text-center" :class="{ 'min-h-[75vh]': dataDetail.hasArticle }">
                    <h3 class="text-center font-bold text-xl">{{
                        dataDetail.title + (articleContent ? ` | ${articleContent.title}` : '')
                    }}
                    </h3>
                    <p v-if="dataDetail.content" class="text-center" v-html="dataDetail.content.replace(/&lt;br&gt;/g, '<br>')"></p>

                    <template v-if="dataDetail.hasArticle">
                        <div v-if="isLoadingArticle" class="flex justify-center">
                            <span class="loading"></span>
                        </div>
                        <template v-else-if="articleContent">
                            <div class="flex-1 text-center">
                                <p class="text-sm text-center" v-html="articleContent.content"></p>
                            </div>
                            <div class="join">
                                <button class="join-item btn" :disabled="articlePage == 1"
                                    @click="--articlePage">«</button>
                                <button class="join-item btn">
                                    {{ articleContent?.title || 'Content' }}
                                </button>
                                <button class="join-item btn" :disabled="true">
                                    »
                                </button>
                            </div>
                        </template>
                    </template>
                </div>
            </LazyModal>
        </template>
    </NuxtLayout>
</template>

<script lang="ts" setup>
import { useConstitutionStore } from '~/stores/constitution-store';

definePageMeta({
    layout: false
})

const ConstitutionStore = useConstitutionStore();

const { setSection, fetchConstitution } = ConstitutionStore;
const { loading, searchQuery, selectedSection, filteredData } = storeToRefs(ConstitutionStore);

onMounted(fetchConstitution)

const title = computed<string>(() => {
    return selectedSection.value === 'constitution'
        ? 'Constitution'
        : 'Constitution Amendments'
});

const showDetail = ref<boolean>(false);
const dataDetail = ref<Constitution | null>(null);

const article = ref<ConstitutionArticle | null>(null)

const isLoadingArticle = ref<boolean>(false);
const articlePage = ref<number>(1);

const articleContent = computed<ConstitutionArticleSection | null>(() => {
    if (!article.value) {
        console.log('No article value');
        return null;
    }
    
    // Check if article has sections (original structure)
    if (article.value.sections && Array.isArray(article.value.sections) && article.value.sections.length > 0) {
        const pageIndex = articlePage.value - 1;
        if (pageIndex >= 0 && pageIndex < article.value.sections.length) {
            console.log('Using article sections');
            return article.value.sections[pageIndex] as ConstitutionArticleSection;
        }
    }
    
    // Check if article has direct content (new structure)
    if ((article.value as any).content) {
        console.log('Using article content directly');
        return {
            content: (article.value as any).content,
            title: article.value.title || 'Content'
        } as ConstitutionArticleSection;
    }
    
    // Check if article has summary (fallback structure)
    if ((article.value as any).summary) {
        console.log('Using article summary as content');
        return {
            content: (article.value as any).summary,
            title: article.value.title || 'Summary'
        } as ConstitutionArticleSection;
    }
    
    console.log('No content or sections found in article');
    return null;
})

const handleClick = async () => {
    showDetail.value = true;

    if (dataDetail.value?.hasArticle) {
        isLoadingArticle.value = true
        articlePage.value = 1;
        try {
            const tokenResponse = await $fetch('/api/auth/token', {
                method: 'POST',
                body: { endpoint: 'constitution/articles' }
            })

            const response = await $fetch<ConstitutionArticle>('/api/constitution/articles/' + dataDetail.value.key, {
                headers: {
                    Authorization: `Bearer ${tokenResponse.token}`
                }
            });

            article.value = response;
            console.log('Article loaded:', article.value); // Debug log
        } catch (error) {

        } finally {
            isLoadingArticle.value = false
        }
    }
}

useHead({
    title: 'Constitution - nUSA Legal',
    meta: [
        {
            name: 'description',
            content: 'Your go-to source for legal information and resources in nUSA P.S ROBLOX ROLEPLAY.'
        },
        {
            property: 'og:title',
            content: 'nUSA Legal - Constitution'
        },
        {
            property: 'og:description',
            content: 'Your go-to source for legal information and resources in nUSA P.S ROBLOX ROLEPLAY.'
        }
    ]
})
</script>