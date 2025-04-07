import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import unocss from 'unocss/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
import components from 'unplugin-vue-components/vite'
import setupProgress from 'vite-plugin-progress'
import vueDevtools from 'vite-plugin-vue-devtools'

export const setupVitePlugins = (viteEnv) => {
  const { PROD } = viteEnv
  const plugins = [
    vue(),
    vueJsx(),
    unocss(),
    components({
      types: [{ from: 'vue-router', names: ['RouterLink', 'RouterView'] }],
      resolvers: [AntDesignVueResolver({ importStyle: false })]
    }),
    setupProgress()
  ]
  if (!PROD) {
    plugins.push(vueDevtools())
  }
  return plugins
}
