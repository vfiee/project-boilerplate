/**
 * 分批发起请求的工具函数
 * 控制并发请求数量，避免一次性发起过多请求导致性能问题
 * @param {Array<Function>} requests - 请求函数数组，每个元素应该是一个返回Promise的函数
 * @param {number} batchSize - 每批次并发请求的数量，默认为5
 * @returns {Promise<Array>} 所有请求完成后的结果数组，顺序与输入请求一致
 *
 * @example
 * import { batchRequest } from '@/utils/request/batchRequest';
 *
 * // 创建请求函数数组
 * const requests = [
 *   () => fetch('/api/data/1'),
 *   () => fetch('/api/data/2'),
 *   // ... 更多请求函数
 * ];
 *
 * // 分批执行请求，每批5个并发
 * const results = await batchRequest(requests, 5);
 */
export async function batchRequest(requests, batchSize = 5) {
    if (!Array.isArray(requests) || requests.length === 0) {
        return []
    }

    const results = []

    // 分批处理请求
    for (let i = 0; i < requests.length; i += batchSize) {
        // 获取当前批次的请求
        const batch = requests.slice(i, i + batchSize)

        // 并发执行当前批次的所有请求
        const batchPromises = batch.map(requestFn => {
            // 确保每个请求都是函数并且返回Promise
            if (typeof requestFn === "function") {
                return requestFn().catch(error => {
                    // 捕获单个请求的错误，避免影响其他请求
                    console.error("Batch request error:", error)
                    return null // 或者返回特定的错误标识
                })
            }
            return Promise.resolve(null)
        })

        // 等待当前批次所有请求完成
        const batchResults = await Promise.all(batchPromises)
        results.push(...batchResults)
    }

    return results
}

/**
 * 分批发起请求的工具函数（带重试机制）
 * 控制并发请求数量并支持失败重试，提高请求成功率
 * @param {Array<Function>} requests - 请求函数数组，每个元素应该是一个返回Promise的函数
 * @param {Object} options - 配置选项
 * @param {number} options.batchSize - 每批次并发请求的数量，默认为5
 * @param {number} options.retryTimes - 重试次数，默认为0（不重试）
 * @param {number} options.retryDelay - 重试延迟时间（毫秒），默认为1000
 * @returns {Promise<Array>} 所有请求完成后的结果数组，顺序与输入请求一致
 *
 * @example
 * import { batchRequestWithRetry } from '@/utils/request/batchRequest';
 *
 * // 创建请求函数数组
 * const requests = [
 *   () => fetch('/api/data/1'),
 *   () => fetch('/api/data/2'),
 *   // ... 更多请求函数
 * ];
 *
 * // 分批执行请求，每批5个并发，最多重试2次
 * const results = await batchRequestWithRetry(requests, {
 *   batchSize: 5,
 *   retryTimes: 2,
 *   retryDelay: 1000
 * });
 */
export async function batchRequestWithRetry(requests, options = {}) {
    const { batchSize = 5, retryTimes = 0, retryDelay = 1000 } = options

    if (!Array.isArray(requests) || requests.length === 0) {
        return []
    }

    const results = []

    // 重试函数
    const retryRequest = async (requestFn, retriesLeft) => {
        try {
            if (typeof requestFn === "function") {
                return await requestFn()
            }
            return null
        } catch (error) {
            if (retriesLeft > 0) {
                // 等待指定时间后重试
                await new Promise(resolve => setTimeout(resolve, retryDelay))
                return retryRequest(requestFn, retriesLeft - 1)
            } else {
                console.error("Batch request error after retries:", error)
                return null
            }
        }
    }

    // 分批处理请求
    for (let i = 0; i < requests.length; i += batchSize) {
        // 获取当前批次的请求
        const batch = requests.slice(i, i + batchSize)

        // 并发执行当前批次的所有请求（带重试机制）
        const batchPromises = batch.map(requestFn =>
            retryRequest(requestFn, retryTimes)
        )

        // 等待当前批次所有请求完成
        const batchResults = await Promise.all(batchPromises)
        results.push(...batchResults)
    }

    return results
}
