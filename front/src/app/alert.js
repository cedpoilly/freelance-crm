import { nextTick, ref } from "vue"

const instanceRef = ref(null)
export function setInstanceRef(instance) {
  if (!instance) { return }
  instanceRef.value = instance
}

const isAlertMode = ref(false)

export default function useAlert() {
  async function alert({ title, text }) {
    await setAletMode(true)

    const alertModal = instanceRef.value.root.refs.alertModal
    alertModal.setValues({ title, text })
    await alertModal.open()

    await setAletMode(false)
  }

  return { alert, isAlertMode }
}

async function setAletMode(isAlert) {
  isAlertMode.value = isAlert
  await nextTick()
}
