<script setup>
import { onMounted, ref, watch } from "vue"

const props = defineProps({
  data: {
    type: Array,
    required: true
  }
})

const { dataHeaders, headers } = getHeadersFromList(props.data)
const data = ref([])

onMounted(() => setData(props.data, dataHeaders))

watch(() => props.data, (newValue) => setData(newValue, dataHeaders))

function setData(list) {
  data.value = getRowsFromList(list, dataHeaders)
}

function getHeadersFromList(list) {
  const firstItem = list[0]
  const { dataHeaders, headers } = getHeadersFromObject(
    firstItem,
    ["_id", "projects", "whatsAppNumber", "isCodementor", "tags"]
  )
  return { dataHeaders, headers }
}

function getHeadersFromObject(object, filterList) {
  const dataHeaders = Object
    .keys(object)
    .filter(item => !filterList.includes(item))
    .map(raw => {
      switch (raw) {
        case "firstName": return {
          id: "firstName", name: "First Name", width: "w-48"
        }
        case "lastName": return {
          id: "lastName", name: "Last Name", width: "w-48"
        }
        case "email": return {
          id: "email", name: "Email", width: "w-96"
        }
        case "level": return {
          id: "level", name: "Level", width: "w-44"
        }
        case "serviceType": return {
          id: "serviceType", name: "Service", width: "w-40"
        }
        case "rate": return {
          id: "rate", name: "Rate (USD)", width: "w-36"
        }
        case "tags": return {
          id: "tags",
          name: "Tags",
          width: "w-48",
          formatter: (cell, row, column) => {
            return cell.join(" | ")
          }
        }

        default: return raw
      }
    })

  const actionHeader = {
    id: 'actions',
    name: "Actions",
    width: "w-24",
  }

  const headers = [...dataHeaders, actionHeader]

  return { dataHeaders, headers }
}

function getRowsFromList(list, headers) {
  return list.map(item => headers.map(header => item[header.id]))
}

function openModal() {
  alert("TODO: Open modal! 😃")
}
</script>

<template>
  <div id="datatable" class="data-table">
    <div class="header">
      <span :class="header.width" class="header-cell" v-for="(header, index) in headers" :key="index">{{
          header.name
      }}</span>
    </div>

    <div class="table-body">
      <div class="table-body-row flex hover:scale-101" title="Click to view all details." @click="openModal"
        v-for="(row, index) in data" :key="index">
        <span class="data-cell" :class="headers[cellIndex].width" v-for="(cell, cellIndex) in row">{{
            cell
        }}
        </span>

        <span class="data-cell" :class="headers[row.length].width">{{ headers[row.length].width
        }}
        </span>
      </div>
    </div>
    <div class="footer"></div>
  </div>
</template>

<style lang="scss">
.data-table {
  @apply w-3/4 mx-auto mt-6 pt-6 overflow-hidden;
}

.header {
  @apply w-full flex h-16 border-t border-b overflow-hidden
}

.header-cell,
.data-cell {
  @apply px-3 py-2 flex items-center
}

.header-cell {
  @apply font-bold bg-gray-100
}

.data-cell {
  @apply bg-gray-100
}

.table-body {
  @apply w-full flex flex-col overflow-x-hidden overflow-y-auto max-h-40;

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
  @apply w-full h-16 border-b transform-gpu ease-in duration-75;
}
</style>
