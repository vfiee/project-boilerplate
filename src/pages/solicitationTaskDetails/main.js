import { setupDayjs } from '@/plugins'
import { addCrmEventListener } from '@/services'
import { setupStore } from '@/stores'
import 'virtual:uno.css'
import { createApp } from 'vue'
import App from './App.vue'
import './styles/main.less'

async function setupApp() {
  setupDayjs()
  const app = createApp(App)
  setupStore(app)
  app.mount('#app')
  addCrmEventListener()
}

setupApp()
