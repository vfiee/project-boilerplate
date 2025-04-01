
export interface EnvModule {
	proxyPrefix: string
	url: string
}

export interface EnvConfig {
	env: string
	name: string
	active?: boolean
	modules: {
		[key: string]: EnvModule
	}
}

export const envs: EnvConfig[] = [
	{
		env: "test",
		name: "测试环境",
		modules: {
			common: {
				proxyPrefix: "test",
				url: "https://test-common.com"
			},
			upload: {
				proxyPrefix: "upload-test",
				url: "https://test-upload.com"
			}
		}
	},
	{
		env: "production",
		name: "正式环境",
		modules: {
			common: {
				proxyPrefix: "prod",
				url: "https://prod-common.com"
			},
			upload: {
				proxyPrefix: "upload-prod",
				url: "https://prod-upload.com"
			}
		}
	}
]