import useEnvStore from "@/components/pickerEnv/store"
import _axios from "axios"
import { get } from "lodash-es"

export { _axios }

const { DEV, APP_ENV } = import.meta.env

export const isTest = APP_ENV === "test"

export const axios = _axios.create({
	timeout: 30000,
	adapter: "fetch",
	timeoutErrorMessage: "请求超时",
	headers: {
		"Content-Type": "application/json"
	}
})

function onRejected(error) {
	const msg = get(error, "data.msg") || "请求错误"
	const showErrorToast = get(error, "config.toast", true)
	if (!showErrorToast) return
	closeToast()
	showFailToast({ message: msg })
}

axios.interceptors.request.use(config => {
	const { module: requestModule = "common" } = config || {}
	const envStore = useEnvStore()
	const { modules } = envStore.currentEnv.value || {}
	const { proxyPrefix, url } = modules[requestModule] || {}
	config.baseURL = DEV ? `/${proxyPrefix}` : url
	return config
})

axios.interceptors.response.use(
	response => {
		const { code } = get(response, "data")
		if (code !== 1) {
			onRejected(response)
			return Promise.reject(response)
		}
		return data
	},
	error => {
		if (!error?.request?.signal?.aborted) {
			onRejected(get(error, "response") || error)
		}
		return Promise.reject(error)
	}
)
