import { ref } from 'vue'

const __loginModule__ = ref('pwd-login')

export function useLoginModule() {
  function updateLoginModule(moduleKey) {
    __loginModule__.value = moduleKey
  }

  return {
    updateLoginModule,
    loginModule: __loginModule__
  }
}
