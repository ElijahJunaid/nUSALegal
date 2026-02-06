<template>
  <div class="citation-generator">
    <div class="tool-card">
      <div class="form-control">
        <label class="label">
          <span class="label-text font-semibold">Citation Type</span>
        </label>
        <select v-model="citationType" class="select select-bordered w-full">
          <option value="case">Court Case</option>
          <option value="statute">Statute/USC</option>
          <option value="constitution">Constitution</option>
        </select>
      </div>

      <div v-if="citationType === 'case'" class="space-y-4 mt-4">
        <div class="form-control">
          <label class="label">
            <span class="label-text">Case Name</span>
          </label>
          <input v-model="caseName" type="text" placeholder="e.g., United States v. Smith" class="input input-bordered w-full" />
        </div>
        <div class="form-control">
          <label class="label">
            <span class="label-text">Volume & Reporter</span>
          </label>
          <input v-model="volume" type="text" placeholder="e.g., 123 F.3d 456" class="input input-bordered w-full" />
        </div>
        <div class="form-control">
          <label class="label">
            <span class="label-text">Year</span>
          </label>
          <input v-model="year" type="text" placeholder="e.g., 2020" class="input input-bordered w-full" />
        </div>
      </div>

      <div v-if="citationType === 'statute'" class="space-y-4 mt-4">
        <div class="form-control">
          <label class="label">
            <span class="label-text">Title</span>
          </label>
          <input v-model="title" type="text" placeholder="e.g., 18" class="input input-bordered w-full" />
        </div>
        <div class="form-control">
          <label class="label">
            <span class="label-text">Section</span>
          </label>
          <input v-model="section" type="text" placeholder="e.g., 1111" class="input input-bordered w-full" />
        </div>
      </div>

      <div v-if="citationType === 'constitution'" class="space-y-4 mt-4">
        <div class="form-control">
          <label class="label">
            <span class="label-text">Article/Amendment</span>
          </label>
          <input v-model="article" type="text" placeholder="e.g., Art. I, § 8 or Amend. IV" class="input input-bordered w-full" />
        </div>
      </div>

      <button @click="generateCitation" class="btn btn-primary w-full mt-6">Generate Citation</button>

      <div v-if="result" class="alert alert-success mt-6">
        <div class="w-full">
          <div class="font-semibold mb-2">Generated Citation:</div>
          <div class="font-mono text-sm bg-base-200 p-3 rounded">{{ result }}</div>
          <button @click="copyCitation" class="btn btn-sm btn-outline mt-3">
            {{ copied ? '✓ Copied!' : 'Copy to Clipboard' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const citationType = ref('case')
const caseName = ref('')
const volume = ref('')
const year = ref('')
const title = ref('')
const section = ref('')
const article = ref('')
const result = ref('')
const copied = ref(false)

function generateCitation() {
  let citation = ''
  
  if (citationType.value === 'case') {
    citation = `${caseName.value}, ${volume.value} (${year.value})`
  } else if (citationType.value === 'statute') {
    citation = `${title.value} U.S.C. § ${section.value}`
  } else if (citationType.value === 'constitution') {
    citation = `U.S. Const. ${article.value}`
  }
  
  result.value = citation
  copied.value = false
}

function copyCitation() {
  navigator.clipboard.writeText(result.value)
  copied.value = true
  setTimeout(() => copied.value = false, 2000)
}
</script>

<style scoped>
.citation-generator {
  padding: 1rem 0;
}

.tool-card {
  max-width: 600px;
  margin: 0 auto;
}

.space-y-4 > * + * {
  margin-top: 1rem;
}
</style>
