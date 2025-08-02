import {z} from 'zod'

export interface RGB {
  r: number
  g: number
  b: number
}

export interface ColorMatch {
  name: string
  color: string
  distance: number
}

const AvailableColorsSchema = z.record(z.string(), z.string())

export function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) return null

  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  } as RGB
}

export function calculateColorDistance(color1: string, color2: string) {
  const rgb1 = hexToRgb(color1)
  const rgb2 = hexToRgb(color2)

  if (!rgb1 || !rgb2) return Infinity

  return Math.sqrt(
    Math.pow(rgb1.r - rgb2.r, 2) +
      Math.pow(rgb1.g - rgb2.g, 2) +
      Math.pow(rgb1.b - rgb2.b, 2),
  )
}

export function isValidHex(hex: string) {
  return /^#[0-9A-F]{6}$/i.test(hex)
}

export function parseAvailableColors(colorsInput: string) {
  try {
    const parsed = JSON.parse(colorsInput)
    const result = AvailableColorsSchema.safeParse(parsed)
    return result.success ? result.data : null
  } catch {
    return null
  }
}

export function findClosestMatches(
  targetColor: string,
  availableColors: string,
): ColorMatch[] {
  const colorsObj = parseAvailableColors(availableColors)
  if (!colorsObj) return []

  const matches: ColorMatch[] = []

  for (const [name, color] of Object.entries(colorsObj)) {
    const distance = calculateColorDistance(targetColor, color)
    if (distance !== Infinity) {
      matches.push({name, color, distance})
    }
  }

  return matches.sort((a, b) => a.distance - b.distance)
}
