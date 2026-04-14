import { reduce } from "lodash-es";
import { resolve } from "node:path";
import { URL, fileURLToPath } from "node:url";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig, loadEnv } from "vite";
import { getBuildTime, setupVitePlugins } from "./build";
import { getProxyConfig } from "./src/config/env";

const pages = ["index"];
export default defineConfig(({ mode }) => {
  const viteEnv = loadEnv(mode, process.cwd());
  const buildTime = getBuildTime();
  return {
    base: "./",
    define: {
      BUILD_TIME: JSON.stringify(buildTime),
    },
    resolve: {
      alias: {
        "~": fileURLToPath(new URL("./", import.meta.url)),
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    envPrefix: ["VITE_", "APP_"],
    server: {
      open: true,
      port: 4433,
      host: "0.0.0.0",
      proxy: getProxyConfig(),
    },
    build: {
      sourcemap: viteEnv.PROD,
      rollupOptions: {
        input: reduce(
          pages,
          (input, page) => {
            input[page] = resolve(__dirname, `${page}.html`);
            return input;
          },
          {},
        ),
        plugins: [
          //   visualizer({
          //     open: false, // 直接在浏览器中打开分析报告
          //     filename: "stats.html", // 输出文件的名称
          //     gzipSize: true, // 显示gzip后的大小
          //     brotliSize: true, // 显示brotli压缩后的大小
          //   }),
        ],
      },
    },
    plugins: setupVitePlugins(viteEnv, buildTime),
  };
});
