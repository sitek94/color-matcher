import {Search} from 'lucide-react'
import {useState} from 'react'
import {useLocalStorage} from 'usehooks-ts'
import {ColorComparison} from './components/color-comparison'
import {ValidAvailableColorsField} from './components/valid-available-colors-field'
import {ValidColorField} from './components/valid-color-field'
import {
	type ColorTokens,
	cn,
	findMultipleClosestMatches,
	isValidColor,
	parseAvailableColorsSafe,
} from './lib/utils'

const initialColorTokens = {
	sapBrandColor: '#427cac',
	sapHighlightColor: '#427cac',
	sapBaseColor: '#eff4f9',
	sapBackgroundColor: '#fafafa',
	sapFontSize: '.875rem',
	sapTextColor: '#333',
	sapLinkColor: '#0070b1',
}

export function App() {
	const [targetColor, setTargetColor] = useState('#327cac')
	const [backgroundColor, setBackgroundColor] = useState('#ffffff')
	const [selectedMatchIndex, setSelectedMatchIndex] = useState(0)
	const [savedColors, setSavedColors] = useLocalStorage(
		'availableColors',
		JSON.stringify(initialColorTokens, null, 2),
	)
	const [availableColors, setAvailableColors] = useState<ColorTokens | null>(() => {
		const parsed = parseAvailableColorsSafe(savedColors)
		return parsed.success ? parsed.data : null
	})

	const isValidTarget = isValidColor(targetColor)
	const hasValidColors = availableColors !== null
	const closestMatches = findMultipleClosestMatches(
		targetColor,
		availableColors || {},
		backgroundColor,
		200,
	)
	const selectedMatch = closestMatches[selectedMatchIndex] || closestMatches[0]

	const handleTargetChange = (color: string) => {
		setTargetColor(color)
		setSelectedMatchIndex(0)
	}

	const handleBackgroundChange = (color: string) => {
		setBackgroundColor(color)
		setSelectedMatchIndex(0)
	}

	const handleAvailableColorsChange = (colors: ColorTokens) => {
		setAvailableColors(colors)
		setSavedColors(JSON.stringify(colors, null, 2))
		setSelectedMatchIndex(0)
	}

	return (
		<div className="bg-white h-screen grid grid-rows-[auto_1fr] gap-8 pt-12 mx-auto max-w-4xl">
			<header className="grid grid-cols-2 gap-8 items-end">
				<div className="flex flex-col gap-8 justify-end">
					<div>
						<h1 className="text-3xl font-bold text-gray-900 mb-2">Color Matcher</h1>
						<p className="text-gray-600">
							Find the closest design token match for your legacy colors
						</p>
					</div>
					<div className="flex flex-col gap-4">
						<ValidColorField
							label="Target Color"
							value={targetColor}
							onChange={handleTargetChange}
						/>
						<ValidColorField
							label="Background Color (optional, defaults to white)"
							value={backgroundColor}
							onChange={handleBackgroundChange}
						/>
					</div>
				</div>

				{isValidTarget && hasValidColors && closestMatches.length > 0 && selectedMatch && (
					<ColorComparison targetColor={targetColor} match={selectedMatch} />
				)}
			</header>

			<div className="grid grid-cols-2 gap-8 overflow-hidden">
				{/* Input Section */}
				<div className="grow h-full pb-12">
					<ValidAvailableColorsField
						label="Available Colors (JSON)"
						initialValue={savedColors}
						onChange={handleAvailableColorsChange}
					/>
				</div>

				{/* Results Section */}
				<div className="flex flex-col gap-4 h-full overflow-hidden">
					{isValidTarget && hasValidColors ? (
						<div className="h-full overflow-hidden">
							<h3 className="text-lg font-semibold text-gray-900 mb-3">All Matches</h3>
							<div className="overflow-y-scroll h-full grow">
								<div className="space-y-2 h-full overflow-y-scroll pb-12">
									{closestMatches.map((match, index) => (
										<button
											type="button"
											key={match.tokenName}
											onClick={() => setSelectedMatchIndex(index)}
											className={cn(
												`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md w-full`,
												index === selectedMatchIndex
													? 'border-blue-500 bg-blue-50 shadow-sm'
													: 'border-gray-200 hover:border-gray-300',
											)}
										>
											<div className="flex items-center justify-between">
												<div className="flex items-center gap-3">
													<div
														className="w-10 h-10 rounded border-2 border-gray-300 shadow-sm"
														style={{backgroundColor: match.tokenValue}}
													/>
													<div className="text-left">
														<div className="font-medium text-gray-900">{match.tokenName}</div>
														<div className="text-sm text-gray-500">{match.tokenValue}</div>
													</div>
												</div>
												<div className="text-right">
													<div className="text-sm text-gray-500">Distance</div>
													<div className="font-mono text-sm font-medium">
														{Math.round(match.distance)}
													</div>
													{index === 0 && (
														<div className="text-xs text-blue-600 font-medium mt-1">Best Match</div>
													)}
												</div>
											</div>
										</button>
									))}
								</div>
							</div>
						</div>
					) : (
						<div className="text-center py-8 text-gray-500">
							<Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
							<p>Enter a valid hex color and JSON to find matches</p>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}
