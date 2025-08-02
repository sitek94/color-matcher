import {Check, Copy, Search} from 'lucide-react'
import {useState} from 'react'
import {useLocalStorage} from 'usehooks-ts'
import {ValidColorField} from './components/valid-color-field'
import {ColorComparison} from './components/color-comparison'
import {
  findMultipleClosestMatches,
  isValidColor,
  parseAvailableColors,
} from './lib/utils'

export function App() {
  const [targetColor, setTargetColor] = useState('#7A7A7A')
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF')
  const [availableColorsInput, setAvailableColors] = useLocalStorage(
    'availableColors',
    '',
  )
  const [copied, setCopied] = useState('')

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    setCopied(type)
    setTimeout(() => setCopied(''), 2000)
  }

  const isValidTarget = isValidColor(targetColor)
  const availableColors = parseAvailableColors(availableColorsInput)
  const hasValidJson = availableColors !== null
  const closestMatches = findMultipleClosestMatches(
    targetColor,
    availableColors || {},
    backgroundColor,
    20,
  )
  const formattedAvailableColors = JSON.stringify(availableColors, null, 2)

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Color Matcher</h1>
        <p className="text-gray-600">
          Find the closest design token match for your legacy colors
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="flex flex-col gap-6">
          <ValidColorField
            label="Target Color"
            value={targetColor}
            onChange={setTargetColor}
          />
          <ValidColorField
            label="Background Color (optional, defaults to white)"
            value={backgroundColor}
            onChange={setBackgroundColor}
          />

          <div className="flex flex-col gap-2 grow">
            <label
              htmlFor="availableColors"
              className="block text-sm font-medium text-gray-700"
            >
              Available Colors (JSON)
            </label>
            <textarea
              id="availableColors"
              value={formattedAvailableColors}
              onChange={e => setAvailableColors(e.target.value)}
              rows={8}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm grow"
              placeholder='{"colorName": "#hexvalue"}'
            />
            {!hasValidJson && availableColorsInput.trim() && (
              <p className="text-red-500 text-xs mt-1">Invalid JSON format</p>
            )}
          </div>
        </div>

        {/* Results Section */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            <Search className="inline w-5 h-5 mr-2" />
            Results
          </h2>

          {isValidTarget && hasValidJson && closestMatches.length > 0 && (
            <ColorComparison
              targetColor={targetColor}
              input={closestMatches[0]}
            />
          )}

          {isValidTarget && hasValidJson ? (
            <div className="space-y-3">
              {closestMatches.map((match, index) => (
                <div
                  key={match.tokenName}
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
                        style={{backgroundColor: match.tokenValue}}
                      />
                      <div>
                        <div className="font-medium text-gray-900">
                          {match.tokenName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {match.tokenValue}
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
                          type="button"
                          onClick={() =>
                            copyToClipboard(match.tokenName, 'name')
                          }
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
                          type="button"
                          onClick={() =>
                            copyToClipboard(match.tokenValue, 'color')
                          }
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
    </div>
  )
}
