export const updateRootThemeColor = color => {
	const root = document.querySelector(":root")
	root.style.setProperty("--primary-color", color)
}

export function isWechatBrowser() {
	const ua = navigator.userAgent.toLowerCase()
	const isWXWork = ua.match(/wxwork/i) == "wxwork"
	return !isWXWork && ua.match(/MicroMessenger/i) == "micromessenger"
}

export function setDocumentTitle(title) {
	if (!title) return
	const body = document.body
	document.title = title
	if (!isWechatBrowser()) return
	const iframe = document.createElement("iframe")
	iframe.setAttribute("style", "display:none;width:0px;height:0px")
	iframe.setAttribute("src", "/logo.ico")
	body.appendChild(iframe)
	const fn = () => {
		setTimeout(function () {
			iframe.removeEventListener("load", fn)
			body.removeChild(iframe)
		}, 0)
	}
	iframe.addEventListener("load", fn)
}

export function getUrlParams(url = location.href) {
	const params = {}
	// 提取主URL参数
	url.replace(/(?:[?&])([^=]+)=([^&]+)/g, (_, key, value) => {
		const decodedValue = decodeURIComponent(decodeURIComponent(value))
		params[key] = decodedValue
		// 检查值是否是URL，如果是则提取其参数
		if (decodedValue.includes("?")) {
			Object.assign(params, getUrlParams(decodedValue, true) || {})
		}
	})
	return params
}
