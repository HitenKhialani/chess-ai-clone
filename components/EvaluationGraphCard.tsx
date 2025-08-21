import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface EvaluationGraphCardProps {
  evalData: { move: number; evaluation: number }[];
  onMoveHover?: (move: number) => void;
}

export const EvaluationGraphCard: React.FC<EvaluationGraphCardProps> = ({ evalData, onMoveHover }) => {
  return (
    <Card className="rounded-2xl shadow-lg bg-card border border-border">
      <CardHeader>
        <CardTitle className="text-lg md:text-xl">Evaluation Graph</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={120}>
          <LineChart data={evalData} margin={{ left: 0, right: 0, top: 8, bottom: 8 }}>
            <XAxis dataKey="move" tick={{ fontSize: 12 }} />
            <YAxis domain={['auto', 'auto']} tick={{ fontSize: 12 }} />
            <Tooltip formatter={(v: number) => v.toFixed(2)} labelFormatter={l => `Move ${l}`} />
            <Line type="monotone" dataKey="evaluation" stroke="#7C3AED" strokeWidth={2} dot={false} onMouseOver={d => onMoveHover && onMoveHover(d.move)} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default EvaluationGraphCard; 