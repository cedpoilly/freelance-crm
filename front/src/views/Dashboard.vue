<script>
  import { onBeforeMount, onMounted } from "vue"

  import useDasboard from "./dashboard"
  import useListViewCommons from "./list-view-commons"

  import ClientModal from "../components/ClientModal.vue"
  import DataTable from "../components/DataTable.vue"
  import Toolbar from "../components/Toolbar.vue"

  import columnsConfig from "../data/clients-data-table-config"

  // * Data refs and related methods
  const { data, selectedClient } = useDasboard()
  const { fetchTableData, filter, filterData } = useDasboard()
</script>

<script setup>
  // * must stay in `<script setup>`
  const emits = defineEmits(["focus-navbar", "notification"])

  onBeforeMount(() => fetchTableData())

  // * template refs
  const { modal, toolbar, dataTable } = useDasboard()

  // * template actions
  const { openModal, openCreateModal } = useDasboard({ notify })

  onMounted(() => {
    const args = { modal, toolbar, dataTable, emits, openCreateModal }
    const { onKeyDownListeners } = useListViewCommons(args)
    onKeyDownListeners(document)
  })

  function notify({ title, message }) {
    emits("notification", { title, message })
  }
</script>

<template>
  <div class="view-container">
    <Toolbar
      ref="toolbar"
      class="toolbar"
      tags-label="Client's tags"
      @create-new="openModal({ mode: 'create' })"
      @search-input="filterData"
      @is-from-codementor="filter('is-from-codementor', $event)"
      @selected-tags="filter('tags', $event)"
    />

    <DataTable
      ref="dataTable"
      :data="data"
      :columns-config="columnsConfig"
      class="data-table"
      @open-modal="openModal"
    >
      <template v-slot:no-data-message
        >No clients to show at the moment. 🤷</template
      >
    </DataTable>

    <ClientModal
      ref="modal"
      :client="selectedClient"
      title="View/Edit the client"
    />
  </div>
</template>

<style scoped>
  .view-container {
    @apply py-6 md:py-10;
  }
</style>
