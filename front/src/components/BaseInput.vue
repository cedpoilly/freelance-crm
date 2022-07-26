<script setup>
  const props = defineProps({
    label: { type: String, required: true },
    fieldName: { type: String, required: true },
    initialValue: { type: String, required: false },
  })

  const emits = defineEmits(["input"])
</script>

<template>
  <span class="base-input-label"> {{ props.label }} </span>
  <label class="base-input" :for="props.fieldName">
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
    @apply w-80 h-16 px-4 py-2 border rounded grid content-center justify-between items-center bg-white;
  }

  .base-input-label {
    @apply mr-1 w-80;
    grid-row: 1/1;
    z-index: 1;
  }

  .base-input-box {
    @apply pl-5 py-1 w-72 rounded-md;
    grid-row: 2/2;
  }
</style>
