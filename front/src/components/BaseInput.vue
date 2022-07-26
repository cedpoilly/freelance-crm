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
      :id="props.label"
      :placeholder="props.label"
      v-bind="$attrs"
      :name="props.label"
      type="text"
      class="base-input-box"
      @input="$emit('input', $event)"
    />
  </label>
</template>

<style lang="scss" scoped>
  .base-input {
    @apply w-full grid content-center justify-items-stretch items-center;
  }

  .base-input-label {
    @apply w-full mb-2;
  }

  .base-input-box {
    @apply h-14 w-full px-4 py-1 rounded border;
  }
</style>
