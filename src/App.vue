<script setup>
import { useEnvStore } from "@/stores";
import EnvConfig from "~/src/services/config/config.vue";
import HelloWorld from "./components/HelloWorld.vue";

const envStore = useEnvStore()

console.log(`envStore:`, envStore)
</script>

<template>
	<div>
		<a href="https://vite.dev" target="_blank">
			<img src="/vite.svg" class="logo" alt="Vite logo" />
		</a>
		<a href="https://vuejs.org/" target="_blank">
			<img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
		</a>
	</div>
	<div class="ml-10 text-xl" @click="envStore.show">logo</div>
	<HelloWorld msg="Vite + Vue" />
	<EnvConfig />
</template>

<style>
@import url("@/assets/styles/global.css");
.logo {
	height: 250px;
	padding: 1.5em;
	will-change: filter;
	transition: filter 300ms;
}
.logo:hover {
	filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
	filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
