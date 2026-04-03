<template>
  <div>
    <div v-if="loading" class="flex justify-center">
      <span class="loading"></span>
    </div>
    <div v-else-if="filteredDCBills.length === 0" class="alert alert-warning">
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
      <span>No DC bills found matching your search.</span>
    </div>

    <div v-else class="grid gap-4">
      <div
        v-for="(bill, index) in filteredDCBills"
        :key="index"
        class="card border border-base-300"
      >
        <div class="card-body text-center">
          <div>
            <h3 class="text-center font-bold text-xl">
              {{ bill.title }}
            </h3>
            <div class="bill-meta">
              <span class="bill-number">{{ bill.billNumber }}</span>
              <span class="bill-status" :class="getStatusClass(bill.status)">
                {{ formatBillStatus(bill.status) }}
              </span>
            </div>
            <button
              @click="$emit('open-pdf', bill.pdfPath)"
              @keydown.enter="$emit('open-pdf', bill.pdfPath)"
              @keydown.space.stop="$emit('open-pdf', bill.pdfPath)"
              class="btn hover:text-primary-focus"
              :aria-label="`View PDF for ${bill.title}`"
            >
              [View Bill Text]
            </button>
          </div>
          <p class="text-center">
            <strong>Description:</strong>
            {{ bill.description }}
          </p>
          <div class="bill-details">
            <p class="text-center text-sm text-gray-600">
              <strong>Sponsor:</strong>
              {{ bill.sponsor }} |
              <strong>Introduced:</strong>
              {{ formatDate(bill.introducedDate) }}
              <span v-if="bill.enactedDate">
                |
                <strong>Enacted:</strong>
                {{ formatDate(bill.enactedDate) }}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useBillsStore } from '~/stores/bills-store'
import { storeToRefs } from 'pinia'

// Helper function to format bill status
const formatBillStatus = (status: string) => {
  const statusMap: Record<string, string> = {
    enacted: 'Enacted',
    pending: 'Pending',
    vetoed: 'Vetoed',
    withdrawn: 'Withdrawn',
    committee: 'In Committee'
  }
  return statusMap[status] || status
}

// Helper function to get status CSS class
const getStatusClass = (status: string) => {
  const classMap: Record<string, string> = {
    enacted: 'status-enacted',
    pending: 'status-pending',
    vetoed: 'status-vetoed',
    withdrawn: 'status-withdrawn',
    committee: 'status-committee'
  }
  return classMap[status] || 'status-unknown'
}

// Helper function to format dates
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

defineEmits(['open-pdf'])

const billsStore = useBillsStore()
const { loading, filteredDCBills } = storeToRefs(billsStore)
</script>

<style scoped>
.bill-meta {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin: 0.5rem 0;
}

.bill-number {
  font-size: 0.875rem;
  font-weight: 600;
  color: #666;
}

.bill-status {
  font-size: 0.75rem;
  padding: 0.125rem 0.5rem;
  border-radius: 0.25rem;
  font-weight: 600;
  text-transform: uppercase;
}

.status-enacted {
  background-color: #10b981;
  color: white;
}

.status-pending {
  background-color: #f59e0b;
  color: white;
}

.status-vetoed {
  background-color: #ef4444;
  color: white;
}

.status-withdrawn {
  background-color: #6b7280;
  color: white;
}

.status-committee {
  background-color: #3b82f6;
  color: white;
}

.status-unknown {
  background-color: #9ca3af;
  color: white;
}

.bill-details {
  margin-top: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1px solid #e5e7eb;
}
</style>
