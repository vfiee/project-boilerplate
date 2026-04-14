import { setupDayjs, setupLoading, setupNProgress } from "@/plugins";
import { setupStore } from "@/stores";
import { autoLogin } from "@/utils";
import { ConfigProvider, Lazyload } from "vant";
import "vant/es/toast/style";
import "virtual:uno.css";
import { createApp } from "vue";
import App from "./App.vue";

async function setupApp() {
  setupLoading();
  setupNProgress();
  setupDayjs();
  const app = createApp(App).use(Lazyload).use(ConfigProvider);
  setupStore(app);
  await autoLogin();
  app.mount("#app");
}

setupApp();
