import { createProgressGuard } from './progress'
import { createRouteGuard } from './route'
import { createDocumentTitleGuard } from './title'

export function createRouterGuard(router) {
  createProgressGuard(router)
  createRouteGuard(router)
  createDocumentTitleGuard(router)
}
