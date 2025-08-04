import {useId, useState} from 'react'
import {type ColorTokens, cn, parseAvailableColorsSafe} from '../lib/utils'

type Props = {
	label: string
	initialValue?: string
	onChange: (colors: ColorTokens) => void
}

export function ValidAvailableColorsField({label, initialValue, onChange}: Props) {
	const id = useId()

	const [input, setInput] = useState(initialValue || '')

	const handleChange = (newValue: string) => {
		setInput(newValue)

		const result = parseAvailableColorsSafe(newValue)
		if (result.success) {
			onChange(result.data)
		}
	}

	const {error} = parseAvailableColorsSafe(input)

	return (
		<div className="flex flex-col gap-2 grow h-full">
			<label htmlFor={id} className="block text-sm font-medium text-gray-700">
				{label}
			</label>
			<textarea
				id={id}
				value={input}
				onChange={e => handleChange(e.target.value)}
				rows={8}
				className={cn(
					`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm grow`,
					error ? 'border-red-300' : 'border-gray-300',
				)}
				placeholder='{"colorName": "#hexvalue"}'
			/>
			{error && <p className="text-red-500 text-xs mt-1">{error}</p>}
		</div>
	)
}
