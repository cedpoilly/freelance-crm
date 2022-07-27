<script setup>
  import { nextTick, ref, watch } from "vue"
  import { computed } from "@vue/reactivity"
  import useHelpers from "../app/helpers"

  const { searchStringInList } = useHelpers()

  const emits = defineEmits(["selected-tags"])

  const props = defineProps({
    name: { type: String, required: true },
    label: { type: String, required: true },
    blankOptionLabel: { type: String, required: true },
    list: { type: Array, required: true },
    initialSelection: { type: [Array, String, Object], required: false },
    isMulti: { type: Boolean, default: false },
  })

  const isActive = ref(false)
  const shouldDropUp = ref(false)

  const data = ref([])
  const selected = ref(null)
  const selectedList = ref([])

  // * template ref
  const contentRef = ref(null)
  const triggerRef = ref(null)

  // * Slightly shorter than the actual height of the content
  // * This is so that some margin is kept: if there is only little
  // * space for the `content` section to be displayed below the `select-trigger`
  // * we want the content to "drop up" for comfort.
  const CONTENT_DROPUP_PIXEL_THRESHOLD = 300

  const showLabel = computed(() => {
    const isSingleBlank = !props.isMulti && !selected.value
    const isMultiAndBlank = props.isMulti && !selectedList.value.length
    return isSingleBlank || isMultiAndBlank
  })

  const isNotEmpty = computed(() => {
    return selected.value || selectedList.value.length
  })

  watch(
    () => props.list,
    newValue => {
      data.value = newValue
    },
    { immediate: true }
  )

  watch(
    () => props.initialSelection,
    newValue => {
      if (props.isMulti) {
        selectedList.value = newValue || selectedList.value
        return
      }

      selected.value = newValue || selected.value
    },
    { immediate: true }
  )

  async function toggleActive() {
    isActive.value = !isActive.value

    // * When closing the content section, the search string is emptied
    // * but the data is still filtered as per last search
    // * hence we have the reset the data when we close the content section.
    const isInactive = !isActive.value
    if (isInactive) {
      data.value = props.list
    }

    if (isActive.value) {
      await handleDropDirection()
      await scrollIntoContent()
    }
  }

  async function handleDropDirection() {
    await nextTick()

    const thisDown = triggerRef.value.getBoundingClientRect().bottom
    const windowDown = window.document.body.getBoundingClientRect().bottom

    const isCrossing = thisDown > windowDown
    const isTooClose = windowDown - thisDown < CONTENT_DROPUP_PIXEL_THRESHOLD

    const hasNoSpace = isCrossing || isTooClose

    shouldDropUp.value = hasNoSpace
  }

  async function scrollIntoContent() {
    await nextTick()
    contentRef.value.focus()
    contentRef.value.scrollIntoView({
      behavior: "smooth",
      block: "center",
    })
  }

  function selectOption(option) {
    const isMultiSelect = props.isMulti
    if (isMultiSelect) {
      toggleInSelectedList(option)
      emits("selected-tags", selectedList.value)
      return
    }

    toggleActive()
    selected.value = option
    emits("selected-tags", selected.value)
  }

  function clearSelection() {
    selected.value = null
    selectedList.value = []
  }

  function toggleViaKeyboard(event) {
    const keyCode = event?.code?.toLowerCase()

    const isNotEnterNorSpace = !["enter", "space"].includes(keyCode)
    if (isNotEnterNorSpace) {
      return
    }

    toggleActive()
  }

  function toggleOptionViaKeyboard(event, option) {
    event.preventDefault()
    event.stopPropagation()
    const isNotEnterNorSpace = !["enter", "space"].includes(
      event.code.toLowerCase()
    )
    if (isNotEnterNorSpace) {
      return
    }
    selectOption(option)
  }

  function preventSpacebarScroll(event) {
    if (event.keyCode === 32) {
      event.preventDefault()
    }
  }

  function searchItem(event) {
    const searchString = event.target.value

    const hasNoSearchString = !searchString
    if (hasNoSearchString) {
      return (data.value = props.list)
    }

    const fitleredList = searchStringInList(props.list, searchString, {
      isObejectList: false,
    })
    return (data.value = [...fitleredList])
  }

  function isInSelectedList(item) {
    return selectedList.value.find(listItem => listItem === item)
  }

  function close() {
    isActive.value = false
  }

  // * component helpers

  function toggleInSelectedList(option) {
    const isAlreadyInList = isInSelectedList(option)
    if (isAlreadyInList) {
      const listWithoutOption = selectedList.value.filter(
        listItem => listItem !== option
      )
      return (selectedList.value = listWithoutOption)
    }

    selectedList.value = getUniqueStrings([...selectedList.value, option])
  }

  // * generic helpers

  function getUniqueStrings(listOfStrings) {
    return [...new Set(listOfStrings)]
  }

  function formatListoString(list, joinString) {
    return list.join(joinString)
  }

  function selectPropertyOrItem(element) {
    return element.title || element.firstName
      ? `${element.firstName} ${element.lastName}`
      : "" || element
  }

  function captitalise(string) {
    const [first, ...rest] = string.split("")
    return `${first.toUpperCase()}${rest.join("")}`
  }
