import { URL, fileURLToPath } from 'node:url'
import { visualizer } from 'rollup-plugin-visualizer'
import { defineConfig, loadEnv } from 'vite'
import { getBuildTime, setupVitePlugins } from './build'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const viteEnv = loadEnv(mode, process.cwd())
  const buildTime = getBuildTime()
  return {
    define: {
      BUILD_TIME: JSON.stringify(buildTime)
    },
    resolve: {
      alias: {
        '~': fileURLToPath(new URL('./', import.meta.url)),
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    server: {
      open: true,
      port: 4433,
      host: '0.0.0.0',
      // proxy: getProxyConfig(),
      envPrefix: ['VITE_', 'APP_']
    },
    build: {
      sourcemap: viteEnv.PROD,
      rollupOptions: {
        plugins: [
          visualizer({
            open: true, // 直接在浏览器中打开分析报告
            filename: 'stats.html', // 输出文件的名称
            gzipSize: true, // 显示gzip后的大小
            brotliSize: true // 显示brotli压缩后的大小
          })
        ]
      }
    },
    plugins: setupVitePlugins(viteEnv, buildTime)
  }
})
