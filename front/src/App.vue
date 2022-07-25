<script setup>
  import { getCurrentInstance, onMounted, ref } from "vue"

  import useHelpers from "./app/helpers"
  import useGlobalState from "./app/global-state"

  import BaseAlertModal from "./components/BaseAlertModal.vue"

  import TheNavbar from "./components/TheNavbar.vue"
  import InfoModal from "./components/InfoModal.vue"

  import { setInstanceRef } from "./app/alert"

  const { ctrlPlus, keyPushed } = useHelpers()

  const { routingDirection } = useGlobalState()

  const navbar = ref(null)
  const alertModal = ref(null)

  onMounted(() => {
    setInstanceRef(getCurrentInstance())

    document.onkeyup = async event => {
      keyPushed(event, "Escape", closeModal)
      ctrlPlus(event, "i", showHints)
    }
  })

  function focusNavbar() {
    navbar.value.focus()
  }

  const helpModal = ref(null)

  async function closeModal() {
    await helpModal.value.cancelAndClose()
  }

  function showHints() {
    helpModal.value.open()
  }
</script>

<template>
  <TheNavbar ref="navbar" />

  <router-view v-slot="{ Component }">
    <Transition :name="routingDirection" mode="out-in">
      <component :is="Component" @focus-navbar="focusNavbar"></component>
    </Transition>

    <BaseAlertModal ref="alertModal" />
    <InfoModal ref="helpModal" :is-alert="true" />
  </router-view>
</template>

<style>
  @import "./route-transitions.css";
</style>
