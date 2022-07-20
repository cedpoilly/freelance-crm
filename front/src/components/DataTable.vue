<!-- 
  Currently using the follwing third party, see documentation:
  https://gridjs.io/
  -->

<script setup>
import { onMounted, ref, toRaw, watch } from "vue"

import { Grid } from "gridjs"
import "gridjs/dist/theme/mermaid.css"

const props = defineProps({
  data: {
    type: Array,
    required: true
  }
})

const gridRef = ref(null)

onMounted(() => {
  const headers = getHeadersFromList(props.data)
  gridRef.value = new Grid({ columns: headers, data: props.data })
    .render(document.getElementById("wrapper"))
})

watch(() => props.data, (newValue) => {
  gridRef.value
    .updateConfig({ data: newValue })
    .forceRender()
})

function getHeadersFromList(list) {
  const firstItem = list[0]
  const headers = getHeadersFromObject(
    firstItem,
    ["_id", "projects", "whatsAppNumber", "isCodementor"]
  )
  return headers
}

function getHeadersFromObject(object, filterList) {
  return Object
    .keys(object)
    .filter(item => !filterList.includes(item))
    .map(raw => {
      switch (raw) {
        case "firstName": return {
          id: "firstName", name: "First Name", width: "10%"
        }
        case "lastName": return {
          id: "lastName", name: "Last Name", width: "10%"
        }
        case "email": return {
          id: "email", name: "Email", width: "10%"
        }
        case "level": return {
          id: "level", name: "Level", width: "10%"
        }
        case "serviceType": return {
          id: "serviceType", name: "Service", width: "10%"
        }
        case "rate": return {
          id: "rate", name: "Rate (USD)", width: "10%"
        }
        case "tags": return {
          id: "tags",
          name: "Tags",
          width: "31%",
          formatter: (cell, row, column) => {
            return cell.join(" | ")
          }
        }
        default: return raw
      }
    })
}

</script>

<template>
  <div id="wrapper" class="w-3/4 mx-auto mt-6 pt-6"></div>
</template>