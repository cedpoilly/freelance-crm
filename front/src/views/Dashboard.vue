<script>
  import { onBeforeMount, onMounted, ref } from "vue"

  import Toolbar from "../components/Toolbar.vue"
  import DataTable from "../components/DataTable.vue"
  import ClientModal from "../components/ClientModal.vue"

  import useHelpers from "../app/helpers"
  import useDasboard from "./dashboard"

  const { ctrlPlus } = useHelpers()

  const { data, selectedClient, fetchTableData, filter, filterData } = useDasboard()

</script>

<script setup>
// * must stay in `<script setup>`
  const emits = defineEmits(["focus-navbar", "notification"])

  onBeforeMount(() => fetchTableData())

  // * template refs
  const { modal, toolbar, dataTable } = useDasboard()

  // * template refs direct methods
  const { focusDataTable, focusSearch } = useDasboard()

  const { openModal, openCreateModal } = useDasboard({ notify })

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

  function focusNavbar() {
    emits("focus-navbar")
  }
  
  function notify({ title, message }) {
    emits("notification", { title, message })
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