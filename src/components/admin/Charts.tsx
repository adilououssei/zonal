interface ChartData {
  label: string
  value: number
  color?: string
}

export const SimpleLineChart = ({ data }: { data: ChartData[] }) => {
  const max = Math.max(...data.map((d) => d.value))
  const w = 280
  const h = 140
  const px = (i: number) => 20 + (i / (data.length - 1)) * (w - 40)
  const py = (v: number) => h - 20 - (v / max) * (h - 40)
  const points = data.map((d, i) => `${px(i)},${py(d.value)}`).join(' ')

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto">
      <polyline points={points} fill="none" stroke="#0B6B3A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {data.map((d, i) => (
        <circle key={i} cx={px(i)} cy={py(d.value)} r="3" fill="#0B6B3A" />
      ))}
      {data.map((d, i) => (
        <text key={i} x={px(i)} y={h - 4} textAnchor="middle" fill="#9CA3AF" fontSize="10">
          {d.label}
        </text>
      ))}
    </svg>
  )
}

export const SimpleDonutChart = ({ data }: { data: ChartData[] }) => {
  const total = data.reduce((s, d) => s + d.value, 0)
  const cx = 80
  const cy = 80
  const r = 60
  const segs: { offset: number; color: string; label: string; value: number }[] = []
  let sum = 0
  for (const d of data) {
    segs.push({ offset: sum, color: d.color ?? '#0B6B3A', label: d.label, value: d.value })
    sum += d.value
  }

  return (
    <div className="flex flex-row items-center gap-4">
      <svg viewBox="0 0 160 160" className="w-40 h-40 shrink-0">
        {segs.map((s, i) => {
          const pct = s.value / total
          const angle = pct * 360
          const startAngle = (s.offset / total) * 360
          const startRad = ((startAngle - 90) * Math.PI) / 180
          const endRad = ((startAngle + angle - 90) * Math.PI) / 180
          const x1 = cx + r * Math.cos(startRad)
          const y1 = cy + r * Math.sin(startRad)
          const x2 = cx + r * Math.cos(endRad)
          const y2 = cy + r * Math.sin(endRad)
          const largeArc = angle > 180 ? 1 : 0
          return (
            <path
              key={i}
              d={`M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`}
              fill={s.color}
            />
          )
        })}
      </svg>
      <div className="flex flex-col gap-2">
        {data.map((d, i) => (
          <div key={i} className="flex items-center gap-1.5 text-xs text-gray-500">
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
            {d.label} ({d.value})
          </div>
        ))}
      </div>
    </div>
  )
}
