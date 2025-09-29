import Vue from '@vitejs/plugin-vue'
import Unocss from 'unocss/vite'
import AutoImport from "unplugin-auto-import/vite"
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import setupProgress from 'vite-plugin-progress'
import VueDevtools from 'vite-plugin-vue-devtools'
import { setupHtmlPlugin } from './html'

export const setupVitePlugins = (viteEnv, buildTime) => {
  const { PROD } = viteEnv
  const plugins = [
    Vue(),
    Unocss(),
    Components({
      dts: 'src/typings/components.d.ts',
      types: [{ from: 'vue-router', names: ['RouterLink', 'RouterView'] }],
      resolvers: [AntDesignVueResolver({ importStyle: false })]
    }),
    AutoImport({
      imports: [
        "vue",
        "@vueuse/core",
        "vue-router",
        {
          "lodash-es": [
            "get",
            "set",
            "unset",
            "isEmpty",
            "map",
            "reduce",
            "cloneDeep",
            "find",
            "isNil",
          ]
        }
      ],
      dts: "src/types/auto-import.d.ts",
      dirs: ["src/hooks"], // 自动导入 hooks
      vueTemplate: true // default false
    }),
    setupProgress(),
    setupHtmlPlugin(buildTime)
  ]
  if (!PROD) {
    plugins.push(VueDevtools())
  }
  return plugins
}
