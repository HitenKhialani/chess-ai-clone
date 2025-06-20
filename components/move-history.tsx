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
    <Card className={`w-full min-w-[300px] bg-[#1e293b] border-[#334155] ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-[#818cf8] text-center">
          Move History
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[400px] overflow-x-auto">
          <Table className="table-fixed">
            <TableHeader>
              <TableRow className="border-[#334155] hover:bg-[#334155]/50">
                <TableHead className="text-[#94a3b8] font-medium text-center w-[50px]">#</TableHead>
                <TableHead className="text-[#94a3b8] font-medium text-center min-w-[70px]">User</TableHead>
                <TableHead className="text-[#94a3b8] font-medium text-center min-w-[70px]">AI</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {moves.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-[#64748b] py-8">
                    No moves yet
                  </TableCell>
                </TableRow>
              ) : (
                moves.map((move) => (
                  <React.Fragment key={move.moveNumber}>
                  <TableRow 
                    className="border-[#334155] hover:bg-[#334155]/30 transition-colors"
                  >
                      <TableCell className="text-center text-[#94a3b8] font-mono text-sm w-[50px]">
                      {move.moveNumber}
                    </TableCell>
                      <TableCell className="text-center text-white font-mono text-sm min-w-[70px]">
                      {move.userMove || '-'}
                    </TableCell>
                      <TableCell className="text-center text-[#818cf8] font-mono text-sm min-w-[70px]">
                      {move.aiMove || '-'}
                    </TableCell>
                  </TableRow>
                    {move.fen && (
                      <TableRow className="border-b border-[#334155] bg-[#2a3b4c] hover:bg-[#2a3b4c]">
                        <TableCell colSpan={3} className="text-left text-[#94a3b8] font-mono text-xs py-1 px-4 truncate">
                          FEN: {move.fen}
                        </TableCell>
                      </TableRow>
                    )}
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