import { ref } from "vue"

import useHelpers from "../app/helpers"

import Client from "../models/Client"

import { getClients, createClient, updateClient } from "../api/client"

const { searchStringInList, getCopy } = useHelpers()

let initialData = []

const data = ref([])
const selectedClient = ref({})

// * template refs
const modal = ref(null)
const toolbar = ref(null)
const dataTable = ref(null)


export default function useDashboard({ notify } = {}) {

  return {
    // * template refs
    modal,
    toolbar,
    dataTable,

    // * data refs
    data,
    initialData,
    selectedClient,

    // * data methods with data & template impacts
    fetchTableData,
    filter,
    filterData,
    openModal: openModalWrapper,
    openCreateModal: openCreateModalWrapper,
    createNewClientViaModal,
    viewClient: viewClientWrapper,
    editClientViaModal: editClientViaModalWrapper,
    updateItemAndFetchData: updateItemAndFetchDataWrapper,
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

  function viewClientWrapper(...args) {
    return viewClient(notify, ...args)
  }

  function editClientViaModalWrapper(...args) {
    return editClientViaModal(notify, ...args)
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

async function fetchTableData() {
  const response = await getClients()
  const dataFromServer = await response.json()
  data.value = [...dataFromServer]
  initialData = [...dataFromServer]
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
      viewClient(notify, index)
      break
    }

    case "edit": {
      editClientViaModal(notify, index)
      break
    }

    case "create": {
      createNewClientViaModal(notify)
      break
    }

    default: {
      debugger
      console.log("Open modal mode is not recognised. 🤷‍♂️")
      break
    }
  }
}

async function createNewClientViaModal(notify, previousClient = null) {
  // * When back-end fails to create the client,
  // * we re-open the modal with the same data
  selectedClient.value = previousClient || new Client()
  const client = await modal.value.open()

  const hasNoClient = !client
  if (hasNoClient) {
    return
  }

  try {
    await createClient(client)
    notify({
      title: "Successfully created!",
      message: `<span class="italic font-bold">${client.firstName} ${client.lastName}</span> was created!`,
    })
  } catch (error) {
    await alert({
      title: "⚠️ OOPS! ⚠️",
      text: `Failed to create the client. Please try again.`,
    })

    return createNewClientViaModal(notify, client)
  }

  await fetchTableData()
  focusDataTable()
}

async function viewClient(notify, clientIndex) {
  selectedClient.value = getCopy(data.value[clientIndex])
  const client = await modal.value.open()

  const hasNoClient = !client
  if (hasNoClient) {
    return
  }
  await updateItemAndFetchData(notify, clientIndex, client)
  focusDataTable({ itemIndex: clientIndex })
}

async function editClientViaModal(notify, clientIndex) {
  selectedClient.value = getCopy(data.value[clientIndex])
  const client = await modal.value.open()

  const hasNoClient = !client
  if (hasNoClient) {
    return
  }

  await updateItemAndFetchData(notify, clientIndex, client)
  focusDataTable({ itemIndex: clientIndex })
}

async function updateItemAndFetchData(notify, index, client) {
  const hasNoClient = !client
  if (hasNoClient) {
    console.warn("Tried to update but had no client")
    return
  }

  const response = await updateClient(client)
  const { acknowledged, error } = response
  if (error) {
    throw error
  }

  if (!acknowledged) {
    notify({
      title: "Unchanged.",
      message: `<span class="italic font-bold">${client.firstName} ${client.lastName}</span> is the same.`,
    })
    return
  }

  notify({
    title: "Successfully Saved!",
    message: `<span class="italic font-bold">${client.firstName} ${client.lastName}</span> was updated!`,
  })

  data.value[index] = client

  // * No need to ensure flow of events as it is the last action
  // * Hence we do not use the await here
  fetchTableData()
}
