<script setup>
const props = defineProps({
  label: { type: String, required: true },
  fieldName: { type: String, required: true },
  isChecked: { type: Boolean, required: true },
})

const emits = defineEmits(["toggled"])

function emitToggle() {
  emits("toggled", !props.isChecked)
}
</script>

<template>
  <label :for="props.fieldName" class="base-toggle" @click="emitToggle">
    <span>{{ props.label }}</span>
    <input type="checkbox" :id="props.label" :name="props.label" :checked="props.isChecked">
  </label>
</template>

<style lang="scss" scoped>
.base-toggle {
  @apply w-80 mx-2 px-4 py-3 mb-3 border rounded flex justify-between bg-white
}
</style>