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
      '4566b61f21f8a9deff347859d5b28637090cd89f42a149778db6dc39973aabd9.MzQxNDgxMzcxOTE4NTQ0OA==0'
  }
  for (let i = 0; i < pairQueryList.length; i++) {
    const [key, value] = pairQueryList[i].split('=')
    query[key] = value
  }
  return query
}
