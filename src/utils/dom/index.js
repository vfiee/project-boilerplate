const { DEV } = import.meta.env

export const updateRootThemeColor = (color) => {
  const root = document.querySelector(':root')
  // const themeColor = getComputedStyle(root)
  //   .getPropertyValue("--primary-color")
  //   .trim()
  root.style.setProperty('--primary-color', color)
}

export function setDocumentTitle(title) {
  if (!title) return
  document.title = title
}

export function getUrlParams(url = location.href, ignore = false) {
  const params = {}
  if (DEV && !ignore) {
    url = ``
  }
  // 提取主URL参数
  url.replace(/(?:[?&])([^=]+)=([^&]+)/g, (_, key, value) => {
    const decodedValue = decodeURIComponent(decodeURIComponent(value))
    params[key] = decodedValue
    // 检查值是否是URL，如果是则提取其参数
    if (decodedValue.includes('?')) {
      Object.assign(params, getUrlParams(decodedValue, true) || {})
    }
  })

  return params
}
