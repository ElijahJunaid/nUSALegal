<template>
  <NuxtLayout name="default">
    <template #sub-menu>
      <div class="sub-menu-container">
        <div class="card">
          <div class="card-body">
            <div class="sub-menu-list">
              <button
                @click="selected = 'definition'"
                @keydown.enter="selected = 'definition'"
                @keydown.space="selected = 'definition'"
                class="btn"
                :class="{
                  'btn-primary': selected === 'definition',
                  'btn-outline': selected !== 'definition'
                }"
                aria-label="View legal definitions"
              >
                Definition
              </button>
              <button
                @click="selected = 'files'"
                @keydown.enter="selected = 'files'"
                @keydown.space="selected = 'files'"
                class="btn"
                :class="{
                  'btn-primary': selected === 'files',
                  'btn-outline': selected !== 'files'
                }"
                aria-label="View legal files and documents"
              >
                Files
              </button>
              <button
                @click="selected = 'court-procedure'"
                @keydown.enter="selected = 'court-procedure'"
                @keydown.space="selected = 'court-procedure'"
                class="btn"
                :class="{
                  'btn-primary': selected === 'court-procedure',
                  'btn-outline': selected !== 'court-procedure'
                }"
                aria-label="View court procedures"
              >
                Court Procedure
              </button>
              <button
                @click="selected = 'office'"
                @keydown.enter="selected = 'office'"
                @keydown.space="selected = 'office'"
                class="btn"
                :class="{
                  'btn-primary': selected === 'office',
                  'btn-outline': selected !== 'office'
                }"
                aria-label="View Office of Public Defender"
              >
                Office of Public Defender
              </button>
              <button
                @click="selected = 'vips'"
                @keydown.enter="selected = 'vips'"
                @keydown.space="selected = 'vips'"
                class="btn"
                :class="{
                  'btn-primary': selected === 'vips',
                  'btn-outline': selected !== 'vips'
                }"
                aria-label="View nUSA Legal VIPS"
              >
                nUSA Legal VIPS
              </button>
              <button
                @click="selected = 'citation'"
                @keydown.enter="selected = 'citation'"
                @keydown.space="selected = 'citation'"
                class="btn"
                :class="{
                  'btn-primary': selected === 'citation',
                  'btn-outline': selected !== 'citation'
                }"
                aria-label="View citation generator"
              >
                Citation Generator
              </button>
              <button
                @click="selected = 'jury'"
                @keydown.enter="selected = 'jury'"
                @keydown.space="selected = 'jury'"
                class="btn"
                :class="{
                  'btn-primary': selected === 'jury',
                  'btn-outline': selected !== 'jury'
                }"
                aria-label="View jury instructions"
              >
                Jury Instructions
              </button>
              <button
                @click="selected = 'sentencing'"
                @keydown.enter="selected = 'sentencing'"
                @keydown.space="selected = 'sentencing'"
                class="btn"
                :class="{
                  'btn-primary': selected === 'sentencing',
                  'btn-outline': selected !== 'sentencing'
                }"
                aria-label="View sentencing calculator"
              >
                Sentencing Calculator
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
              <button
                @click="selected = 'definition'"
                @keydown.enter="selected = 'definition'"
                @keydown.space="selected = 'definition'"
                class="btn"
                :class="{
                  'btn-primary': selected === 'definition',
                  'btn-outline': selected !== 'definition'
                }"
                aria-label="View legal definitions"
              >
                Definition
              </button>
              <button
                @click="selected = 'files'"
                @keydown.enter="selected = 'files'"
                @keydown.space="selected = 'files'"
                class="btn"
                :class="{
                  'btn-primary': selected === 'files',
                  'btn-outline': selected !== 'files'
                }"
                aria-label="View legal files and documents"
              >
                Files
              </button>
              <button
                @click="selected = 'court-procedure'"
                @keydown.enter="selected = 'court-procedure'"
                @keydown.space="selected = 'court-procedure'"
                class="btn"
                :class="{
                  'btn-primary': selected === 'court-procedure',
                  'btn-outline': selected !== 'court-procedure'
                }"
                aria-label="View court procedures"
              >
                Court Procedure
              </button>
              <button
                @click="selected = 'office'"
                @keydown.enter="selected = 'office'"
                @keydown.space="selected = 'office'"
                class="btn"
                :class="{
                  'btn-primary': selected === 'office',
                  'btn-outline': selected !== 'office'
                }"
                aria-label="View Office of Public Defender"
              >
                Office of Public Defender
              </button>
              <button
                @click="selected = 'vips'"
                @keydown.enter="selected = 'vips'"
                @keydown.space="selected = 'vips'"
                class="btn"
                :class="{
                  'btn-primary': selected === 'vips',
                  'btn-outline': selected !== 'vips'
                }"
                aria-label="View nUSA Legal VIPS"
              >
                nUSA Legal VIPS
              </button>
              <button
                @click="selected = 'citation'"
                @keydown.enter="selected = 'citation'"
                @keydown.space="selected = 'citation'"
                class="btn"
                :class="{
                  'btn-primary': selected === 'citation',
                  'btn-outline': selected !== 'citation'
                }"
                aria-label="View citation generator"
              >
                Citation Generator
              </button>
              <button
                @click="selected = 'jury'"
                @keydown.enter="selected = 'jury'"
                @keydown.space="selected = 'jury'"
                class="btn"
                :class="{
                  'btn-primary': selected === 'jury',
                  'btn-outline': selected !== 'jury'
                }"
                aria-label="View jury instructions"
              >
                Jury Instructions
              </button>
              <button
                @click="selected = 'sentencing'"
                @keydown.enter="selected = 'sentencing'"
                @keydown.space="selected = 'sentencing'"
                class="btn"
                :class="{
                  'btn-primary': selected === 'sentencing',
                  'btn-outline': selected !== 'sentencing'
                }"
                aria-label="View sentencing calculator"
              >
                Sentencing Calculator
              </button>
            </div>

            <h2 class="section-title capitalize text-center">
              {{
                selected === 'office'
                  ? 'Defense'
                  : selected === 'citation'
                    ? 'Citation Generator'
                    : selected === 'jury'
                      ? 'Jury Instructions'
                      : selected === 'sentencing'
                        ? 'Sentencing Calculator'
                        : selected.replaceAll('-', ' ')
              }}
            </h2>

            <div
              class="search-filter"
              v-if="!['citation', 'jury', 'sentencing'].includes(selected)"
            >
              <div class="form-control flex-1">
                <input
                  v-model="searchQuery"
                  type="text"
                  :placeholder="`Search ${selected === 'office' ? 'Defense' : selected.replaceAll('-', ' ')}...`"
                  class="input input-bordered w-full"
                />
              </div>
            </div>

            <LazyResourcesDefinitions v-if="selected === 'definition'" :search="searchQuery" />
            <LazyResourcesFiles v-if="selected === 'files'" :search="searchQuery" />
            <LazyResourcesCourtProcedure
              v-if="selected === 'court-procedure'"
              :search="searchQuery"
            />
            <LazyResourcesOffice
              v-if="selected === 'office'"
              :search="searchQuery"
              @reset_search="searchQuery = ''"
            />
            <LazyResourcesVips
              v-if="selected === 'vips'"
              :search="searchQuery"
              @reset_search="searchQuery = ''"
            />
            <LazyResourcesCitation v-if="selected === 'citation'" />
            <LazyResourcesJury v-if="selected === 'jury'" />
            <LazyResourcesSentencing v-if="selected === 'sentencing'" />
          </div>
        </div>
      </section>
    </template>
  </NuxtLayout>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

definePageMeta({
  layout: false
})

const selected = ref<
  | 'definition'
  | 'files'
  | 'court-procedure'
  | 'office'
  | 'vips'
  | 'citation'
  | 'jury'
  | 'sentencing'
>('definition')

const searchQuery = ref<string>('')

useHead({
  title: 'Resources - nUSA Legal',
  meta: [
    {
      name: 'description',
      content: 'Your go-to source for legal information and resources in nUSA P.S ROBLOX ROLEPLAY.'
    },
    {
      property: 'og:title',
      content: 'nUSA Legal - Resources'
    },
    {
      property: 'og:description',
      content: 'Your go-to source for legal information and resources in nUSA P.S ROBLOX ROLEPLAY.'
    }
  ]
})
</script>

<style scoped></style>
