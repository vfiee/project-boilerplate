import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetUno,
  transformerDirectives,
  transformerVariantGroup
} from "unocss"
import {
  presetApplet,
  presetRemRpx,
  transformerAttributify
} from "unocss-applet"

// @see https://unocss.dev/presets/legacy-compat
// import { presetLegacyCompat } from '@unocss/preset-legacy-compat'

function getPresets() {
	const presets = [
		presetIcons({
			scale: 1.2,
			warn: true,
			extraProperties: {
				display: "inline-block",
				"vertical-align": "middle"
			}
		})
	]
	const isMp = process.env?.UNI_PLATFORM?.startsWith("mp") ?? false
	if (isMp) {
		// 使用小程序预设
		presets.push(presetApplet(), presetRemRpx())
	} else {
		presets.push(
			// 非小程序用官方预设
			presetUno(),
			// 支持css class属性化
			presetAttributify()
		)
	}
	return presets
}

export default defineConfig({
	presets: getPresets(),
	/**
	 * 自定义快捷语句
	 * @see https://github.com/unocss/unocss#shortcuts
	 */
	shortcuts: [
		{
			"flex-center": "flex justify-center items-center",
			"flex-x-center": "flex justify-center",
			"flex-y-center": "flex items-center",
			"flex-col": "flex flex-col",
			"flex-col-center": "flex-center flex-col",
			"flex-col-stretch": "flex-col items-stretch",
			"i-flex-center": "inline-flex justify-center items-center",
			"i-flex-x-center": "inline-flex justify-center",
			"i-flex-y-center": "inline-flex items-center",
			"i-flex-col": "flex-col inline-flex",
			"i-flex-col-stretch": "i-flex-col items-stretch",
			"flex-1-hidden": "flex-1 overflow-hidden"
		},
		{
			"absolute-lt": "absolute left-0 top-0",
			"absolute-lb": "absolute left-0 bottom-0",
			"absolute-rt": "absolute right-0 top-0",
			"absolute-rb": "absolute right-0 bottom-0",
			"absolute-tl": "absolute-lt",
			"absolute-tr": "absolute-rt",
			"absolute-bl": "absolute-lb",
			"absolute-br": "absolute-rb",
			"absolute-center": "absolute-lt flex-center size-full",
			"fixed-lt": "fixed left-0 top-0",
			"fixed-lb": "fixed left-0 bottom-0",
			"fixed-rt": "fixed right-0 top-0",
			"fixed-rb": "fixed right-0 bottom-0",
			"fixed-tl": "fixed-lt",
			"fixed-tr": "fixed-rt",
			"fixed-bl": "fixed-lb",
			"fixed-br": "fixed-rb",
			"fixed-center": "fixed-lt flex-center size-full"
		},
		{
			"nowrap-hidden": "overflow-hidden whitespace-nowrap",
			"ellipsis-text": "nowrap-hidden text-ellipsis"
		}
	],
	transformers: [
		// 启用 @apply 功能
		transformerDirectives(),
		// 启用 () 分组功能
		// 支持css class组合，eg: `<div class="hover:(bg-gray-400 font-medium) font-(light mono)">测试 unocss</div>`
		transformerVariantGroup(),
		// Don't change the following order
		transformerAttributify({
			// 解决与第三方框架样式冲突问题
			prefixedOnly: true,
			prefix: "fg"
		})
	],
	rules: [
		[
			"p-safe",
			{
				padding:
					"env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)"
			}
		],
		["pt-safe", { "padding-top": "env(safe-area-inset-top)" }],
		["pb-safe", { "padding-bottom": "env(safe-area-inset-bottom)" }]
	]
})
/**
 * 最终这一套组合下来会得到：
 * mp 里面：mt-4 => margin-top: 32rpx  == 16px
 * h5 里面：mt-4 => margin-top: 1rem == 16px
 *
 * 如果是传统方式写样式，则推荐设计稿设置为 750，这样设计稿1px，代码写1rpx。
 * rpx是响应式的，可以让不同设备的屏幕显示效果保持一致。
 */
