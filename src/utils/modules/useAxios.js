import { useAuthStore, useEnvStore } from "@/stores"
import { un } from "@uni-helper/uni-network"
import { useUn } from "@uni-helper/uni-network/composables"
import { get, merge } from "lodash-es"
import { isH5 } from "./platform"

const { DEV } = import.meta.env

const instance = un.create({
	timeout: 30000,
	timeoutErrorMessage: "请求超时",
	headers: {
		"Content-Type": "application/json"
	}
})

async function onRejected(response) {
	const { errMsg, statusText, config } = response || {}
	const { message } = get(response, "data.data") || {}
	const msg = message || errMsg || statusText || "请求错误"
	const enableToast = get(config, "toast", true)
	if (enableToast) {
		await uni.showToast({ title: msg, icon: "error", duration: 3000 })
	}
}

instance.interceptors.request.use(config => {
	const { module: requestModule = "common" } = config || {}
	const envStore = useEnvStore()
	const authStore = useAuthStore()
	const { modules } = envStore.currentEnv || {}
	const { proxyPrefix, url } = modules[requestModule] || {}
	if (isH5) {
		config.baseURL = DEV ? `/${proxyPrefix}` : url
	} else {
		config.baseUrl = `/${proxyPrefix}`
	}
	config.headers = merge({}, config.headers, authStore.useHeaders)
	return config
})

instance.interceptors.response.use(
	response => {
		const { data, status } = response || {}
		const { code } = get(data, "data") || {}
		if (code === 0) {
			// 业务逻辑错误
			onRejected(response)
			if (status === 401) {
				// 未登录或登录超时，重定向到登录页面
				uni.reLaunch({ url: "/pages/login/index" })
			}
			return Promise.reject(response)
		}
		return Promise.resolve(response)
	},
	error => {
		if (!error?.request?.signal?.aborted) {
			onRejected(get(error, "response") || error)
		}
		return Promise.reject(error)
	}
)

export function useAxios(url, config, options) {
	return useUn(url, config, instance, {
		immediate: false,
		resetOnExecute: false,
		...(options || {})
	})
}
