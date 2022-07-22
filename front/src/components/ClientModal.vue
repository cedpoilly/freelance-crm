<script setup>
import { computed, nextTick, ref, watch } from 'vue'

import BaseModal from './BaseModal.vue'
import BaseInput from './BaseInput.vue'
import BaseToggle from './BaseToggle.vue'
import BaseSelect from './BaseSelect.vue'

const LEVEL = ["beginner", "intermediate", "advanced"]
const TAGS = ["JavaScript", "HTML", "CSS", "Vue.js", "Front-End", "Back-end", "Node.js", "Express.js", "MongoDB", "Mongoose"]
const SERVICE_TYPE = ["individual", "team"]

const props = defineProps({
  client: { type: Object, required: true }
})

const dialog = ref(null)
const mainInput = ref(null)

defineExpose({ open, close })

const client = ref(props.client)
watch(
  () => props.client,
  (updated) => client.value = updated
)

function updateClientLevel(levels) {
  client.value.levels = levels
}
function updateClientServiceType(serviceType) {
  client.value.serviceType = serviceType
}

/** Inteactions */
const isEditing = computed(() => !!props.client?.firstName)
const currentAction = computed(() => isEditing.value ? 'Edit' : 'Create')

async function open(callback) {
  await setIsOpen(true)
  focusInput()

  await dialog?.value?.open(callback)
  const ret = dialog.value?.isCancelled ? '' : client.value.firstName

  await setIsOpen(false)
  return ret
}

function close() { return dialog?.value?.close() }

let focusAttempts = 0
const MAX_ATTEMPTS = 30

function focusInput() {
  const DELAY = 50
  setTimeout(recurse, DELAY)

  function recurse() {
    focusAttempts += 1
    const hasReachedTheLimit = focusAttempts >= MAX_ATTEMPTS
    if (hasReachedTheLimit) { return }

    if (!mainInput.value) { focusInput() }

    mainInput.value.focus && mainInput.value.focus()
  }
}

const isOpen = ref(false)
async function setIsOpen(shouldOpen) {
  isOpen.value = shouldOpen
  await nextTick()
}
</script>

<template>
  <BaseModal v-if="isOpen" :is-default-actions="true" role="dialog" ref="dialog" key="EDIT_TOPIC_DIALOG">
    <template #title>
      {{ currentAction }} client
      <span v-if="isEditing">
        '
        <span class="italic">
          {{ props.client?.firstName }}
          {{ props.client?.lastName }}
        </span>'
      </span>
    </template>

    <template #content>
      <form class="client-form container">
        <div>
          <BaseInput :value="props.client.firstName" class="first-name" field-name="firstname" label="First Name"
            ref="mainInput" data-cy="edit-client-firstname" />
        </div>
        <div>
          <BaseInput :value="props.client.lastName" class="last-name" field-name="lastname" label="Last Name"
            data-cy="edit-client-lastname" />
        </div>

        <div>
          <BaseInput :value="props.client.whatsAppNumber" class="whatsapp-number" field-name="whatsappnumber"
            label="WhatsApp Number" data-cy="edit-client-whatsapp" />
        </div>

        <div>
          <span class="base-input-label"> Is CodeMentor </span>
          {{ props.client.isCodementor }}
          <BaseToggle :is-checked="props.client.isCodementor" class="is-codementor" field-name="iscodementor"
            label="Is CodeMentor" data-cy="edit-client-iscodementor" />
        </div>

        <div class="level">
          <span class="base-input-label"> Level/Experience </span>
          <BaseSelect label="client's level" :list="LEVEL" :initial-selection="props.client.level" @selected-tags="updateClientLevel" />
        </div>

        <div class="service-type">
          <span class="base-input-label"> Service type </span>
          <BaseSelect label="client's level" :list="SERVICE_TYPE" :initial-selection="props.client.serviceType"  
            @selected-tags="updateClientServiceType" />
        </div>

        <div class="rate">
          <BaseInput :value="props.client.rate" field-name="rate" label="Rate" data-cy="edit-client-rate" />
        </div>

        <div class="tags">
          <span class="base-input-label"> Tags </span>
          <BaseSelect :value="props.client.tags" :list="TAGS" :initial-selection="props.client.tags" :is-multi="true" field-name="tags" label="Tags"
            data-cy="edit-client-tags" />
        </div>
      </form>
    </template>
  </BaseModal>
</template>

<style lang="scss" scoped>
.client-form {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-auto-flow: row;
  gap: 1rem;
}

.client-name-input {
  @apply w-full px-4 py-3 h-8 ease-in-out duration-100 text-base dark:text-slate-900 placeholder-gray-500 dark:placeholder-slate-900 rounded-full rounded-2xl border border-gray-200 dark:border-none focus:outline-none focus:border-sky-400;
}
</style>