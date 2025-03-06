import { computed } from 'vue'
import { useRoute } from 'vue-router'

export function useMenu() {
  const route = useRoute()

  const selectedKey = computed(() => {
    const { hideInMenu, activeMenu } = route.meta
    const name = route.name

    const routeName = (hideInMenu ? activeMenu : name) || name

    return routeName
  })

  return {
    selectedKey
  }
}
