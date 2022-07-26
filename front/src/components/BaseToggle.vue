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

    <div class="base-toggle-cb-container">
      <span>{{ props.isChecked ? "Yes" : "No" }}</span>
      <input
        class="base-toggle-cb"
        type="checkbox"
        :id="props.label"
        :name="props.label"
        :checked="props.isChecked"
      />
    </div>
  </label>
</template>

<style lang="scss" scoped>
  .base-toggle {
    @apply w-full;
  }

  .base-toggle-label {
    @apply flex items-center mb-2 inline-block;
  }

  .base-toggle-cb-container {
    @apply h-14 w-full px-4 py-2 flex justify-between items-center rounded border bg-white;
  }
  .base-toggle-cb {
    @apply block w-5 h-5 px-3;
  }
</style>
