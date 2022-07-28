<script setup>
  import { getCurrentInstance } from "vue"
  import BaseCloseButton from "./BaseCloseButton.vue"
  import useBaseModal from "./base-modal"
  import { config } from "./base-modal.js"

  const props = defineProps(config)

  const {
    canShow,
    isCancelled,
    open,
    close,
    cancelModal,
    cancelAndClose,
    uid,
    isAlert,
    isConfirm,
    actions,
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

  defineExpose({
    open,
    close,
    cancelAndClose,
    isCancelled,
    uid,
    isAlert,
    isConfirm,
  })
</script>

<template>
  <Transition name="appear">
    <div
      v-if="canShow"
      class="modal-container"
      tabindex="0"
      @keydown.esc="cancelAndClose"
    >
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
            <button
              :class="{ [props.width]: !!props.width }"
              class="button-text button-text--action"
              @click="cancelAndClose"
            >
              OK
            </button>
          </slot>

          <slot v-else-if="isConfirm" name="actions">
            <button
              class="button-text button-text--cancel"
              data-cy="modal-action-cancel"
              @click="cancel"
            >
              CANCEL
            </button>

            <button
              class="button-text button-text--action"
              data-cy="modal-action-confirm"
              @click="confirm"
            >
              OK
            </button>
          </slot>

          <slot v-else-if="actions || props.isDefaultActions" name="actions">
            <button
              class="button-text button-text--cancel mr-4"
              data-cy="modal-action-cancel"
              @click="cancel"
            >
              {{ props?.actions?.cancel?.label || "CANCEL" }}
            </button>

            <button
              :class="{ [props.actionsPushLeft]: !!props.actionsPushLeft }"
              data-cy="modal-action-confirm"
              class="button-text button-text--action"
              :disabled="props?.actions?.confirm?.isDisabled"
              @click="confirm"
            >
              {{ props?.actions?.confirm?.label || "OK" }}
            </button>
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
    @apply fixed top-0 left-0 z-20 w-screen h-screen;
  }

  .modal {
    @apply absolute z-10 mx-auto;
    @apply flex flex-col items-center justify-between;
    @apply bg-slate-100 dark:bg-slate-900;

    @apply h-full px-7 py-7;
    @apply w-full sm:h-full sm:left-0 sm:right-0 sm:px-10 sm:py-8;
    @apply md:w-11/12 md:h-5/6 md:my-4 md:left-4 md:right-4 md:px-10 md:py-8 md:text-lg md:rounded-md;
    @apply lg:w-11/12;
    @apply xl:w-11/12;

    .modal-title {
      @apply w-full mb-5 flex justify-between items-center;

      .modal-title-text {
        @apply w-full flex font-bold md:text-lg;
        @apply flex-col justify-items-stretch;
        @apply md:flex-row;
        @apply mr-4;
      }
    }

    .modal-content {
      @apply relative h-full w-full;
      @apply flex flex-col justify-center items-center overflow-y-auto;
      @apply py-4 md:py-6 lg:py-6 xl:py-4;
      @apply whitespace-pre-wrap;
    }

    .modal-actions {
      @apply flex justify-end w-full mt-10;
    }

    .modal-actions .button-text {
      @apply w-24;
    }
  }

  .modal-overlay {
    @apply fixed  bg-slate-600 relative w-full h-full opacity-90;
  }

  .appear-enter-active,
  .appear-leave-active {
    transition: all 0.3s ease;
  }

  .appear-enter-from,
  .appear-leave-to {
    opacity: 0;
    transform: scale(0.9, 0.9);
  }
</style>
