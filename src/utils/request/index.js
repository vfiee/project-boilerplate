/**
 * 批次派发 Promise 请求
 * @param {Array} tasks - 请求任务数组，每个元素可以是函数或 Promise
 * @param {number} [batchSize=5] - 每批次请求数量，默认 5
 * @param {Function} [onProgress] - 进度回调，参数为 (completed, total)
 * @returns {Promise<Array>} - 所有请求结果数组
 */
export async function batchRequest(tasks, batchSize = 5, onProgress) {
  const results = [];
  const total = tasks.length;
  let completed = 0;

  for (let i = 0; i < total; i += batchSize) {
    const batch = tasks.slice(i, i + batchSize);

    const batchResults = await Promise.all(
      batch.map((task) => (typeof task === "function" ? task() : task)),
    );

    results.push(...batchResults);
    completed += batch.length;

    if (onProgress) {
      onProgress(completed, total);
    }
  }

  return results;
}

/**
 * 批次派发请求（带错误收集）
 * @param {Array} tasks - 请求任务数组
 * @param {number} [batchSize=5] - 每批次请求数量
 * @param {Function} [onProgress] - 进度回调
 * @returns {Promise<{results: Array, errors: Array}>} - 结果和错误数组
 */
export async function batchRequestWithErrors(tasks, batchSize = 5, onProgress) {
  const results = [];
  const errors = [];
  const total = tasks.length;
  let completed = 0;

  for (let i = 0; i < total; i += batchSize) {
    const batch = tasks.slice(i, i + batchSize);

    const batchResults = await Promise.allSettled(
      batch.map((task) => (typeof task === "function" ? task() : task)),
    );

    batchResults.forEach((result, index) => {
      if (result.status === "fulfilled") {
        results.push(result.value);
      } else {
        errors.push({ index: i + index, error: result.reason });
      }
    });

    completed += batch.length;

    if (onProgress) {
      onProgress(completed, total);
    }
  }

  return { results, errors };
}

/**
 * 延迟执行
 * @param {number} ms 延迟毫秒数，默认500ms
 * @returns {Promise}
 */
export const sleep = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));
