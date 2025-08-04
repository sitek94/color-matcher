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

export function colorToRgb(color: string): RGB | null {
	color = color.trim()
	let match = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})?$/i.exec(color)
	if (match) {
		return {
			r: parseInt(match[1], 16),
			g: parseInt(match[2], 16),
			b: parseInt(match[3], 16),
		}
	}
	match = /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+)\s*)?\)$/i.exec(color)
	if (match) {
		const r = parseInt(match[1], 10)
		const g = parseInt(match[2], 10)
		const b = parseInt(match[3], 10)
		if (r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255) return null
		return {r, g, b}
	}
	return null
}

export function calculateColorDistance(color1: string, color2: string) {
	const rgb1 = colorToRgb(color1)
	const rgb2 = colorToRgb(color2)

	if (!rgb1 || !rgb2) return Infinity

	return Math.sqrt((rgb1.r - rgb2.r) ** 2 + (rgb1.g - rgb2.g) ** 2 + (rgb1.b - rgb2.b) ** 2)
}

export function isValidColor(color: string) {
	return colorToRgb(color) !== null
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

export function findClosestMatches(targetColor: string, availableColors: string): ColorMatch[] {
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
