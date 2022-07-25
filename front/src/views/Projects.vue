<script setup>
import { onMounted, ref } from "vue"
import { useRoute } from "vue-router"
import { computed } from "@vue/reactivity"

import Toolbar from "../components/Toolbar.vue"
import DataTable from "../components/DataTable.vue"

import useHelpers from "../app/helpers"
import ProjectModal from "../components/ProjectModal.vue"

import {
  getProjects,
  getProjectsByClientId,
  persistProject,
} from "../api/project"

const route = useRoute()

const { searchStringInList, getCopy, ctrlPlus } = useHelpers()

const emits = defineEmits(["focus-navbar"])

let initialData = []
const data = ref([])
const currentClient = ref(null)
const modal = ref(null)
const toolbar = ref(null)
const dataTable = ref(null)
const selectedProject = ref({})

const hasCurrentClient = computed(() => !!currentClient.value?.firstName)

fetchData()

onMounted(() => {
  document.onkeydown = async event => {
    await saveOnCtrlS(event)
    await saveOnCtrlEnter(event)
    closeOnEscape(event)

    ctrlPlus(event, "F", focusSearch)
    ctrlPlus(event, "L", focusNavbar)
    ctrlPlus(event, "H", focusDataTable)
  }
})

async function fetchData() {
  const clientId = route.params.clientId

  const call = clientId ? getProjectsByClientId(clientId) : getProjects()

  const response = await call

  const dataFromServer = await response.json()

  data.value = [...dataFromServer]
  initialData = [...dataFromServer]
}

async function fetchClient(clientId) {
  const response = await fetch(`/clients/${clientId}`)
  return await response.json()
}

function filter(field, value) {
  switch (field) {
    case "is-from-codementor": {
      if (!value) {
        return (data.value = initialData)
      }

      data.value = initialData.filter(item => item.isCodementor === value)
      break
    }

    case "tags": {
      if (!value || !value.length) {
        return (data.value = initialData)
      }

      const filteredData = initialData.filter(item =>
        value.every(tag => !!item.tags.includes(tag))
      )

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

  const filteredList = searchStringInList(initialData, searchString, {
    isObejectList: true,
  })
  data.value = [...filteredList]
}

async function saveOnCtrlS(event) {
  if (event.ctrlKey && event.key === "s") {
    event.preventDefault()
    await modal.value.close()
  }
}

async function saveOnCtrlEnter(event) {
  if (event.ctrlKey && event.key === "Enter") {
    event.preventDefault()
    await modal.value.close()
  }
}

async function closeOnEscape(event) {
  if (event.key === "Escape") {
    event.preventDefault()
    await modal.value.cancelAndClose()
  }
}

function focusSearch() {
  toolbar.value.focusSearch()
}

function focusNavbar() {
  emits("focus-navbar")
}

function focusDataTable() {
  dataTable.value.focus()
}

async function updateLocalData(index, project) {
  const hasNoProject = !project
  if (hasNoProject) {
    return
  }

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
      selectedProject.value = getCopy(data.value[index])
      const project = await modal.value.open()
      updateLocalData(index, project)
      break
    }

    case "edit": {
      selectedProject.value = getCopy(data.value[index])
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
    <Toolbar
      class="project-toolbar"
      ref="toolbar"
      @search-input="filterData"
      @is-from-codementor="filter('is-from-codementor', $event)"
      @selected-tags="filter('tags', $event)"
    />

    <div v-if="hasCurrentClient" class="client-indication">
      <h2>
        <span class="font-bold">Projects for: </span
        >{{ currentClient.firstName }} {{ currentClient.lastName }}
      </h2>
    </div>

    <DataTable
      v-if="data.length"
      ref="dataTable"
      :data="data"
      @open-modal="openModal"
    />
    <h2 v-else-if="route.params.clientId" class="no-data-message">
      There are no projects available for this client. 🤷
    </h2>
    <h2 v-else class="no-data-message">No data to show at the moment. 🤷</h2>

    <ProjectModal
      ref="modal"
      :project="selectedProject"
      title="View/Edit the project"
    />
  </div>
</template>

<style lang="scss">
.project-toolbar {
  @apply mb-10;
}

.no-data-message {
  @apply text-xl my-10 mx-auto w-full text-center;
}

.client-indication {
  @apply container mx-auto mt-6 py-5 text-center text-xl;
}
</style>
