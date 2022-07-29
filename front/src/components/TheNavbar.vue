<script setup>
  import { ref } from "vue"
  import { useRoute } from "vue-router"
  import ThemeSwitchButton from "../ui-kit/ThemeSwitchButton.vue"
  const route = useRoute()

  const firstRoute = ref(null)

  function focus() {
    firstRoute.value.$el.focus()
  }

  defineExpose({ focus })

  function isActiveRoute(routeName) {
    return route.name === routeName
  }

  const isDarkMode = document.querySelector("body").classList.contains("dark")
  const isDark = ref(isDarkMode)

  function updateIsDark(newValue) {
    isDark.value = newValue
  }
</script>

<template>
  <nav class="navbar">
    <ThemeSwitchButton
      :is-dark="isDark"
      class="!w-12 h-12 self-center"
      data-cy="mode-switch-button"
      @is-dark-update="updateIsDark"
    />

    <div class="routes">
      <router-link
        :class="{ active: isActiveRoute('settings') }"
        class="nav-route"
        to="/app/settings"
        >🔧
      </router-link>
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
    </div>
  </nav>
</template>

<style lang="scss" scoped>
  .navbar {
    transition: all 0.3s linear;

    @apply w-full sm:h-16 md:h-20 flex justify-end;
    @apply drop-shadow-md dark:border-b dark:border-slate-100;
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
