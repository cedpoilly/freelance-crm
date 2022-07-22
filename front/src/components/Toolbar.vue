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
  <nav class="
  w-3/4 mx-auto px-6 py-7 mt-5
  flex
  rounded-md
  bg-gray-100 ">
    <form @submit.prevent class="mr-3">
      <BaseSearchInput label="Search" field-name="search" @input="search($event)" />
    </form>

    <form @submit.prevent class="mr-3">
      <BaseToggle label="Only from CodeMentor" field-name="isCodeMentor" :is-checked="isCodeMentor"
        @toggled="toggleIsCodeMentorFilter" />
    </form>

    <form @submit.prevent>
      <BaseSelect label="one or more tags." :list="tagList" :is-multi="true" @selected-tags="filterViaTags" />
    </form>
  </nav>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
