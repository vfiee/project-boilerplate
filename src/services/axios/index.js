import router from "@/router"
import { useAuthStore, useEnvStore } from "@/stores"
import { useAxios as vueUseAxios } from "@vueuse/integrations/useAxios"
import axios from "axios"
import { get, merge } from "lodash-es"
import { showFailToast } from "vant"

const { DEV, APP_ENV } = import.meta.env

export const isTest = APP_ENV === "test"

const instance = axios.create({
	timeout: 30000,
	adapter: "fetch",
	timeoutErrorMessage: "请求超时",
	headers: {
		"Content-Type": "application/json"
	}
})

function onRejected(error) {
	if (get(error, "config.signal.aborted")) return
	const statusCode = get(error, "statusCode")
	if (statusCode === 401) {
		const authStore = useAuthStore()
		authStore.remove()
		router.replace("/")
	}
	const msg = get(error, "data.msg") || error?.message || "请求错误"
	const showErrorToast = get(error, "config.toast", true)
	if (!showErrorToast) return
	showFailToast(msg)
}

instance.interceptors.request.use(config => {
	const { module: requestModule = "common" } = config || {}
	const envStore = useEnvStore()
	const authStore = useAuthStore()
	const { modules } = envStore.currentEnv || {}
	const { proxyPrefix, url } = modules[requestModule] || {}
	config.baseURL = DEV ? `/${proxyPrefix}` : url
	config.headers = merge({}, config.headers, authStore.useHeaders)
	return config
})

instance.interceptors.response.use(
	response => {
		const { code } = get(response, "data") || {}
		if (code === 1) {
			return Promise.resolve(response?.data)
		}
		onRejected(response)
		return Promise.reject(response)
	},
	error => {
		if (!error?.request?.signal?.aborted) {
			onRejected(get(error, "response") || error)
		}
		return Promise.reject(error)
	}
)

export function useAxios(url, config, options) {
	return vueUseAxios(url, config, instance, {
		immediate: false,
		resetOnExecute: true,
		...(options || {})
	})
}
