import { createProgressGuard } from './progress'
import { createDocumentTitleGuard } from './title'

export function createRouterGuard(router) {
  createProgressGuard(router)
  createDocumentTitleGuard(router)
}
