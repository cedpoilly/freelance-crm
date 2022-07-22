<script setup>
import { nextTick, ref } from 'vue'

import Toolbar from '../components/Toolbar.vue'
import DataTable from '../components/DataTable.vue'

import useHelpers from "../app/helpers"
import ClientModal from "../components/ClientModal.vue"

const { searchStringInList } = useHelpers()

fetchData()

let initialData = []
const data = ref([])
const modal = ref(null)
const selectedClient = ref({})

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

  const filteredList = searchStringInList(initialData, searchString, { isObejectList: true })
  data.value = [...filteredList]
}

async function openModal(response) {
  const {mode, index} = response
  switch (mode) {
    case "view": {
      // alert("Open view modal! 😃")
      selectedClient.value = data.value[index]
      await nextTick()
      modal.value.open()
      break
    }

    case "edit": {
      // alert("Open edit modal! 🖊️")
      debugger
      selectedClient.value = data.value[index]
      await nextTick()
      modal.value.open()
      break
    }

    default: {
      console.log("Open modal mode is not recognised. 🤷‍♂️")
      break
    }
  }

}
</script>

<template>
  <div class="view-container">
    <Toolbar @search-input="filterData" @is-from-codementor="filter('is-from-codementor', $event)"
      @selected-tags="filter('tags', $event)" />

    <DataTable v-if="data.length" :data="data" @open-modal="openModal" />
    <h2 v-else class="text-xl px-auto mx-auto w-full text-center">
      No data to show at the moment.
    </h2>

    <ClientModal ref="modal" :client="selectedClient" title="View/Edit the client"  />
  </div>
</template>