<script setup>
  import { ref } from "vue"
  import { useRoute } from "vue-router"
  const route = useRoute()

  const firstRoute = ref(null)

  function focus() {
    firstRoute.value.$el.focus()
  }

  defineExpose({ focus })

  function isActiveRoute(routeName) {
    return route.name === routeName
  }
</script>

<template>
  <nav class="navbar">
    <div class="routes">
      <router-link
        ref="firstRoute"
        :class="{ active: isActiveRoute('dashboard') }"
        class="nav-route"
        to="/app/dashboard"
      >
        Dashboard
      </router-link>
      <router-link
        :class="{ active: isActiveRoute('projects') }"
        class="nav-route"
        to="/app/projects"
        >Projects
      </router-link>
      <router-link
        :class="{ active: isActiveRoute('settings') }"
        class="nav-route"
        to="/app/settings"
        >Settings
      </router-link>
    </div>
  </nav>
</template>

<style lang="scss" scoped>
  .navbar {
    @apply absolute top-0;
    @apply w-full sm:h-16 md:h-20 bg-white flex justify-end;
  }

  .routes {
    @apply my-auto px-5 py-4 self-end;
  }

  .nav-route {
    @apply px-3 py-2 my-2;
  }

  .active {
    @apply font-bold;
  }
</style>
