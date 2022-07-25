<script setup>
import { useRouter } from "vue-router"

const router = useRouter()

const DELAY_IN_MILISECONDS = 3000

setTimeout(function timerCallback() {
  router.push({ name: "dashboard" })
}, DELAY_IN_MILISECONDS)
</script>

<template>
  <h2>Route Not Found</h2>
  <h3>Redirecting to dashboard...</h3>
</template>
