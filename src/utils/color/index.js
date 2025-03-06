import { colord, extend } from 'colord'
import mixPlugin from 'colord/plugins/mix'
import namesPlugin from 'colord/plugins/names'

extend([namesPlugin, mixPlugin])

/** Hue step */
export const hueStep = 2
/** Saturation step, light color part */
export const saturationStep = 16
/** Saturation step, dark color part */
export const saturationStep2 = 5
/** Brightness step, light color part */
export const brightnessStep1 = 5
/** Brightness step, dark color part */
export const brightnessStep2 = 15
/** Light color count, main color up */
export const lightColorCount = 5
/** Dark color count, main color down */
export const darkColorCount = 4

export function getSaturation(hsv, i, isLight) {
  if (hsv.h === 0 && hsv.s === 0) {
    return hsv.s
  }

  let saturation

  if (isLight) {
    saturation = hsv.s - saturationStep * i
  } else if (i === darkColorCount) {
    saturation = hsv.s + saturationStep
  } else {
    saturation = hsv.s + saturationStep2 * i
  }

  if (saturation > 100) {
    saturation = 100
  }

  if (isLight && i === lightColorCount && saturation > 10) {
    saturation = 10
  }

  if (saturation < 6) {
    saturation = 6
  }

  return saturation
}

export function getValue(hsv, i, isLight) {
  let value

  if (isLight) {
    value = hsv.v + brightnessStep1 * i
  } else {
    value = hsv.v - brightnessStep2 * i
  }

  if (value > 100) {
    value = 100
  }

  return value
}

export function getHue(hsv, i, isLight) {
  let hue

  const hsvH = Math.round(hsv.h)

  if (hsvH >= 60 && hsvH <= 240) {
    hue = isLight ? hsvH - hueStep * i : hsvH + hueStep * i
  } else {
    hue = isLight ? hsvH + hueStep * i : hsvH - hueStep * i
  }

  if (hue < 0) {
    hue += 360
  }

  if (hue >= 360) {
    hue -= 360
  }

  return hue
}

export function addColorAlpha(color, alpha) {
  return colord(color).alpha(alpha).toHex()
}

export function transformColorWithOpacity(color, alpha, bgColor = '#ffffff') {
  const originColor = addColorAlpha(color, alpha)
  const { r: oR, g: oG, b: oB } = colord(originColor).toRgb()

  const { r: bgR, g: bgG, b: bgB } = colord(bgColor).toRgb()

  function calRgb(or, bg, al) {
    return bg + (or - bg) * al
  }

  return colord({
    r: calRgb(oR, bgR, alpha),
    g: calRgb(oG, bgG, alpha),
    b: calRgb(oB, bgB, alpha)
  }).toHex()
}

export function isValidColor(color) {
  return colord(color).isValid()
}

export function getHex(color) {
  return colord(color).toHex()
}

export function getRgb(color) {
  return colord(color).toRgb()
}

export function getHsl(color) {
  return colord(color).toHsl()
}

export function getHsv(color) {
  return colord(color).toHsv()
}

export function getDeltaE(color1, color2) {
  return colord(color1).delta(color2)
}

export function transformHslToHex(color) {
  return colord(color).toHex()
}

export function mixColor(firstColor, secondColor, ratio) {
  return colord(firstColor).mix(secondColor, ratio).toHex()
}

export function getRgbOfColor(color) {
  return colord(color).toRgb()
}

export function getColorPalette(color, index) {
  const transformColor = colord(color)

  if (!transformColor.isValid()) {
    throw new Error('invalid input color value')
  }

  if (index === 6) {
    return colord(transformColor).toHex()
  }

  const isLight = index < 6
  const hsv = transformColor.toHsv()
  const i = isLight ? lightColorCount + 1 - index : index - lightColorCount - 1

  const newHsv = {
    h: getHue(hsv, i, isLight),
    s: getSaturation(hsv, i, isLight),
    v: getValue(hsv, i, isLight)
  }

  return colord(newHsv).toHex()
}
