import { toNumber } from "lodash-es";

/**
 * 转换非数字值为 0
 */
export function transformNumber(value) {
  return isNaN(value) || !isFinite(value) ? 0 : value;
}

/**
 * 展示为千分位
 */
export function formatThousandth(value, decimal = 0) {
  const num = toNumber(value);
  if (isNaN(num)) return 0;
  return num.toLocaleString("en-US", {
    minimumFractionDigits: decimal,
    maximumFractionDigits: decimal,
  });
}
