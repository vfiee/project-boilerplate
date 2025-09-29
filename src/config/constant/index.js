export * from './reg'

const { APP_TITLE } = import.meta.env
console.log(`import.meta.env:`, import.meta.env)

console.log('APP_TITLE: ', APP_TITLE)

export const SYSTEM_NAME = APP_TITLE

export const STORAGE_USERINFO_KEY = `STORAGE_USERINFO`

export const STORAGE_THEME_SETTING = `THEME_SETTING`

export const GLOBAL_HEADER_MENU_ID = '__GLOBAL_HEADER_MENU__'

export const GLOBAL_SIDER_MENU_ID = '__GLOBAL_SIDER_MENU__'

export const GLOBAL_TABS = '__GLOBAL__TABS__'

export const resetCacheStrategyOptions = [
  {
    label: '关闭页面',
    value: 'close'
  },
  {
    label: '刷新页面',
    value: 'refresh'
  }
]

export const themeScrollModeOptions = [
  {
    label: '外层滚动',
    value: 'wrapper'
  },
  {
    label: '主题滚动',
    value: 'content'
  }
]

export const themePageAnimationModeOptions = [
  {
    label: '滑动',
    value: 'fade-slide'
  },
  {
    label: '淡入淡出',
    value: 'fade'
  },
  {
    label: '底部消退',
    value: 'fade-bottom'
  },
  {
    label: '缩放消退',
    value: 'fade-scale'
  },
  {
    label: '渐变',
    value: 'zoom-fade'
  },
  {
    label: '闪现',
    value: 'zoom-out'
  },
  {
    label: '无',
    value: 'none'
  }
]

export const themeTabModeOptions = [
  {
    label: '谷歌风格',
    value: 'chrome'
  },
  {
    label: '按钮风格',
    value: 'button'
  }
]
