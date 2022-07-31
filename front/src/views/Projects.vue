<script>
  import { onBeforeMount, onMounted } from "vue"
  import { useRoute } from "vue-router"

  import useListViewCommons from "./list-view-commons"
  import useProjectsView from "./projects-view"

  import DataTable from "../components/DataTable.vue"
  import ProjectModal from "../components/ProjectModal.vue"
  import Toolbar from "../components/Toolbar.vue"

  import columnsConfig from "../data/projects-data-table-config"

  // * Data refs and related methods
  const {
    data,
    selectedProject,
    hasCurrentClient,
    clients,
    filter,
    filterData,
  } = useProjectsView()
</script>

<script setup>
  const route = useRoute()
  const { fetchTableData } = useProjectsView({ route })

  // * must stay in `<script setup>`
  const emits = defineEmits(["focus-navbar", "notification"])

  onBeforeMount(() => fetchTableData())

  // * template refs
  const { modal, toolbar, dataTable } = useProjectsView()

  // * template actions
  const { openModal, openCreateModal } = useProjectsView({ notify })

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
      class="project-toolbar"
      tags-label="Project's technologies"
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
      ref="dataTable"
      :columns-config="columnsConfig"
      :data="data"
      class="data-table"
      @open-modal="openModal"
    >
      <template v-slot:no-data-message v-if="route.params.clientId">
        There are no projects for this client. 🤷
      </template>

      <template v-slot:no-data-message v-else
        >No data to show at the moment. 🤷
      </template>
    </DataTable>

    <ProjectModal
      ref="modal"
      :project="selectedProject"
      :clients="clients"
      title="View/Edit the project"
    />
  </div>
</template>

<style lang="scss" scoped>
  .project-indication {
    @apply container mx-auto mt-6 py-5 text-center text-xl;
  }

  .view-container {
    @apply py-6 md:py-10;
  }
</style>
