<script setup>
  import { ref } from "vue"

  const props = defineProps({
    label: { type: String, required: true },
    fieldName: { type: String, required: true },
    initialValue: { type: String, required: false },
  })

  const emits = defineEmits(["input"])

  const input = ref()
  function focus() {
    input.value.focus()
  }

  defineExpose({ focus })

  function search(searchString) {
    emits("input", searchString)
  }
</script>

<template>
  <label class="base-search" :for="props.fieldName">
    <span class="base-search-label">Search </span>
    <input
      :id="props.label"
      :name="props.label"
      ref="input"
      type="text"
      class="base-search-input"
      @input="search($event)"
    />
  </label>
</template>

<style lang="scss" scoped>
  .base-search {
    @apply w-full flex flex-col justify-between items-start;
  }

  .base-search-label {
    @apply my-auto mb-0 ml-4;
  }

  .base-search-input {
    @apply w-full border rounded h-14 px-4 py-2;
    grid-row: 1/1;
    grid-column: 4/13;
  }
</style>
