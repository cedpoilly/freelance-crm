<script setup>
  import { onBeforeMount, onMounted, ref } from "vue"

  import Client from "../models/Client"

  import Toolbar from "../components/Toolbar.vue"
  import DataTable from "../components/DataTable.vue"
  import BaseAlertModal from "../components/BaseAlertModal.vue"
  import ClientModal from "../components/ClientModal.vue"

  import useAlert from "../app/alert"

  import useHelpers from "../app/helpers"

  import { getClients, createClient, updateClient } from "../api/client"

  const { alert } = useAlert()

  const { searchStringInList, getCopy, ctrlPlus } = useHelpers()

  const emits = defineEmits(["focus-navbar", "notification"])

  let initialData = []
  const data = ref([])
  const selectedClient = ref({})

  onBeforeMount(() => fetchTableData())

  // * template refs
  const alertModal = ref(null)
  const modal = ref(null)
  const toolbar = ref(null)
  const dataTable = ref(null)

  onMounted(() => {
    document.onkeydown = async event => {
      await saveOnCtrlS(event)
      await saveOnCtrlEnter(event)
      ctrlPlus(event, "F", focusSearch)
      ctrlPlus(event, "L", focusNavbar)
      ctrlPlus(event, "H", focusDataTable)
      ctrlPlus(event, ">", openCreateModal)
    }
  })

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

  async function updateItemAndFetchData(index, client) {
    const hasNoClient = !client
    if (hasNoClient) {
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

  async function openModal(response) {
    const { mode, index } = response
    switch (mode) {
      case "view": {
        viewClient(index)
        break
      }

      case "edit": {
        editClientViaModal(index)
        break
      }

      case "create": {
        createNewClientViaModal()
        break
      }

      default: {
        debugger
        console.log("Open modal mode is not recognised. 🤷‍♂️")
        break
      }
    }
  }

  async function viewClient(clientIndex) {
    selectedClient.value = getCopy(data.value[clientIndex])
    const client = await modal.value.open()
    focusDataTable()

    const hasNoClient = !client
    if (hasNoClient) {
      return
    }

    await updateItemAndFetchData(clientIndex, client)
  }

  // * same as `viewClient` client for now; subject to change soon.
  async function editClientViaModal(clientIndex) {
    selectedClient.value = getCopy(data.value[clientIndex])
    const client = await modal.value.open()
    focusDataTable()

    const hasNoClient = !client
    if (hasNoClient) {
      return
    }

    await updateItemAndFetchData(index, client)
  }

  async function createNewClientViaModal(previousClient = null) {
    // * When back-end fails to create the client,
    // * we re-open the modal with the same data
    selectedClient.value = previousClient || new Client()
    const client = await modal.value.open()
    focusDataTable()

    const hasNoClient = !client
    if (hasNoClient) {
      return
    }

    try {
      const response = await createClient(client)
      notify({
        title: "Successfully created!",
        message: `<span class="italic font-bold">${client.firstName} ${client.lastName}</span> was created!`,
      })
    } catch (error) {
      await alert({
        title: "⚠️ OOPS! ⚠️",
        text: `Failed to create the client. Please try again.`,
      })

      return createNewClientViaModal(client)
    }

    await fetchTableData()
  }
</script>

<template>
  <div class="view-container">
    <Toolbar
      ref="toolbar"
      class="client-toolbar"
      @create-new="openModal({ mode: 'create' })"
      @search-input="filterData"
      @is-from-codementor="filter('is-from-codementor', $event)"
      @selected-tags="filter('tags', $event)"
    />

    <DataTable
      v-if="data.length"
      ref="dataTable"
      :data="data"
      @open-modal="openModal"
    />
    <h2 v-else class="text-xl px-auto mx-auto w-full text-center">
      No data to show at the moment.
    </h2>

    <ClientModal
      ref="modal"
      :client="selectedClient"
      title="View/Edit the client"
    />
  </div>
</template>

<style lang="scss" scoped>
  .client-toolbar {
    @apply mb-10;
  }
</style>
