import { Chess } from 'chess.js';

/**
 * Sanitizes a raw PGN string by removing unwanted annotations and validating it
 * @param rawPGN - The raw PGN string to sanitize
 * @returns The cleaned and validated PGN string
 * @throws Error if the PGN cannot be loaded by chess.js
 */
export function sanitizePGN(rawPGN: string): string {
  // Step 1: Strip unnecessary characters (comments, NAGs, etc.)
  const stripped = rawPGN
    .replace(/\{[^}]*\}/g, '')           // remove comments like {comment}
    .replace(/\$\d+/g, '')               // remove NAGs like $1, $146
    .replace(/\d+\.\.\./g, '')           // remove redundant move indicators
    .replace(/[!?]+/g, '')               // remove move annotations like !, !!, ?, ??
    .replace(/\s+/g, ' ')                // normalize whitespace
    .replace(/\r\n/g, '\n')              // normalize line endings
    .replace(/\r/g, '\n')                // normalize line endings
    .trim();

  // Step 2: Load into chess.js to check validity
  const game = new Chess();
  
  try {
    game.loadPgn(stripped);
  } catch (error) {
    throw new Error(`PGN could not be loaded by chess.js: ${error}`);
  }

  // Step 3: Get back cleaned, valid PGN
  return game.pgn();
}

/**
 * Validates if a PGN string is valid without sanitizing it
 * @param pgn - The PGN string to validate
 * @returns true if valid, false otherwise
 */
export function isValidPGN(pgn: string): boolean {
  try {
    const game = new Chess();
    game.loadPgn(pgn);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Extracts game metadata from PGN headers
 * @param pgn - The PGN string
 * @returns Object containing game metadata
 */
export function extractPGNMetadata(pgn: string): {
  event?: string;
  site?: string;
  date?: string;
  white?: string;
  black?: string;
  result?: string;
} {
  const metadata: any = {};
  
  // Extract headers using regex
  const headerRegex = /\[(\w+)\s+"([^"]*)"\]/g;
  let match;
  
  while ((match = headerRegex.exec(pgn)) !== null) {
    const [, key, value] = match;
    metadata[key.toLowerCase()] = value;
  }
  
  return metadata;
}

export function parsePgnPuzzles(pgnText: string) {
  // Split by [Event ...] which always starts a new puzzle
  const games = pgnText.split(/\[Event /).filter(Boolean).map(g => "[Event " + g.trim());
  return games.map(game => {
    // Extract FEN
    const fenMatch = game.match(/\[FEN "([^"]+)"\]/);
    const fen = fenMatch ? fenMatch[1] : null;
    // Extract moves (after the last header line)
    const movesSection = game.split(/\n\n/).pop() || '';
    const movesLines = movesSection
      .split('\n')
      .filter(line => line && !line.startsWith('['))
      .join(' ')
      .replace(/\d+\./g, '')
      .replace(/\s+/g, ' ')
      .trim();
    const moves = movesLines.split(' ').filter(m => m && !['1-0', '0-1', '1/2-1/2'].includes(m));
    return { fen, solutionMoves: moves };
  });
} 