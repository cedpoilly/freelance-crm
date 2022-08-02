<script setup>
  import { ref } from "vue"
  import BaseButton from "../ui-kit/BaseButton.vue"
  import BaseInput from "../ui-kit/BaseInput.vue"
  import BaseToggle from "../ui-kit/BaseToggle.vue"

  const emits = defineEmits([
    "search-input",
    "is-from-codementor",
    "selected-tags",
    "create-new",
  ])

  const props = defineProps({
    tagsLabel: { type: String, required: true },
  })

  defineExpose({ focusSearch })

  const searchInput = ref(null)

  const tagList = [
    "JavaScript",
    "HTML",
    "CSS",
    "Vue.js",
    "Front-End",
    "Back-end",
    "Node.js",
    "Express.js",
    "MongoDB",
    "Mongoose",
  ]

  const isSearching = ref(false)

  function toggleIsSearching() {
    isSearching.value = !isSearching.value
  }

  const isCodeMentor = ref(false)

  function focusSearch() {
    searchInput.value.focus()
  }

  function search(event) {
    const searchString = event.target.value
    emits("search-input", searchString)
  }

  function toggleIsCodeMentorFilter() {
    isCodeMentor.value = !isCodeMentor.value
    emits("is-from-codementor", isCodeMentor.value)
  }

  function filterViaTags(options) {
    emits("selected-tags", options)
  }

  function emitOpenModal() {
    emits("create-new")
  }
</script>

<template>
  <section class="toolbar">
    <BaseButton
      icon="filter"
      class="!w-10 md:!w-12 !h-10 md:!h-12"
      @click="toggleIsSearching"
    >
      <svg xmlns="http://www.w3.org/2000/svg" height="20" width="20">
        <path
          d="M9.208 15Q8.854 15 8.594 14.74Q8.333 14.479 8.333 14.125Q8.333 13.771 8.594 13.51Q8.854 13.25 9.208 13.25H10.792Q11.146 13.25 11.406 13.51Q11.667 13.771 11.667 14.125Q11.667 14.479 11.406 14.74Q11.146 15 10.792 15ZM3.375 6.75Q3.021 6.75 2.76 6.49Q2.5 6.229 2.5 5.875Q2.5 5.521 2.76 5.26Q3.021 5 3.375 5H16.625Q16.979 5 17.24 5.26Q17.5 5.521 17.5 5.875Q17.5 6.229 17.24 6.49Q16.979 6.75 16.625 6.75ZM5.875 10.875Q5.521 10.875 5.26 10.615Q5 10.354 5 10Q5 9.646 5.26 9.385Q5.521 9.125 5.875 9.125H14.146Q14.5 9.125 14.76 9.385Q15.021 9.646 15.021 10Q15.021 10.354 14.76 10.615Q14.5 10.875 14.146 10.875Z"
        />
      </svg>
    </BaseButton>

    <BaseInput
      v-if="isSearching"
      :is-no-label="true"
      label="Search"
      name="search"
      ref="searchInput"
      field-name="search"
      @input="search($event)"
    />

    <BaseToggle
      v-if="!isSearching"
      :is-no-label="true"
      label="CodeMentor only"
      field-name="isCodeMentor"
      :is-checked="isCodeMentor"
      @toggled="toggleIsCodeMentorFilter"
    />

    <BaseButton
      icon="filter"
      class="!w-10 md:!w-12 !h-10 md:!h-12"
      title="Create"
      @click="emitOpenModal"
    >
      <svg xmlns="http://www.w3.org/2000/svg" height="20" width="20">
        <path
          d="M10 15.833Q9.646 15.833 9.385 15.573Q9.125 15.312 9.125 14.958V10.875H5.042Q4.688 10.875 4.427 10.615Q4.167 10.354 4.167 10Q4.167 9.646 4.427 9.385Q4.688 9.125 5.042 9.125H9.125V5.042Q9.125 4.688 9.385 4.427Q9.646 4.167 10 4.167Q10.354 4.167 10.615 4.427Q10.875 4.688 10.875 5.042V9.125H14.958Q15.312 9.125 15.573 9.385Q15.833 9.646 15.833 10Q15.833 10.354 15.573 10.615Q15.312 10.875 14.958 10.875H10.875V14.958Q10.875 15.312 10.615 15.573Q10.354 15.833 10 15.833Z"
        />
      </svg>
    </BaseButton>
  </section>
</template>

<style lang="scss" scoped>
  .toolbar {
    @apply w-full md:w-11/12 mx-auto my-0 p-8;
    @apply grid grid-flow-col items-center;
    grid-template-columns: auto 1fr;
    column-gap: 1rem;
    @apply columns-4 px-4 md:px-8 py-4 md:py-8 h-20 md:h-40;
    @apply bg-slate-100 dark:bg-slate-800;
  }

  .filters {
    @apply w-full grid justify-start content-center items-center;
    @apply py-5 md:pt-7 md:pb-10;
    grid-template-columns: repeat(auto-fill, minmax(12rem, 1fr));
    gap: 1rem;
    @apply border-b border-slate-700;
  }

  .filter {
    @apply flex justify-center w-full;
  }

  .create-new {
    @apply flex h-auto items-center justify-self-start  w-auto cursor-pointer;
  }

  @media (min-width: 900px) {
    .filters {
      @apply w-full mx-auto gap-6;
      grid-template-columns: repeat(auto-fill, minmax(14rem, 1fr));
    }
  }

  @media (min-width: 1368px) {
    .filters {
      @apply gap-8;

      grid-template-columns: repeat(4, 1fr);
    }
  }
</style>
