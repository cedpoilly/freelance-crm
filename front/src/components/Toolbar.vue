<script setup>
import { ref } from 'vue'

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

function updateTagList(event) {
  const selectedOptions = [...event.target.options]
    .filter((item) => !!item.selected)
    .map(item => item.value)
  emits('selected-tags', selectedOptions)
}
</script>

<template>
  <nav class="
  w-3/4 mx-auto px-6 py-7 mt-5
  flex
  rounded-md
  bg-gray-100 ">
    <form @submit.prevent>
      <label for="search">
        <span class="px-5">Search </span>
        <input type="text" name="search" class="px-5 py-2 rounded-md" @input="search($event)">
      </label>
    </form>

    <form @submit.prevent>
      <label for="isCodeMentor" class="px-5 py-2 rounded-md" @click="toggleIsCodeMentorFilter">
        <span>Only from CodeMentor </span>
        <input type="checkbox" name="isCodeMentor" :checked="isCodeMentor">
      </label>
    </form>

    <form @submit.prevent>
      <label for="tags" class="px-5 py-2 rounded-md" @click="filterTags">
        <span>Client's Tags </span>
        <select name="tage" id="tags" multiple @input="updateTagList">
          <option value="null">Select a tag</option>
          <option :value="tag" v-for="(tag, index) in tagList" :key="index">{{ tag }}</option>
        </select>
      </label>
    </form>
  </nav>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
