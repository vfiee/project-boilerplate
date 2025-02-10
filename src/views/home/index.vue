<script setup>
import { Icon } from "@iconify/vue";
import { ref } from "vue";

const count = ref(0)
</script>

<template>
	<div>
		Icon: <Icon icon="material-symbols:10k-outline" />
		<h1>Home Page</h1>
		<p>Count: {{ count }}</p>
		<button @click="count++">Increment</button>
	</div>
</template>
