<script setup>
  import { computed, nextTick, ref, toRaw, watch } from "vue"

  import BaseModal from "./BaseModal.vue"
  import BaseInput from "./BaseInput.vue"
  import BaseToggle from "./BaseToggle.vue"
  import BaseSelect from "./BaseSelect.vue"

  const PAYMENT_METHODS = ["codementor", "bank", "paypal"]

  const props = defineProps({
    project: { type: Object, required: true },
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
  <BaseModal
    v-if="isOpen"
    width="!w-[46rem]"
    tabindex="0"
    actions-push-left="mr-6"
    :is-default-actions="true"
    role="dialog"
    ref="dialog"
    key="EDIT_PROJECT_DIALOG"
  >
    <template #title>
      {{ currentAction }} project
      <span v-if="isEditing">
        '<span class="italic">{{ props.project?.title }}</span
        >'
      </span>
    </template>

    <template #content>
      <form class="project-form container">
        <div class="form-group">
          <BaseInput
            :value="props.project.title"
            data-ref="first-input"
            class="title"
            field-name="title"
            label="Project Title"
            data-cy="edit-project-title"
            @input="updateProject('title', $event.target.value)"
          />
        </div>

        <div class="form-group">
          <BaseInput
            :value="props.project.requirements"
            class="requirements"
            field-name="requirements"
            label="Requirements"
            data-cy="edit-project-requirements"
            @input="updateProject('requirements', $event.target.value)"
          />
        </div>

        <div class="form-group">
          <BaseInput
            :value="props.project.milestones"
            class="milestones"
            field-name="milestones"
            label="Milestones"
            data-cy="edit-project-milestones"
            @input="updateProject('milestones', $event.target.value)"
          />
        </div>

        <div class="form-group" v-if="props.project.isCodementor">
          <span class="base-input-label"> Is from codementor.io </span>
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
            label="Payment Method"
            data-cy="edit-project-payment-method"
            @selected-tags="updateProject('paymentMethod', $event)"
          />
        </div>

        <div class="form-group budget">
          <BaseInput
            :value="props.project.budget"
            field-name="budget"
            label="Budget"
            data-cy="edit-project-budget"
            @input="updateProject('budget', $event.target.value)"
          />
        </div>

        <span class="form-group spacer"></span>

        <div class="form-group form-group-status">
          <span class="base-input-label"> Status </span>
          <span class="base-input-label"></span>
          <BaseToggle
            :is-checked="props.project.hasDownPayment"
            class="has-down-payment"
            field-name="has-down-payment"
            label="Has Down Payment"
            data-cy="edit-project-has-down-payment"
            @toggled="updateProject('hasDownPayment', $event)"
          />

          <BaseToggle
            :is-checked="props.project.wasPaymentDone"
            class="was-payment-done"
            field-name="was-payment-done"
            label="Was Payment Done"
            data-cy="edit-project-was-payment-done"
            @toggled="updateProject('wasPaymentDone', $event)"
          />

          <BaseToggle
            :is-checked="props.project.isCompleted"
            class="is-completed"
            field-name="is-completed"
            label="Is Completed"
            data-cy="edit-project-is-completed"
            @toggled="updateProject('isCompleted', $event)"
          />

          <BaseToggle
            :is-checked="props.project.isInvoiceSent"
            class="is-invoice-sent"
            field-name="is-invoice-sent"
            label="Is Invoice Sent"
            data-cy="edit-project-is-invoice-sent"
            @toggled="updateProject('isInvoiceSent', $event)"
          />

          <BaseToggle
            :is-checked="props.project.wasPaidInFull"
            class="was-paid-in-full"
            field-name="was-paid-in-full"
            label="Is Invoice Sent"
            data-cy="edit-project-was-paid-in-full"
            @toggled="updateProject('wasPaidInFull', $event)"
          />
        </div>
      </form>
    </template>
  </BaseModal>
</template>

<style lang="scss" scoped>
  .project-form {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-auto-flow: row;
    gap: 1rem;

    width: 40rem;
  }

  .form-group {
    @apply flex flex-col justify-center items-start;
  }

  .form-group.budget {
    justify-content: start;
  }

  .form-group-status {
    grid-column: 1/3;
    @apply grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }

  .project-name-input {
    @apply w-full px-4 py-3 h-8 ease-in-out duration-100 text-base dark:text-slate-900 placeholder-gray-500 dark:placeholder-slate-900 rounded-full rounded-2xl border border-gray-200 dark:border-none focus:outline-none focus:border-sky-400;
  }
</style>
