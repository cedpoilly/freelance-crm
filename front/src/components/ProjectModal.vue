<script setup>
  import { computed, nextTick, ref, toRaw, watch } from "vue"

  import BaseModal from "./BaseModal.vue"
  import BaseInput from "./BaseInput.vue"
  import BaseToggle from "./BaseToggle.vue"
  import BaseSelect from "./BaseSelect.vue"

  const PAYMENT_METHODS = ["codementor", "bank", "paypal"]

  const props = defineProps({
    project: { type: Object, required: true },
    clients: { type: Array, required: true },
  })

  const dialog = ref(null)

  defineExpose({ open, close, cancelAndClose })

  const project = ref(props.project)
  watch(
    () => props.project,
    updated => {
      project.value = updated
    }
  )

  function updateProject(fieldName, value) {
    project.value[fieldName] = value
  }

  /** Inteactions */
  const isEditing = computed(() => !!props.project?.title)
  const currentAction = computed(() => (isEditing.value ? "Edit" : "Create"))

  async function open(callback) {
    await setIsOpen(true)

    focusOnFirstInput()

    await dialog?.value?.open(callback)
    const ret = dialog.value?.isCancelled ? "" : toRaw(project.value)

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
      document.querySelector('[data-ref="first-input"] input').focus()
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
    key="EDIT_PROJECT_DIALOG"
  >
    <template #title>
      {{ currentAction }} project&nbsp;
      <span v-if="isEditing">
        '<span class="italic">{{ props.project?.title }}</span
        >'
      </span>
    </template>

    <template #content>
      <form class="main-form">
        <span class="form-section-header"> Info </span>

        <div class="project-form">
          <div class="form-group">
            <BaseInput
              :value="props.project.title"
              data-ref="first-input"
              class="title"
              field-name="title"
              label="Project title *"
              data-cy="edit-project-title"
              @input="updateProject('title', $event.target.value)"
            />
          </div>

          <div class="form-group">
            <BaseSelect
              :initial-selection="props.project.client"
              :list="props.clients"
              class="client"
              field-name="client"
              label="Client *"
              name="client"
              blank-option-label="Client name"
              data-cy="edit-project-client"
              @selected-tags="updateProject('client', $event)"
            />
          </div>

          <div class="form-group">
            <BaseInput
              :value="props.project.requirements"
              class="requirements"
              field-name="requirements"
              label="Requirements *"
              data-cy="edit-project-requirements"
              @input="updateProject('requirements', $event.target.value)"
            />
          </div>

          <div class="form-group">
            <BaseInput
              :value="props.project.milestones"
              class="milestones"
              field-name="milestones"
              label="Milestones *"
              data-cy="edit-project-milestones"
              @input="updateProject('milestones', $event.target.value)"
            />
          </div>

          <div class="form-group" v-if="props.project.isCodementor">
            <span class="base-input-label">Is from codementor.io </span>
            <BaseToggle
              :is-checked="props.project.isCodementor"
              class="is-completed"
              field-name="is-completed"
              label="Is Completed"
              data-cy="edit-project-is-completed"
              @toggled="updateProject('isCompleted', $event)"
            />
          </div>

          <div class="form-group">
            <BaseSelect
              :initial-selection="props.project.paymentMethod"
              :list="PAYMENT_METHODS"
              class="payment-method"
              field-name="payment-method"
              label="Payment method *"
              name="paymentmethod"
              blank-option-label="Payment method"
              data-cy="edit-project-payment-method"
              @selected-tags="updateProject('paymentMethod', $event)"
            />
          </div>

          <div class="form-group">
            <BaseInput
              :value="props.project.budget"
              field-name="budget"
              label="Budget *"
              data-cy="edit-project-budget"
              @input="updateProject('budget', $event.target.value)"
            />
          </div>
        </div>

        <span class="form-group spacer"></span>

        <span class="form-section-header mt-10"> Status </span>

        <div class="project-form mt-10 pt-10">
          <div class="form-group">
            <span class="base-input-label"></span>
            <BaseToggle
              :is-checked="props.project.hasDownPayment"
              class="has-down-payment"
              field-name="has-down-payment"
              label="Has Down Payment"
              data-cy="edit-project-has-down-payment"
              @toggled="updateProject('hasDownPayment', $event)"
            />
          </div>

          <div class="form-group">
            <BaseToggle
              :is-checked="props.project.wasPaymentDone"
              class="was-payment-done"
              field-name="was-payment-done"
              label="Was Payment Done"
              data-cy="edit-project-was-payment-done"
              @toggled="updateProject('wasPaymentDone', $event)"
            />
          </div>

          <div class="form-group">
            <BaseToggle
              :is-checked="props.project.isCompleted"
              class="is-completed"
              field-name="is-completed"
              label="Is Completed"
              data-cy="edit-project-is-completed"
              @toggled="updateProject('isCompleted', $event)"
            />
          </div>

          <div class="form-group">
            <BaseToggle
              :is-checked="props.project.isInvoiceSent"
              class="is-invoice-sent"
              field-name="is-invoice-sent"
              label="Is Invoice Sent"
              data-cy="edit-project-is-invoice-sent"
              @toggled="updateProject('isInvoiceSent', $event)"
            />
          </div>

          <div class="form-group">
            <BaseToggle
              :is-checked="props.project.wasPaidInFull"
              class="was-paid-in-full"
              field-name="was-paid-in-full"
              label="Is Invoice Sent"
              data-cy="edit-project-was-paid-in-full"
              @toggled="updateProject('wasPaidInFull', $event)"
            />
          </div>
        </div>
      </form>
    </template>
  </BaseModal>
</template>

<style lang="scss" scoped>
  .main-form {
    @apply overflow-y-auto w-full flex flex-col gap-4;
    height: 55vh;
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

  .form-section-header {
    @apply relative block w-full mb-5 text-center font-bold self-center;
    &::before {
      content: "";
      @apply absolute left-0 top-3 w-5/12 border-b border-gray-200;
    }

    &::after {
      content: "";
      @apply absolute right-0 top-3 w-5/12 border-b border-gray-200;
    }
  }
  .project-form {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(20rem, 1fr));
    grid-auto-rows: 7rem;
    column-gap: 4rem;
    row-gap: 1.5rem;

    @apply sm:w-11/12;
    @apply w-full px-0 py-0 my-auto content-center;
  }

  .form-group {
    @apply flex flex-col justify-center items-center;
  }
</style>
