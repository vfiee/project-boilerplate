import { defineUniPages } from "@uni-helper/vite-plugin-uni-pages"

export default defineUniPages({
	globalStyle: {
		navigationStyle: "default",
		navigationBarTitleText: "uni-app",
		navigationBarBackgroundColor: "#f8f8f8",
		navigationBarTextStyle: "black",
		backgroundColor: "#ffffff"
	},
	tabBar: {
		color: "#999999",
		selectedColor: "#018d71",
		backgroundColor: "#F8F8F8",
		borderStyle: "black",
		height: "50px",
		fontSize: "10px",
		iconWidth: "24px",
		spacing: "5px",
		list: [
			{
				text: "首页",
				pagePath: "pages/index/index",
				iconPath: "static/images/tabbar/home.png",
				selectedIconPath: "static/images/tabbar/homeHL.png"
			},
			{
				text: "关于",
				pagePath: "pages/about/index",
				iconPath: "static/images/tabbar/example.png",
				selectedIconPath: "static/images/tabbar/exampleHL.png"
			}
		]
	}
})
