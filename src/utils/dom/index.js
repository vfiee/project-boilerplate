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
  url = `/json/global_redirect/proxy.action?targetUrl=https%3A%2F%2Flapp-sandbox.xiaoshouyi.com%2Fservice%2Flapp%2Fpage%2Ftask_detail&objectId=3748555821860946&recordId=3765874092508183`
) {
  const href = decodeURIComponent(url || location.href)
  const [_, queryString] = href.split('?')
  const pairQueryList = (queryString || '').split('&')
  const query = {
    access_token:
      'bc16730e002a5ec4f5ebb061767669e4fcdb5e21d167e88190192d478c18bcea.MzQxNDgxMzcxOTE4NTQ0OA==0'
  }
  for (let i = 0; i < pairQueryList.length; i++) {
    const [key, value] = pairQueryList[i].split('=')
    query[key] = value
  }
  return query
}
