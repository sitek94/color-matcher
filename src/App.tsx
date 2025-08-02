import {useState, useMemo} from 'react'
import {Search, Copy, Check} from 'lucide-react'

export function App() {
  const [targetColor, setTargetColor] = useState('#7A7A7A')
  const [availableColors, setAvailableColors] = useState(`{
  "sapInformativeColor": "#91c8f6",
  "sapNeutralColor": "#d3d7d9",
  "sapNegativeElementColor": "#ff8888",
  "sapCriticalElementColor": "#fabd64",
  "sapPositiveElementColor": "#abe2ab",
  "sapInformativeElementColor": "#91c8f6"
}`)
  const [copied, setCopied] = useState('')

  // Convert hex to RGB
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null
  }

  // Calculate Euclidean distance between two colors
  const calculateColorDistance = (color1: string, color2: string) => {
    const rgb1 = hexToRgb(color1)
    const rgb2 = hexToRgb(color2)

    if (!rgb1 || !rgb2) return Infinity

    return Math.sqrt(
      Math.pow(rgb1.r - rgb2.r, 2) +
        Math.pow(rgb1.g - rgb2.g, 2) +
        Math.pow(rgb1.b - rgb2.b, 2),
    )
  }

  // Find closest color match
  const findClosestMatches = useMemo(() => {
    try {
      const colorsObj = JSON.parse(availableColors)
      const matches = []

      for (const [name, color] of Object.entries(colorsObj)) {
        const distance = calculateColorDistance(targetColor, color)
        if (distance !== Infinity) {
          matches.push({name, color, distance})
        }
      }

      return matches.sort((a, b) => a.distance - b.distance)
    } catch (error) {
      console.error(error)
      return []
    }
  }, [targetColor, availableColors])

  // Validate hex color
  const isValidHex = (hex: string) => {
    return /^#[0-9A-F]{6}$/i.test(hex)
  }

  // Copy to clipboard
  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    setCopied(type)
    setTimeout(() => setCopied(''), 2000)
  }

  const isValidTarget = isValidHex(targetColor)
  const hasValidJson = findClosestMatches.length > 0

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Color Similarity Finder
        </h1>
        <p className="text-gray-600">
          Find the closest design token match for your legacy colors
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target Color (Hex)
            </label>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={targetColor}
                  onChange={e => setTargetColor(e.target.value)}
                  placeholder="#7A7A7A"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isValidTarget ? 'border-gray-300' : 'border-red-300'
                  }`}
                />
                {!isValidTarget && (
                  <p className="text-red-500 text-xs mt-1">
                    Invalid hex color format
                  </p>
                )}
              </div>
              <div
                className="w-12 h-10 rounded-md border-2 border-gray-300"
                style={{
                  backgroundColor: isValidTarget ? targetColor : '#f3f4f6',
                }}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Available Colors (JSON)
            </label>
            <textarea
              value={availableColors}
              onChange={e => setAvailableColors(e.target.value)}
              rows={8}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
              placeholder='{"colorName": "#hexvalue"}'
            />
            {!hasValidJson && availableColors.trim() && (
              <p className="text-red-500 text-xs mt-1">Invalid JSON format</p>
            )}
          </div>
        </div>

        {/* Results Section */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            <Search className="inline w-5 h-5 mr-2" />
            Closest Matches
          </h2>

          {isValidTarget && hasValidJson ? (
            <div className="space-y-3">
              {findClosestMatches.slice(0, 5).map((match, index) => (
                <div
                  key={match.name}
                  className={`p-4 border rounded-lg ${
                    index === 0
                      ? 'border-blue-300 bg-blue-50'
                      : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded border-2 border-gray-300"
                        style={{backgroundColor: match.color}}
                      />
                      <div>
                        <div className="font-medium text-gray-900">
                          {match.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {match.color}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Distance</div>
                      <div className="font-mono text-sm">
                        {Math.round(match.distance)}
                      </div>
                    </div>
                  </div>

                  {index === 0 && (
                    <div className="mt-3 pt-3 border-t border-blue-200">
                      <div className="text-sm text-blue-600 font-medium mb-2">
                        Best Match!
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => copyToClipboard(match.name, 'name')}
                          className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200"
                        >
                          {copied === 'name' ? (
                            <Check className="w-3 h-3" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                          Copy Name
                        </button>
                        <button
                          onClick={() => copyToClipboard(match.color, 'color')}
                          className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200"
                        >
                          {copied === 'color' ? (
                            <Check className="w-3 h-3" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                          Copy Color
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Enter a valid hex color and JSON to find matches</p>
            </div>
          )}
        </div>
      </div>

      {/* Color Comparison */}
      {isValidTarget && hasValidJson && findClosestMatches.length > 0 && (
        <div className="mt-8 p-6 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Visual Comparison
          </h3>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div
                className="w-20 h-20 rounded-lg border-2 border-gray-300 mb-2"
                style={{backgroundColor: targetColor}}
              />
              <div className="text-sm text-gray-600">Input</div>
              <div className="font-mono text-xs">{targetColor}</div>
            </div>
            <div className="text-2xl text-gray-400">→</div>
            <div className="text-center">
              <div
                className="w-20 h-20 rounded-lg border-2 border-gray-300 mb-2"
                style={{backgroundColor: findClosestMatches[0].color}}
              />
              <div className="text-sm text-gray-600">Best Match</div>
              <div className="font-mono text-xs">
                {findClosestMatches[0].color}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
