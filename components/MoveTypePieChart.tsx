import React from "react";
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';

interface PieDataItem {
  name: string;
  value: number;
  color: string;
}

interface MoveTypePieChartProps {
  pieData: PieDataItem[];
}

const MoveTypePieChart: React.FC<MoveTypePieChartProps> = ({ pieData }) => (
  <div className="w-full max-w-xs mx-auto">
    <div className="font-semibold text-center mb-2">Move Type Distribution</div>
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={pieData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={80}
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
        >
          {pieData.map((entry, idx) => (
            <Cell key={`cell-${idx}`} fill={entry.color} />
          ))}
        </Pie>
        <RechartsTooltip formatter={(value, name) => [`${value}`, `${name}`]} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  </div>
);

export default MoveTypePieChart; 