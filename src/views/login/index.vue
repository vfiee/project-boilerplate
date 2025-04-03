<script setup>
import { useRouter } from "vue-router"

const router = useRouter()

const toHome = () => {
	router.replace("/index")
}
</script>
<template>
	<div>
		login
		<van-button type="primary" @click="toHome">去首页</van-button>
	</div>
</template>
