<script setup>
  import { ref } from "vue"
  import BaseAccordion from "../ui-kit/BaseAccordion.vue"
  import BaseButton from "../ui-kit/BaseButton.vue"
  import BaseInput from "../ui-kit/BaseInput.vue"
  import BaseSelect from "../ui-kit/BaseSelect.vue"
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
    <BaseAccordion title="Show/hide filters">
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
            field-name="tags"
            :options="tagList"
            :is-multi="true"
            @selected-tags="filterViaTags"
          />
        </form>

        <BaseButton
          title="Create a new client!"
          class="create-new"
          @click="emitOpenModal"
          >Create</BaseButton
        >
      </div>
    </BaseAccordion>
  </section>
</template>

<style lang="scss" scoped>
  .toolbar {
    @apply w-full md:w-11/12 mx-auto;
    @apply my-0 p-0 flex flex-col;
  }

  .filters {
    @apply w-full grid justify-start content-center items-center;
    @apply py-5 md:pt-7 md:pb-10;
    grid-template-columns: repeat(auto-fill, minmax(12rem, 1fr));
    gap: 1rem;
  }

  .filter {
    @apply flex justify-center w-full;
  }

  .create-new {
    @apply flex h-auto items-center justify-self-start self-end w-auto cursor-pointer;
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
