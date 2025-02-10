import { VantResolver } from "@vant/auto-import-resolver"
import vue from "@vitejs/plugin-vue"
import { URL, fileURLToPath } from "node:url"
import { visualizer } from "rollup-plugin-visualizer"
import AutoImport from "unplugin-auto-import/vite"
import Components from "unplugin-vue-components/vite"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
	server: {
		open: true,
		port: 4433,
		host: "0.0.0.0",
		envPrefix: ["VITE_", "APP_"]
	},
	build: {
		rollupOptions: {
			plugins: [
				visualizer({
					open: true, // 直接在浏览器中打开分析报告
					filename: "stats.html", // 输出文件的名称
					gzipSize: true, // 显示gzip后的大小
					brotliSize: true // 显示brotli压缩后的大小
				})
			]
		}
	},
	plugins: [
		vue(),
		AutoImport({
			resolvers: [VantResolver()]
		}),
		Components({
			resolvers: [VantResolver()]
		})
	],
	resolve: {
		alias: {
			"@": fileURLToPath(new URL("./src", import.meta.url))
		}
	}
})
