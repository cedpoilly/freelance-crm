<script setup>
  import useTheme from "./theme"

  const { themeMode } = useTheme()

  const props = defineProps({ isDark: Boolean })
  const emits = defineEmits(["is-dark-update"])

  function toggleDarkMode() {
    const currentValue = localStorage.getItem("theme")
    themeMode.value = currentValue

    const isDark = currentValue === "dark"
    isDark ? setLight() : setDark()
    setThemeColour(isDark)
  }

  function setDark() {
    emits("is-dark-update", true)
    localStorage.theme = "dark"
    addClassToDocumentRoot("dark")
    removeClassToDocumentRoot("light")
  }

  function setLight() {
    emits("is-dark-update", false)
    localStorage.theme = "light"
    addClassToDocumentRoot("light")
    removeClassToDocumentRoot("dark")
  }

  function setThemeColour(isDark) {
    const themeColour = isDark ? "#fff" : "#000"
    const metaThemeColour = document.querySelector("meta[name=theme-color]")
    metaThemeColour.setAttribute("content", themeColour)
  }

  function addClassToDocumentRoot(classToAdd) {
    document.querySelector("body").classList.add(classToAdd)
  }

  function removeClassToDocumentRoot(classToRemove) {
    document.querySelector("body").classList.remove(classToRemove)
  }
</script>

<template>
  <button
    class="mode-switch-button button-icon button-icon--with-emoji ripple"
    @click="toggleDarkMode"
  >
    <div v-if="props.isDark">🌞</div>
    <div v-else>🌙</div>
  </button>
</template>

<style scoped>
  .mode-switch-button {
    @apply select-none sm:z-10 relative;
    @apply bg-slate-300;
    @apply h-8 !w-8 py-0 px-0 rounded;
  }
</style>
