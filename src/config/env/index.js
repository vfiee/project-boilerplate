export const envs = [
  {
    env: "test",
    name: "测试环境",
    modules: {
      common: {
        proxyPrefix: "test",
        url: "https://api-sandbox.xiaoshouyi.com",
      },
    },
  },
  {
    env: "prod",
    name: "正式环境",
    modules: {
      common: {
        proxyPrefix: "prod",
        url: "https://api.xiaoshouyi.com",
      },
    },
  },
  {
    name: "发布环境",
    env: "production",
    modules: {
      common: {
        enableProxy: false,
        url: "/service/api/proxy?request=",
      },
    },
  },
];

export const getProxyConfig = () => {
  return envs
    .map((config) => Object.values(config.modules))
    .flat()
    .reduce((acc, { proxyPrefix, url } = {}) => {
      acc[`/${proxyPrefix}`] = {
        target: url,
        secure: false,
        changeOrigin: true,
        headers: { Referer: url },
        rewrite: (path) => path.replace(new RegExp(`^/${proxyPrefix}`), ""),
      };
      return acc;
    }, {});
};
