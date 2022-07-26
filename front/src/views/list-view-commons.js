import useHelpers from "../app/helpers"

const { ctrlPlus } = useHelpers()

let modal = null
let dataTable = null
let toolbar = null
let emits = null
let openCreateModal = null

export default function useListViewCommons({
  modal: modalRef,
  dataTable: dataTableRef,
  toolbar: toolbarRef,
  emits: emitsRef,
  openCreateModal: openCreateModalRef
}) {
  modal = modalRef
  dataTable = dataTableRef
  toolbar = toolbarRef
  emits = emitsRef
  emits = emitsRef
  openCreateModal = openCreateModalRef

  return {
    onKeyDownListeners,
    focusDataTable,
    focusSearch,
    focusNavbar
  }
}

function onKeyDownListeners(document) {
  document.onkeydown = async event => {
    await saveOnCtrlS(event)
    await saveOnCtrlEnter(event)
    ctrlPlus(event, "F", focusSearch)
    ctrlPlus(event, "L", focusNavbar)
    ctrlPlus(event, "H", focusDataTable)
    ctrlPlus(event, ">", openCreateModal)
  }
}

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

function focusDataTable() {
  dataTable.value.focus()
}

function focusSearch() {
  toolbar.value.focusSearch()
}

function focusNavbar() {
  emits("focus-navbar")
}
