import { createPinia } from 'pinia'
import persisted from 'pinia-plugin-persistedstate'
export * from './modules/env'

export function setupStore(app) {
  const store = createPinia()
  store.use(persisted)
  app.use(store)
}
