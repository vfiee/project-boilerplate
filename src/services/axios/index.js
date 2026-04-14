import { useEnvStore } from "@/stores";
import { getAccessToken } from "@/utils";
import { useAxios as vueUseAxios } from "@vueuse/integrations/useAxios";
import axios from "axios";
import { get, merge } from "lodash-es";
import { showFailToast } from "vant";

const { DEV, APP_ENV } = import.meta.env;

export const isTest = APP_ENV === "test";

const instance = axios.create({
  timeout: 30000,
  adapter: "fetch",
  timeoutErrorMessage: "请求超时",
  responseType: "json",
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use((config) => {
  const { module: requestModule = "common" } = config || {};
  const envStore = useEnvStore();
  const { modules } = envStore.currentEnv || {};
  const { proxyPrefix, url } = modules[requestModule] || {};
  config.baseURL = DEV ? `/${proxyPrefix}` : url;
  if (DEV) {
    const access_token = getAccessToken();
    config.headers = merge({}, config.headers, {
      Authorization: `Bearer ${access_token}`,
    });
  }
  return config;
});

instance.interceptors.response.use((response) => {
  const skipResponseInterceptor = !get(response, "config.interceptors.response", true);
  if (skipResponseInterceptor) return response;
  const data = get(response, "data") || {};
  const { code, msg, message } = data;
  if (code == 200) return data;
  showFailToast(msg || message || "请求发生错误");
  return Promise.reject(response);
});

export function useAxios(url, config, options) {
  return vueUseAxios(url, config, instance, {
    immediate: false,
    resetOnExecute: true,
    ...(options || {}),
  });
}
