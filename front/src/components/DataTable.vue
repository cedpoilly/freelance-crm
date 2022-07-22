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
  <div id="datatable" class="w-3/4 mx-auto mt-6 pt-6 overflow-x-hidden">
    <div class="header w-full flex">
      <span :class="header.width" class="header-cell border bg-gray-100 rounded" v-for="(header, index) in headers"
        :key="index">{{
            header.name
        }}</span>
    </div>

    <div class="body w-full flex flex-col contents rounded">
      <div class="w-full flex hover:scale-101 transform-gpu ease-in	duration-75" title="Click to view all details."
        @click="openModal" v-for="(row, index) in data" :key="index">
        <span class="data-cell border bg-gray-100" :class="headers[cellIndex].width" v-for="(cell, cellIndex) in row">{{
            cell
        }}
        </span>

        <span class="data-cell border bg-gray-100" :class="headers[row.length].width">{{ headers[row.length].width
        }}
        </span>
      </div>
    </div>
    <div class="footer"></div>
  </div>
</template>

<style lang="scss">
.header-cell,
.data-cell {
  @apply px-3 py-2
}

.header-cell {
  @apply font-bold
}
</style>
