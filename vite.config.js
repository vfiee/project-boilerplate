import Uni from "@dcloudio/vite-plugin-uni"
import Components from "@uni-helper/vite-plugin-uni-components"
import { WotResolver } from "@uni-helper/vite-plugin-uni-components/resolvers"
import UniLayouts from "@uni-helper/vite-plugin-uni-layouts"
import UniManifest from "@uni-helper/vite-plugin-uni-manifest"
import UniPages from "@uni-helper/vite-plugin-uni-pages"
import { join } from "node:path"
import { visualizer } from "rollup-plugin-visualizer"
// import UnoCSS from "unocss/vite"
import AutoImport from "unplugin-auto-import/vite"
import UniRouter from "unplugin-uni-router/dist/vite.js"
import { defineConfig } from "vite"
import ViteRestart from "vite-plugin-restart"
import UniPolyfill from "vite-plugin-uni-polyfill"
import { envs } from "./src/constant/modules/env"
import {
	copyNativeRes,
	fixUniAppVitePlugin,
	setupHtmlPlugin
} from "./vite-plugins"

// @see https://uni-helper.js.org
// 不支持的commonjs模块，可以使用动态导入的方式
// const UnoCSS = await import('unocss/vite').then(m=>m.default)

const getProxyConfig = envList => {
	return envList
		.map(config => Object.values(config.modules))
		.flat()
		.reduce((acc, envModule) => {
			const { proxyPrefix, url } = envModule
			acc[`/${proxyPrefix}`] = {
				target: url,
				secure: false,
				changeOrigin: true,
				headers: { Referer: url },
				rewrite: path => path.replace(new RegExp(`^/${proxyPrefix}`), "")
			}
			return acc
		}, {})
}

const getBuildConfig = isDevelopment => {
	if (!isDevelopment) return {}
	return {
		watch: {
			exclude: ["node_modules/**", "/__uno.css"]
		}
	}
}

const resolveEsPlugin = (module, options) => {
	return (module?.default || module)(options)
}

// https://vitejs.dev/config/
export default defineConfig(async ({ mode }) => {
	const { UNI_PLATFORM } = process.env
	const isH5 = UNI_PLATFORM === "h5"
	const isApp = UNI_PLATFORM === "app"
	const isDevelopment = mode === "development"
	const isProduction = mode === "production"
	console.log("UNI_PLATFORM:", UNI_PLATFORM) // 得到 mp-weixin, h5, app 等
	const UnoCSS = await import("unocss/vite").then(m => m.default)
	return {
		envPrefix: ["VITE_", "UNI_", "APP_"],
		define: {
			__UNI_PLATFORM__: JSON.stringify(UNI_PLATFORM)
		},
		css: {
			postcss: {
				plugins: []
			}
		},
		resolve: {
			alias: {
				"~": join(process.cwd(), "./"),
				"@": join(process.cwd(), "./src")
			}
		},
		server: {
			hmr: true,
			port: 8088,
			host: "0.0.0.0",
			proxy: isH5 ? getProxyConfig(envs) : undefined
		},
		optimizeDeps: {},
		build: {
			target: "es6",
			outDir: "app",
			sourcemap: isProduction,
			minify: isDevelopment ? false : "terser",
			terserOptions: {
				compress: {
					drop_console: true,
					drop_debugger: true
				}
			},
			...getBuildConfig()
		},
		plugins: [
			resolveEsPlugin(UniPages, {
				dts: false,
				routeBlockLang: "json5",
				exclude: ["**/components/**/**.*"],
				// dts: "src/types/uni-pages.d.ts",
				subPackages: ["src/page1", "src/page2"]
			}),
			resolveEsPlugin(UniLayouts),
			UniManifest(),
			resolveEsPlugin(Uni),
			resolveEsPlugin(UniRouter),
			resolveEsPlugin(UniPolyfill),
			fixUniAppVitePlugin(),
			UnoCSS(),
			AutoImport({
				imports: [
					"vue",
					"@vueuse/core",
					"uni-app",
					{
						from: "wot-design-uni",
						imports: ["useToast", "useNotify", "useMessage"]
					}
				],
				dts: "src/types/auto-import.d.ts",
				dirs: ["./src/hooks/**"], // 自动导入 hooks
				vueTemplate: true // default false
			}),
			Components({
				resolvers: [WotResolver()],
				dts: "src/types/components.d.ts",
				directoryAsNamespace: true
			}),
			ViteRestart({ restart: ["vite.config.js"] }),
			isH5 && setupHtmlPlugin(),
			// 打包分析插件，h5 + 生产环境才弹出
			isH5 &&
				isProduction &&
				visualizer({
					filename: "./node_modules/.cache/visualizer/stats.html",
					open: true,
					gzipSize: true,
					brotliSize: true
				}),
			// 只有在 app 平台时才启用 copyNativeRes 插件
			isApp && copyNativeRes()
		]
	}
})
