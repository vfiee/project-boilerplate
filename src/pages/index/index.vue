<route lang="json5" type="home">
{
	layout: "default",
	style: {
		navigationStyle: "custom",
		navigationBarTitleText: "首页"
	}
}
</route>
<template>
	<view
		class="bg-white overflow-hidden pt-2 px-4"
		:style="{ marginTop: safeAreaInsets?.top + 'px' }">
		<view class="mt-12">
			<image
				src="/static/images/logo.svg"
				alt=""
				class="w-28 h-28 block mx-auto" />
		</view>
		<view class="text-center text-2xl mt-2 mb-8">最好用的 uniapp 开发模板</view>

		<view
			class="text-justify max-w-100 m-auto text-4 indent mb-2 line-height-normal"
			>{{ description }}</view
		>
		<view class="text-center mt-8">
			当前平台是：
			<text class="text-green-500">{{ platform }}</text>
		</view>
		<button @click="handleAbout">跳转到关于页面</button>
		<button @click="handleToPage2">跳转到分包page2</button>
	</view>
</template>

<script setup>
import { platform } from "@/utils"

defineOptions({
	name: "Home"
})

// 获取屏幕边界到安全区域距离
const author = ref("vyron")
const description = ref(
	"集成了多种工具和技术的 uniapp 开发模板，由 uniapp + Vue3 + Ts + Vite4 + UnoCss + UniUI + VSCode 构建，模板具有代码提示、自动格式化、统一配置、代码片段等功能，并内置了许多常用的基本组件和基本功能，让你编写 uniapp 拥有 best 体验。"
)

const toast = useToast()
const message = useMessage()
// 测试 uni API 自动引入
onLoad(() => {
	console.log(author)
})

function handleAbout() {
	uni.switchTab({
		url: `/pages/about/index`
	})
}
function handleToPage2() {
	uni.navigateTo({
		url: `/page2/demo/index`
	})
}
</script>

<style>
.main-title-color {
	color: #d14328;
}
</style>
