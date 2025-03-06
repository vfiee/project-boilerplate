import { themeVars } from '@/config/theme/vars'
import {
  getHex,
  getHsv,
  getHue,
  getRgbOfColor,
  getSaturation,
  getValue,
  isValidColor,
  lightColorCount,
  mixColor
} from '@/utils'
import { theme } from 'ant-design-vue'

const DARK_CLASS = 'dark'

export function getAntdTheme(colors, darkMode) {
  const { defaultAlgorithm, darkAlgorithm } = theme

  const { primary, info, success, warning, error } = colors

  return {
    token: {
      colorPrimary: primary,
      colorInfo: info,
      colorSuccess: success,
      colorWarning: warning,
      colorError: error
    },
    algorithm: [darkMode ? darkAlgorithm : defaultAlgorithm]
    // components: {
    //   Button: {
    //     controlHeightSM: 28
    //   },
    //   Menu: {
    //     colorSubItemBg: 'transparent'
    //   }
    // }
  }
}

export function getAntDPaletteColorByIndex(color, index) {
  if (!isValidColor(color)) {
    throw new Error('invalid input color value')
  }

  if (index === 6) {
    return getHex(color)
  }

  const isLight = index < 6
  const hsv = getHsv(color)
  const i = isLight ? lightColorCount + 1 - index : index - lightColorCount - 1

  const newHsv = {
    h: getHue(hsv, i, isLight),
    s: getSaturation(hsv, i, isLight),
    v: getValue(hsv, i, isLight)
  }

  return getHex(newHsv)
}

export function getAntDColorPalette(
  color,
  darkTheme = false,
  darkThemeMixColor = '#141414'
) {
  const indexes = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]

  const patterns = indexes.map((index) =>
    getAntDPaletteColorByIndex(color, index)
  )

  const darkColorMap = [
    { index: 7, opacity: 0.15 },
    { index: 6, opacity: 0.25 },
    { index: 5, opacity: 0.3 },
    { index: 5, opacity: 0.45 },
    { index: 5, opacity: 0.65 },
    { index: 5, opacity: 0.85 },
    { index: 5, opacity: 0.9 },
    { index: 4, opacity: 0.93 },
    { index: 3, opacity: 0.95 },
    { index: 2, opacity: 0.97 },
    { index: 1, opacity: 0.98 }
  ]

  if (darkTheme) {
    const darkPatterns = darkColorMap.map(({ index, opacity }) => {
      const darkColor = mixColor(darkThemeMixColor, patterns[index], opacity)

      return darkColor
    })

    return darkPatterns.map((item) => getHex(item))
  }

  return patterns
}

export function getColorPalette(color) {
  const colorMap = new Map()

  const colors = getAntDColorPalette(color)

  const colorNumbers = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]

  colorNumbers.forEach((number, index) => {
    colorMap.set(number, colors[index])
  })

  return colorMap
}

function createThemePaletteColors(colors) {
  const colorKeys = Object.keys(colors)
  const colorPaletteVar = {}

  colorKeys.forEach((key) => {
    const colorMap = getColorPalette(colors[key])

    colorPaletteVar[key] = colorMap.get(500)

    colorMap.forEach((hex, number) => {
      colorPaletteVar[`${key}-${number}`] = hex
    })
  })

  return colorPaletteVar
}

export function createThemeToken(colors, tokens) {
  const paletteColors = createThemePaletteColors(colors)

  const { light, dark } = tokens || themeSettings.tokens

  const themeTokens = {
    colors: {
      ...paletteColors,
      nprogress: paletteColors.primary,
      ...light.colors
    },
    boxShadow: {
      ...light.boxShadow
    }
  }

  const darkThemeTokens = {
    colors: {
      ...themeTokens.colors,
      ...dark?.colors
    },
    boxShadow: {
      ...themeTokens.boxShadow,
      ...dark?.boxShadow
    }
  }

  return {
    themeTokens,
    darkThemeTokens
  }
}

function getCssVarByTokens(tokens) {
  const styles = []

  function removeVarPrefix(value) {
    return value.replace('var(', '').replace(')', '')
  }

  function removeRgbPrefix(value) {
    return value.replace('rgb(', '').replace(')', '')
  }

  for (const [key, tokenValues] of Object.entries(themeVars)) {
    for (const [tokenKey, tokenValue] of Object.entries(tokenValues)) {
      let cssVarsKey = removeVarPrefix(tokenValue)
      let cssValue = tokens[key][tokenKey]

      if (key === 'colors') {
        cssVarsKey = removeRgbPrefix(cssVarsKey)
        const { r, g, b } = getRgbOfColor(cssValue)
        cssValue = `${r} ${g} ${b}`
      }

      styles.push(`${cssVarsKey}: ${cssValue}`)
    }
  }

  const styleStr = styles.join(';')

  return styleStr
}

export function addThemeVarsToGlobal(tokens, darkTokens) {
  const cssVarStr = getCssVarByTokens(tokens)
  const darkCssVarStr = getCssVarByTokens(darkTokens)

  const css = `
    :root {
      ${cssVarStr}
    }
  `

  const darkCss = `
    html.${DARK_CLASS} {
      ${darkCssVarStr}
    }
  `

  const styleId = 'theme-vars'

  const style =
    document.querySelector(`#${styleId}`) || document.createElement('style')

  style.id = styleId

  style.textContent = css + darkCss

  document.head.appendChild(style)
}

export function toggleAuxiliaryColorModes(
  grayscaleMode = false,
  colourWeakness = false
) {
  const htmlElement = document.documentElement
  htmlElement.style.filter = [
    grayscaleMode ? 'grayscale(100%)' : '',
    colourWeakness ? 'invert(80%)' : ''
  ]
    .filter(Boolean)
    .join(' ')
}

export function toggleCssDarkMode(darkMode = false) {
  const { add, remove } = toggleHtmlClass(DARK_CLASS)

  if (darkMode) {
    add()
  } else {
    remove()
  }
}

export function toggleHtmlClass(className) {
  function add() {
    document.documentElement.classList.add(className)
  }

  function remove() {
    document.documentElement.classList.remove(className)
  }

  return {
    add,
    remove
  }
}
