import { useState, useCallback } from 'react';

interface MoveExplanationData {
  move: string;
  position: string;
  moveType: string;
  evaluation: string;
  moveNumber: number;
  playerColor: 'white' | 'black';
}

interface UseMoveExplanationReturn {
  getExplanation: (data: MoveExplanationData) => Promise<string>;
  isLoading: boolean;
  error: string | null;
}

export function useMoveExplanation(): UseMoveExplanationReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getExplanation = useCallback(async (data: MoveExplanationData): Promise<string> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/explain-move', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get explanation');
      }

      const result = await response.json();
      return result.explanation;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get explanation';
      setError(errorMessage);
      return `Unable to generate explanation: ${errorMessage}`;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    getExplanation,
    isLoading,
    error,
  };
} 