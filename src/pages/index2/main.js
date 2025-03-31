import { setupDayjs, setupNProgress } from '@/plugins'
import 'virtual:uno.css'
import { createApp } from 'vue'
import App from './App.vue'

async function setupApp() {
  setupNProgress()
  setupDayjs()
  createApp(App).mount('#app')
}

setupApp()
