import { merge } from 'lodash-es'

export const __SCROLL_EL_ID = 'ADMIN_LAYOUT_SCROLL_ID'

export const layoutHeaderProps = {
  headerVisible: {
    type: Boolean,
    default: true
  },
  headerClass: {
    type: String,
    default: ''
  },
  headerHeight: {
    type: Number,
    default: 56
  }
}

export const layoutTabProps = {
  tabVisible: {
    type: Boolean,
    default: true
  },
  tabHeight: {
    type: Number,
    default: 48
  },
  tabClass: {
    type: String,
    default: ''
  }
}

export const layoutSiderProps = {
  siderVisible: {
    type: Boolean,
    default: true
  },
  siderClass: {
    type: String,
    default: ''
  },
  mobileSiderClass: {
    type: String,
    default: ''
  },
  siderCollapse: {
    type: Boolean,
    default: false
  },
  siderWidth: {
    type: Number,
    default: 220
  },
  siderCollapsedWidth: {
    type: Number,
    default: 64
  }
}

export const layoutContentProps = {
  contentClass: {
    type: String,
    default: ''
  },
  fullContent: {
    type: Boolean,
    default: false
  }
}

export const layoutFooterProps = {
  footerVisible: {
    type: Boolean,
    default: true
  },
  fixedFooter: {
    type: Boolean,
    default: true
  },
  footerClass: {
    type: String,
    default: ''
  },
  footerHeight: {
    type: Number,
    default: 48
  },
  rightFooter: {
    type: Boolean,
    default: true
  }
}

export const adminLayoutProps = merge(
  {
    mode: {
      type: String,
      // 'horizontal' | 'vertical'
      default: 'vertical'
    },
    scrollMode: {
      type: String,
      // 'wrapper' | 'content';
      default: 'content'
    },
    scrollElId: {
      type: String,
      default: __SCROLL_EL_ID
    },
    scrollElClass: {
      type: String
    },
    scrollWrapperClass: {
      type: String
    },
    commonClass: {
      type: String,
      default: 'transition-all-300'
    },
    fixedTop: {
      type: Boolean,
      default: true
    },
    isMobile: {
      type: Boolean
    },
    maxZIndex: {
      type: Number,
      default: 100
    }
  },
  layoutHeaderProps,
  layoutContentProps,
  layoutFooterProps,
  layoutSiderProps,
  layoutTabProps
)

function createLayoutCssVarsByCssVarsProps(props) {
  const {
    headerHeight,
    headerZIndex,
    tabHeight,
    tabZIndex,
    siderWidth,
    siderCollapsedWidth,
    siderZIndex,
    mobileSiderZIndex,
    footerHeight,
    footerZIndex
  } = props
  return {
    '--admin-header-height': `${headerHeight}px`,
    '--admin-header-z-index': headerZIndex,
    '--admin-tab-height': `${tabHeight}px`,
    '--admin-tab-z-index': tabZIndex,
    '--admin-sider-width': `${siderWidth}px`,
    '--admin-sider-collapsed-width': `${siderCollapsedWidth}px`,
    '--admin-sider-z-index': siderZIndex,
    '--admin-mobile-sider-z-index': mobileSiderZIndex,
    '--admin-footer-height': `${footerHeight}px`,
    '--admin-footer-z-index': footerZIndex
  }
}

/**
 * Create layout css vars
 *
 * @param props
 */
export function createLayoutCssVars(props) {
  const {
    mode,
    isMobile,
    maxZIndex = LAYOUT_MAX_Z_INDEX,
    headerHeight,
    tabHeight,
    siderWidth,
    siderCollapsedWidth,
    footerHeight
  } = props

  const headerZIndex = maxZIndex - 3
  const tabZIndex = maxZIndex - 5
  const siderZIndex =
    mode === 'vertical' || isMobile ? maxZIndex - 1 : maxZIndex - 4
  const mobileSiderZIndex = isMobile ? maxZIndex - 2 : 0
  const footerZIndex = maxZIndex - 5

  return createLayoutCssVarsByCssVarsProps({
    headerHeight,
    headerZIndex,
    tabHeight,
    tabZIndex,
    siderWidth,
    siderZIndex,
    mobileSiderZIndex,
    siderCollapsedWidth,
    footerHeight,
    footerZIndex
  })
}
