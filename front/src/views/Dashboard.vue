<script>
  import { onBeforeMount, onMounted } from "vue"

  import Toolbar from "../components/Toolbar.vue"
  import DataTable from "../components/DataTable.vue"
  import ClientModal from "../components/ClientModal.vue"

  import useDasboard from "./dashboard"
  import useListViewCommons from "./list-view-commons"

  // * Data refs and related methods
  const { data, selectedClient, fetchTableData, filter, filterData } = useDasboard()

</script>

<script setup>
// * must stay in `<script setup>`
  const emits = defineEmits(["focus-navbar", "notification"])

  onBeforeMount(() => fetchTableData())

  // * template refs
  const { modal, toolbar, dataTable } = useDasboard()

  const { openModal } = useDasboard({ notify })

  onMounted(() => {
    const args = { modal, toolbar, dataTable, emits }
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