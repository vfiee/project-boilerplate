import { get } from "lodash-es"

export function getStorage(key, path, defaultValue) {
	let data
	try {
		data = JSON.parse(localStorage.getItem(key))
		if (path) {
			data = get(data, path, defaultValue)
		}
		data = data === undefined ? defaultValue : data
	} catch (_a) {
		data = null
	}
	return data
}

export function setStorage(key, value) {
	try {
		localStorage.setItem(key, JSON.stringify(value))
	} catch (_a) {}
}

export function removeStorage(key) {
	if (typeof key === "string") {
		return localStorage.removeItem(key)
	} else if (Array.isArray(key)) {
		for (let i = 0; i < key.length; i++) {
			localStorage.removeItem(key[i])
		}
	}
}