</script>

<template>
  <div
    :name="props.name"
    class="select"
    tabindex="1"
    v-click-outside="() => close()"
    @keyup="toggleViaKeyboard"
  >
    <label class="base-select-label" :for="props.name">{{ props.label }}</label>
    <div
      :class="{ active: isActive }"
      class="select-trigger"
      ref="triggerRef"
      tabindex="0"
      @click="toggleActive"
    >
      <span class="truncate" v-if="showLabel">
        {{ props.blankOptionLabel }}
      </span>
      <span class="multi-selected" v-else-if="props.isMulti">
        {{ formatListoString(selectedList, ", ") }}
      </span>
      <span class="px-1" v-else>
        {{ captitalise(selectPropertyOrItem(selected)) }}
      </span>
      <div class="icons-wrapper px-1">
        <span
          v-if="isNotEmpty"
          class="select-trigger__icon--clear"
          @click="clearSelection"
          >❌</span
        >
        <span class="select-trigger__icon">🔻</span>
      </div>
    </div>

    <div
      v-show="isActive"
      class="content"
      ref="contentRef"
      :class="{ 'content--drop-up': shouldDropUp }"
      tabindex="0"
    >
      <label class="search-label" for="search">
        <input
          type="text"
          id="search"
          name="search"
          placeholder="Search"
          class="search-box"
          @input="searchItem"
        />
      </label>

      <ul class="options">
        <li
          class="option"
          tabindex="0"
          v-for="(option, index) in data"
          :key="index"
          @click="selectOption(option)"
          @keydown="preventSpacebarScroll"
          @keyup.stop.prevent="toggleOptionViaKeyboard($event, option)"
        >
          {{ captitalise(selectPropertyOrItem(option)) }}
          <span v-if="props.isMulti && isInSelectedList(option)">✔️</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .select {
    @apply w-full items-stretch;
    // * When position is `relative`, the `content` of the dropdown
    // * will STAY on the document flow. Hence the
    // * `dropUp` feature will NOT be triggered.
    @apply relative;
  }

  .select-trigger {
    @apply w-full h-14 px-4 py-2 border rounded flex justify-between items-center bg-white;
  }

  .select-trigger__icon {
    @apply transition duration-300;
  }

  .select-trigger__icon--clear {
    justify-self: flex-end !important;
    font-size: 10px !important;
  }

  .select-trigger__icon {
    display: inline-block;
  }

  .select-trigger.active .select-trigger__icon {
    transform: rotate(180deg);
  }

  .base-select-label {
    @apply block w-full mb-2;
  }

  .multi-selected {
    white-space: nowrap;
    word-break: break-word;
    text-overflow: ellipsis;
    overflow: hidden;
    width: 12rem;
  }

  .content {
    @apply absolute w-full px-4 py-4 mt-3;
    @apply max-h-[15rem] h-60;
    @apply bg-white border z-10 drop-shadow-xl;

    // * specific to the `dropUp` feature
    @apply top-24 bottom-0;
  }

  .content--drop-up {
    // * Estimate margin required between the bottom of the `content` section
    // * and the top of the `base-select-label`
    // * `+ 2rem` for additional margin.
    bottom: calc(3.5rem * 2 + 2rem);
  }

  .search-label {
    @apply w-full relative block h-12;
  }

  .search-box {
    @apply w-full border px-4 py-2 mb-2 rounded-md;
  }

  .options {
    @apply overflow-y-auto;
    max-height: 10rem;

    &::-webkit-scrollbar {
      @apply w-10;
      width: 0.4rem;
    }

    &::-webkit-scrollbar-track {
      background-color: #f1f1f1;
      border-radius: 2rem;
    }

    &::-webkit-scrollbar-thumb {
      background-color: #ccc;
      border-radius: 2rem;
    }
  }

  .option {
    @apply h-10 px-3 py-2 my-2 rounded-md flex justify-between;
    @apply hover:bg-gray-100;
  }
</style>
