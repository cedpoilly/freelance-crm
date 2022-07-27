<script setup>
  import { ref, watch } from "vue"
  import { computed } from "@vue/reactivity"

  import BaseButton from "./BaseButton.vue"

  const ACTION_HEADERS = [
    {
      id: "actions",
      name: "Actions",
      width: "w-1/24 !hidden",
    },
  ]

  const props = defineProps({
    data: { type: Array, required: true },
    columnsConfig: { type: Object, required: true },
  })

  const emits = defineEmits(["open-modal"])

  const dataTable = ref(null)

  const hasData = computed(() => props?.data?.length)

  // * Focus on the table itself
  // * Available in `list-view-commons.js`
  function focus() {
    dataTable.value.focus()
  }

  function focusOnCreate() {
    const rows = [...dataTable.value.querySelectorAll(".table-body-row")]
    const updatedRow = rows[rows.length - 1]
    updatedRow.focus()
    updatedRow.scrollIntoView()
  }

  function focusOnUpdated(itemIndex) {
    const rows = [...dataTable.value.querySelectorAll(".table-body-row")]
    const updatedRow = rows[itemIndex]
    updatedRow.focus()
    updatedRow.scrollIntoView()
  }

  defineExpose({ focus, focusOnCreate, focusOnUpdated })

  const headers = ref([])
  const dataHeaders = ref([])
  const data = ref([])

  watch(
    () => props.data,
    list => {
      const isEmpty = !list?.length
      if (isEmpty) {
        return
      }

      setHeadersAndData(list)
    },
    { immediate: true }
  )

  function setHeadersAndData(list) {
    dataHeaders.value = getHeadersFromList(list)
    headers.value = [...dataHeaders.value, ...ACTION_HEADERS]
    data.value = getRowsFromList(list, dataHeaders.value)
  }

  function getHeadersFromList(list) {
    const isEmpty = !list.length
    if (isEmpty) {
      return
    }

    const firstItem = list[0]
    const _headers = getHeadersFromObject(firstItem)

    return _headers
  }

  function getHeadersFromObject(object) {
    const dataHeaders = Object.keys(object)
      .map(raw => props.columnsConfig[raw])
      .filter(Boolean)

    return dataHeaders
  }

  function getWidthClass(headers, cellIndex) {
    const isEmpty = !headers.length
    if (isEmpty) {
      return
    }

    return headers[cellIndex]?.width
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
  <div
    v-if="hasData"
    id="datatable"
    ref="dataTable"
    tabindex="0"
    class="data-table"
  >
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
        tabindex="0"
        class="table-body-row flex hover:scale-101"
        title="Click to view all details."
        v-for="(row, index) in data"
        :key="index"
        @click="openViewModal(index)"
        @keydown.control.enter="openViewModal(index)"
      >
        <span
          :class="getWidthClass(headers, cellIndex)"
          class="data-cell"
          v-for="(cell, cellIndex) in row"
          >{{
            headers[cellIndex].formatter
              ? headers[cellIndex].formatter(cell)
              : cell
          }}
        </span>
        <span class="data-cell" :class="getWidthClass(headers, row.length)">
          <BaseButton
            class="action-button hover:bg-yellow-100"
            @button-click="openEditModal(index)"
            >Edit</BaseButton
          >
        </span>
      </div>
    </div>

    <div class="footer">
      <span class="footer-cell">Count: {{ data.length }}</span>
    </div>
  </div>

  <h2 v-else class="no-data-message">
    <slot></slot>
  </h2>
</template>

<style lang="scss" scoped>
  .data-table {
    @apply w-11/12 mx-auto my-3 overflow-y-hidden drop-shadow-xl rounded;
  }

  .header,
  .footer {
    @apply w-full flex h-20 border-t border-b overflow-hidden text-lg bg-gray-200;
  }

  .footer {
    @apply h-14;
  }

  .header-cell,
  .data-cell,
  .footer-cell {
    @apply px-10 py-2 flex items-center;
  }

  .sm-hidden {
    @media screen and (max-width: 767px) {
      @apply hidden;
    }
  }

  .md-hidden {
    @media screen and (max-width: 1023px) {
      @apply hidden;
    }
  }

  .lg-hidden {
    @media screen and (max-width: 1279px) {
      @apply hidden;
    }
  }

  .xl-hidden {
    @media screen and (max-width: 1535px) {
      @apply hidden;
    }
  }

  .header-cell,
  .footer-cell {
    @apply font-bold;
  }

  .data-cell {
    @apply h-20;
  }

  .table-body,
  .no-data-message {
    @apply w-full h-[41rem] my-3;
  }

  .no-data-message {
    @apply text-xl mx-auto w-full text-center;
  }

  .table-body {
    @apply flex flex-col max-h-[31rem] overflow-x-hidden overflow-y-auto;

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
    @apply w-full items-center h-24 border-b bg-white transform-gpu ease-in duration-75 cursor-pointer text-lg focus:bg-sky-100;
  }

  .action-button {
    @apply bg-white;
  }
</style>
