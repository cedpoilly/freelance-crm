<script setup>
  import { ref } from "vue"
  import BaseSelect from "../ui-kit/BaseSelect.vue"
  import BaseToggle from "../ui-kit/BaseToggle.vue"
  import AddItemButton from "./AddItemButton.vue"
  import BaseInput from "../ui-kit/BaseInput.vue"

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
    <div class="filters">
      <form @submit.prevent class="filter">
        <BaseInput
          label="Search"
          name="search"
          ref="searchInput"
          field-name="search"
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
          :label="props.tagsLabel"
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
    @apply w-11/12 mx-auto my-0 p-0 mb-3 flex flex-col;
  }

  .filters {
    @apply w-full grid justify-start content-center items-center;
  }

  .filter {
    @apply flex justify-center w-full;
  }

  .create-new {
    @apply flex h-16 w-auto items-center justify-self-end self-end cursor-pointer;
  }

  .create-new-label {
    @apply flex items-center gap-0 px-3 py-2 cursor-pointer
    rounded-md
    hover:text-green-900 hover:bg-sky-100 active:bg-sky-200;
  }

  @media (min-width: 900px) {
    .filters {
      @apply w-full mx-auto gap-3;
      grid-template-columns: repeat(auto-fill, minmax(14rem, 1fr));
    }
  }

  @media (min-width: 1368px) {
    .filters {
      grid-template-columns: repeat(4, 1fr);
    }
  }
</style>
