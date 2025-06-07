import { get } from "lodash-es"

export function getStorage(key, path, defaultValue) {
	const value = uni.getStorageSync(key)
	return path ? get(value, path, defaultValue) : value
}

export const setStorage = uni.setStorageSync

export const removeStorage = uni.removeStorageSync

export const clearStorage = uni.clearStorageSync

export const getStorageInfo = uni.getStorageInfoSync
