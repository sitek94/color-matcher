import {useId, useState} from 'react'
import {isValidColor} from '../lib/utils'

type Props = {
	label: string
	value: string
	onChange: (color: string) => void
}

export function ValidColorField({label, value, onChange}: Props) {
	const id = useId()
	const [input, setInput] = useState(value)

	const handleChange = (value: string) => {
		setInput(value)

		if (isValidColor(value)) {
			onChange(value)
		}
	}

	const isValid = isValidColor(input)

	return (
		<div>
			<label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
				{label}
			</label>
			<div className="flex items-center gap-3">
				<div className="flex items-center gap-2 relative grow">
					<div className="relative flex-1">
						<input
							id={id}
							type="text"
							value={input}
							onChange={e => handleChange(e.target.value)}
							placeholder="#7A7A7A"
							className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${isValid ? 'border-gray-300' : 'border-red-300'}`}
						/>
						{!isValid && <p className="text-red-500 text-xs mt-1">Invalid color format</p>}
					</div>
				</div>
				<div
					className="w-12 h-10 rounded-md border-2 border-gray-300"
					style={{
						backgroundColor: isValid ? input : '#f3f4f6',
					}}
				/>
			</div>
		</div>
	)
}
