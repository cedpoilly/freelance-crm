<script setup>
  import { ref } from "vue"
  import { useRoute } from "vue-router"
  import BaseButton from "../ui-kit/BaseButton.vue"
  import ThemeSwitchButton from "../ui-kit/ThemeSwitchButton.vue"
  const route = useRoute()

  const expanded = ref(false)

  // * template ref
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
  <nav class="navbar h-16 py-2 my-2">
    <div class="routes-mobile md:!hidden" :class="{ '!hidden': !expanded }">
      <router-link
        ref="firstRoute"
        :class="{ active: isActiveRoute('dashboard') }"
        class="nav-route"
        to="/app/dashboard"
        @click="expanded = false"
      >
        Dashboard
      </router-link>
      <router-link
        :class="{ active: isActiveRoute('projects') }"
        class="nav-route"
        to="/app/projects"
        @click="expanded = false"
        >Projects
      </router-link>

      <router-link
        :class="{ active: isActiveRoute('settings') }"
        class="nav-route"
        to="/app/settings"
        @click="expanded = false"
        >Settings
      </router-link>
    </div>

    <div class="routes !hidden md:!flex">
      <router-link
        ref="firstRoute"
        :class="{ active: isActiveRoute('dashboard') }"
        class="nav-route"
        to="/app/dashboard"
        @click="expanded = false"
        >Dashboard</router-link
      >
      <router-link
        :class="{ active: isActiveRoute('projects') }"
        class="nav-route"
        to="/app/projects"
        @click="expanded = false"
        >Projects</router-link
      >

      <router-link
        :class="{ active: isActiveRoute('settings') }"
        element="BaseButton"
        class="nav-route"
        to="/app/settings"
        @click="expanded = false"
        >Settings
      </router-link>
    </div>

    <ThemeSwitchButton
      :is-dark="isDark"
      class="self-center mr-8 md:mr-12 lg:mr-14"
      data-cy="mode-switch-button"
      @is-dark-update="updateIsDark"
    />

    <BaseButton
      class="w-16 md:!hidden"
      icon="menu_toggle"
      @click="expanded = !expanded"
    />
  </nav>
</template>

<style lang="scss" scoped>
  .navbar {
    @apply w-full sm:h-16 md:h-20;
    @apply flex justify-end items-center;
    @apply shadow dark:shadow-slate-800 mb-1 px-4;
  }

  .routes {
    & .nav-route {
      @apply px-3 py-2 my-2;
      @apply w-full px-8;
      @apply hover:underline;
    }

    & .active {
      @apply font-bold;
    }
  }

  .routes-mobile {
    @apply relative;
    @apply my-auto  px-5 py-4;
    @apply flex flex-col items-center;
    @apply fixed top-14 h-full z-10 left-0 w-full;
    @apply transition-all;

    &:before {
      animation: forwards appear-bg 0.3s;

      content: "";
      z-index: -10;
      @apply absolute h-full w-full pt-12;
      @apply bg-white dark:bg-neutral-900 bg-opacity-90 dark:bg-opacity-80 backdrop-filter backdrop-blur-md;
    }

    & .nav-route:nth-child(1) {
      @apply block mt-10;
    }

    & .nav-route {
      @apply px-3 py-2 my-2;
      @apply w-full px-8;
      @apply text-xl;
      @apply hover:underline;
    }

    & .active {
      @apply font-bold;
    }
  }

  @keyframes appear-bg {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
</style>
