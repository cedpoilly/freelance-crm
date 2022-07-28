import { ref, watch } from "vue"

export const config = {
  isAlert: { type: Boolean, default: false },
  isConfirm: { type: Boolean, default: false },
  isDefaultActions: { type: Boolean, default: false },
  width: { type: [String, Object], default: null },
  actionsPushLeft: { type: [String, Object], default: null },
  actions: {
    type: Object,
    require: false,
    default() {
      return {
        cancel: { label: "CANCEL", function: () => {} },
        confirm: { function: () => {}, label: "OK", isDisabled: false },
      }
    },

    validator({ confirm, cancel }) {
      if (!confirm) {
        return false
      }
      if (!cancel) {
        return false
      }
      return true
    },
  },
}

const canShow = ref(false)
const isCancelled = ref(false)

export default function useBaseModal(instance) {
  const { uid, props: instanceProps } = instance
  const { isAlert, isConfirm, actions } = instanceProps

  return {
    canShow,
    isCancelled,
    open,
    close,
    cancelModal,
    cancelAndClose,
    uid,
    isAlert,
    isConfirm,
    actions,
  }
}

function cancelModal() {
  isCancelled.value = true
}

function cancelAndClose() {
  cancelModal(), close()
}

function close() {
  canShow.value = false
}

function open(callback = async () => {}) {
  canShow.value = true
  isCancelled.value = false

  return new Promise(resolve => {
    const stopHandle = watch(() => canShow.value, watchCB)

    async function watchCB() {
      stopHandle()
      const response = await callback()

      const responseOrCancelledStatus =
        response !== undefined ? response : !isCancelled.value

      resolve(responseOrCancelledStatus)
    }
  })
}
