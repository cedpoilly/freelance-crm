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
    @apply flex justify-between items-center;
  }

  .base-toggle-cb {
    @apply w-5 h-5;
  }

  .base-toggle {
    & .base-toggle-cb-container {
      @apply bg-white dark:bg-slate-900;
      @apply border-slate-400 dark:border-slate-400;
    }

    & .base-toggle-cb:checked::before {
      @apply bg-slate-100 dark:bg-red-900;
    }
  }

  .base-toggle-cb-container:focus-visible,
  .base-toggle-cb-container:focus-within,
  .base-toggle-cb-container:focus,
  .base-toggle-cb-container:active {
    @apply border-4 border-slate-500 dark:border-white outline-none;
  }

  .base-toggle[disabled] .base-input-element:active {
    @apply border border-slate-400 dark:border-slate-400;
  }

  .base-toggle[disabled] {
    @apply opacity-70 cursor-not-allowed;
    & .base-toggle-cb-container {
      @apply cursor-not-allowed;
      @apply bg-slate-100 dark:bg-slate-800 dark:border-slate-500;
    }
  }
</style>
