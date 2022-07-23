

<script setup>
import { getCurrentInstance } from 'vue'
import BaseCloseButton from './BaseCloseButton.vue'
import useBaseModal from './base-modal'
import { config } from './base-modal.js'

const props = defineProps(config);

const {
  canShow, isCancelled,
  open, close, cancelModal, cancelAndClose,
  uid, isAlert, isConfirm, actions
} = useBaseModal(getCurrentInstance())

function confirm() {
  isCancelled.value = false
  props.actions?.confirm?.function()
  close()
  return !isCancelled.value
}

function cancel() {
  props.actions?.cancel.function()
  close()
  cancelModal()
  return isCancelled.value
}

defineExpose({ open, close, cancelAndClose, isCancelled, uid, isAlert, isConfirm })
</script>

<template>
  <Transition name="appear">
    <div v-if="canShow" class="modal-container" tabindex="0" @keydown.esc="cancelAndClose">
      <div class="modal">
        <div class="modal-title">
          <h4 class="modal-title-text">
            <slot name="title"></slot>
          </h4>

          <BaseCloseButton :action="cancelAndClose" />
        </div>

        <div class="modal-content" :class="{ [props.width]: props.width }">
          <p v-if="isConfirm">
            <slot name="content"></slot>
          </p>

          <slot v-else name="content">
            <p>No content available. 🤷‍♂️</p>
          </slot>
        </div>

        <div class="modal-actions" :class="{ [props.width]: !!props.width }">
          <slot v-if="props.isAlert" name="actions">
            <button class="button-text button-text--action" :class="{ [props.width]: !!props.width }" @click="cancelAndClose">OK</button>
          </slot>

          <slot v-else-if="isConfirm" name="actions">
            <button class="button-text button-text--cancel" data-cy="modal-action-cancel"
              @click="cancel">CANCEL</button>

            <button class="button-text button-text--action" data-cy="modal-action-confirm" @click="confirm">OK</button>
          </slot>

          <slot v-else-if="actions || props.isDefaultActions" name="actions">
            <button class="button-text button-text--cancel mr-4" data-cy="modal-action-cancel" @click="cancel">{{
                props?.actions?.cancel?.label || 'CANCEL'
            }}</button>

            <button class="button-text button-text--action" :class="{ [props.actionsPushLeft]: !!props.actionsPushLeft }" data-cy="modal-action-confirm"
              :disabled="props?.actions?.confirm?.isDisabled" @click="confirm">{{ props?.actions?.confirm?.label || 'OK'
              }}</button>
          </slot>
        </div>
      </div>
      <div class="modal-overlay"></div>
    </div>
  </Transition>
</template>

<style lang="scss" scoped>
.modal-container {
  @apply text-black dark:text-white mx-auto fixed inset-0 flex items-center z-50;
}

.modal {
  @apply bg-slate-100 dark:bg-slate-900 flex flex-col items-center justify-between absolute left-4 right-4 z-10 sm:w-11/12 md:w-9/12 lg:w-8/12 xl:w-6/12 mx-auto px-10 py-8 rounded-md text-lg;
}

.modal-title {
  @apply w-full flex justify-between items-center;
}

.modal-title-text {
  @apply font-bold text-2xl self-center;
}

.modal-overlay {
  @apply bg-slate-600 relative w-full h-full opacity-90;
}

.modal-content {
  @apply relative h-full w-full py-9 flex flex-col justify-center items-center;
}

.modal-actions {
  @apply flex justify-end w-full;
}

.modal-actions .button-text {
  @apply w-24 dark:mr-4;
}

.appear-enter-active,
.appear-leave-active {
  transition: all 0.2s ease;
}

.appear-enter-from,
.appear-leave-to {
  opacity: 0;
  transform: scale(0.9, 0.9);
}
</style>