const Stockfish = require('stockfish');
const { Chess } = require('chess.js');
const GameAnalysis = require('../models/GameAnalysis');

class ChessAnalysisService {
  constructor() {
    this.stockfish = null;
    this.isReady = false;
    this.initPromise = null;
    this.initializeStockfish();
  }

  initializeStockfish() {
    this.stockfish = Stockfish();
    this.isReady = false;
    this.initPromise = new Promise((resolve) => {
      this.stockfish.onmessage = (line) => {
        if (line.includes('uciok')) {
          this.stockfish.postMessage('isready');
        } else if (line.includes('readyok')) {
          this.isReady = true;
          resolve();
        }
      };
      this.stockfish.postMessage('uci');
    });
  }

  async ensureReady() {
    if (!this.isReady) {
      await this.initPromise;
    }
  }

  async analyzePosition(fen, grandmaster) {
    try {
      // First try to find similar positions in GM's PGN database
      const pgnAnalysis = await this.analyzeFromPGNDatabase(fen, grandmaster);
      if (pgnAnalysis) {
        return pgnAnalysis;
      }
      // If no PGN match found, use Stockfish
      return await this.analyzeWithStockfish(fen, grandmaster);
    } catch (error) {
      console.error('Analysis error:', error);
      throw error;
    }
  }

  async analyzeFromPGNDatabase(fen, grandmaster) {
    try {
      // Read the GM's PGN file
      const pgnFile = path.join(__dirname, '..', '..', `${grandmaster}.pgn`);
      const pgnContent = await fs.promises.readFile(pgnFile, 'utf-8');
      
      const chess = new Chess();
      // Split PGN games at the start of each new game
      const games = pgnContent.split(/\r?\n\r?\n(?=\[Event )/);
      
      for (const game of games) {
        if (!game.trim()) continue;
        
        chess.loadPgn(game);
        const positions = this.getAllPositions(chess);
        
        // Find similar positions
        const similarPosition = positions.find(pos => this.arePositionsSimilar(pos, fen));
        if (similarPosition) {
          const nextMove = chess.history()[positions.indexOf(similarPosition) + 1];
          return {
            suggestedMove: nextMove,
            justification: this.generateJustification(nextMove, grandmaster, 'PGN_DATABASE'),
            analysisSource: 'PGN_DATABASE',
            evaluation: 0 // PGN analysis doesn't provide evaluation
          };
        }
      }
      
      return null;
    } catch (error) {
      console.error('PGN analysis error:', error);
      return null;
    }
  }

  async analyzeWithStockfish(fen, grandmaster) {
    await this.ensureReady();
    return new Promise((resolve, reject) => {
      let bestMove = null;
      let evaluation = 0;
      let receivedBestMove = false;
      this.stockfish.onmessage = (output) => {
        if (output.startsWith('info') && output.includes('score cp')) {
          const match = output.match(/score cp (-?\d+)/);
          if (match) {
            evaluation = parseInt(match[1], 10) / 100;
          }
        }
        if (output.startsWith('bestmove')) {
          bestMove = output.split(' ')[1];
          receivedBestMove = true;
          resolve({
            suggestedMove: bestMove,
            justification: this.generateJustification(bestMove, grandmaster, 'STOCKFISH'),
            analysisSource: 'STOCKFISH',
            evaluation: evaluation
          });
        }
      };
      this.stockfish.postMessage(`position fen ${fen}`);
      this.stockfish.postMessage('go depth 20');
      setTimeout(() => {
        if (!receivedBestMove) {
          reject(new Error('Stockfish analysis timed out'));
        }
      }, 15000);
    });
  }

  getAllPositions(chess) {
    const positions = [];
    const history = chess.history();
    const tempChess = new Chess();
    
    for (const move of history) {
      tempChess.move(move);
      positions.push(tempChess.fen());
    }
    
    return positions;
  }

  arePositionsSimilar(pos1, pos2) {
    // Simple similarity check - can be improved with more sophisticated comparison
    const pieces1 = pos1.split(' ')[0];
    const pieces2 = pos2.split(' ')[0];
    return pieces1 === pieces2;
  }

  generateJustification(move, grandmaster, source) {
    const justifications = {
      Carlsen: {
        PGN_DATABASE: "I've played this position before, and this move leads to a strong initiative.",
        STOCKFISH: "This move creates the most pressure while maintaining a solid position."
      },
      Nakamura: {
        PGN_DATABASE: "This aggressive move is typical of my style - it creates complications.",
        STOCKFISH: "This tactical shot creates the most dynamic possibilities."
      },
      Caruana: {
        PGN_DATABASE: "This positional move improves the piece coordination.",
        STOCKFISH: "This move maintains the initiative while keeping the position under control."
      },
      Anand: {
        PGN_DATABASE: "This move is part of my strategic plan to control the center.",
        STOCKFISH: "This move develops the position harmoniously while maintaining equality."
      }
    };

    return justifications[grandmaster][source];
  }
}

module.exports = new ChessAnalysisService(); 