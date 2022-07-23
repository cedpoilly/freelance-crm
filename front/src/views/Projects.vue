<script setup>
import { onMounted, ref, toRaw } from 'vue'

import Toolbar from '../components/Toolbar.vue'
import DataTable from '../components/DataTable.vue'

import useHelpers from "../app/helpers"
import ProjectModal from "../components/ProjectModal.vue"

import { persistProject } from "../api/project"

const { searchStringInList } = useHelpers()

fetchData()

onMounted(() => {
  document.onkeydown = async (event) => {
    await saveOnCtrlS(event)
    await saveOnCtrlEnter(event)
    closeOnEscape(event)
    showHintsOnCtrlH(event)
  }
})

let initialData = []
const data = ref([])
const modal = ref(null)
const selectedProject = ref({})

async function fetchData() {
  const response = await fetch("http://localhost:3000/projects/")
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

async function saveOnCtrlS(event) {
  if (event.ctrlKey && event.key === 's') {
    event.preventDefault()
    await modal.value.close()
  }
}

async function saveOnCtrlEnter(event) {
  if (event.ctrlKey && event.key === 'Enter') {
    event.preventDefault()
    await modal.value.close()
  }
}

async function closeOnEscape(event) {
  if (event.key === 'Escape') {
    event.preventDefault()
    await modal.value.cancelAndClose()
  }
}

function showHintsOnCtrlH(event) {
  if (event.ctrlKey && event.key === 'h') {
    event.preventDefault()
    alert("Use [ctrl + s] or [ctrl + enter] to save the updates.")
  }
}

async function updateLocalData(index, project) {
  const hasNoProject = !project
  if (hasNoProject) { return }

  const strippedProject = stripProject(project)

  const response = await persistProject(strippedProject)
  const { acknowledged } = response
  if (!acknowledged) {
    alert("Project was not modified!")
    return
  }

  data.value[index] = project

  // * No need to ensure flow of events as it is the last action
  // * Hence we do not use the await here
  fetchData()
}

function stripProject(project) {
  project.client = { _id: project.client._id }
  return project
}

async function openModal(response) {
  const { mode, index } = response
  switch (mode) {
    case "view": {
      selectedProject.value = toRaw(data.value[index])
      const project = await modal.value.open()
      updateLocalData(index, project)
      break
    }

    case "edit": {
      selectedProject.value = toRaw(data.value[index])
      const project = await modal.value.open()
      updateLocalData(index, project)
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

    <ProjectModal ref="modal" :project="selectedProject" title="View/Edit the project" />
  </div>
</template>