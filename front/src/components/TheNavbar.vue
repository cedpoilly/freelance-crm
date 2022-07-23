<script setup>
import { useRoute } from 'vue-router'
const route = useRoute()

function isActiveRoute(routeName) {
  return route.name === routeName
}
</script>

<template>
  <nav class="navbar">
    <div class="routes">
      <router-link :class="{ active: isActiveRoute('dashboard') }" class="nav-route" to="/dashboard">Dashboard
      </router-link>
      <router-link :class="{ active: isActiveRoute('projects') }" class="nav-route" to="/projects">Projects
      </router-link>
      <router-link :class="{ active: isActiveRoute('settings') }" class="nav-route" to="/settings">Settings
      </router-link>
    </div>
  </nav>
</template>

<style lang="scss" scoped>
.navbar {
  @apply w-full flex justify-end;
}

.routes {
  @apply px-5 py-4 self-end;
}

.nav-route {
  @apply px-3 py-2 my-2;
}

.active {
  @apply font-bold;
}
</style>