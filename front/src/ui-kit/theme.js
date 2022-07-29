import { ref } from "vue"

const modes = {
  light: {
    name: "Light Mode",
    code: "light",
    options: [
      { label: "White", value: "white" },
      { label: "Sepia", value: "_sepia", disabled: true }]
  },
  dark: {
    name: "Dark Mode",
    code: "dark",
    options: [
      { label: "Slate", value: "dark-slate" },
      { label: "Black", value: "just-black" }
    ]
  }
}

const selectedThemes = ref({})

const localStorageTheme = localStorage.theme
const themeMode = ref(localStorageTheme)

export default function useTheme() {
  return {
    themeMode,
    modes,
    selectedThemes,
    initialiseSelectedThemesRef,
    toggleClasses
  }
}

function initialiseSelectedThemesRef() {
  selectedThemes.value.light = localStorage.light || modes.light.options[0].value
  selectedThemes.value.dark = localStorage.dark || modes.dark.options[0].value

  const mode = localStorage.theme || 'light'
  const value = selectedThemes.value[mode] || 'light'

  toggleClasses(mode, value)

  const themeColour = mode === "dark" ? "#000" : "#fff"
  const metaThemeColour = document.querySelector("meta[name=theme-color]")
  metaThemeColour.setAttribute("content", themeColour)
}

function toggleClasses(mode, addClass) {
  if (!addClass) { return }

  const [defaultCass, customClass] = getModeClasses(mode)
  const removeClass = addClass === defaultCass ? customClass : defaultCass

  document.querySelector('body').classList.add(addClass)
  document.querySelector('body').classList.remove(removeClass)
}

function getModeClasses(mode) {
  return modes[mode].options.map(({ value }) => value)
}