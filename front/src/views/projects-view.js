import { computed, ref } from "vue"

import useHelpers from "../app/helpers"

import Project from "../models/Project"

import { getProjects, getProjectsByClientId, createProject, updateProject } from "../api/project"
import { getClients } from "../api/client" // todo: get list with Id & name only

const { searchStringInList, getCopy } = useHelpers()

let initialData = []

const data = ref([])
const selectedProject = ref({})

const currentClient = ref(null)

const hasCurrentClient = computed(() => !!currentClient.value?.firstName)

const clients = ref([])

// * template refs
const modal = ref(null)
const toolbar = ref(null)
const dataTable = ref(null)


export default function userProjectsView({ notify, route } = {}) {

  return {
    // * template refs
    modal,
    toolbar,
    dataTable,

    // * data refs
    data,
    initialData,
    selectedProject,
    currentClient,
    hasCurrentClient,
    clients,

    // * data methods with data & template impacts
    fetchTableData: fetchTableDataWrapper,
    filter,
    filterData,
    openModal: openModalWrapper,
    openCreateModal: openCreateModalWrapper,
    createItemViaModal,
    viewItem: viewItemWrapper,
    editItemViaModal: editItemViaModalWrapper,
    updateItemAndFetchData: updateItemAndFetchDataWrapper,
  }

  function fetchTableDataWrapper(...args) {
    return fetchTableData(route, ...args)
  }

  function openModalWrapper(...args) {
    return openModal(notify, ...args)
  }

  function openCreateModalWrapper(...args) {
    return openCreateModal(notify, ...args)
  }

  function updateItemAndFetchDataWrapper(...args) {
    return updateItemAndFetchData(notify, ...args)
  }

  function viewItemWrapper(...args) {
    return viewItem(notify, ...args)
  }

  function editItemViaModalWrapper(...args) {
    return editItemViaModal(notify, ...args)
  }
}

function openCreateModal(notify) {
  openModal(notify, { mode: "create" })
}

function focusDataTable({ itemIndex } = {}) {
  itemIndex >= 0
    ? dataTable.value.focusOnUpdated(itemIndex)
    : dataTable.value.focusOnCreate()
}

async function fetchTableData(route = null) {
  const clientId = route?.params.clientId

  const call = clientId ? getProjectsByClientId(clientId) : getProjects()
  const calls = [call, getClients]

  const [projectResponse] = await Promise.all(calls)
  const dataFromServer = await projectResponse.json()

  data.value = [...dataFromServer]
  initialData = [...dataFromServer]

  const clientsResponses = await getClients()
  clients.value = await clientsResponses.json()
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

async function openModal(notify, response) {
  const { mode, index } = response
  switch (mode) {
    case "view": {
      viewItem(notify, index)
      break
    }

    case "edit": {
      editItemViaModal(notify, index)
      break
    }

    case "create": {
      createItemViaModal(notify)
      break
    }

    default: {
      console.log("Open modal mode is not recognised. 🤷‍♂️")
      break
    }
  }
}

async function createItemViaModal(notify, previousItem = null) {
  // * When back-end fails to create the client,
  // * we re-open the modal with the same data
  selectedProject.value = previousItem || new Project()
  const project = await modal.value.open()
  focusDataTable()

  const hasNoProject = !project
  if (hasNoProject) {
    return
  }

  try {
    await createProject(project)
    notify({
      title: "Successfully created!",
      message: `<span class="italic font-bold">${project.title}</span> was created!`,
    })
  } catch (error) {
    await alert({
      title: "⚠️ OOPS! ⚠️",
      text: `Failed to create the project. Please try again.`,
    })

    return createItemViaModal(notify, project)
  }

  await fetchTableData()
}

async function viewItem(notify, itemIndex) {
  selectedProject.value = getCopy(data.value[itemIndex])
  const project = await modal.value.open()
  focusDataTable({ itemIndex: itemIndex })

  const hasNoItem = !project
  if (hasNoItem) {
    return
  }
  await updateItemAndFetchData(notify, itemIndex, project)
}

async function editItemViaModal(notify, itemIndex) {
  selectedProject.value = getCopy(data.value[itemIndex])
  const project = await modal.value.open()
  focusDataTable({ itemIndex: itemIndex })

  const hasNoClient = !project
  if (hasNoClient) {
    return
  }

  await updateItemAndFetchData(notify, itemIndex, project)
}

async function updateItemAndFetchData(notify, index, project) {
  const hasNoProject = !project
  if (hasNoProject) {
    console.warn("Tried to update but had no client 🤷")
    return
  }

  const response = await updateProject(project)
  const { acknowledged, error } = response
  if (error) {
    throw error
  }

  if (!acknowledged) {
    notify({
      title: "Unchanged.",
      message: `<span class="italic font-bold">${project.title}</span> is the same.`,
    })
    return
  }

  notify({
    title: "Successfully Saved!",
    message: `<span class="italic font-bold">${project.title}</span> was updated!`,
  })

  data.value[index] = project

  // * No need to ensure flow of events as it is the last action
  // * Hence we do not use the await here
  fetchTableData()
}
