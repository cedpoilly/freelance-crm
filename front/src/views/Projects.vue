<script setup>
  import { onMounted, ref } from "vue"
  import { useRoute } from "vue-router"
  import { computed } from "@vue/reactivity"

  import Project from "../models/Project"

  import Toolbar from "../components/Toolbar.vue"
  import DataTable from "../components/DataTable.vue"
  import BaseAlertModal from "../components/BaseAlertModal.vue"
  import ProjectModal from "../components/ProjectModal.vue"

  import useHelpers from "../app/helpers"
  import useAlert from "../app/alert"

  import { getClientById } from "../api/client"
  import {
    getProjects,
    getProjectsByClientId,
    createProject,
    updateProject,
  } from "../api/project"

  const route = useRoute()

  const { alert } = useAlert()

  const { searchStringInList, getCopy, ctrlPlus } = useHelpers()

  const emits = defineEmits(["focus-navbar", "notification"])

  let initialData = []
  const data = ref([])
  const currentClient = ref(null)
  const modal = ref(null)
  const toolbar = ref(null)
  const dataTable = ref(null)
  const selectedProject = ref({})

  const hasCurrentClient = computed(() => !!currentClient.value?.firstName)

  fetchTableData()

  onMounted(() => {
    document.onkeydown = async event => {
      await saveOnCtrlS(event)
      await saveOnCtrlEnter(event)
      closeOnEscape(event)

      ctrlPlus(event, "F", focusSearch)
      ctrlPlus(event, "L", focusNavbar)
      ctrlPlus(event, "H", focusDataTable)
      ctrlPlus(event, ">", openCreateModal)
    }
  })

  async function fetchTableData() {
    const clientId = route.params.clientId

    const call = clientId ? getProjectsByClientId(clientId) : getProjects()

    const response = await call

    const dataFromServer = await response.json()

    data.value = [...dataFromServer]
    initialData = [...dataFromServer]
  }

  async function fetchClient(clientId) {
    const response = await getClientById(clientId)
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

  function notify({ title, message }) {
    emits("notification", { title, message })
  }

  function openCreateModal() {
    openModal({ mode: "create" })
  }

  async function updateItemAndFetchData(index, project) {
    const hasNoProject = !project
    if (hasNoProject) {
      return
    }

    const response = await updateProject(project)
    const { acknowledged } = response
    if (!acknowledged) {
      alert("Project was not modified!")
      return
    }

    data.value[index] = project

    // * No need to ensure flow of events as it is the last action
    // * Hence we do not use the await here
    fetchTableData()
  }

  async function openModal(response) {
    const { mode, index } = response
    switch (mode) {
      case "view": {
        editItemViaModal(index)
        break
      }

      case "edit": {
        editItemViaModal(index)
        break
      }

      case "create": {
        createItemViaModal()
        break
      }

      default: {
        console.log("Open modal mode is not recognised. 🤷‍♂️")
        break
      }
    }
  }

  // * same as `viewClient` client for now; subject to change soon.
  async function editItemViaModal(itemIndex) {
    selectedProject.value = getCopy(data.value[itemIndex])
    const project = await modal.value.open()

    const hasNoProject = !project
    if (hasNoProject) {
      return
    }

    await updateItemAndFetchData(itemIndex, project)

    notify({
      title: "Successfully Saved!",
      message: `<span class="italic font-bold">${project.title}</span> was updated!`,
    })
  }

  async function createItemViaModal(previousItem = null) {
    // * When back-end fails to create the client,
    // * we re-open the modal with the same data
    selectedProject.value = previousItem || new Project()
    const project = await modal.value.open()

    const hasNoProject = !project
    if (hasNoProject) {
      return
    }

    try {
      const response = await createProject(project)
      notify({
        title: "Successfully created!",
        message: `<span class="italic font-bold">${project.title}</span> was created!`,
      })
    } catch (error) {
      await alert({
        title: "⚠️ OOPS! ⚠️",
        text: `Failed to create the project. Please try again.`,
      })

      return createItemViaModal(project)
    }

    await fetchTableData()
  }
</script>

<template>
  <div class="view-container">
    <Toolbar
      ref="toolbar"
      class="project-toolbar"
      @create-new="openModal({ mode: 'create' })"
      @search-input="filterData"
      @is-from-codementor="filter('is-from-codementor', $event)"
      @selected-tags="filter('tags', $event)"
    />

    <div v-if="hasCurrentClient" class="project-indication">
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

<style lang="scss" scoped>
  .project-toolbar {
    @apply mb-10;
  }

  .no-data-message {
    @apply text-xl my-10 mx-auto w-full text-center;
  }

  .project-indication {
    @apply container mx-auto mt-6 py-5 text-center text-xl;
  }
</style>
