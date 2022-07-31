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
    v-click-outside="() => close()"
    :class="{ active: isActive }"
    class="base-accordion select-none"
    data-borders="not-bottom"
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
    transition: all 1s linear;

    @apply overflow-hidden;
    @apply px-4 md:px-10 py-0;
    @apply bg-white dark:bg-slate-800;
  }

  .base-accordion[data-borders="all"] {
    @apply border;
  }

  .base-accordion[data-borders="sides"] {
    @apply border-x;
  }

  .base-accordion[data-borders="not-bottom"] {
    @apply border-x border-t border-b-0;
    @apply border dark:border dark:border-slate-700;
  }

  .base-accordion-top {
    @apply flex justify-start items-center;
    @apply w-full py-4;
    @apply bg-white dark:bg-slate-800;

    & * {
      @apply mr-4;
    }
  }

  .base-accordion-top.active {
    @apply border-b dark:border-slate-600;
  }

  .base-accordion-top__icon {
    @apply transition duration-200;
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
    @apply bg-white dark:bg-slate-800;

    @apply overflow-hidden;
  }
</style>
