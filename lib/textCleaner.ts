/**
 * Utility function to clean up markdown formatting from AI responses
 * Removes ** for bold, - for bullet points, and other common markdown artifacts
 */
export function cleanMarkdownText(text: string): string {
  if (!text) return text;
  
  return text
    .replace(/\*\*/g, '') // Remove bold markers
    .replace(/^- /g, '') // Remove bullet points at start of lines
    .replace(/\n- /g, '\n') // Remove bullet points in middle of text
    .replace(/\n\*\*/g, '\n') // Remove bold markers at line starts
    .replace(/\*\*\n/g, '\n') // Remove bold markers at line ends
    .replace(/\n\n+/g, '\n\n') // Normalize multiple line breaks to max 2
    .trim(); // Remove extra whitespace
}

/**
 * Clean up an array of move analysis objects
 */
export function cleanMoveAnalysis(analysis: any[]): any[] {
  if (!Array.isArray(analysis)) return analysis;
  
  return analysis.map((move: any) => ({
    ...move,
    explanation: move.explanation ? cleanMarkdownText(move.explanation) : move.explanation
  }));
}
