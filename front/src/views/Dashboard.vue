<script setup>
import { ref } from 'vue'

import Toolbar from '../components/Toolbar.vue'
import DataTable from '../components/DataTable.vue'

fetchData()

let initialData = []
const data = ref([])

async function fetchData() {
  const response = await fetch("http://localhost:3000/clients/")
  const dataFromServer = await response.json()
  data.value = [...dataFromServer]
  initialData = [...dataFromServer]
}

function filter(field, value) {
  switch (field) {
    case "is-from-codementor": {
      if (!value) { return data.value = initialData }

      data.value = initialData.filter(item => item.isCodementor === value)
      break
    }

    case "tags": {
      if (!value || !value.length) { return data.value = initialData }

      const filteredData = initialData
        .filter(item => value.every(tag => !!item.tags.includes(tag)))

      data.value = filteredData || initialData
      break
    }

    default: {
      data.value = initialData
      break
    }
  }
}

function filterData(searchString) {
  const noSearchString = !searchString
  if (noSearchString) {
    data.value = initialData
    return
  }

  const filteredList = [...initialData].filter(item => {
    const values = Object.values(item)

    return !!values.some(value => !!value.includes &&
      !!value.toLowerCase &&
      value.toLowerCase().includes(searchString.toLowerCase())
    )
  })

  data.value = [...filteredList]
}
</script>

<template>
  <div class="view-container">
    <Toolbar @search-input="filterData" @is-from-codementor="filter('is-from-codementor', $event)"
      @selected-tags="filter('tags', $event)" />

    <DataTable v-if="data.length" :data="data" />
    <h2 v-else class="text-xl px-auto mx-auto w-full text-center">
      No data to show at the moment.
    </h2>
  </div>
</template>