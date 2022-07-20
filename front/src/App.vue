<script setup>
import { ref } from 'vue'

import Toolbar from './components/Toolbar.vue'
import DataTable from './components/DataTable.vue'

let initialData = []
const data = ref([])

async function fetchData() {
  const response = await fetch("http://localhost:3000/clients/")
  const dataFromServer = await response.json()
  data.value = [...dataFromServer]
  initialData = [...dataFromServer]
}

fetchData()

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
  <Toolbar @search-input="filterData" />

  <DataTable v-if="data.length" :data="data" />
  <h2 v-else class="text-xl px-auto mx-auto w-full text-center">
    No data to show at the moment.
  </h2>
</template>
