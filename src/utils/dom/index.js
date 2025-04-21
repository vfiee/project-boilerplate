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
export function getUrlParams(url) {
  const href = decodeURIComponent(url || location.href)
  const [_, queryString] = href.split('?')
  const pairQueryList = (queryString || '').split('&')
  const query = {}
  if (DEV) {
    query['access_token'] =
      '5426ad6fddf713d9e2065a9cf20331133e4e842ae66dc0cc0a7c51f6f8bfc724.MzQxNDgxMzcxOTE4NTQ0OA==0'
  }
  for (let i = 0; i < pairQueryList.length; i++) {
    const [key, value] = pairQueryList[i].split('=')
    query[key] = value
  }
  return query
}
