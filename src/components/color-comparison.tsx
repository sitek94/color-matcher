import {Check, Copy} from 'lucide-react'
import {useCopyToClipboard} from 'usehooks-ts'

type Props = {
	targetColor: string
	match: {
		tokenName: string
		tokenValue: string
		distance: number
	}
}

export function ColorComparison({targetColor, match}: Props) {
	const [copied, copyToClipboard] = useCopyToClipboard()

	return (
		<div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
			<div className="flex items-center justify-between mb-4">
				<div className="text-center grow">
					<div className="text-sm font-medium text-gray-700">Target</div>
					<div className="font-mono text-sm text-gray-900">{targetColor}</div>
				</div>
				<div className="text-center grow">
					<div className="text-sm font-medium text-gray-700">Match</div>
					<div className="font-mono text-sm text-gray-900">{match.tokenValue}</div>
				</div>
			</div>

			<div className="flex grow rounded-lg overflow-hidden h-24 mb-4 shadow-sm">
				<div className="grow" style={{backgroundColor: targetColor}} />
				<div className="grow" style={{backgroundColor: match.tokenValue}} />
			</div>

			<div className="border-t border-blue-200 pt-4">
				<div className="flex flex-col gap-2">
					<div className="flex items-center gap-2 justify-between">
						<div className="font-medium text-gray-700">{match.tokenName}</div>
						<div className="font-medium text-gray-700">{match.tokenValue}</div>
					</div>
					<div className="flex gap-2 justify-between">
						<button
							type="button"
							onClick={() => copyToClipboard(match.tokenName)}
							className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200"
						>
							{copied === 'name' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
							Copy Name
						</button>
						<button
							type="button"
							onClick={() => copyToClipboard(match.tokenValue)}
							className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200"
						>
							{copied === 'color' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
							Copy Color
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}
