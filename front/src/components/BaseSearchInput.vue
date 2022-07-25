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
    @apply w-80 h-16 px-4 py-2 border rounded grid grid-cols-12 justify-between items-center bg-white;
  }

  .base-search-label {
    @apply mr-1 my-auto;
    grid-row: 1/1;
    grid-column: 1/4;
    z-index: 1;
  }

  .base-search-input {
    @apply pl-5 py-2 rounded-md;
    grid-row: 1/1;
    grid-column: 4/13;
  }
</style>
