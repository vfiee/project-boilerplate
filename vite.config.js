import { VantResolver } from "@vant/auto-import-resolver"
import vue from "@vitejs/plugin-vue"
import { URL, fileURLToPath } from "node:url"
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
			"~": fileURLToPath(new URL("./", import.meta.url)),
			"@": fileURLToPath(new URL("./src", import.meta.url))
		}
	}
})
