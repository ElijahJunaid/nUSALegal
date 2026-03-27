<template>
  <NuxtLayout name="default">
    <template #sub-menu>
      <div class="sub-menu-container">
        <div class="card">
          <div class="card-body">
            <div class="sub-menu-list">
              <button
                @click="setSection('congress')"
                @keydown.enter="setSection('congress')"
                @keydown.space="setSection('congress')"
                class="btn"
                :class="{
                  'btn-primary': selectedSection === 'congress',
                  'btn-outline': selectedSection !== 'congress'
                }"
                aria-label="View Congress bills"
                :aria-pressed="selectedSection === 'congress'"
              >
                Congress
              </button>
              <button
                @click="setSection('city-council')"
                @keydown.enter="setSection('city-council')"
                @keydown.space="setSection('city-council')"
                class="btn"
                :class="{
                  'btn-primary': selectedSection === 'city-council',
                  'btn-outline': selectedSection !== 'city-council'
                }"
                aria-label="View City Council bills"
                :aria-pressed="selectedSection === 'city-council'"
              >
                City Council
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
            <h2 class="section-title text-center">
              {{ selectedSection === 'congress' ? 'Congress' : 'City Council' }}
            </h2>

            <div class="search-filter">
              <div class="form-control flex-1">
                <input
                  v-model="searchQuery"
                  type="text"
                  :placeholder="
                    selectedSection === 'congress' ? 'Search bills...' : 'Search DC bills...'
                  "
                  class="input input-bordered w-full"
                />
              </div>

              <div class="form-control w-full md:w-80">
                <select
                  v-model="filterType"
                  class="select select-bordered w-full"
                  @change="searchQuery = ''"
                >
                  <template v-if="selectedSection === 'congress'">
                    <option value="all">All Bills</option>
                    <option value="hr">House Bills (H.R.)</option>
                    <option value="s">Senate Bills (S.)</option>
                    <option value="hjres">House Joint Resolutions (H.J.Res.)</option>
                    <option value="sjres">Senate Joint Resolutions (S.J.Res.)</option>
                    <option value="hconres">House Concurrent Resolutions (H.Con.Res.)</option>
                    <option value="sconres">Senate Concurrent Resolutions (S.Con.Res.)</option>
                    <option value="hres">House Resolutions (H.Res.)</option>
                    <option value="sres">Senate Resolutions (S.Res.)</option>
                  </template>
                  <template v-else>
                    <option value="all">All DC Bills</option>
                    <option value="act">Acts</option>
                    <option value="ordinance">Ordinances</option>
                    <option value="resolution">Resolutions</option>
                  </template>
                </select>
              </div>
            </div>

            <BillsCongress
              v-if="selectedSection === 'congress'"
              @open-pdf="openPDF"
              @open-detail="openBillDetail"
            />

            <BillsCityCouncil v-else @open-pdf="openPDF" />
          </div>
        </div>
      </section>
    </template>
  </NuxtLayout>

  <LazyModal
    v-if="showBillDetail && selectedBill"
    :show="showBillDetail"
    max-width="max-w-3xl"
    @close="closeBillDetail"
  >
    <div class="data-detail text-center">
      <h3 class="text-center font-bold text-xl mb-2">
        {{ formatBillNumber(selectedBill.number) }}
      </h3>
      <p class="text-sm text-center mb-4">{{ selectedBill.description }}</p>
      <button
        v-if="selectedBill.pdfPath"
        class="btn btn-primary"
        @click="openPDF(selectedBill.pdfPath)"
      >
        [View Bill Text]
      </button>
    </div>
  </LazyModal>
</template>

<script lang="ts" setup>
import { useBillsStore } from '~/stores/bills-store'
import { dError } from '~/plugins/debug-logger.client'
import { formatBillNumber } from '~/utils/formatBillNumber'
import { useHead, definePageMeta, storeToRefs, onMounted, ref } from '#imports'

definePageMeta({
  title: 'Legislation & Bills',
  description: 'View Congress and City Council bills and legislation',
  layout: false
})

const billsStore = useBillsStore()

const { setSection, fetchCongressBills } = billsStore
const { searchQuery, selectedSection, filterType } = storeToRefs(billsStore)

onMounted(fetchCongressBills)

interface PdfTokenResponse {
  token: string
  url: string
}

interface BillDetail {
  number: string
  description: string
  pdfPath: string
  type: string
}

const showBillDetail = ref(false)
const selectedBill = ref<BillDetail | null>(null)

function openBillDetail(bill: BillDetail) {
  selectedBill.value = bill
  showBillDetail.value = true
}

function closeBillDetail() {
  showBillDetail.value = false
  selectedBill.value = null
}

async function openPDF(pdfPath: string) {
  try {
    const response = await $fetch<PdfTokenResponse>('/api/pdf/token', {
      method: 'POST',
      body: { pdfPath }
    })

    const opened = window.open(response.url, '_blank')

    if (!opened || opened.closed || typeof opened.closed === 'undefined') {
      alert('Pop-up was blocked. Please allow pop-ups for this site to view PDFs.')
    }
  } catch (error: unknown) {
    dError('Failed to open PDF:', error)

    const err = error as {
      data?: { statusMessage?: string }
      message?: string
      statusCode?: number
    }
    const errorMessage = err?.data?.statusMessage || err?.message || 'Failed to open PDF'

    if (err?.statusCode === 403) {
      alert('⏱️ Access Denied\n\nThis PDF link may have expired or is invalid. Please try again.')
    } else if (err?.statusCode === 404) {
      alert('🔍 PDF Not Found\n\nThe requested PDF file could not be found.')
    } else {
      alert(`❌ Error\n\n${errorMessage}\n\nPlease try again or contact support.`)
    }
  }
}

useHead({
  title: 'Bills - nUSA Legal',
  meta: [
    {
      name: 'description',
      content: 'Your go-to source for legal information and resources in nUSA P.S ROBLOX ROLEPLAY.'
    },
    {
      property: 'og:title',
      content: 'nUSA Legal - Bills'
    },
    {
      property: 'og:description',
      content: 'Your go-to source for legal information and resources in nUSA P.S ROBLOX ROLEPLAY.'
    }
  ]
})
</script>

<style scoped></style>
