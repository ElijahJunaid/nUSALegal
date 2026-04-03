<template>
  <div class="jury-instructions">
    <div class="tool-card">
      <div class="form-control">
        <label class="label">
          <span class="label-text font-semibold">Select Criminal Charge</span>
        </label>
        <select v-model="selectedCharge" class="select select-bordered w-full">
          <option value="">-- Select a charge --</option>
          <option value="murder">Murder (18 USC § 1111)</option>
          <option value="assault">Assault (18 USC § 113)</option>
          <option value="theft">Theft (18 USC § 641)</option>
          <option value="robbery">Robbery (18 USC § 2111)</option>
          <option value="drug-possession">Drug Possession (21 USC § 844)</option>
          <option value="conspiracy">Conspiracy (18 USC § 371)</option>
        </select>
      </div>

      <button
        @click="generateInstructions"
        @keydown.enter="generateInstructions"
        @keydown.space="generateInstructions"
        class="btn btn-primary w-full mt-6"
        :disabled="!selectedCharge"
        aria-label="Generate jury instructions"
      >
        Generate Jury Instructions
      </button>

      <div v-if="instructions" class="alert alert-info mt-6">
        <div class="w-full">
          <div class="font-bold text-lg mb-3">{{ chargeTitle }}</div>
          <div class="text-sm whitespace-pre-line leading-relaxed">{{ instructions }}</div>
          <button
            @click="copyInstructions"
            @keydown.enter="copyInstructions"
            @keydown.space="copyInstructions"
            class="btn btn-sm btn-outline mt-4"
            :aria-label="
              copied ? 'Instructions copied to clipboard' : 'Copy instructions to clipboard'
            "
          >
            {{ copied ? '✓ Copied!' : 'Copy to Clipboard' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const selectedCharge = ref('')
const chargeTitle = ref('')
const instructions = ref('')
const copied = ref(false)

interface JuryInstruction {
  title: string
  text: string
}

const juryInstructionsData: Record<string, JuryInstruction> = {
  murder: {
    title: 'Murder in the First Degree',
    text: `Elements of First Degree Murder (18 USC § 1111):

The government must prove the following elements beyond a reasonable doubt:

1. The defendant unlawfully killed another human being
2. The defendant acted with malice aforethought
3. The killing was premeditated and deliberate

"Malice aforethought" means the defendant intended to kill or intended to inflict great bodily harm, or acted with reckless disregard for human life.

"Premeditated" means the defendant thought about the killing beforehand, even if only briefly.

"Deliberate" means the defendant made a decision to kill in a cool and calm manner.

If you find all elements proven beyond a reasonable doubt, you must find the defendant guilty of first degree murder. If any element is not proven, you must find the defendant not guilty.`
  },
  assault: {
    title: 'Assault (18 USC § 113)',
    text: `Elements of Assault:

The government must prove beyond a reasonable doubt:

1. The defendant intentionally struck, wounded, or inflicted bodily injury upon another person
2. The act was done willfully and unlawfully

"Willfully" means the defendant acted deliberately and intentionally, not by accident or mistake.

If you find all elements proven beyond a reasonable doubt, you must find the defendant guilty. Otherwise, you must find the defendant not guilty.`
  },
  theft: {
    title: 'Theft of Government Property (18 USC § 641)',
    text: `Elements of Theft:

The government must prove beyond a reasonable doubt:

1. The defendant took property belonging to another person or the government
2. The defendant intended to permanently deprive the owner of the property
3. The taking was without the owner's consent

If all elements are proven, you must find the defendant guilty. If any element is not proven, you must find the defendant not guilty.`
  },
  robbery: {
    title: 'Robbery (18 USC § 2111)',
    text: `Elements of Robbery:

The government must prove beyond a reasonable doubt:

1. The defendant took property from another person
2. The taking was against that person's will
3. The defendant used force, violence, or intimidation
4. The defendant intended to permanently deprive the victim of the property

Robbery is theft accomplished through force or fear. If all elements are proven, you must find the defendant guilty.`
  },
  'drug-possession': {
    title: 'Drug Possession (21 USC § 844)',
    text: `Elements of Drug Possession:

The government must prove beyond a reasonable doubt:

1. The defendant knowingly possessed a controlled substance
2. The substance was indeed a controlled substance as defined by law
3. The defendant knew the substance was a controlled substance

"Possession" can be actual (on the person) or constructive (within the defendant's control).

If all elements are proven, you must find the defendant guilty. Otherwise, you must find the defendant not guilty.`
  },
  conspiracy: {
    title: 'Conspiracy (18 USC § 371)',
    text: `Elements of Conspiracy:

The government must prove beyond a reasonable doubt:

1. An agreement existed between two or more persons to commit an unlawful act
2. The defendant knowingly and voluntarily joined the agreement
3. At least one conspirator committed an overt act in furtherance of the conspiracy

The agreement need not be formal or written. It can be inferred from the conduct of the parties.

If all elements are proven, you must find the defendant guilty of conspiracy.`
  }
}

function generateInstructions() {
  const data = juryInstructionsData[selectedCharge.value]
  if (data) {
    chargeTitle.value = data.title
    instructions.value = data.text
    copied.value = false
  }
}

function copyInstructions() {
  const text = `${chargeTitle.value}\n\n${instructions.value}`
  navigator.clipboard.writeText(text)
  copied.value = true
  setTimeout(() => (copied.value = false), 2000)
}
</script>

<style scoped>
.jury-instructions {
  padding: 1rem 0;
}

.tool-card {
  max-width: 800px;
  margin: 0 auto;
  background: #ffffff;
  border-radius: 0.5rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.form-control {
  margin-bottom: 1.5rem;
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

.btn-outline {
  background-color: transparent;
  color: #3b82f6;
  border: 1px solid #3b82f6;
}

.btn-outline:hover {
  background-color: #3b82f6;
  color: #ffffff;
}

.btn-sm {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
}

.alert {
  padding: 1rem;
  border-radius: 0.375rem;
  margin-top: 1.5rem;
}

.alert-info {
  background-color: #eff6ff;
  border: 1px solid #bfdbfe;
  color: #1e40af;
}

.font-bold {
  font-weight: 700;
}

.text-lg {
  font-size: 1.125rem;
  line-height: 1.75rem;
}

.mb-3 {
  margin-bottom: 0.75rem;
}

.text-sm {
  font-size: 0.875rem;
  line-height: 1.25rem;
}

.whitespace-pre-line {
  white-space: pre-line;
}

.leading-relaxed {
  line-height: 1.625;
}

.mt-4 {
  margin-top: 1rem;
}

.mt-6 {
  margin-top: 1.5rem;
}

.w-full {
  width: 100%;
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

[data-theme='dark'] .alert-info {
  background-color: #1e3a8a;
  border-color: #3b82f6;
  color: #93c5fd;
}

[data-theme='dark'] .font-bold {
  color: #f3f4f6;
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

  .alert-info {
    background-color: #dbeafe;
    border-color: #93c5fd;
    color: #1e3a8a;
  }

  .text-lg {
    color: #111827;
  }

  .text-sm {
    color: #374151;
  }
}
</style>
