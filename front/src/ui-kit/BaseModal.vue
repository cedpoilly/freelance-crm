<script setup>
  import { getCurrentInstance } from "vue"
  import useBaseModal, { config } from "./base-modal"
  import BaseButton from "./BaseButton.vue"
  import BaseCloseButton from "./BaseCloseButton.vue"

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
      <div class="modal" v-bind="$attrs">
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
            <BaseButton
              class="mr-4"
              variant="cancel"
              data-cy="modal-action-cancel"
              @click="cancel"
            >
              {{ props?.actions?.cancel?.label || "CANCEL" }}
            </BaseButton>

            <BaseButton
              variant="primary"
              :class="{ [props.actionsPushLeft]: !!props.actionsPushLeft }"
              data-cy="modal-action-confirm"
              class="button-text button-text--action"
              :disabled="props?.actions?.confirm?.isDisabled"
              @click="confirm"
            >
              {{ props?.actions?.confirm?.label || "OK" }}
            </BaseButton>
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
    @apply absolute top-0 left-0 z-20;
  }

  .modal {
    @apply overflow-hidden;

    @apply z-10 mx-auto;
    @apply grid;
    grid-template-rows: auto 1fr auto;

    @apply bg-slate-100 dark:bg-slate-900;

    @apply w-full max-w-[30rem];

    @media screen and (min-width: 30rem) {
      @apply rounded-xl;
    }

    @apply sm:left-0 sm:right-0;
    @apply px-6 py-6;

    @apply overflow-y-hidden grid;

    .modal-title {
      @apply overflow-hidden;

      @apply w-full flex justify-between items-center;
      @apply pb-6 md:pb-6 lg:pb-6 xl:pb-4;

      .modal-title-text {
        @apply overflow-hidden truncate;

        @apply w-full flex font-bold md:text-lg overflow-hidden;
        @apply flex-col justify-items-stretch;
        @apply md:flex-row;
        @apply mr-4;
      }
    }

    .modal-content {
      @apply w-full overflow-x-hidden overflow-y-auto;
      @apply grid;

      @apply whitespace-pre-wrap;
    }

    .modal-actions {
      @apply flex justify-end w-full;
      @apply pt-6 md:pt-6 lg:pt-6 xl:pt-4;
    }

    .modal-actions .button-text {
      @apply w-24 relative justify-self-start;
    }
  }

  .modal[data-size="full"] {
    @apply max-h-screen;
    @apply md:h-5/6 md:w-[40rem] lg:w-[50rem] xl:w-[60rem];
    @apply rounded-none md:rounded-xl;
  }

  .modal-overlay {
    @apply fixed bg-slate-600 w-full h-screen opacity-90;
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
