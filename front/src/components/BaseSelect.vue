<script setup>
import { ref, watch } from 'vue'
import { computed } from '@vue/reactivity'
import useHelpers from '../app/helpers'

const { searchStringInList } = useHelpers()

const emits = defineEmits(["selected-tags"])

const props = defineProps({
  label: { type: String, required: true },
  list: { type: Array, required: true },
  isMulti: { type: Boolean, default: false },
})

const isActive = ref(false)

const data = ref([])
const selected = ref(null)
const selectedList = ref([])

const showLabel = computed(() => {
  const isSingleBlank = !props.isMulti && !selected.value
  const isMultiAndBlank = props.isMulti && !selectedList.value.length
  return isSingleBlank || isMultiAndBlank
})

const isNotEmpty = computed(() => {
  return selected.value || selectedList.value.length
})

watch(() => props.list, (newValue) => {
  data.value = newValue
}, { immediate: true })


watch(() => isActive.value, (newValue) => {
  console.log(newValue)
}, { immediate: true })

function toggleActive() {
  isActive.value = !isActive.value

  // * When closing the content section, the search string is emptied
  // * but the data is still filtered as per last search
  // * hence we have the reset the data when we close the content section.
  const isInactive = !isActive.value
  if (isInactive) { data.value = props.list }
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

function searchItem(event) {
  const searchString = event.target.value

  const hasNoSearchString = !searchString
  if (hasNoSearchString) {
    return data.value = props.list
  }

  const fitleredList = searchStringInList(props.list, searchString, { isObejectList: false })
  return data.value = [...fitleredList]
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
    const listWithoutOption = selectedList.value.filter(listItem => listItem !== option)
    return selectedList.value = listWithoutOption
  }

  selectedList.value = getUniqueStrings([...selectedList.value, option])
}

// * generic helpers

function getUniqueStrings(listOfStrings) {
  return [... new Set(listOfStrings)]
}

function formatListoString(list, joinString) {
  return list.join(joinString)
}
</script>

<template>
  <div class="select" v-click-outside="() => close()">
    <div :class="{ 'active': isActive }" class="select-trigger" @click="toggleActive">
      <span class="px-1" v-if="showLabel">Select {{ label }}</span>
      <span class="px-1" v-else-if="props.isMulti">{{ formatListoString(selectedList, ", ") }}</span>
      <span class="px-1" v-else>{{ selected }}</span>
      <div class="icons-wrapper px-1">
        <span v-if="isNotEmpty" class="select-trigger__icon--clear" @click="clearSelection">❌</span>
        <span class="select-trigger__icon">🔻</span>
      </div>
    </div>

    <div v-if="isActive" class="content">
      <div class="search">
        <label for="search">
          <input type="text" id="search" name="search" placeholder="Search" class="search-box" @input="searchItem" />
        </label>
      </div>

      <ul class="options">
        <li class="option" v-for="(option, index) in data" :key="index" @click="selectOption(option)">
          {{ option }}
          <span v-if="props.isMulti && isInSelectedList(option)">✔️</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="scss">
.select {
  @apply w-80 px-3 items-stretch;
}

.select-trigger {
  @apply w-80 mx-2 px-4 py-3 mb-3 border rounded flex justify-between bg-white
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
  transform: rotate(180deg)
}

.content {
  @apply w-80 px-3 py-3 bg-white border;
  position: absolute;
  z-index: 10;
}

.search-box {
  @apply w-full border px-3 py-2 mb-2 rounded-md
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
  @apply h-10 px-3 py-2 my-2 rounded-md flex justify-between
}
</style>

