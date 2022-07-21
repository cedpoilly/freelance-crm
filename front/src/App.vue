<script setup>
import useGlobalState from './app/global-state'

import TheNavbar from './components/TheNavbar.vue'

const { routingDirection } = useGlobalState()
</script>

<template>
  <TheNavbar />

  <router-view v-slot="{ Component }">
    <Transition :name="routingDirection" mode="out-in">
      <component :is="Component"></component>
    </Transition>
  </router-view>
</template>

<style>
@import "./route-transitions.css";
</style>