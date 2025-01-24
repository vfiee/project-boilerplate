import { EnvConfig, initEnvStore } from "@/services/config"

export const envConfigs: EnvConfig[] = [
	{
		env: "development",
		name: "dev环境",
		modules: {
			common: {
				proxyPrefix: "book-dev",
				url: "https://dev-book.xxx.com"
			},
			login: {
				proxyPrefix: "login-dev",
				url: "https://dev-login.xxx.com"
			}
		}
	},
	{
		env: "test",
		name: "test环境",
		modules: {
			common: {
				proxyPrefix: "book-test",
				url: "https://test-book.xxx.com"
			},
			login: {
				proxyPrefix: "login-test",
				url: "https://test-login.xxx.com"
			}
		}
	},
	{
		env: "production",
		name: "prod环境",
		modules: {
			common: {
				proxyPrefix: "book",
				url: "https://book.xxx.com"
			},
			login: {
				proxyPrefix: "login",
				url: "https://login.xxx.com"
			}
		}
	},
	{
		env: "mock",
		name: "mock环境",
		modules: {
			common: {
				proxyPrefix: "mock-book",
				url: "https://mock-book.xxx.com"
			},
			login: {
				proxyPrefix: "login-mock",
				url: "https://mock-login.xxx.com"
			}
		}
	}
]

export const useEnvStore = initEnvStore({ config: envConfigs })
