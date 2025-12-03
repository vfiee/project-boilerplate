import { useAxios } from "@/services"
import { getStorage, setStorage } from "@/utils"
import dayjs from "dayjs"
import { get } from "lodash-es"

const { DEV } = import.meta.env

export function updateDialogTitle(title) {
  if (!title) return
  window.parent.postMessage(
    {
      action: "set_dialog_title",
      actionParam: title
    },
    "*"
  )
}

export function closeDialog() {
  window.parent.postMessage({ doClose: true }, "*")
}

export function postDialogData(data) {
  if (!data) return
  window.parent.postMessage(
    {
      isvData: data,
      doClose: true
    },
    "*"
  )
}

// 根据当前环境返回基础的URL
export function resolveCrmEnv() {
  const sandboxUrl = `https://api-sandbox.xiaoshouyi.com`
  const url = `https://api.xiaoshouyi.com`
  return DEV || location.origin.includes("sandbox") ? sandboxUrl : url
}

// DEV环境开发时，配置账号密码自动登录获取access_token并设置到本地缓存中
export async function autoLogin() {
  const { DEV, APP_ENV } = import.meta.env
  const now = dayjs().format("YYYY-MM-DD")
  const storageAccessToken = getStorage(`${now}_access_token`)
  if (!DEV || storageAccessToken) return
  const isProd = APP_ENV === "production"
  const data = isProd
    ? {}
    : {
      grant_type: "password",
      username: "",
      password: "" + "",
      client_id: "",
      client_secret: ""
    }
  const { execute, data: res } = useAxios("/oauth2/token", {
    data,
    method: "POST",
    interceptors: { response: false },
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  })
  await execute()
  const access_token = get(res.value, "access_token")
  setStorage(`${now}__access_token`, access_token)
}
