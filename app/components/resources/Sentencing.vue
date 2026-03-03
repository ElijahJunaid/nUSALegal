<template>
  <div class="sentencing-calculator">
    <div class="tool-card">
      <div class="form-control">
        <label class="label">
          <span class="label-text font-semibold">Primary Offense</span>
        </label>
        <select v-model="offense" class="select select-bordered w-full">
          <option value="">-- Select offense --</option>
          <option value="murder-1">First Degree Murder</option>
          <option value="murder-2">Second Degree Murder</option>
          <option value="manslaughter">Voluntary Manslaughter</option>
          <option value="assault-serious">Aggravated Assault</option>
          <option value="assault-simple">Simple Assault</option>
          <option value="robbery-armed">Armed Robbery</option>
          <option value="robbery">Robbery</option>
          <option value="theft-major">Grand Theft (>$5000)</option>
          <option value="theft-minor">Petty Theft (<$5000)</option>
          <option value="drug-trafficking">Drug Trafficking</option>
          <option value="drug-possession">Drug Possession</option>
        </select>
      </div>

      <div class="form-control mt-4">
        <label class="label">
          <span class="label-text font-semibold">Criminal History Category</span>
        </label>
        <select v-model="history" class="select select-bordered w-full">
          <option value="I">I - No prior convictions</option>
          <option value="II">II - 1-2 prior offenses</option>
          <option value="III">III - 3-4 prior offenses</option>
          <option value="IV">IV - 5-6 prior offenses</option>
          <option value="V">V - 7+ prior offenses</option>
        </select>
      </div>

      <div class="form-control mt-4">
        <label class="label cursor-pointer justify-start gap-3">
          <input v-model="acceptedResponsibility" type="checkbox" class="checkbox checkbox-primary" />
          <span class="label-text">Accepted Responsibility (reduces sentence)</span>
        </label>
      </div>

      <button @click="calculateSentencing" class="btn btn-primary w-full mt-6" :disabled="!offense">
        Calculate Sentencing Range
      </button>

      <div v-if="result" class="alert alert-warning mt-6">
        <div class="w-full">
          <div class="font-bold text-lg mb-2">Recommended Sentencing Range</div>
          <div class="text-2xl font-bold my-3">{{ result.range }}</div>
          <p class="text-sm mb-3">{{ result.description }}</p>
          <div class="divider"></div>
          <div class="text-xs opacity-80 space-y-1">
            <p><strong>Offense Level:</strong> {{ result.offenseLevel }}</p>
            <p><strong>Criminal History:</strong> Category {{ history }}</p>
            <p v-if="acceptedResponsibility" class="text-success">✓ Reduction applied for acceptance of responsibility (-2 levels)</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const offense = ref('')
const history = ref('I')
const acceptedResponsibility = ref(false)
const result = ref<any>(null)

const sentencingGuidelines: Record<string, any> = {
  'murder-1': { base: 43, range: 'Life imprisonment', description: 'First degree murder carries a mandatory life sentence.' },
  'murder-2': { base: 38, range: '20-40 years', description: 'Second degree murder with possible parole eligibility.' },
  'manslaughter': { base: 29, range: '10-16 years', description: 'Voluntary manslaughter with mitigating circumstances.' },
  'assault-serious': { base: 24, range: '5-8 years', description: 'Aggravated assault with serious bodily injury.' },
  'assault-simple': { base: 14, range: '1-3 years', description: 'Simple assault without weapon or serious injury.' },
  'robbery-armed': { base: 28, range: '8-12 years', description: 'Armed robbery with firearm or deadly weapon.' },
  'robbery': { base: 22, range: '4-7 years', description: 'Robbery without deadly weapon.' },
  'theft-major': { base: 18, range: '2-5 years', description: 'Grand theft over $5,000.' },
  'theft-minor': { base: 8, range: '6 months - 2 years', description: 'Petty theft under $5,000.' },
  'drug-trafficking': { base: 32, range: '10-20 years', description: 'Drug trafficking with large quantities.' },
  'drug-possession': { base: 12, range: '1-2 years', description: 'Simple possession for personal use.' }
}

const historyAdjustments: Record<string, number> = {
  'I': 0,
  'II': 1,
  'III': 2,
  'IV': 3,
  'V': 4
}

function calculateSentencing() {
  const guideline = sentencingGuidelines[offense.value]
  if (!guideline) return
  
  let offenseLevel = guideline.base
  offenseLevel += historyAdjustments[history.value]
  
  if (acceptedResponsibility.value) {
    offenseLevel -= 2
  }
  
  result.value = {
    range: guideline.range,
    description: guideline.description,
    offenseLevel
  }
}
</script>

<style scoped>
.sentencing-calculator {
  padding: 1rem 0;
}

.tool-card {
  max-width: 700px;
  margin: 0 auto;
}

.space-y-1 > * + * {
  margin-top: 0.25rem;
}
</style>
