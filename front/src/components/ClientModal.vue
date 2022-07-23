<script setup>
import { computed, nextTick, ref, toRaw, watch } from 'vue'

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

defineExpose({ open, close, cancelAndClose })

const client = ref(props.client)
watch(
  () => props.client,
  (updated) => client.value = updated
)

function updateClient(fieldName, value) {
  client.value[fieldName] = value
}

/** Inteactions */
const isEditing = computed(() => !!props.client?.firstName)
const currentAction = computed(() => isEditing.value ? 'Edit' : 'Create')

async function open(callback) {
  await setIsOpen(true)

  focusOnFirstInput()

  await dialog?.value?.open(callback)
  const ret = dialog.value?.isCancelled ? '' : toRaw(client.value)

  await setIsOpen(false)
  return ret
}

function close() { return dialog?.value?.close() }
function cancelAndClose() { return dialog?.value?.cancelAndClose() }

function focusOnFirstInput() {
  requestAnimationFrame(() => {
    document.querySelector('[data-ref="first-input"]').focus()
  })
}

const isOpen = ref(false)
async function setIsOpen(shouldOpen) {
  isOpen.value = shouldOpen
  await nextTick()
}
</script>

<template>
  <BaseModal v-if="isOpen" width="!w-[46rem]" tabindex="0" actions-push-left="mr-6" :is-default-actions="true"
    role="dialog" ref="dialog" key="EDIT_CLIENT_DIALOG">
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
        <div class="form-group">
          <BaseInput :value="props.client.firstName" data-ref="first-input" class="first-name" field-name="firstname" label="First Name"
            data-cy="edit-client-firstname" @input="updateClient('firstName', $event.target.value)" />
        </div>

        <div class="form-group">
          <BaseInput :value="props.client.lastName" class="last-name" field-name="lastname" label="Last Name"
            data-cy="edit-client-lastname" @input="updateClient('lastName', $event.target.value)" />
        </div>

        <div class="form-group">
          <BaseInput :value="props.client.whatsAppNumber" class="whatsapp-number" field-name="whatsappnumber"
            label="WhatsApp Number" data-cy="edit-client-whatsapp"
            @input="updateClient('whatsAppNumber', $event.target.value)" />
        </div>

        <div class="form-group">
          <span class="base-input-label"> Is CodeMentor </span>
          <BaseToggle :is-checked="props.client.isCodementor" class="is-codementor" field-name="iscodementor"
            label="Is CodeMentor" data-cy="edit-client-iscodementor" @toggled="updateClient('isCodementor', $event)" />
        </div>

        <div class="form-group level">
          <span class="base-input-label"> Level/Experience </span>
          <BaseSelect label="client's level" :list="LEVEL" :initial-selection="props.client.level"
            @selected-tags="updateClient('level', $event)" />
        </div>

        <div class="form-group service-type">
          <span class="base-input-label"> Service type </span>
          <BaseSelect label="Service Type" :list="SERVICE_TYPE" :initial-selection="props.client.serviceType"
            @selected-tags="updateClient('serviceType', $event)" />
        </div>

        <div class="form-group rate">
          <BaseInput :value="props.client.rate" field-name="rate" label="Rate" data-cy="edit-client-rate"
            @input="updateClient('rate', $event.target.value)" />
        </div>

        <div class="form-group tags">
          <span class="base-input-label"> Tags </span>
          <BaseSelect :value="props.client.tags" :list="TAGS" :initial-selection="props.client.tags" :is-multi="true"
            field-name="tags" label="Tags" data-cy="edit-client-tags" @selected-tags="updateClient('tags', $event)" />
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

  width: 40rem;
}

.form-group {
  @apply flex flex-col justify-center;
}

.client-name-input {
  @apply w-full px-4 py-3 h-8 ease-in-out duration-100 text-base dark:text-slate-900 placeholder-gray-500 dark:placeholder-slate-900 rounded-full rounded-2xl border border-gray-200 dark:border-none focus:outline-none focus:border-sky-400;
}
</style>