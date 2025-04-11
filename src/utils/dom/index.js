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
      '8f91993f13589bc5ccdad5aa2d4d3cd61c35e17a898ed75b811da038f45a080c.MzQxNDgxMzcxOTE4NTQ0OA==0'
  }
  for (let i = 0; i < pairQueryList.length; i++) {
    const [key, value] = pairQueryList[i].split('=')
    query[key] = value
  }
  return query
}
