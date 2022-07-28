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
  <label
    :for="props.fieldName"
    class="base-input base-toggle"
    @click="emitToggle"
  >
    <span class="base-input-label">{{ props.label }}</span>

    <div class="base-input-element base-toggle-cb-container">
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
  .base-toggle-cb-container {
    @apply flex justify-between items-center bg-white;
  }

  .base-toggle-cb {
    @apply w-5 h-5;
  }
</style>
