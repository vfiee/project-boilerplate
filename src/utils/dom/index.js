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

export function getUrlParams(
  url = `/json/global_redirect/proxy.action?targetUrl=https%3A%2F%2Flapp-sandbox.xiaoshouyi.com%2Fservice%2Flapp%2Fpage%2Ftask_detail&objectId=3748555821860946&recordId=3765600042484782`
) {
  const href = decodeURIComponent(url || location.href)
  const [_, queryString] = href.split('?')
  const pairQueryList = (queryString || '').split('&')
  const query = {
    access_token:
      '4566b61f21f8a9deff347859d5b28637090cd89f42a149778db6dc39973aabd9.MzQxNDgxMzcxOTE4NTQ0OA==0'
  }
  for (let i = 0; i < pairQueryList.length; i++) {
    const [key, value] = pairQueryList[i].split('=')
    query[key] = value
  }
  return query
}
