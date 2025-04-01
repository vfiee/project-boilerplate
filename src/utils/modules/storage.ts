import { get } from "lodash-es"

export function getStorage<T = any, R = any>(
	key: string,
	path?: string,
	defaultValue = undefined
): R | T {
	const value = uni.getStorageSync<T>(key)
	return path ? get(value, path, defaultValue) : value
}

export const setStorage = uni.setStorageSync

export const removeStorage = uni.removeStorageSync

export const clearStorage = uni.clearStorageSync

export const getStorageInfo = uni.getStorageInfoSync
