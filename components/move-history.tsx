'use client';

import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Move {
  moveNumber: number;
  userMove?: string;
  aiMove?: string;
  fen?: string;
}

interface MoveHistoryProps {
  moves: Move[];
  className?: string;
}

export function MoveHistory({ moves, className = '' }: MoveHistoryProps) {
  return (
    <Card className={`w-full min-w-[300px] bg-[var(--card)] border-[var(--border)] ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-[var(--primary-text)] text-center">
          Move History
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[400px] overflow-x-auto">
          <Table className="table-fixed">
            <TableHeader>
              <TableRow className="border-[var(--border)] hover:bg-[var(--card)]/50">
                <TableHead className="text-[var(--primary-text)] font-medium text-center w-[50px]">#</TableHead>
                <TableHead className="text-[var(--primary-text)] font-medium text-center min-w-[70px]">User</TableHead>
                <TableHead className="text-[var(--primary-text)] font-medium text-center min-w-[70px]">AI</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {moves.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-[var(--primary-text)] py-8">
                    No moves yet
                  </TableCell>
                </TableRow>
              ) : (
                moves.map((move) => (
                  <React.Fragment key={move.moveNumber}>
                  <TableRow 
                    className="border-[var(--border)] hover:bg-[var(--card)]/30 transition-colors"
                  >
                      <TableCell className="text-center text-[var(--primary-text)] font-mono text-sm w-[50px]">
                      {move.moveNumber}
                    </TableCell>
                      <TableCell className="text-center text-[var(--primary-text)] font-mono text-sm min-w-[70px]">
                      {move.userMove || '-'}
                    </TableCell>
                      <TableCell className="text-center text-[var(--primary-text)] font-mono text-sm min-w-[70px]">
                      {move.aiMove || '-'}
                    </TableCell>
                  </TableRow>
                  </React.Fragment>
                ))
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}