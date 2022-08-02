<script setup>
  const props = defineProps({
    label: { type: String, required: true },
    fieldName: { type: String, required: true },
    error: { type: String, required: false },
    isNoLabel: { type: Boolean, required: false },
    initialValue: { type: String, required: false },
  })

  const emits = defineEmits(["input"])
</script>

<template>
  <label class="base-input" :for="props.fieldName">
    <span
      v-if="!props.isNoLabel"
      v-bind="$attrs"
      :class="{ 'has-errors': props.error }"
      role="label"
      class="base-input-label"
    >
      {{ props.label }}
    </span>

    <input
      v-bind="$attrs"
      :id="props.label"
      :name="props.label"
      :placeholder="props.label"
      :class="{
        'base-input--primary': props.variant === 'primary',
        'base-input--secondary': props.variant === 'secondary',
        'base-input--cancel': props.variant === 'cancel',
        'base-input--default': props.variant === 'default' || !props.variant,
        'base-input--disabled': !!$attrs.disabled,
        'base-input--loading': !!props.isLoading,
        'has-errors': props.error,
      }"
      type="text"
      class="base-input-element"
      @input="$emit('input', $event)"
    />
    <span class="error" v-if="!props.isNoLabel">{{ props.error }}</span>
  </label>
</template>

<style lang="scss" scoped>
  .base-input {
    @apply w-full grid content-center justify-items-stretch items-center;
  }

  .base-input-element {
    @apply bg-white dark:bg-slate-900;
    @apply border-slate-400 dark:border-slate-400;
    @apply text-slate-900 dark:text-slate-100;
  }

  .base-input:focus,
  .base-input:focus-within,
  .base-input:active {
    @apply dark:text-slate-100;
  }

  .base-input .base-input-element:focus-visible,
  .base-input .base-input-element:focus-within,
  .base-input .base-input-element:focus,
  .base-input .base-input-element:active {
    @apply border-4 border-slate-500 dark:border-white outline-none;
  }

  // disable visual changes on disabled but activated input elements
  .base-input [disabled].base-input-element:active {
    @apply border border-slate-400 dark:border-slate-400;
  }

  .base-input[disabled] .base-input-element,
  .base-input[disabled] .base-input-label {
    @apply text-slate-900 dark:text-slate-400;
  }

  .base-input[disabled] .base-input-element {
    @apply cursor-not-allowed;
    @apply bg-slate-100 dark:bg-slate-800 dark:border-slate-500;
    @apply text-slate-900 dark:text-slate-400;
  }

  .base-input .base-input-label[error] {
    @apply text-sm text-red-500 h-10 mt-2;
  }

  .has-errors {
    @apply text-red-500;
  }

  .base-input-element.has-errors {
    @apply border-red-500;
  }

  .error {
    @apply text-sm text-red-500 h-auto mt-2;
  }
</style>
