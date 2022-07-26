import { computed, ref } from "vue"

import useGlobalState from "../app/global-state"
import useHelpers from "../app/helpers"

import Project from "../models/Project"

import { getClients } from "../api/client" // todo: get list with Id & name only
import {
  createProject,
  getProjects,
  getProjectsByClientId,
  updateProject,
} from "../api/project"

import localData from "../local-data/projects.json"

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

function focusOnWholeTable() {
  dataTable.value.focus()
}

function focusDataTable({ itemIndex } = {}) {
  itemIndex >= 0
    ? dataTable.value.focusOnUpdated(itemIndex)
    : dataTable.value.focusOnCreate()
}

async function fetchTableData(route = null) {
  const { startLoadingState, stopLoadingState } = useGlobalState()
  startLoadingState()

  const clientId = route?.params.clientId

  const call = clientId ? getProjectsByClientId(clientId) : getProjects()
  const calls = [call, getClients]

  try {
    const [projectResponse] = await Promise.all(calls)
    const dataFromServer = await projectResponse.json()

    data.value = [...dataFromServer]
    initialData = [...dataFromServer]

    const clientsResponses = await getClients()
    clients.value = await clientsResponses.json()
  } catch (error) {
    const isDev = import.meta.env.DEV
    if (isDev) {
      data.value = localData
      initialData = localData
      console.warn("Failed to fetch projects(s).")
    } else {
      alert("Failed to fetch projects(s).")
    }
  }

  stopLoadingState()
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
        value.every(tag => !!item.techs.includes(tag))
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

  const hasNoProject = !project
  if (hasNoProject) {
    focusOnWholeTable()
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
  focusDataTable()
}

async function viewItem(notify, itemIndex) {
  selectedProject.value = getCopy(data.value[itemIndex])
  const project = await modal.value.open()

  const hasNoItem = !project
  if (hasNoItem) {
    focusOnWholeTable()
    return
  }
  await updateItemAndFetchData(notify, itemIndex, project)
  focusDataTable({ itemIndex: itemIndex })
}

async function editItemViaModal(notify, itemIndex) {
  selectedProject.value = getCopy(data.value[itemIndex])
  const project = await modal.value.open()

  const hasNoClient = !project
  if (hasNoClient) {
    focusOnWholeTable()
    return
  }

  await updateItemAndFetchData(notify, itemIndex, project)
  focusDataTable({ itemIndex: itemIndex })
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
