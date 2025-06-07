import { defineManifestConfig } from "@uni-helper/vite-plugin-uni-manifest"
import { description, version } from "./package.json"

export default defineManifestConfig({
	name: "A11Y-QSL",
	appid: "__UNI__BE7C1BF",
	description,
	versionName: version,
	versionCode: "100",
	transformPx: false,
	locale: "zh-Hans",
	h5: {
		router: { base: "/" }
	},
	/* 5+App特有相关 */
	"app-plus": {
		usingComponents: true,
		nvueStyleCompiler: "uni-app",
		compilerVersion: 3,
		compatible: { ignoreVersion: true },
		splashscreen: {
			delay: 0,
			waiting: true,
			autoclose: true,
			alwaysShowBeforeRender: true
		},
		screenOrientation: ["portrait-primary"],
		/* 模块配置 */
		modules: {},
		/* 应用发布信息 */
		distribute: {
			/* android打包配置 */
			android: {
				minSdkVersion: 23,
				targetSdkVersion: 30,
				packagename: "com.renai.a11y-qsl",
				keystore: "./certificate/a11y-qsl.keystore",
				password: "a11y-qsl",
				aliasname: "a11y-qsl",
				abiFilters: ["armeabi-v7a", "arm64-v8a"],
				permissions: [
					'<uses-permission android:name="android.permission.CHANGE_NETWORK_STATE"/>',
					'<uses-permission android:name="android.permission.MOUNT_UNMOUNT_FILESYSTEMS"/>',
					'<uses-permission android:name="android.permission.VIBRATE"/>',
					'<uses-permission android:name="android.permission.READ_LOGS"/>',
					'<uses-permission android:name="android.permission.ACCESS_WIFI_STATE"/>',
					'<uses-feature android:name="android.hardware.camera.autofocus"/>',
					'<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE"/>',
					'<uses-permission android:name="android.permission.CAMERA"/>',
					'<uses-permission android:name="android.permission.GET_ACCOUNTS"/>',
					'<uses-permission android:name="android.permission.READ_PHONE_STATE"/>',
					'<uses-permission android:name="android.permission.CHANGE_WIFI_STATE"/>',
					'<uses-permission android:name="android.permission.WAKE_LOCK"/>',
					'<uses-permission android:name="android.permission.FLASHLIGHT"/>',
					'<uses-feature android:name="android.hardware.camera"/>',
					'<uses-permission android:name="android.permission.WRITE_SETTINGS"/>'
				]
			},
			/* ios打包配置 */
			ios: {
				appid: "com.renai.a11y-qsl",
				mobileprovision: "./certificate/a11y-qsl.mobileprovision",
				p12: "./certificate/a11y-qsl.p12",
				password: "vyron"
			},
			/* SDK配置 */
			sdkConfigs: {},
			/* 图标配置 */
			icons: {
				android: {
					hdpi: "static/images/app/icons/72x72.png",
					xhdpi: "static/images/app/icons/96x96.png",
					xxhdpi: "static/images/app/icons/144x144.png",
					xxxhdpi: "static/images/app/icons/192x192.png"
				},
				ios: {
					appstore: "static/images/app/icons/1024x1024.png",
					ipad: {
						app: "static/images/app/icons/76x76.png",
						"app@2x": "static/images/app/icons/152x152.png",
						notification: "static/images/app/icons/20x20.png",
						"notification@2x": "static/images/app/icons/40x40.png",
						"proapp@2x": "static/images/app/icons/167x167.png",
						settings: "static/images/app/icons/29x29.png",
						"settings@2x": "static/images/app/icons/58x58.png",
						spotlight: "static/images/app/icons/40x40.png",
						"spotlight@2x": "static/images/app/icons/80x80.png"
					},
					iphone: {
						"app@2x": "static/images/app/icons/120x120.png",
						"app@3x": "static/images/app/icons/180x180.png",
						"notification@2x": "static/images/app/icons/40x40.png",
						"notification@3x": "static/images/app/icons/60x60.png",
						"settings@2x": "static/images/app/icons/58x58.png",
						"settings@3x": "static/images/app/icons/87x87.png",
						"spotlight@2x": "static/images/app/icons/80x80.png",
						"spotlight@3x": "static/images/app/icons/120x120.png"
					}
				}
			}
		}
	},
	/* 快应用特有相关 */
	quickapp: {},
	/* 小程序特有相关 */
	"mp-weixin": {
		appid: "",
		setting: {
			urlCheck: false
		},
		usingComponents: true,
		optimization: {
			subPackages: true
		}
		// __usePrivacyCheck__: true,
	},
	"mp-alipay": {
		usingComponents: true,
		styleIsolation: "shared"
	},
	"mp-baidu": {
		usingComponents: true
	},
	"mp-toutiao": {
		usingComponents: true
	},
	uniStatistics: {
		enable: false
	},
	vueVersion: "3"
})
