import { nextTick, ref } from "vue"

const isOpen = ref(false)

export default function useConfirm(instance) {
  async function confirm({ title, text }) {
    await setIsOpen(true)

    const confirmModal = instance.root.refs.confirmModal
    confirmModal.setValues({ title, text })

    const confirmed = await confirmModal.open()
    await setIsOpen(false)

    return confirmed
  }

  return { confirm, isOpen }
}

async function setIsOpen(shouldOpen) {
  isOpen.value = shouldOpen
  await nextTick()
}
