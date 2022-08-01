<script setup>
  import { nextTick, ref, watch } from "vue"

  const emits = defineEmits(["selected-tags"])

  const props = defineProps({
    title: { type: String, required: true },
  })

  const externalClasses = ref([])

  const isActive = ref(false)

  // * template refs
  const root = ref(null)
  const contentRef = ref(null)

  watch(
    () => root.value,
    element =>
      removeExternalClasslistFromElement(element, externalClasses.value)
  )

  async function removeExternalClasslistFromElement(element, classes) {
    const classListString = classes
    if (!classListString) {
      return
    }

    await nextTick()

    classes = classListString.split(" ")
    classes.forEach(className => element.classList.remove(className))
  }

  async function toggleActive() {
    isActive.value = !isActive.value

    removeExternalClasslistFromElement(root.value, externalClasses.value)
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
    ref="root"
    :data-clear="(externalClasses = $attrs.class)"
    class="base-accordion select-none"
    :class="{ active: isActive }"
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
    @apply w-full mx-0 py-0 px-4 md:px-10;

    @apply bg-white dark:bg-slate-800;
  }

  .base-accordion[data-borders="all"] {
    @apply border;
  }

  .base-accordion[data-borders="none"] {
    @apply border-none;
  }

  .base-accordion[data-borders="sides"] {
    @apply border-x;
  }

  .base-accordion[data-borders="not-bottom"] {
    @apply border-x border-t border-b-0;
    @apply border dark:border dark:border-slate-700;
  }

  .base-accordion[data-header="color"] {
    @apply bg-slate-200 dark:bg-gray-700;
  }

  .base-accordion-top {
    @apply flex justify-start items-center;
    @apply w-full py-4 md:py-8;

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

    @apply overflow-hidden;
  }
</style>
