<template>
  <div>
    <div v-if="loading" class="flex justify-center">
      <span class="loading"></span>
    </div>
    <div v-else-if="filteredCongressBills.length === 0" class="alert alert-warning">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        class="h-6 w-6 shrink-0 stroke-current"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        ></path>
      </svg>
      <span>No bills found matching your search.</span>
    </div>

    <div v-else class="grid gap-4">
      <div
        v-for="(bill, index) in filteredCongressBills"
        :key="index"
        class="card border border-base-300 cursor-pointer hover:shadow-md transition-shadow"
        @click="$emit('open-detail', bill)"
      >
        <div class="card-body text-center">
          <div>
            <h3 class="text-center font-bold text-xl">{{ formatBillNumber(bill.number) }}</h3>
            <button
              @click.stop="$emit('open-pdf', bill.pdfPath)"
              @keydown.enter.stop="$emit('open-pdf', bill.pdfPath)"
              @keydown.space.stop="$emit('open-pdf', bill.pdfPath)"
              class="btn hover:text-primary-focus"
              :aria-label="`View PDF for bill ${formatBillNumber(bill.number)}`"
            >
              [View Bill Text]
            </button>
          </div>
          <p class="text-center">
            <strong>Description:</strong>
            {{ bill.description }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useBillsStore } from '~/stores/bills-store'
import { storeToRefs } from 'pinia'
import { formatBillNumber } from '~/utils/formatBillNumber'

defineEmits<{
  'open-pdf': [pdfPath: string]
  'open-detail': [bill: { number: string; description: string; pdfPath: string; type: string }]
}>()

const billsStore = useBillsStore()
const { loading, filteredCongressBills } = storeToRefs(billsStore)
</script>
