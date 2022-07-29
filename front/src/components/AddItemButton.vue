<script setup>
  const emit = defineEmits(["add-item"])
  const props = defineProps({
    canAdd: { type: Boolean, required: true },
    title: { type: String, required: true },
  })

  function emitClicked() {
    emit("add-item")
  }
</script>

<template>
  <button
    type="button-icon"
    class="group h-12 my-auto disabled:cursor-not-allowed"
    data-cy="topic-create-button"
    :title="props.title"
    :disabled="!props.canAdd"
    @click="emitClicked"
  >
    <svg
      class="button-icon-svg w-12 h-12 dark:bg-none rounded-full"
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        class="button-icon-path"
        d="M24 4C12.96 4 4 12.96 4 24C4 35.04 12.96 44 24 44C35.04 44 44 35.04 44 24C44 12.96 35.04 4 24 4ZM34 26H26V34H22V26H14V22H22V14H26V22H34V26Z"
        fill="#1A91FF"
      />
    </svg>
  </button>
</template>
