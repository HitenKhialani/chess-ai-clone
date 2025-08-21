import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SideBySideComparisonCardProps {
  moves: { moveNumber: number; playerMove: string; engineMove: string; evalDiff: number; isCritical: boolean }[];
}

export const SideBySideComparisonCard: React.FC<SideBySideComparisonCardProps> = ({ moves }) => {
  return (
    <Card className="rounded-2xl shadow-lg bg-card border border-border">
      <CardHeader>
        <CardTitle className="text-lg md:text-xl">Side-by-Side Comparison</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left border-b border-muted">
              <th className="py-2 px-2">#</th>
              <th className="py-2 px-2">Your Move</th>
              <th className="py-2 px-2">Engine Move</th>
              <th className="py-2 px-2">Eval Diff</th>
            </tr>
          </thead>
          <tbody>
            {moves.map((row, idx) => (
              <tr key={idx} className={row.isCritical ? "bg-[var(--secondary)] dark:bg-red-900/30" : ""}>
                <td className="py-1 px-2 font-mono">{row.moveNumber}</td>
                <td className="py-1 px-2 font-mono">{row.playerMove}</td>
                <td className="py-1 px-2 font-mono">{row.engineMove}</td>
                <td className={`py-1 px-2 font-mono ${row.evalDiff > 0 ? 'text-green-500' : row.evalDiff < 0 ? 'text-red-500' : ''}`}>{row.evalDiff > 0 ? '+' : ''}{row.evalDiff.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
};

export default SideBySideComparisonCard; 