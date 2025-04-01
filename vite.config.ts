import Uni from "@dcloudio/vite-plugin-uni"
import { join, resolve } from "node:path"
import { defineConfig, loadEnv } from "vite"
// @see https://uni-helper.js.org/vite-plugin-uni-pages
import UniPages from "@uni-helper/vite-plugin-uni-pages"
// @see https://uni-helper.js.org/vite-plugin-uni-layouts
import UniLayouts from "@uni-helper/vite-plugin-uni-layouts"
// @see https://github.com/uni-helper/vite-plugin-uni-platform
// 需要与 @uni-helper/vite-plugin-uni-pages 插件一起使用
import UniPlatform from "@uni-helper/vite-plugin-uni-platform"
// @see https://github.com/uni-helper/vite-plugin-uni-manifest
import UniManifest from "@uni-helper/vite-plugin-uni-manifest"
// @see https://unocss.dev/
import { visualizer } from "rollup-plugin-visualizer"
import UnoCSS from "unocss/vite"
import AutoImport from "unplugin-auto-import/vite"
import ViteRestart from "vite-plugin-restart"
import {
	type EnvConfig,
	type EnvModule,
	envs
} from "./src/constant/modules/env"
import {
	copyNativeRes,
	fixUniAppVitePlugin,
	setupHtmlPlugin
} from "./vite-plugins"

const getProxyConfig = (envList: EnvConfig[]) => {
	return envList
		.map(config => Object.values(config.modules))
		.flat()
		.reduce((acc, envModule) => {
			const { proxyPrefix, url } = envModule as EnvModule
			acc[`/${proxyPrefix}`] = {
				target: url,
				secure: false,
				changeOrigin: true,
				headers: { Referer: url },
				rewrite: (path: string) =>
					path.replace(new RegExp(`^/${proxyPrefix}`), "")
			}
			return acc
		}, {})
}

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
	// console.log(mode === process.env.NODE_ENV) // true
	// mode: 区分生产环境还是开发环境
	console.log("command, mode -> ", command, mode)
	// pnpm dev:h5 时得到 => serve development
	// pnpm build:h5 时得到 => build production
	// pnpm dev:mp-weixin 时得到 => build development (注意区别，command为build)
	// pnpm build:mp-weixin 时得到 => build production
	// pnpm dev:app 时得到 => build development (注意区别，command为build)
	// pnpm build:app 时得到 => build production
	// dev 和 build 命令可以分别使用 .env.development 和 .env.production 的环境变量

	const { UNI_PLATFORM } = process.env
	console.log("UNI_PLATFORM -> ", UNI_PLATFORM) // 得到 mp-weixin, h5, app 等

	const env = loadEnv(mode, resolve(process.cwd(), "env"))
	const { VITE_APP_PORT, VITE_DELETE_CONSOLE, VITE_SHOW_SOURCEMAP } = env
	const isH5 = UNI_PLATFORM === "h5"
	const isApp = UNI_PLATFORM === "app"
	console.log("环境变量 env -> ", env)

	return {
		envDir: "./env",
		plugins: [
			UniPages({
				exclude: ["**/components/**/**.*"],
				routeBlockLang: "json5", // 虽然设了默认值，但是vue文件还是要加上 lang="json5", 这样才能很好地格式化
				// homePage 通过 vue 文件的 route-block 的type="home"来设定
				// pages 目录为 src/pages，分包目录不能配置在pages目录下
				// subPackages: ['src/pages-sub'], // 是个数组，可以配置多个，但是不能为pages里面的目录
				dts: "src/types/uni-pages.d.ts"
			}),
			UniLayouts(),
			UniPlatform(),
			UniManifest(),
			Uni(),
			fixUniAppVitePlugin(),
			UnoCSS(),
			AutoImport({
				imports: ["vue", "uni-app"],
				dts: "src/types/auto-import.d.ts",
				dirs: ["src/hooks"], // 自动导入 hooks
				eslintrc: { enabled: true },
				vueTemplate: true // default false
			}),

			ViteRestart({
				// 通过这个插件，在修改vite.config.js文件则不需要重新运行也生效配置
				restart: ["vite.config.js"]
			}),
			isH5 && setupHtmlPlugin(),
			// 打包分析插件，h5 + 生产环境才弹出
			isH5 &&
				mode === "production" &&
				visualizer({
					filename: "./node_modules/.cache/visualizer/stats.html",
					open: true,
					gzipSize: true,
					brotliSize: true
				}),
			// 只有在 app 平台时才启用 copyNativeRes 插件
			isApp && copyNativeRes()
		],
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
			host: "0.0.0.0",
			hmr: true,
			port: Number.parseInt(VITE_APP_PORT, 10),
			// 仅 H5 端生效，其他端不生效（其他端走build，不走devServer)
			proxy: isH5 ? getProxyConfig(envs) : undefined
		},
		build: {
			// 方便非h5端调试
			sourcemap: VITE_SHOW_SOURCEMAP === "true", // 默认是false
			target: "es6",
			// 开发环境不用压缩
			minify: mode === "development" ? false : "terser",
			terserOptions: {
				compress: {
					drop_console: VITE_DELETE_CONSOLE === "true",
					drop_debugger: true
				}
			}
		}
	}
})
