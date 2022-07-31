<script setup>
  const props = defineProps({
    isIconButton: { type: Boolean, default: false },
    isLoading: { type: Boolean, default: false },
    variant: { type: String, default: "default" },
  })
</script>

<template>
  <button
    class="base-button"
    :class="{
      'base-button--text': !props.isIconButton,
      'base-button--primary': props.variant === 'primary',
      'base-button--secondary': props.variant === 'secondary',
      'base-button--cancel': props.variant === 'cancel',
      'base-button--default': props.variant === 'default' || !props.variant,
      'base-button--disabled': !!$attrs.disabled,
      'base-button--loading': !!props.isLoading,
    }"
    v-bind="$attrs"
    @click.stop="$emit('button-click', $event)"
  >
    <svg
      v-if="props.isLoading"
      class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      ></circle>
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
    <slot></slot>
  </button>
</template>

<style lang="scss" scoped>
  .base-button {
    @apply flex justify-center;
    @apply px-4 py-2;
    @apply rounded;
    @apply text-white dark:text-slate-100;
    @apply bg-slate-500 dark:bg-slate-500;

    &:focus {
      @apply outline-none;
      @apply ring ring-offset-4;
      @apply ring-offset-slate-100 dark:ring-offset-slate-700 ring-slate-500 dark:ring-slate-100;

      @apply bg-slate-500 dark:bg-slate-500;
    }
    &:hover {
      @apply bg-slate-500 dark:bg-slate-500;
    }

    &:active {
      @apply bg-slate-400 dark:bg-slate-400;
    }
  }

  .base-button.base-button--primary,
  .base-button.base-button--action {
    @apply bg-sky-700;

    // prevent unwanted highlight when disabled
    &:disabled:hover {
      @apply bg-sky-600;
    }

    &:focus {
      @apply bg-sky-500;
    }
    &:hover {
      @apply bg-sky-400;
    }
    &:active {
      @apply bg-sky-300;
    }
  }

  .base-button.base-button--secondary {
    @apply bg-orange-700;

    // prevent unwanted highlight when disabled
    &:disabled:hover {
      @apply bg-orange-700;
    }

    &:focus {
      @apply bg-orange-700;
    }
    &:hover {
      @apply bg-orange-700;
    }
    &:active {
      @apply bg-orange-600;
    }
  }

  .base-button.base-button--cancel {
    @apply bg-gray-700;

    // prevent unwanted highlight when disabled
    &:disabled:hover {
      @apply bg-gray-700;
    }

    &:focus {
      @apply bg-gray-600;
    }
    &:hover {
      @apply bg-gray-500;
    }
    &:active {
      @apply bg-gray-400;
    }
  }

  .base-button:disabled {
    @apply cursor-not-allowed;
    @apply opacity-70;
  }

  .button-icon {
    @apply rounded-full hover:bg-slate-200 dark:bg-slate-700 w-10 p-2;
  }

  .button-icon--with-emoji {
    @apply px-0;
  }

  .button-icon-svg {
    @apply w-6 h-6;
  }

  .button-icon-path {
    @apply dark:fill-sky-400 rounded-full fill-blue;
  }

  .button-icon-path--disabled {
    @apply fill-slate-500 dark:fill-slate-800;
  }

  .button-icon-path-red {
    @apply fill-red-400 /*can be changed later on*/ dark:fill-red-400;
  }
</style>
