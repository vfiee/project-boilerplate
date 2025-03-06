import vue from '@vitejs/plugin-vue'
import unocss from 'unocss/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
import components from 'unplugin-vue-components/vite'
import setupProgress from 'vite-plugin-progress'
import vueDevtools from 'vite-plugin-vue-devtools'
import { setupHtmlPlugin } from './html'

export const setupVitePlugins = (viteEnv, buildTime) => {
  const { PROD } = viteEnv
  const plugins = [
    vue(),
    unocss(),
    components({
      dts: 'src/typings/components.d.ts',
      types: [{ from: 'vue-router', names: ['RouterLink', 'RouterView'] }],
      resolvers: [AntDesignVueResolver({ importStyle: false })]
    }),
    setupProgress(),
    setupHtmlPlugin(buildTime)
  ]
  if (!PROD) {
    plugins.push(vueDevtools())
  }
  return plugins
}
