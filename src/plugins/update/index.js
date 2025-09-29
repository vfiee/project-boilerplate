import { Button } from 'ant-design-vue'
import { h } from 'vue'

export function setupAppUpdate() {
  const { PROD } = import.meta.env
  if (!PROD) return

  let isShow = false
  let updateTimer
  const UPDATE_CHECK_INTERVAL = 5 * 60 * 1000

  const checkForUpdates = async () => {
    if (isShow) return

    const buildTime = await getHtmlBuildTime()

    // If build time hasn't changed, no update is needed
    if (!buildTime || buildTime === BUILD_TIME) return

    isShow = true

    const key = `open${Date.now()}`

    window.$notification?.open({
      key,
      message: '系统版本更新通知',
      description: '检测到系统有新版本发布，是否立即刷新页面？',
      btn() {
        return h(
          'div',
          {
            style: {
              display: 'flex',
              justifyContent: 'end',
              gap: '12px',
              width: '325px'
            }
          },
          [
            h(
              Button,
              {
                onClick() {
                  window.$notification?.destroy(key)
                  isShow = false
                }
              },
              () => '稍后再说'
            ),
            h(
              Button,
              {
                type: 'primary',
                onClick() {
                  location.reload()
                }
              },
              () => '立即刷新'
            )
          ]
        )
      },
      onClose() {
        isShow = false
      }
    })

    startUpdateTimeout()
  }

  const startUpdateTimeout = () => {
    if (updateTimer) {
      clearTimeout(updateTimer)
    }
    updateTimer = setTimeout(checkForUpdates, UPDATE_CHECK_INTERVAL)
  }

  if (!isShow && document.visibilityState === 'visible') {
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        checkForUpdates()
      }
    })
  }
  startUpdateTimeout()
}

async function getHtmlBuildTime() {
  const baseUrl = import.meta.env.VITE_BASE_URL || '/'

  const res = await fetch(`${baseUrl}index.html?time=${Date.now()}`)

  const html = await res.text()

  const match = html.match(/<meta name="buildTime" content="(.*)">/)

  const buildTime = match?.[1] || ''

  return buildTime
}
