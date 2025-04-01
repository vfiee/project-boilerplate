<route lang="json5">
{
	style: {
		navigationBarTitleText: "关于"
	}
}
</route>

<template>
	<view
		class="bg-white overflow-hidden pt-2 px-4"
		:style="{ marginTop: safeAreaInsets?.top + 'px' }">
		<view class="text-center text-xl mt-8">
			coder们好，我是
			<text class="text-red-500">vyron</text>
		</view>
	</view>
</template>

<script lang="ts" setup>
// 获取屏幕边界到安全区域距离
const { safeAreaInsets } = uni.getSystemInfoSync()
console.log(safeAreaInsets)
</script>

<style lang="scss" scoped>
.test-css {
	// mt-4=>1rem=>16px;
	margin-top: 16px;
}
</style>
