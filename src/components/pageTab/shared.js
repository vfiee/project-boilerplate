import { addColorAlpha, transformColorWithOpacity } from '@/utils'

/** The active color of the tab */
export const ACTIVE_COLOR = '#1890ff'

function createCssVars(props) {
  return {
    '--tabs-primary-color': props.primaryColor,
    '--tabs-primary-color1': props.primaryColor1,
    '--tabs-primary-color2': props.primaryColor2,
    '--tabs-primary-color-opacity1': props.primaryColorOpacity1,
    '--tabs-primary-color-opacity2': props.primaryColorOpacity2,
    '--tabs-primary-color-opacity3': props.primaryColorOpacity3
  }
}

export function createTabCssVars(primaryColor) {
  return createCssVars({
    primaryColor,
    primaryColor1: transformColorWithOpacity(primaryColor, 0.1, '#ffffff'),
    primaryColor2: transformColorWithOpacity(primaryColor, 0.3, '#000000'),
    primaryColorOpacity1: addColorAlpha(primaryColor, 0.1),
    primaryColorOpacity2: addColorAlpha(primaryColor, 0.15),
    primaryColorOpacity3: addColorAlpha(primaryColor, 0.3)
  })
}

export const props = {
  darkMode: {
    type: Boolean
  },
  mode: {
    type: String,
    default: 'chrome'
  },
  commonClass: {
    type: String,
    default: 'transition-all-300'
  },
  buttonClass: {
    type: String,
    default: 'transition-all-300'
  },
  chromeClass: {
    type: String,
    default: 'transition-all-300'
  },
  active: {
    type: Boolean
  },
  activeColor: {
    type: String,
    default: ACTIVE_COLOR
  },
  closable: {
    default: Boolean,
    default: true
  }
}
