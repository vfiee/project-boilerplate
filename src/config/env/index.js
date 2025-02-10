export const envs = [
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
	}
]
