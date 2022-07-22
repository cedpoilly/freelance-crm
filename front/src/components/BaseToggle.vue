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
    <span class="base-toggle-label">{{ props.label }}</span>
    <input class="base-toggle-cb" type="checkbox" :id="props.label" :name="props.label" :checked="props.isChecked">
  </label>
</template>

<style lang="scss" scoped>
.base-toggle {
  @apply w-80 h-16 px-4 py-3 border rounded flex justify-between items-center bg-white
}

.base-toggle-label {
  @apply flex items-center
}

.base-toggle-cb {
  @apply block w-5 h-5 px-3
}
</style>