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
    class="base-input base-toggle select-none"
    @click="emitToggle"
  >
    <span class="base-input-label select-none">{{ props.label }}</span>

    <div v-bind="$attrs" class="base-input-element base-toggle-cb-container">
      <span>{{ props.isChecked ? "Yes" : "No" }}</span>
      <input
        v-bind="$attrs"
        :id="props.label"
        :name="props.label"
        :checked="props.isChecked"
        class="base-toggle-cb"
        type="checkbox"
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

  .base-toggle[disabled] {
    @apply opacity-70 cursor-not-allowed;
    & .base-toggle-cb-container {
      @apply cursor-not-allowed;
      @apply bg-slate-100;
    }
  }
</style>
