import 'virtual:uno.css'
import { createApp } from 'vue'
import App from './App.vue'
import {
  setupAppUpdate,
  setupDayjs,
  setupLoading,
  setupNProgress
} from './plugins'
import { setupRouter } from './router'
import { setupStore } from './stores'

async function setupApp() {
  setupLoading()
  setupNProgress()
  setupDayjs()
  const app = createApp(App)
  setupStore(app)
  await setupRouter(app)
  setupAppUpdate(app)
  app.mount('#app')
}

setupApp()
