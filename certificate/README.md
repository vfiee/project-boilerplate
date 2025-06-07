# 证书介绍

## Android证书生成

查看android生成证书[文档](https://ask.dcloud.net.cn/article/35777)

```zsh
keytool -genkey -alias a11y-qsl -keyalg RSA -keysize 2048 -validity 36500 -keystore a11y-qsl.keystore
```

## Android打包证书信息

| 类目         | 值                                                           |
| ------------ | ------------------------------------------------------------ |
| 证书文件     | /Users/vyron/Mine/a11y-qsl-app/certificate/a11y-qsl.keystore |
| 证书密码     | a11y-qsl                                                     |
| 证书别名     | a11y-qsl                                                     |
| 证书私钥密码 | a11y-qsl                                                     |

## IOS证书生成

查看IOS生成证书[文档](https://ask.dcloud.net.cn/article/152)
