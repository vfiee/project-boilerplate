import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useMenu = defineStore('menu', () => {
  const menus = ref([])

  const initMenuStore = (menuList) => {
    menus.value = menuList
  }
  return {
    menus,
    initMenuStore
  }
})
