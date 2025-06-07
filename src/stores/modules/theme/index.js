import { defineStore } from "pinia"
import { ref } from "vue"

export const useThemeStore = defineStore("theme", () => {
	const theme = ref("light")
	const themeVars = ref({ colorTheme: "#07c160" })

	function toggleTheme(mode) {
		theme.value = mode || (theme.value === "light" ? "dark" : "light")
	}

	return {
		theme,
		themeVars,
		toggleTheme
	}
})
