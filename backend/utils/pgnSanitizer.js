const { Chess } = require('chess.js');

/**
 * Sanitizes a raw PGN string by removing unwanted annotations and validating it
 * @param {string} rawPGN - The raw PGN string to sanitize
 * @returns {string} The cleaned and validated PGN string
 * @throws {Error} if the PGN cannot be loaded by chess.js
 */
function sanitizePGN(rawPGN) {
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
 * @param {string} pgn - The PGN string to validate
 * @returns {boolean} true if valid, false otherwise
 */
function isValidPGN(pgn) {
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
 * @param {string} pgn - The PGN string
 * @returns {Object} Object containing game metadata
 */
function extractPGNMetadata(pgn) {
  const metadata = {};
  
  // Extract headers using regex
  const headerRegex = /\[(\w+)\s+"([^"]*)"\]/g;
  let match;
  
  while ((match = headerRegex.exec(pgn)) !== null) {
    const [, key, value] = match;
    metadata[key.toLowerCase()] = value;
  }
  
  return metadata;
}

module.exports = {
  sanitizePGN,
  isValidPGN,
  extractPGNMetadata
}; 