<route lang="json5">
{
	layout: "default",
	style: {
		navigationBarTitleText: "登录"
	}
}
</route>

<script setup>
function handleLogin() {
	uni.navigator({
		url: `/pages/index/index`
	})
}
</script>
<template>
	<div>
		login
		<button @click="handleLogin">跳转到首页</button>
	</div>
</template>
