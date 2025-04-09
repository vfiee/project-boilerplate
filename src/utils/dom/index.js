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

export function getUrlParams() {
  const [_, queryString] = location.href.split('?')
  const pairQueryList = (queryString || '').split('&')
  const query = {
    objectId: '3748555821860946',
    recordId: '3748558651868205',
    access_token:
      '20319378a4a3546f20ad3425bddfe1d07c6de556837ccd9a72d855e7d5a717ba.MzQxNDgxMzcxOTE4NTQ0OA==0'
  }
  for (let i = 0; i < pairQueryList.length; i++) {
    const [key, value] = pairQueryList[i].split('=')
    query[key] = value
  }
  return query
}
