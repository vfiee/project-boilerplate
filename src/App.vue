<script setup>
import PickerEnv from "@/components/pickerEnv/index.vue";
import { envs } from "@/config";
</script>

<template>
	<router-view v-slot="{ Component }">
		<keep-alive>
			<component :is="Component" :key="$route.fullPath" />
		</keep-alive>
	</router-view>
	<PickerEnv :envs="envs" />
</template>

<style>
@import url("@/assets/styles/global.css");
</style>
