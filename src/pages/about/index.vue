<route lang="json5">
{
	layout: "default",
	style: {
		navigationBarTitleText: "关于"
	}
}
</route>

<template>
	<view class="bg-white overflow-hidden pt-2 px-4">
		<view class="text-center text-xl mt-8">
			coder们好，我是
			<text class="text-red-500">vyron</text>
		</view>
		<button @click="handleToIndex">跳转到首页</button>
		<button @click="handleToPage1">跳转到分包page1</button>
	</view>
</template>

<script setup>
// 获取屏幕边界到安全区域距离
const { safeAreaInsets } = uni.getSystemInfoSync()
console.log(`safeAreaInsets:`, safeAreaInsets)

function handleToIndex() {
	uni.switchTab({
		url: `/pages/index/index`
	})
}
function handleToPage1() {
	uni.navigateTo({
		url: `/page1/demo/index`
	})
}
</script>
