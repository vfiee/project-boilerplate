<script setup>
import { useThemeStore } from "@/stores"

const themeStore = useThemeStore()
</script>

<template>
	<wd-config-provider
		:theme="themeStore.theme"
		:themeVars="themeStore.themeVars">
		<slot />
		<wd-toast position="middle" />
		<wd-message-box />
	</wd-config-provider>
</template>
