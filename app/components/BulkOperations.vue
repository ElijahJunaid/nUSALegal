<template>
  <div class="dropdown dropdown-end">
    <label tabindex="0" class="btn btn-secondary gap-2">
      <Icon name="lucide:more-horizontal" class="w-5 h-5" />
      <span>Bulk Actions</span>
    </label>
    <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 mt-1">
      <li>
        <button @click="exportData('json')">
          <Icon name="lucide:download" class="w-4 h-4" />
          Export as JSON
        </button>
      </li>
      <li>
        <button @click="exportData('csv')">
          <Icon name="lucide:file-spreadsheet" class="w-4 h-4" />
          Export as CSV
        </button>
      </li>
      <li>
        <button @click="showImportModal = true">
          <Icon name="lucide:upload" class="w-4 h-4" />
          Import Data
        </button>
      </li>
    </ul>
  </div>

  <dialog class="modal" :class="{ 'modal-open': showImportModal }">
    <div class="modal-box">
      <h3 class="font-bold text-lg">Import {{ entityName }}</h3>
      <p class="py-4">Upload a JSON or CSV file to bulk import {{ entityName.toLowerCase() }}.</p>
      
      <input 
        type="file" 
        ref="fileInput"
        @change="handleImportFile"
        accept=".json,.csv"
        class="file-input file-input-bordered w-full"
      />

      <div v-if="importResult" class="mt-4">
        <div v-if="importResult.success > 0" class="alert alert-success">
          <Icon name="lucide:check-circle" class="w-5 h-5" />
          <div>
            <p>✅ Successfully imported: {{ importResult.success }}</p>
            <p v-if="importResult.created > 0" class="text-xs">Created: {{ importResult.created }}</p>
            <p v-if="importResult.updated > 0" class="text-xs">Updated: {{ importResult.updated }}</p>
          </div>
        </div>
        
        <div v-if="importResult.failed > 0" class="alert alert-warning mt-2">
          <Icon name="lucide:alert-triangle" class="w-5 h-5" />
          <div>
            <p>⚠️ Failed: {{ importResult.failed }}</p>
            <details v-if="importResult.errors.length > 0" class="mt-2">
              <summary class="cursor-pointer text-xs">View errors</summary>
              <ul class="list-disc list-inside text-xs mt-1">
                <li v-for="(error, i) in importResult.errors.slice(0, 5)" :key="i">{{ error }}</li>
                <li v-if="importResult.errors.length > 5">... and {{ importResult.errors.length - 5 }} more</li>
              </ul>
            </details>
          </div>
        </div>
      </div>

      <div v-if="error" class="alert alert-error mt-4">
        <Icon name="lucide:alert-circle" class="w-5 h-5" />
        <span>{{ error }}</span>
      </div>

      <div v-if="importing" class="mt-4 text-center">
        <Icon name="lucide:loader-2" class="w-8 h-8 animate-spin mx-auto" />
        <p class="mt-2">Importing data...</p>
      </div>
      
      <div class="modal-action">
        <button @click="closeModal" class="btn">Close</button>
      </div>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button @click="closeModal">close</button>
    </form>
  </dialog>
</template>

<script setup lang="ts">
interface Props {
  endpoint: string      
  entityName: string    
}

const props = defineProps<Props>()
const emit = defineEmits<{ refresh: [] }>()

const showImportModal = ref(false)
const importResult = ref<any>(null)
const importing = ref(false)
const error = ref('')
const fileInput = ref<HTMLInputElement>()

const exportData = async (format: string) => {
  try {
    const url = `${props.endpoint}/export?format=${format}`
    window.open(url, '_blank')
  } catch (e: any) {
    error.value = 'Export failed'
  }
}

const handleImportFile = async (event: Event) => {
  const target = event.target as HTMLInputElement
  if (!target.files || !target.files[0]) return
  
  const file = target.files[0]
  importing.value = true
  error.value = ''
  importResult.value = null
  
  try {
    const text = await file.text()
    let data: any
    
    if (file.name.endsWith('.json')) {
      data = JSON.parse(text)
    } else if (file.name.endsWith('.csv')) {
      
      const lines = text.split('\n').filter(l => l.trim())
      if (lines.length === 0) {
        throw new Error('CSV file is empty')
      }
      const headers = lines[0]!.split(',').map(h => h.trim().replace(/^"|"$/g, ''))
      
      data = lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''))
        const obj: any = {}
        headers.forEach((header, i) => {
          obj[header] = values[i] || ''
        })
        return obj
      })
    } else {
      throw new Error('Unsupported file format')
    }

    const dataArray = Array.isArray(data) ? data : [data]

    const response: any = await $fetch(`${props.endpoint}/import`, {
      method: 'POST',
      body: { [props.entityName.toLowerCase()]: dataArray }
    })
    
    importResult.value = response
    emit('refresh')
    
  } catch (e: any) {
    error.value = e.data?.message || e.message || 'Import failed'
  } finally {
    importing.value = false
  }
}

const closeModal = () => {
  showImportModal.value = false
  importResult.value = null
  error.value = ''
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}
</script>