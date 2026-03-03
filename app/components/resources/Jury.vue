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

      <button @click="generateInstructions" class="btn btn-primary w-full mt-6" :disabled="!selectedCharge">
        Generate Jury Instructions
      </button>

      <div v-if="instructions" class="alert alert-info mt-6">
        <div class="w-full">
          <div class="font-bold text-lg mb-3">{{ chargeTitle }}</div>
          <div class="text-sm whitespace-pre-line leading-relaxed">{{ instructions }}</div>
          <button @click="copyInstructions" class="btn btn-sm btn-outline mt-4">
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

const juryInstructionsData: Record<string, any> = {
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
  setTimeout(() => copied.value = false, 2000)
}
</script>

<style scoped>
.jury-instructions {
  padding: 1rem 0;
}

.tool-card {
  max-width: 800px;
  margin: 0 auto;
}
</style>
