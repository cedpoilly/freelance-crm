<script setup>
  const props = defineProps({
    label: { type: String, required: true },
    fieldName: { type: String, required: true },
    initialValue: { type: String, required: false },
  })

  const emits = defineEmits(["input"])
</script>

<template>
  <label class="base-input" :for="props.fieldName">
    <span role="label" class="base-input-label"> {{ props.label }} </span>
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
      }"
      type="text"
      class="base-input-element"
      @input="$emit('input', $event)"
    />
  </label>
</template>

<style lang="scss" scoped>
  .base-input {
    @apply w-full grid content-center justify-items-stretch items-center;
  }

  .base-input [disabled] {
    @apply cursor-not-allowed;
    @apply bg-slate-100;
  }
</style>
