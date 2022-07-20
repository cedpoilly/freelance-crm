<script setup>
const emits = defineEmits(["search-input"])
function search(event) {
  const searchString = event.target.value
  emits("search-input", searchString)
}
</script>

<template>
  <nav class="
  w-3/4 mx-auto px-6 py-7 mt-5
  rounded-md
  bg-gray-100 ">
    <form @submit.prevent>
      <label for="search">
        <span class="px-5">Search </span>
        <input type="text" name="search" class="px-5 py-2 rounded-md" @input="search($event)">
      </label>
    </form>
  </nav>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
