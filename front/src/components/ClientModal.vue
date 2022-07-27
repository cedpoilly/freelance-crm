<script setup>
  import { computed, nextTick, ref, toRaw, watch } from "vue"

  import BaseModal from "./BaseModal.vue"
  import BaseInput from "./BaseInput.vue"
  import BaseToggle from "./BaseToggle.vue"
  import BaseSelect from "./BaseSelect.vue"

  const LEVEL = ["beginner", "intermediate", "advanced"]
  const TAGS = [
    "JavaScript",
    "HTML",
    "CSS",
    "Vue.js",
    "Front-End",
    "Back-end",
    "Node.js",
    "Express.js",
    "MongoDB",
    "Mongoose",
  ]
  const SERVICE_TYPE = ["individual", "team"]

  const props = defineProps({
    client: { type: Object, required: true },
  })

  const dialog = ref(null)

  defineExpose({ open, close, cancelAndClose })

  const client = ref(props.client)
  watch(
    () => props.client,
    updated => (client.value = updated)
  )

  function updateClient(fieldName, value) {
    client.value[fieldName] = value
  }

  /** Inteactions */
  const isEditing = computed(() => !!props.client?.firstName)
  const currentAction = computed(() => (isEditing.value ? "Edit" : "Create"))

  async function open(callback) {
    await setIsOpen(true)

    focusOnFirstInput()

    await dialog?.value?.open(callback)
    const ret = dialog.value?.isCancelled ? "" : toRaw(client.value)

    await setIsOpen(false)
    return ret
  }

  function close() {
    return dialog?.value?.close()
  }
  function cancelAndClose() {
    return dialog?.value?.cancelAndClose()
  }

  function focusOnFirstInput() {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const input = document.querySelector('[data-ref="first-input"] input')
        input.focus()
      })
    })
  }

  const isOpen = ref(false)
  async function setIsOpen(shouldOpen) {
    isOpen.value = shouldOpen
    await nextTick()
  }
</script>

<template>
  <BaseModal
    v-if="isOpen"
    tabindex="0"
    :is-default-actions="true"
    role="dialog"
    ref="dialog"
    key="EDIT_CLIENT_DIALOG"
  >
    <template #title class="tile-container">
      <p class="flex w-9/12">
        {{ currentAction }} client &nbsp;
        <span v-if="isEditing">
          '<span class="italic">
            {{ props.client?.firstName }}
            {{ props.client?.lastName }} </span
          >'
        </span>
      </p>
      <p class="flex w-3/12 justify-end mr-4">
        <router-link
          :to="`/app/projects/${props.client._id}`"
          class="see-projects-link"
          >See projects</router-link
        >
      </p>
    </template>

    <template #content>
      <form class="client-form">
        <div class="form-group">
          <BaseInput
            :value="props.client.firstName"
            data-ref="first-input"
            class="first-name"
            field-name="firstname"
            label="First Name"
            data-cy="edit-client-firstname"
            @input="updateClient('firstName', $event.target.value)"
          />
        </div>

        <div class="form-group">
          <BaseInput
            :value="props.client.lastName"
            class="last-name"
            field-name="lastname"
            label="Last Name"
            data-cy="edit-client-lastname"
            @input="updateClient('lastName', $event.target.value)"
          />
        </div>

        <div class="form-group">
          <BaseInput
            :value="props.client.email"
            class="email"
            field-name="email"
            label="Email"
            data-cy="edit-client-email"
            @input="updateClient('email', $event.target.value)"
          />
        </div>

        <div class="form-group">
          <BaseInput
            :value="props.client.whatsAppNumber"
            class="whatsapp-number"
            field-name="whatsappnumber"
            label="WhatsApp number"
            data-cy="edit-client-whatsapp"
            @input="updateClient('whatsAppNumber', $event.target.value)"
          />
        </div>

        <div class="form-group">
          <BaseToggle
            :is-checked="props.client.isCodementor"
            class="is-codementor"
            field-name="iscodementor"
            label="Is from codementor.io"
            data-cy="edit-client-iscodementor"
            @toggled="updateClient('isCodementor', $event)"
          />
        </div>

        <div class="form-group level">
          <BaseSelect
            :list="LEVEL"
            :initial-selection="props.client.level"
            name="level"
            label="Client's level"
            blank-option-label="Select client's level"
            @selected-tags="updateClient('level', $event)"
          />
        </div>

        <div class="form-group service-type">
          <BaseSelect
            :list="SERVICE_TYPE"
            :initial-selection="props.client.serviceType"
            name="servicetype"
            label="Service type"
            blank-option-label="Service type."
            @selected-tags="updateClient('serviceType', $event)"
          />
        </div>

        <div class="form-group rate">
          <BaseInput
            :value="props.client.rate"
            field-name="rate"
            label="Rate"
            data-cy="edit-client-rate"
            @input="updateClient('rate', $event.target.value)"
          />
        </div>

        <div class="form-group tags">
          <BaseSelect
            :value="props.client.tags"
            :list="TAGS"
            :initial-selection="props.client.tags"
            :is-multi="true"
            name="tags"
            label="Tags"
            blank-option-label="Select one or more tags."
            field-name="tags"
            data-cy="edit-client-tags"
            @selected-tags="updateClient('tags', $event)"
          />
        </div>
      </form>
    </template>
  </BaseModal>
</template>

<style lang="scss" scoped>
  .client-form {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(20rem, 1fr));
    grid-auto-rows: 5.7rem;
    column-gap: 4rem;
    row-gap: 1.5rem;
    @apply sm:w-11/12;

    max-height: 69vh;
    @apply w-full px-0 py-0 overflow-y-auto my-auto content-center;

    &::-webkit-scrollbar {
      @apply w-10;
      width: 0.4rem;
    }

    &::-webkit-scrollbar-track {
      background-color: #f1f1f1;
      border-radius: 2rem;
    }

    &::-webkit-scrollbar-thumb {
      background-color: #ccc;
      border-radius: 2rem;
    }
  }

  .form-group {
    @apply flex flex-col justify-center items-center;
  }

  .client-name-input {
    @apply w-full px-4 py-3 h-8 ease-in-out duration-100 text-base dark:text-slate-900 placeholder-gray-500 dark:placeholder-slate-900 rounded-full rounded-2xl border border-gray-200 dark:border-none focus:outline-none focus:border-sky-400;
  }

  .modal-title {
    @apply flex justify-between;
  }

  .see-projects-link {
    @apply inline-block self-end justify-self-end;
  }
</style>
