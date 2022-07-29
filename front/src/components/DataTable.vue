<script setup>
  import { computed } from "@vue/reactivity"
  import { ref, watch } from "vue"

  import BaseButton from "../ui-kit/BaseButton.vue"

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
    <div class="data-table-header">
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
        class="table-body-row hover:scale-101"
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

    <div class="data-table-footer">
      <span class="footer-cell">Count: {{ data.length }}</span>
    </div>
  </div>

  <h2 v-else class="no-data-message">
    <slot></slot>
  </h2>
</template>

<style lang="scss" scoped>
  .data-table {
    @apply w-11/12  mx-auto;
    @apply overflow-y-hidden;
    @apply grid;

    @apply drop-shadow-xl rounded-md;
    @apply dark:border dark:border-slate-700;
    @apply dark:text-slate-100;
    @apply bg-slate-50 dark:bg-slate-900;
  }

  .data-table .data-table-header,
  .data-table .data-table-footer {
    @apply w-full flex border-t border-b dark:border-slate-700 overflow-hidden;
    @apply bg-white dark:bg-slate-800;
  }

  .data-table .data-table-header {
    @apply h-14 md:h-16 lg:h-20;
  }
  .data-table .data-table-footer {
    @apply h-10 md:h-12 lg:h-14;
  }

  .header-cell,
  .data-cell,
  .footer-cell {
    @apply mx-4 md:mx-10 py-2;
    @apply grid items-center;
  }

  .header-cell,
  .footer-cell {
    @apply font-bold;
  }

  .no-data-message {
    @apply w-full my-0 h-full;
  }

  .no-data-message {
    @apply text-xl mx-auto w-full text-center;
  }

  .table-body {
    @apply flex flex-col;
    @apply overflow-x-hidden overflow-y-scroll;

    &::-webkit-scrollbar {
      @apply w-10;
      width: 0.4rem;
    }

    &::-webkit-scrollbar-track {
      border-radius: 2rem;
      background-color: #f1f1f1;
      @apply dark:bg-slate-700;
    }

    &::-webkit-scrollbar-thumb {
      border-radius: 2rem;
      background-color: #ccc;
      @apply dark:bg-slate-400;
    }
  }

  .table-body-row {
    @apply relative flex w-full items-center;
    @apply border-b;
    @apply dark:border-slate-700;

    @apply cursor-pointer focus:bg-sky-100;
  }

  .data-cell {
    @apply h-14 md:h-16 lg:h-20;
  }
</style>

<style lang="scss" scoped>
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
</style>
