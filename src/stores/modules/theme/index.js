import { STORAGE_THEME_SETTING, initThemeSetting } from '@/config'
import { setStorage } from '@/utils'
import {
  useEventListener,
  usePreferredColorScheme,
  useToggle
} from '@vueuse/core'
import { defineStore } from 'pinia'
import { computed, ref, toRefs, watch } from 'vue'
import {
  addThemeVarsToGlobal,
  createThemeToken,
  getAntdTheme,
  toggleAuxiliaryColorModes,
  toggleCssDarkMode
} from './share'

export const useThemeStore = defineStore('theme', () => {
  const [themeDrawerVisible, toggleThemeDrawerVisible] = useToggle(false)
  const osTheme = usePreferredColorScheme()
  const settings = ref(initThemeSetting())

  const themeColors = computed(() => {
    const { themeColor, otherColor, isInfoFollowPrimary } = settings.value
    return {
      primary: themeColor,
      ...otherColor,
      info: isInfoFollowPrimary ? themeColor : otherColor.info
    }
  })

  const darkMode = computed(() => {
    const themeScheme = settings.value.themeScheme
    if (themeScheme === 'auto') {
      return osTheme.value === 'dark'
    }
    return themeScheme === 'dark'
  })

  const grayscaleMode = computed(() => settings.value.grayscale)
  const colorWeaknessMode = computed(() => settings.value.colourWeakness)
  const antdTheme = computed(() =>
    getAntdTheme(themeColors.value, darkMode.value)
  )

  function setThemeScheme(themeScheme) {
    settings.value.themeScheme = themeScheme
  }

  function setGrayscale(isGrayscale) {
    settings.value.grayscale = Boolean(isGrayscale)
  }

  function setColourWeakness(isColourWeakness) {
    settings.value.colourWeakness = Boolean(isColourWeakness)
  }

  function toggleThemeScheme() {
    const themeSchemes = ['light', 'dark', 'auto']

    const index = themeSchemes.findIndex(
      (item) => item === settings.value.themeScheme
    )

    const nextIndex = index === themeSchemes.length - 1 ? 0 : index + 1

    const nextThemeScheme = themeSchemes[nextIndex]

    setThemeScheme(nextThemeScheme)
  }

  function setThemeLayout(mode) {
    settings.value.layout.mode = mode
  }

  function cacheThemeSettings() {
    setStorage(STORAGE_THEME_SETTING, settings.value)
  }

  function setupThemeVarsToGlobal() {
    const { themeTokens, darkThemeTokens } = createThemeToken(
      themeColors.value,
      settings.value.tokens
    )
    addThemeVarsToGlobal(themeTokens, darkThemeTokens)
  }

  function updateThemeColors(key, color) {
    let colorValue = color

    if (key === 'primary') {
      settings.value.themeColor = colorValue
    } else {
      settings.value.otherColor[key] = colorValue
    }
  }

  watch(
    darkMode,
    (isDarkMode) => {
      toggleCssDarkMode(isDarkMode)
    },
    { immediate: true }
  )

  watch(
    themeColors,
    () => {
      setupThemeVarsToGlobal()
    },
    { immediate: true }
  )

  watch(
    [grayscaleMode, colorWeaknessMode],
    (val) => {
      toggleAuxiliaryColorModes(...val)
    },
    { immediate: true }
  )

  // cache theme settings when page is closed or refreshed
  useEventListener(window, 'beforeunload', () => {
    cacheThemeSettings()
  })

  return {
    ...toRefs(settings.value),
    themeColors,
    darkMode,
    grayscaleMode,
    colorWeaknessMode,
    antdTheme,
    updateThemeColors,
    setThemeScheme,
    setGrayscale,
    setColourWeakness,
    toggleThemeScheme,
    setThemeLayout,
    themeDrawerVisible,
    toggleThemeDrawerVisible
  }
})
