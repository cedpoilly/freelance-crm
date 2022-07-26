<script setup>
  import { ref } from "vue"
  import BaseSelect from "./BaseSelect.vue"
  import BaseToggle from "./BaseToggle.vue"
  import BaseSearchInput from "./BaseSearchInput.vue"
  import AddItemButton from "./AddItemButton.vue"

  const emits = defineEmits([
    "search-input",
    "is-from-codementor",
    "selected-tags",
    "create-new",
  ])

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
    <h3 class="toolbar-title">Filter the table's data.</h3>

    <div class="filters">
      <form @submit.prevent class="filter">
        <BaseSearchInput
          label="Search"
          name="search"
          ref="searchInput"
          field-name="search"
          placeholder="Search any field"
          @input="search($event)"
        />
      </form>

      <form @submit.prevent class="filter">
        <BaseToggle
          label="Only from CodeMentor"
          field-name="isCodeMentor"
          :is-checked="isCodeMentor"
          @toggled="toggleIsCodeMentorFilter"
        />
      </form>

      <form @submit.prevent class="filter">
        <BaseSelect
          label="one or more tags."
          blank-option-label="Select one or more tags."
          name="tags"
          :list="tagList"
          :is-multi="true"
          @selected-tags="filterViaTags"
        />
      </form>

      <div class="create-new">
        <label class="create-new-label">
          <AddItemButton
            :can-add="true"
            title="Create a new client!"
            @add-item="emitOpenModal"
          />
          <span class="label px-3">Create new </span>
        </label>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
  .toolbar {
    @apply w-11/12 mx-auto px-6 py-7 mt-5 flex flex-col rounded-md;
  }

  .toolbar-title {
    @apply mb-4 text-xl text-center font-bold;
  }

  .filters {
    @apply grid justify-center content-center items-center;
  }

  .filter {
    @apply flex justify-center w-80;
  }

  .create-new {
    @apply flex h-16 w-80 items-center justify-self-end self-end cursor-pointer;
  }

  .create-new-label {
    @apply flex items-center gap-3 px-3 py-2 cursor-pointer
    rounded-md
    hover:text-green-900 hover:bg-sky-100 active:bg-sky-200;
  }

  @media (min-width: 900px) {
    .filters {
      @apply w-auto mx-auto gap-3;
      grid-template-columns: repeat(3, minmax(100px, 1fr));
    }
  }

  @media (min-width: 1368px) {
    .filters {
      grid-template-columns: repeat(4, 1fr);
    }
  }
</style>
