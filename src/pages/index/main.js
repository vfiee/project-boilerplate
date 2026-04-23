import { setupDayjs } from '@/plugins'
import { addCrmEventListener } from '@/services'
import { setupStore } from '@/stores'
import { autoLogin } from '@/utils'
import 'virtual:uno.css'
import { createApp } from 'vue'
import App from './App.vue'

async function setupApp() {
  setupDayjs()
  const app = createApp(App)
  setupStore(app)
  await autoLogin()
  app.mount('#app')
  addCrmEventListener()
}

setupApp()
