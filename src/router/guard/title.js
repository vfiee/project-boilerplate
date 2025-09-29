import { setDocumentTitle } from '@/utils'
import { get } from 'lodash-es'

export function createDocumentTitleGuard(router) {
  router.beforeEach((to, _from, next) => {
    const metaTitle = get(to, 'meta.title')
    setDocumentTitle(metaTitle)
    next()
  })
}
