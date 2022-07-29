<script setup>
  import { computed, nextTick, ref, toRaw, watch } from "vue"

  import BaseModal from "../ui-kit/BaseModal.vue"
  import BaseInput from "../ui-kit/BaseInput.vue"
  import BaseToggle from "../ui-kit/BaseToggle.vue"
  import BaseSelect from "../ui-kit/BaseSelect.vue"

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
      <p class="flex w-full sm:w-full md:w-9/12 lg:w-full">
        <span class="block w-24 md:w-auto"
          >{{ currentAction }} client &nbsp;</span
        >
        <span
          v-if="isEditing"
          class="italic block truncate max-w-[10rem] md:max-w-max"
        >
          {{ props.client?.firstName }}
          {{ props.client?.lastName }}
        </span>
      </p>
    </template>

    <template #content>
      <p class="relative flex w-full top-4 self-start">
        <router-link
          :to="`/app/projects/${props.client._id}`"
          class="see-projects-link link"
          >See projects</router-link
        >
      </p>
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

        <div class="form-group">
          <BaseSelect
            :list="LEVEL"
            :initial-selection="props.client.level"
            name="level"
            label="Client's level"
            blank-option-label="Select client's level"
            @selected-tags="updateClient('level', $event)"
          />
        </div>

        <div class="form-group">
          <BaseSelect
            :list="SERVICE_TYPE"
            :initial-selection="props.client.serviceType"
            name="servicetype"
            label="Service type"
            blank-option-label="Service type."
            @selected-tags="updateClient('serviceType', $event)"
          />
        </div>

        <div class="form-group">
          <BaseInput
            :value="props.client.rate"
            field-name="rate"
            label="Rate"
            data-cy="edit-client-rate"
            @input="updateClient('rate', $event.target.value)"
          />
        </div>

        <div class="form-group">
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
    @apply sm:w-full h-full;
    @apply my-4 md:my-6 lg:my-8 xl:my-10;

    @apply grid;
    grid-template-columns: repeat(auto-fill, minmax(20rem, 1fr));
    grid-auto-rows: 5.7rem;
    column-gap: 4rem;
    row-gap: 1.5rem;
    padding-right: 0.3rem;

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

  .see-projects-link {
    @apply inline-block self-end justify-self-end;
  }
</style>
