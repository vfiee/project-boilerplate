import { breakpointsTailwind, useBreakpoints, useToggle } from '@vueuse/core'
import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', () => {
  const [reloadFlag, setReloadFlag] = useToggle(true)
  const [siderCollapse, toggleSiderCollapse] = useToggle(false)
  const [fullContent, toggleFullContent] = useToggle(false)
  const [contentXScrollable, setContentXScrollable] = useToggle(false)
  const breakpoints = useBreakpoints(breakpointsTailwind)

  const isMobile = breakpoints.smaller('sm')

  async function reloadPage(duration = 300) {
    setReloadFlag(false)

    await new Promise((resolve) => {
      setTimeout(resolve, duration)
    })

    setReloadFlag(true)
  }
  return {
    // reload
    reloadFlag,
    reloadPage,
    // sider collapse
    siderCollapse,
    toggleSiderCollapse,
    // mobile
    isMobile,
    // fullscreen content
    fullContent,
    toggleFullContent,
    contentXScrollable,
    setContentXScrollable
  }
})
