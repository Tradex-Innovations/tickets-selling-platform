"use client";

import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatNumber } from "@/lib/utils";

const salesData = [{ day: "Mon", sales: 780000 }, { day: "Tue", sales: 1120000 }, { day: "Wed", sales: 940000 }, { day: "Thu", sales: 1680000 }, { day: "Fri", sales: 2140000 }, { day: "Sat", sales: 2860000 }, { day: "Sun", sales: 2480000 }];
const sectionData = [{ name: "Premium", value: 82 }, { name: "Stalls", value: 164 }, { name: "Circle", value: 68 }, { name: "Accessible", value: 12 }];

export function SalesAreaChart() {
  return <div className="h-72 w-full"><ResponsiveContainer width="100%" height="100%"><AreaChart data={salesData} margin={{ top: 10, right: 4, bottom: 0, left: -18 }}><defs><linearGradient id="salesFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#6541d8" stopOpacity={.28} /><stop offset="1" stopColor="#6541d8" stopOpacity={0} /></linearGradient></defs><CartesianGrid vertical={false} stroke="#edf0f5" /><XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#7a8295", fontSize: 11 }} /><YAxis axisLine={false} tickLine={false} tick={{ fill: "#7a8295", fontSize: 10 }} tickFormatter={(value) => `${value / 100000}k`} /><Tooltip formatter={(value) => [`Rs. ${formatNumber(Number(value))}`, "Gross sales"]} contentStyle={{ borderRadius: 12, border: "1px solid #e4e7ef", fontSize: 12 }} /><Area type="monotone" dataKey="sales" stroke="#6541d8" strokeWidth={3} fill="url(#salesFill)" /></AreaChart></ResponsiveContainer></div>;
}

export function SectionBarChart() {
  return <div className="h-64 w-full"><ResponsiveContainer width="100%" height="100%"><BarChart data={sectionData} layout="vertical" margin={{ left: 8, right: 15 }}><CartesianGrid horizontal={false} stroke="#edf0f5" /><XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: "#7a8295", fontSize: 10 }} /><YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: "#4b5365", fontSize: 11 }} width={70} /><Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e4e7ef", fontSize: 12 }} /><Bar dataKey="value" fill="#6541d8" radius={[0, 7, 7, 0]} barSize={18} /></BarChart></ResponsiveContainer></div>;
}

export function OccupancyPieChart({ value = 72 }: { value?: number }) {
  const data = [{ name: "Occupied", value }, { name: "Available", value: 100 - value }];
  return <div className="relative h-48 w-full"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={data} dataKey="value" innerRadius={62} outerRadius={82} startAngle={90} endAngle={-270} paddingAngle={2}>{data.map((_, index) => <Cell key={index} fill={index === 0 ? "#6541d8" : "#edf0f5"} />)}</Pie></PieChart></ResponsiveContainer><div className="pointer-events-none absolute inset-0 grid place-items-center text-center"><div><p className="text-3xl font-bold tracking-tight text-[var(--ink)]">{value}%</p><p className="text-xs text-[var(--muted)]">occupied</p></div></div></div>;
}
