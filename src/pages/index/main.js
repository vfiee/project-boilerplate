import { setupDayjs, setupNProgress } from '@/plugins'
import { setupStore } from '@/stores'
import 'virtual:uno.css'
import { createApp } from 'vue'
import App from './App.vue'

async function setupApp() {
  setupNProgress()
  setupDayjs()
  const app = createApp(App)
  setupStore(app)
  app.mount('#app')
}

setupApp()
