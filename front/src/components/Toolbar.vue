<script setup>
import { ref } from 'vue'
import BaseSelect from './BaseSelect.vue'
import BaseToggle from './BaseToggle.vue'
import BaseSearchInput from './BaseSearchInput.vue'

const emits = defineEmits(["search-input", "is-from-codementor", "selected-tags"])

const tagList = ["JavaScript", "HTML", "CSS", "Vue.js", "Front-End", "Back-end", "Node.js", "Express.js", "MongoDB", "Mongoose"]
const isCodeMentor = ref(false)

function search(event) {
  const searchString = event.target.value
  emits("search-input", searchString)
}

function toggleIsCodeMentorFilter() {
  isCodeMentor.value = !isCodeMentor.value
  emits("is-from-codementor", isCodeMentor.value)
}

function filterViaTags(options) {
  emits('selected-tags', options)
}
</script>

<template>
  <section class="toolbar">
    <h3 class="toolbar-title">Filter the table's data.</h3>

    <div class="filters">
      <form @submit.prevent class="filter">
        <BaseSearchInput label="Search" field-name="search" placeholder="Search any field" @input="search($event)" />
      </form>

      <form @submit.prevent class="filter">
        <BaseToggle label="Only from CodeMentor" field-name="isCodeMentor" :is-checked="isCodeMentor"
          @toggled="toggleIsCodeMentorFilter" />
      </form>

      <form @submit.prevent class="filter">
        <BaseSelect label="one or more tags." :list="tagList" :is-multi="true" @selected-tags="filterViaTags" />
      </form>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.toolbar {
  @apply w-11/12 mx-auto px-6 py-7 mt-5 flex flex-col rounded-md bg-gray-100
}

.toolbar-title {
  @apply mb-4 text-xl text-center font-bold
}

.filters {
  @apply grid justify-center content-center;
}

.filter {
  @apply flex justify-center
}

@media (min-width: 900px) {
  .filters {
    @apply w-auto mx-auto gap-3;
    grid-template-columns: repeat(2, minmax(100px, 1fr));
  }
}

@media (min-width: 1368px) {
  .filters {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
