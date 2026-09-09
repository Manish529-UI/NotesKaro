import React from 'react'
import { 
  BarChart, 
  Bar, 
  Cell, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis,
  Legend 
} from "recharts"

function RechartSetUp({ charts }) {
    if (!charts || !Array.isArray(charts) || charts.length === 0) return null;
    const COLORS = ["#6366f1", "#22c55e", "#f59e0b", "#ef4444", "#06b6d4", "#8b5cf6", "#ec4899"];

    return (
        <div className='space-y-8'>
            {charts.map((chart, index) => {
                if (!chart) return null;
                const chartType = (chart.type || "bar").toLowerCase();
                
                // Normalize chart data to ensure name & value keys exist
                const rawData = Array.isArray(chart.data) ? chart.data : [];
                const normalizedData = rawData.map((item) => ({
                    name: String(item.name || item.label || item.category || item.x || `Item`),
                    value: Number(item.value ?? item.val ?? item.count ?? item.y ?? 0)
                }));

                if (normalizedData.length === 0) return null;

                const isLine = chartType.includes("line");
                const isPie = chartType.includes("pie");
                const isBar = !isLine && !isPie; // Default fallback to bar chart

                return (
                    <div key={index} className='border border-gray-200 rounded-xl p-4 bg-white shadow-sm'>
                        <h4 className='font-semibold text-gray-800 mb-3 flex items-center gap-2'>
                            <span>📊</span> {chart.title || "Chart Analysis"}
                        </h4>
                        <div className='h-72 w-full'>
                            <ResponsiveContainer width="100%" height="100%">
                                {isBar && (
                                    <BarChart data={normalizedData}>
                                        <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
                                        <YAxis stroke="#6b7280" fontSize={12} />
                                        <Tooltip />
                                        <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                                            {normalizedData.map((_, i) => (
                                                <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                )}

                                {isLine && (
                                    <LineChart data={normalizedData}>
                                        <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
                                        <YAxis stroke="#6b7280" fontSize={12} />
                                        <Tooltip />
                                        <Line 
                                            type="monotone"
                                            dataKey="value"
                                            stroke="#6366f1"
                                            strokeWidth={3} 
                                            dot={{ r: 4, fill: "#6366f1" }}
                                        />
                                    </LineChart>
                                )}

                                {isPie && (
                                    <PieChart>
                                        <Tooltip />
                                        <Legend />
                                        <Pie 
                                            data={normalizedData}
                                            dataKey="value"
                                            nameKey="name"
                                            outerRadius={90}
                                            label
                                        >
                                            {normalizedData.map((_, i) => (
                                                <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                            ))}
                                        </Pie>
                                    </PieChart>
                                )}
                            </ResponsiveContainer>
                        </div>
                    </div>
                );
            })}
        </div>
    )
}

export default RechartSetUp
