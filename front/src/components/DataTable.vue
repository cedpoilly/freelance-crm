<script setup>
  import { onMounted, ref, watch } from "vue"
  import BaseButton from "./BaseButton.vue"

  const props = defineProps({
    data: {
      type: Array,
      required: true,
    },
  })

  const emits = defineEmits(["open-modal"])

  const dataTable = ref(null)

  function focus() {
    dataTable.value.focus()
  }

  defineExpose({ focus })

  const { dataHeaders, headers } = getHeadersFromList(props.data)
  const data = ref([])

  onMounted(() => setData(props.data, dataHeaders))

  watch(
    () => props.data,
    newValue => setData(newValue, dataHeaders)
  )

  function setData(list) {
    data.value = getRowsFromList(list, dataHeaders)
  }

  function getHeadersFromList(list) {
    const firstItem = list[0]
    const { dataHeaders, headers } = getHeadersFromObject(firstItem, [
      "_id",
      "projects",
      "whatsAppNumber",
      "isCodementor",
      "tags",
    ])
    return { dataHeaders, headers }
  }

  function getHeadersFromObject(object, filterList) {
    const dataHeaders = Object.keys(object)
      .filter(item => !filterList.includes(item))
      .map(raw => {
        switch (raw) {
          case "firstName":
            return {
              id: "firstName",
              name: "First Name",
              width: "w-2/12",
            }
          case "lastName":
            return {
              id: "lastName",
              name: "Last Name",
              width: "w-2/12",
            }
          case "email":
            return {
              id: "email",
              name: "Email",
              width: "w-3/12",
            }
          case "level":
            return {
              id: "level",
              name: "Level",
              width: "w-2/12",
            }
          case "serviceType":
            return {
              id: "serviceType",
              name: "Service",
              width: "w-2/12",
            }
          case "rate":
            return {
              id: "rate",
              name: "Rate (USD)",
              width: "w-2/12",
            }
          case "tags":
            return {
              id: "tags",
              name: "Tags",
              width: "2/12",
              formatter: (cell, row, column) => {
                return cell.join(" | ")
              },
            }

          case "title":
            return {
              id: "title",
              name: "Title",
              width: "w-4/12",
            }

          case "paymentMethod":
            return {
              id: "paymentMethod",
              name: "Payment Methods",
              width: "w-2/12",
              formatter: (cell, row, column) => {
                const [first, ...rest] = cell.split("")
                return `${first.toUpperCase()}${rest.join("")}`
              },
            }

          case "budget":
            return {
              id: "budget",
              name: "Budget",
              width: "w-2/12",
            }

          case "client":
            return {
              id: "client",
              name: "Client",
              width: "w-3/12",
              formatter: (client, row, column) => {
                return (
                  `${client?.firstName} ${client?.lastName}` || "<no client 🤷>"
                )
              },
            }

          default:
            return raw
        }
      })

    const actionHeader = {
      id: "actions",
      name: "Actions",
      width: "w1/12",
    }

    const headers = [...dataHeaders, actionHeader]

    return { dataHeaders, headers }
  }

  function getRowsFromList(list, headers) {
    return list.map(item => headers.map(header => item[header.id]))
  }

  function openViewModal(rowIndex) {
    emits("open-modal", { mode: "view", index: rowIndex })
  }

  function openEditModal(rowIndex) {
    emits("open-modal", { mode: "edit", index: rowIndex })
  }
</script>

<template>
  <div id="datatable" ref="dataTable" tabindex="0" class="data-table">
    <div class="header">
      <span
        :class="header.width"
        class="header-cell"
        v-for="(header, index) in headers"
        :key="index"
        >{{ header.name }}</span
      >
    </div>

    <div class="table-body">
      <div
        class="table-body-row flex hover:scale-101"
        title="Click to view all details."
        v-for="(row, index) in data"
        :key="index"
        @click="openViewModal(index)"
      >
        <span
          class="data-cell"
          :class="headers[cellIndex].width"
          v-for="(cell, cellIndex) in row"
          >{{
            headers[cellIndex].formatter
              ? headers[cellIndex].formatter(cell)
              : cell
          }}
        </span>

        <span class="data-cell" :class="headers[row.length].width">
          <BaseButton
            class="action-button hover:bg-yellow-100"
            @button-click="openEditModal(index)"
            >Edit</BaseButton
          >
        </span>
      </div>
    </div>
    <div class="footer"></div>
  </div>
</template>

<style lang="scss">
  .data-table {
    @apply w-11/12 mx-auto overflow-hidden;
  }

  .header {
    @apply w-full flex h-16 border-t border-b overflow-hidden;
  }

  .header-cell,
  .data-cell {
    @apply px-3 py-2 flex items-center;
  }

  .header-cell {
    @apply font-bold bg-gray-100;
  }

  .data-cell {
    @apply bg-gray-100;
  }

  .table-body {
    @apply w-full max-h-80 flex flex-col overflow-x-hidden overflow-y-auto;

    &::-webkit-scrollbar {
      @apply w-10;
      width: 0.4rem;
    }

    &::-webkit-scrollbar-track {
      background-color: #f1f1f1;
      border-radius: 2rem;
    }

    &::-webkit-scrollbar-thumb {
      background-color: #ccc;
      border-radius: 2rem;
    }
  }

  .table-body-row {
    @apply w-full h-16 border-b transform-gpu ease-in duration-75 cursor-pointer;
  }

  .action-button {
    @apply bg-white;
  }
</style>
