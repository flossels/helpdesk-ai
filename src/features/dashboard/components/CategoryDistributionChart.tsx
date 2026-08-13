'use client'

import { BarChart, Bar, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import type { CategorySlice } from '@/features/dashboard/types'

type Props = {
  data: CategorySlice[]
}

export function CategoryDistributionChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data}>
        <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
        <YAxis stroke="#64748b" fontSize={12} allowDecimals={false} />
        <Tooltip />
        <Bar dataKey="count" isAnimationActive={false}>
          {data.map((slice) => (
            <Cell key={slice.name} fill={slice.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
