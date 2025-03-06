import { createPinia } from 'pinia'
export * from './modules/app'
export * from './modules/auth'
export * from './modules/router'
export * from './modules/tab'
export * from './modules/theme'

export function setupStore(app) {
  const store = createPinia()
  app.use(store)
}
