"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

const data = [
  {
    name: "Jan",
    total: 580,
  },
  {
    name: "Feb",
    total: 690,
  },
  {
    name: "Mar",
    total: 1100,
  },
  {
    name: "Apr",
    total: 1200,
  },
  {
    name: "May",
    total: 900,
  },
  {
    name: "Jun",
    total: 1700,
  },
  {
    name: "Jul",
    total: 1400,
  },
  {
    name: "Aug",
    total: 1100,
  },
  {
    name: "Sep",
    total: 1600,
  },
  {
    name: "Oct",
    total: 1800,
  },
  {
    name: "Nov",
    total: 2100,
  },
  {
    name: "Dec",
    total: 2400,
  },
]

export function Overview() {
  return (
    <ResponsiveContainer width="100%" height={350} style={{ color: 'red' }}>
      <BarChart data={data}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <Tooltip formatter={(value) => [`$${value}`, "Revenue"]} labelFormatter={(label) => `Month: ${label}`} />
        <Bar dataKey="total" fill="currentColor" radius={[4, 4, 0, 0]} className="fill-primary" />
      </BarChart>
    </ResponsiveContainer>
  )
}
