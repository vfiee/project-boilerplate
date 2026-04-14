import { useAxios } from "@/services";
import { getStorage, setStorage } from "@/utils";
import dayjs from "dayjs";
import { get } from "lodash-es";

const { DEV } = import.meta.env;

export function updateDialogTitle(title) {
  if (!title) return;
  window.parent.postMessage(
    {
      action: "set_dialog_title",
      actionParam: title,
    },
    "*",
  );
}

export function closeDialog() {
  window.parent.postMessage({ doClose: true }, "*");
  window.parent.postMessage({ action: "close_dialog" }, "*");
}

export function postDialogData(data) {
  if (!data) return;
  window.parent.postMessage(
    {
      isvData: data,
      doClose: true,
    },
    "*",
  );
}

// 根据当前环境返回基础的URL
export function resolveCrmEnv() {
  const sandboxUrl = `https://api-sandbox.xiaoshouyi.com`;
  const url = `https://api.xiaoshouyi.com`;
  return DEV || location.origin.includes("sandbox") ? sandboxUrl : url;
}

function getAccessTokenStorageKey() {
  const now = dayjs().format("YYYY-MM-DD");
  return `${now}_ACCESS_TOKEN`;
}

export function setAccessToken(value) {
  setStorage(getAccessTokenStorageKey(), value);
}

export function getAccessToken() {
  return getStorage(getAccessTokenStorageKey());
}

// DEV环境开发时，配置账号密码自动登录获取access_token并设置到本地缓存中
export async function autoLogin() {
  const { APP_ENV, PROD } = import.meta.env;
  const storageAccessToken = getAccessToken();
  if (storageAccessToken) return;
  const isProd = APP_ENV === "production";
  if (PROD) return;
  const data = isProd
    ? {
        grant_type: "password",
        username: "",
        password: "" + "",
        client_id: "",
        client_secret: "",
      }
    : {
        grant_type: "password",
        username: "",
        password: "" + "",
        client_id: "",
        client_secret: "",
      };
  const { execute, data: res } = useAxios(`/oauth2/token`, {
    data,
    method: "POST",
    interceptors: { response: false },
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
  await execute();
  setAccessToken(get(res.value, "access_token"));
}
