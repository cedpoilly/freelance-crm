<script setup>
  import { getCurrentInstance, onMounted, ref } from "vue"

  import useHelpers from "./app/helpers"
  import useGlobalState from "./app/global-state"

  import BaseAlertModal from "./ui-kit/BaseAlertModal.vue"
  import NotificationsContainer from "./ui-kit/NotificationsContainer.vue"

  import TheNavbar from "./components/TheNavbar.vue"
  import InfoModal from "./components/InfoModal.vue"

  import { setInstanceRef } from "./app/alert"
  import TheFooter from "./components/TheFooter.vue"

  const { ctrlPlus, keyPushed } = useHelpers()

  const { routingDirection } = useGlobalState()

  const navbar = ref(null)
  const alertModal = ref(null)

  const notifications = ref([])

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

  function showNotification(notification) {
    notifications.value = [...notifications.value, notification]
  }
</script>

<template>
  <TheNavbar ref="navbar" />

  <router-view v-slot="{ Component }">
    <Transition :name="routingDirection" mode="out-in">
      <component
        :is="Component"
        @notification="showNotification"
        @focus-navbar="focusNavbar"
      ></component>
    </Transition>

    <BaseAlertModal ref="alertModal" />
    <InfoModal ref="helpModal" :is-alert="true" />
  </router-view>

  <TheFooter class="h-14" />

  <NotificationsContainer :notifications="notifications" />
</template>

<style lang="scss">
  @import "./route-transitions.css";
  @import "./ui-kit/base-input.scss";

  html,
  body,
  .app {
    @apply relative flex flex-col h-screen bg-gray-100;
  }
</style>
