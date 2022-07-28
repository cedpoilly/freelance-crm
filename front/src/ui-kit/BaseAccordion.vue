<script setup>
  import { ref } from "vue"

  const emits = defineEmits(["selected-tags"])

  const props = defineProps({
    title: { type: String, required: true },
  })

  const isActive = ref(false)
  // * template ref
  const contentRef = ref(null)

  async function toggleActive() {
    isActive.value = !isActive.value
  }

  function toggleViaKeyboard(event) {
    const keyCode = event?.code?.toLowerCase()

    const isNotEnterNorSpace = !["enter", "space"].includes(keyCode)
    if (isNotEnterNorSpace) {
      return
    }

    toggleActive()
  }

  function close() {
    isActive.value = false
  }
</script>

<template>
  <div
    class="base-accordion"
    :class="{ active: isActive }"
    v-click-outside="() => close()"
  >
    <label
      class="base-accordion-top"
      :class="{ active: isActive }"
      for="accordion"
      tabindex="0"
      @keyup.stop="toggleViaKeyboard"
      @click.stop="toggleActive"
    >
      <span>{{ props.title }}</span>
      <span class="base-accordion-top__icon">🔻</span>
    </label>

    <div
      v-show="isActive"
      id="accordion"
      class="base-accordion-content"
      :class="{ active: isActive }"
      ref="contentRef"
    >
      <slot></slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .base-accordion {
    @apply overflow-hidden;
  }

  .base-accordion-top {
    @apply w-full  px-4 py-2;
    @apply flex justify-between items-center;
    @apply h-12 md:h-14;
    @apply border rounded;
    @apply bg-white;
  }

  .base-accordion-top__icon {
    @apply transition duration-500;
  }

  .base-accordion-top__icon--clear {
    justify-self: flex-end !important;
    font-size: 10px !important;
  }

  .base-accordion-top__icon {
    display: inline-block;
  }

  .base-accordion-top.active .base-accordion-top__icon {
    transform: rotate(180deg);
  }

  .base-accordion-content {
    @apply flex justify-center items-center;
    @apply w-[97%] mx-auto;
    @apply bg-neutral-50;

    @apply overflow-hidden;

    @apply px-4 py-4;
    @apply lg:px-4 lg:py-4;
  }
</style>
