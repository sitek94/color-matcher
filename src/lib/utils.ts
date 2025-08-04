import {type ClassValue, clsx} from 'clsx'
import Color, {type ColorInstance} from 'color'
import {closest, diff, rgba_to_lab as rgbaToLab} from 'color-diff'
import {twMerge} from 'tailwind-merge'

interface ColorToken {
	[key: string]: string
}

interface ColorMatch {
	tokenName: string
	tokenValue: string
	distance: number
	inputColor: string
}

/**
 * Finds the closest matching design token for a given color input
 * Uses CIEDE2000 algorithm in LAB color space for perceptually accurate matching
 * Properly handles transparency by compositing with white background
 */
export function findClosestMatches(
	input: string,
	availableColors: ColorToken,
	backgroundColor: string = '#ffffff', // Default white background
): ColorMatch {
	try {
		// Parse and normalize input color
		const inputColor = Color(input)

		// Handle transparency by compositing with background
		const compositeInput = composeWithBackground(inputColor, backgroundColor)

		// Convert to format expected by color-diff (RGB object)
		const inputRgb = {
			R: compositeInput.red(),
			G: compositeInput.green(),
			B: compositeInput.blue(),
		}

		// Prepare palette from available colors
		const palette = Object.entries(availableColors).map(([name, value]) => {
			const color = Color(value)
			return {
				name,
				value,
				R: color.red(),
				G: color.green(),
				B: color.blue(),
			}
		})

		// Find closest match using CIEDE2000 algorithm
		const match = closest(
			inputRgb,
			palette.map(p => ({R: p.R, G: p.G, B: p.B})),
		)

		// Find the corresponding token
		const matchedToken = palette.find(p => p.R === match.R && p.G === match.G && p.B === match.B)

		if (!matchedToken) {
			throw new Error('Unable to find matching token')
		}

		// Calculate the actual distance for reference
		const distance = diff(rgbaToLab(inputRgb), rgbaToLab(match))

		return {
			// biome-ignore lint/style/noNonNullAssertion: The match was already found
			tokenName: Object.keys(availableColors)?.find(
				key => availableColors[key] === matchedToken.value,
			)!,
			tokenValue: matchedToken.value,
			distance: distance,
			inputColor: input,
		}
	} catch (error) {
		console.error(error)
		throw new Error(`Color parsing failed for input "${input}"`)
	}
}

/**
 * Handles transparency by compositing the input color with background
 * This is crucial for accurate color matching with alpha channels
 */
function composeWithBackground(inputColor: ColorInstance, backgroundColor: string): ColorInstance {
	const bgColor = Color(backgroundColor)
	const alpha = inputColor.alpha()

	// If fully opaque, return as-is
	if (alpha === 1) {
		return inputColor
	}

	// Alpha compositing formula: result = alpha * foreground + (1 - alpha) * background
	const compositeRed = Math.round(alpha * inputColor.red() + (1 - alpha) * bgColor.red())
	const compositeGreen = Math.round(alpha * inputColor.green() + (1 - alpha) * bgColor.green())
	const compositeBlue = Math.round(alpha * inputColor.blue() + (1 - alpha) * bgColor.blue())

	return Color.rgb(compositeRed, compositeGreen, compositeBlue)
}

export function findMultipleClosestMatches(
	input: string,
	availableColors: ColorToken,
	backgroundColor: string = '#ffffff',
	count: number = 3,
): ColorMatch[] {
	try {
		const inputColor = Color(input)
		const compositeInput = composeWithBackground(inputColor, backgroundColor)

		const inputRgb = {
			R: compositeInput.red(),
			G: compositeInput.green(),
			B: compositeInput.blue(),
		}

		// Calculate distances to all colors
		const matches = Object.entries(availableColors).map(([name, value]) => {
			const color = Color(value)
			const colorRgb = {
				R: color.red(),
				G: color.green(),
				B: color.blue(),
			}

			const distance = diff(rgbaToLab(inputRgb), rgbaToLab(colorRgb))

			return {
				tokenName: name,
				tokenValue: value,
				distance: distance,
				inputColor: input,
			}
		})

		// Sort by distance and return top matches
		return matches.sort((a, b) => a.distance - b.distance).slice(0, count)
	} catch (error) {
		console.log(error)
		throw new Error(`Color parsing failed for input "${input}"`)
	}
}

/**
 * Checks if a color is valid
 */
export function isValidColor(color: string) {
	try {
		Color(color)
		return true
	} catch (_error) {
		return false
	}
}

/**
 * Parses available colors from a JSON string and returns a record of valid colors
 */
export function parseAvailableColors(input: string) {
	let inputColors: Record<string, string> = {}

	try {
		inputColors = JSON.parse(input)
	} catch (_error) {
		throw new Error('Available colors must be a valid JSON object')
	}

	const validColors = Object.entries(inputColors).reduce(
		(acc, [name, value]) => {
			if (isValidColor(value)) {
				acc[name] = value
			}
			return acc
		},
		{} as Record<string, string>,
	)

	return validColors
}

/**
 * Merges class names into a single string
 */
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}
