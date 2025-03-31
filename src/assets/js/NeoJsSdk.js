//此js用于在开发页面注入ctx,以便在开发页面中使用ctx中的能力，后续加入版本管理

const promiseArr = {}
// 接收方的 message event handler
function crmHandleMessage(event) {
  console.log('handleMessage', event)
  const { actionType, data } = event.data
  switch (actionType) {
    case 'openCreateForm':
      promiseArr['openCreateForm'].resolve(data)
      break
    case 'openEditForm':
      promiseArr['openEditForm'].resolve(data)
      break
  }
}
window.addEventListener('message', crmHandleMessage)
const api = {
  openCreateForm: function (params) {
    window.parent.postMessage(
      { actionType: 'openCreateForm', data: params },
      '*'
    )
    const promise = new Promise((resolve, reject) => {
      promiseArr['openCreateForm'] = { resolve, reject }
    })

    return promise
  },
  openEditForm: function (params) {
    window.parent.postMessage({ actionType: 'openEditForm', data: params }, '*')
    const promise = new Promise((resolve, reject) => {
      promiseArr['openEditForm'] = { resolve, reject }
    })

    return promise
  },
  openCopyForm: function (params) {
    window.parent.postMessage({ actionType: 'openCopyForm', data: params }, '*')
  },
  openDetailPage: function (params) {
    window.parent.postMessage(
      { actionType: 'openDetailPage', data: params },
      '*'
    )
  },
  openListPage: function (params) {
    window.parent.postMessage({ actionType: 'openListPage', data: params }, '*')
  }
}
const ui = {
  openIframe: function (params) {
    window.parent.postMessage({ actionType: 'openIframe', data: params }, '*')
  },
  closeIframe: function (params) {
    window.removeEventListener('message', crmHandleMessage)
    window.parent.postMessage({ actionType: 'closeIframe', data: params }, '*')
  },
  reloadPageData: function (params) {
    window.parent.postMessage(
      { actionType: 'reloadPageData', data: params },
      '*'
    )
  },
  refreshPage: function (params) {
    window.parent.postMessage({ actionType: 'refreshPage', data: params }, '*')
  }
}
let ctx = { api: api, ui: ui }
console.log('crmContext:', ctx)
window.ctx = ctx
