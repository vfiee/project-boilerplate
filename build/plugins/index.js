import vue from "@vitejs/plugin-vue"
import unocss from "unocss/vite"
import AutoImport from "unplugin-auto-import/vite"
import { VantResolver } from "unplugin-vue-components/resolvers"
import Components from "unplugin-vue-components/vite"
import setupProgress from "vite-plugin-progress"
import vueDevtools from "vite-plugin-vue-devtools"
import { setupHtmlPlugin } from "./html"

export const setupVitePlugins = (viteEnv, buildTime) => {
	const { PROD } = viteEnv
	const plugins = [
		vue(),
		unocss(),
		AutoImport({
			resolvers: [VantResolver()]
		}),
		Components({
			dts: "src/typings/components.d.ts",
			types: [{ from: "vue-router", names: ["RouterLink", "RouterView"] }],
			resolvers: [VantResolver({ importStyle: "css" })]
		}),

		setupProgress(),
		setupHtmlPlugin(buildTime)
	]
	if (!PROD) {
		plugins.push(vueDevtools())
	}
	return plugins
}
