//此js用于在开发页面注入ctx,以便在开发页面中使用ctx中的能力，后续加入版本管理

const promises = {}

function onCrmMessage(event) {
  const { actionType, data } = event.data
  switch (actionType) {
    case 'openCreateForm':
      promises['openCreateForm'].resolve(data)
      break
    case 'openEditForm':
      promises['openEditForm'].resolve(data)
      break
  }
}

export function addCrmEventListener() {
  window.addEventListener('message', onCrmMessage)
}

export function removeCrmEventListener() {
  window.removeEventListener('message', onCrmMessage)
}

function postMessage(action, data) {
  window.parent.postMessage({ action, data }, '*')
}

export const openIframe = (data) => postMessage('openIframe', data)
export const closeIframe = (data) => {
  removeCrmEventListener()
  postMessage('closeIframe', data)
}
export const reloadPageData = (data) => postMessage('reloadPageData', data)
export const refreshPage = (data) => postMessage('refreshPage', data)
export const openListPage = (data) => postMessage('openListPage', data)
export const openDetailPage = (data) => postMessage('openDetailPage', data)
export const openCopyForm = (data) => postMessage('openCopyForm', data)
export const openEditForm = (data) => {
  postMessage('openEditForm', data)
  return new Promise((resolve, reject) => {
    promises['openEditForm'] = { resolve, reject }
  })
}

export const openCreateForm = (data) => {
  postMessage('openCreateForm', data)
  return new Promise((resolve, reject) => {
    promises['openCreateForm'] = { resolve, reject }
  })
}

export function closeDialog() {
  postMessage('close_dialog')
}
