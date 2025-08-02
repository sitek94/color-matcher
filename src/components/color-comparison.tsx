type Props = {
  targetColor: string
  input: {
    tokenName: string
    tokenValue: string
    distance: number
  }
}

export function ColorComparison({targetColor, input}: Props) {
  return (
    <div className="p-6">
      <div className="flex grow rounded-lg overflow-hidden h-24 mb-2">
        <div className="grow" style={{backgroundColor: targetColor}} />
        <div className="grow" style={{backgroundColor: input.tokenValue}} />
      </div>

      <div className="flex items-center">
        <div className="text-center grow">
          <div className="text-sm text-gray-600">Target</div>
          <div className="font-mono text-xs">{targetColor}</div>
        </div>
        <div className="text-center grow">
          <div className="text-sm text-gray-600">Input</div>
          <div className="font-mono text-xs">{input.tokenValue}</div>
        </div>
      </div>
    </div>
  )
}
