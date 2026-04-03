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
          <input
            v-model="acceptedResponsibility"
            type="checkbox"
            class="checkbox checkbox-primary"
          />
          <span class="label-text">Accepted Responsibility (reduces sentence)</span>
        </label>
      </div>

      <button
        @click="calculateSentencing"
        @keydown.enter="calculateSentencing"
        @keydown.space="calculateSentencing"
        class="btn btn-primary w-full mt-6"
        :disabled="!offense"
        aria-label="Calculate sentencing range"
      >
        Calculate Sentencing Range
      </button>

      <div v-if="result" class="alert alert-warning mt-6">
        <div class="w-full">
          <div class="font-bold text-lg mb-2">Recommended Sentencing Range</div>
          <div class="text-2xl font-bold my-3">{{ result.range }}</div>
          <p class="text-sm mb-3">{{ result.description }}</p>
          <div class="divider"></div>
          <div class="text-xs opacity-80 space-y-1">
            <p>
              <strong>Offense Level:</strong>
              {{ result.offenseLevel }}
            </p>
            <p>
              <strong>Criminal History:</strong>
              Category {{ history }}
            </p>
            <p v-if="acceptedResponsibility" class="text-success">
              ✓ Reduction applied for acceptance of responsibility (-2 levels)
            </p>
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
interface SentencingGuideline {
  base: number
  range: string
  description: string
}

interface SentencingResult {
  range: string
  description: string
  offenseLevel: number
}

const result = ref<SentencingResult | null>(null)

const sentencingGuidelines: Record<string, SentencingGuideline> = {
  'murder-1': {
    base: 43,
    range: 'Life imprisonment',
    description: 'First degree murder carries a mandatory life sentence.'
  },
  'murder-2': {
    base: 38,
    range: '20-40 years',
    description: 'Second degree murder with possible parole eligibility.'
  },
  manslaughter: {
    base: 29,
    range: '10-16 years',
    description: 'Voluntary manslaughter with mitigating circumstances.'
  },
  'assault-serious': {
    base: 24,
    range: '5-8 years',
    description: 'Aggravated assault with serious bodily injury.'
  },
  'assault-simple': {
    base: 14,
    range: '1-3 years',
    description: 'Simple assault without weapon or serious injury.'
  },
  'robbery-armed': {
    base: 28,
    range: '8-12 years',
    description: 'Armed robbery with firearm or deadly weapon.'
  },
  robbery: { base: 22, range: '4-7 years', description: 'Robbery without deadly weapon.' },
  'theft-major': { base: 18, range: '2-5 years', description: 'Grand theft over $5,000.' },
  'theft-minor': { base: 8, range: '6 months - 2 years', description: 'Petty theft under $5,000.' },
  'drug-trafficking': {
    base: 32,
    range: '10-20 years',
    description: 'Drug trafficking with large quantities.'
  },
  'drug-possession': {
    base: 12,
    range: '1-2 years',
    description: 'Simple possession for personal use.'
  }
}

const historyAdjustments: Record<string, number> = {
  I: 0,
  II: 1,
  III: 2,
  IV: 3,
  V: 4
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
  background: #ffffff;
  border-radius: 0.5rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.form-control {
  margin-bottom: 1rem;
}

.mt-4 {
  margin-top: 1rem;
}

.label {
  display: block;
  margin-bottom: 0.5rem;
}

.label-text {
  color: #1f2937;
  font-weight: 600;
  display: block;
  margin-bottom: 0.25rem;
}

.cursor-pointer {
  cursor: pointer;
}

.justify-start {
  justify-content: flex-start;
}

.gap-3 {
  gap: 0.75rem;
}

.select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  background-color: #ffffff;
  color: #1f2937;
  font-size: 0.875rem;
  transition:
    border-color 0.15s ease-in-out,
    box-shadow 0.15s ease-in-out;
}

.select:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
  border-color: #3b82f6;
}

.checkbox {
  width: 1rem;
  height: 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.25rem;
  background-color: #ffffff;
  cursor: pointer;
  transition: all 0.15s ease-in-out;
}

.checkbox:checked {
  background-color: #3b82f6;
  border-color: #3b82f6;
}

.checkbox-primary:checked {
  background-color: #3b82f6;
  border-color: #3b82f6;
}

.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease-in-out;
  border: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.btn-primary {
  background-color: #3b82f6;
  color: #ffffff;
}

.btn-primary:hover:not(:disabled) {
  background-color: #2563eb;
}

.btn-primary:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
}

.alert {
  padding: 1rem;
  border-radius: 0.375rem;
  margin-top: 1.5rem;
}

.alert-success {
  background-color: #f0fdf4;
  border: 1px solid #86efac;
  color: #166534;
}

.font-bold {
  font-weight: 700;
}

.text-lg {
  font-size: 1.125rem;
  line-height: 1.75rem;
}

.mb-2 {
  margin-bottom: 0.5rem;
}

.text-sm {
  font-size: 0.875rem;
  line-height: 1.25rem;
}

.text-blue-600 {
  color: #2563eb;
}

.space-y-1 > * + * {
  margin-top: 0.25rem;
}

.bg-blue-50 {
  background-color: #eff6ff;
}

.border-blue-200 {
  border-color: #bfdbfe;
}

.text-blue-800 {
  color: #1e40af;
}

.py-2 {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}

.px-3 {
  padding-left: 0.75rem;
  padding-right: 0.75rem;
}

.rounded {
  border-radius: 0.375rem;
}

.font-mono {
  font-family:
    ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New',
    monospace;
}

/* Dark mode improvements */
[data-theme='dark'] .tool-card {
  background: #1f2937;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

[data-theme='dark'] .label-text {
  color: #f3f4f6;
}

[data-theme='dark'] .select {
  background-color: #374151;
  border-color: #4b5563;
  color: #f3f4f6;
}

[data-theme='dark'] .select:focus {
  border-color: #60a5fa;
}

[data-theme='dark'] .checkbox {
  background-color: #374151;
  border-color: #4b5563;
}

[data-theme='dark'] .checkbox:checked {
  background-color: #3b82f6;
  border-color: #3b82f6;
}

[data-theme='dark'] .alert-success {
  background-color: #14532d;
  border-color: #16a34a;
  color: #86efac;
}

[data-theme='dark'] .font-bold {
  color: #f3f4f6;
}

[data-theme='dark'] .text-blue-600 {
  color: #60a5fa;
}

[data-theme='dark'] .bg-blue-50 {
  background-color: #1e3a8a;
}

[data-theme='dark'] .text-blue-800 {
  color: #93c5fd;
}

/* Light mode contrast improvements */
@media (prefers-color-scheme: light) {
  .tool-card {
    background: #ffffff;
    border: 1px solid #e5e7eb;
  }

  .label-text {
    color: #111827;
  }

  .select {
    background-color: #ffffff;
    border-color: #d1d5db;
    color: #111827;
  }

  .checkbox {
    background-color: #ffffff;
    border-color: #d1d5db;
  }

  .checkbox:checked {
    background-color: #3b82f6;
    border-color: #3b82f6;
  }

  .alert-success {
    background-color: #f0fdf4;
    border-color: #86efac;
    color: #166534;
  }

  .text-lg {
    color: #111827;
  }

  .text-sm {
    color: #374151;
  }

  .text-blue-600 {
    color: #2563eb;
  }
}
</style>
