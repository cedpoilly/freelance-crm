<script setup>
  import { computed, nextTick, ref, toRaw, watch } from "vue"

  import BaseButton from "../ui-kit/BaseButton.vue"
  import BaseInput from "../ui-kit/BaseInput.vue"
  import BaseModal from "../ui-kit/BaseModal.vue"
  import BaseSelect from "../ui-kit/BaseSelect.vue"
  import BaseToggle from "../ui-kit/BaseToggle.vue"

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
    class="client-modal"
    role="dialog"
    ref="dialog"
    key="EDIT_CLIENT_DIALOG"
  >
    <template #title>
      <span class="flex items-center h-fit overflow-hidden md:w-9/12 lg:w-full">
        <span class="flex items-center min-w-max truncate md:max-w-max"
          >{{ currentAction }} client &nbsp;</span
        >
        <span
          v-if="isEditing"
          class="italic flex items-center text-ellipsis overflow-hidden"
        >
          {{ props.client?.firstName }}
          {{ props.client?.lastName }}
        </span>
      </span>
    </template>

    <template #content>
      <div class="py-4 md:pb-8 client-view-container grid auto-rows-max">
        <p
          class="client-form-header pb-4 h-fit flex w-full justify-between items-center"
        >
          <BaseButton>Edit</BaseButton>

          <router-link
            :to="`/app/projects/${props.client._id}`"
            class="see-projects-link mr-1"
            >See projects</router-link
          >
        </p>

        <form class="client-form h-fit gap-8 py-8">
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
              :options="LEVEL"
              :initial-selection="props.client.level"
              field-name="level"
              label="Client's level"
              blank-option-label="Select client's level"
              @selected-tags="updateClient('level', $event)"
            />
          </div>
          <div class="form-group">
            <BaseSelect
              :options="SERVICE_TYPE"
              :initial-selection="props.client.serviceType"
              field-name="servicetype"
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
              :options="TAGS"
              :initial-selection="props.client.tags"
              :is-multi="true"
              field-name="tags"
              label="Tags"
              blank-option-label="Select one or more tags."
              data-cy="edit-client-tags"
              @selected-tags="updateClient('tags', $event)"
            />
          </div>
        </form>
      </div>
    </template>
  </BaseModal>
</template>

<style lang="scss">
  .modal-container.client-modal .modal {
    max-width: 80rem;
  }
</style>

<style lang="scss" scoped>
  .client-form {
    @apply sm:w-full h-auto;

    @apply grid;
    grid-template-columns: repeat(auto-fill, minmax(17rem, 1fr));

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
    @apply link text-right;
  }
</style>
