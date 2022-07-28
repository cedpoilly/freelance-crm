<script setup>
  import { ref } from "vue"

  import useAlert from "../app/alert"

  import BaseModal from "../ui-kit/BaseModal.vue"

  defineExpose({ open, close, setValues })

  const { isAlertMode } = useAlert()

  const baseModal = ref(null)
  function open() {
    return baseModal?.value?.open()
  }
  function close() {
    return baseModal?.value?.close()
  }

  const theTitle = ref(null)
  const theText = ref(null)

  function setValues({ title, text }) {
    theTitle.value = title
    theText.value = text
  }
</script>

<template>
  <BaseModal v-if="isAlertMode" ref="baseModal" :is-alert="true">
    <template #title>{{ theTitle }}</template>
    <template #content>{{ theText }}</template>
  </BaseModal>
</template>
