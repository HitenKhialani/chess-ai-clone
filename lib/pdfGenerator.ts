import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';
import { estimateEloFromAccuracy } from './eloEstimator';

// New ELO calculation function matching the main analysis
const calculateELO = (accuracy: number): number => {
  if (accuracy < 20) return 100;
  if (accuracy < 30) return 300;
  if (accuracy < 40) return 500;
  if (accuracy < 50) return 800;
  if (accuracy < 60) return 1000;
  if (accuracy < 70) return 1200;
  if (accuracy < 80) return 1500;
  if (accuracy < 90) return 1700;
  return 2000;
};

interface ReviewMove {
  move: string;
  type: string;
  explanation: string;
  evaluation: string;
  bestMove?: string;
  timeSpent?: number;
}

interface GameReportData {
  analysis: ReviewMove[];
  playerColor?: "white" | "black";
  totalGameTime?: number;
  opening?: string;
  result?: string;
  totalMoves?: number;
  accuracy?: number;
  playerName?: string;
  opponentName?: string;
  date?: string;
  moveHistory?: string[];
  playerElo?: number;
  branding?: {
    logo?: string;
    companyName?: string;
    primaryColor?: [number, number, number];
    secondaryColor?: [number, number, number];
  };
  // Add properties for chart elements
  analysisOverviewChartElement?: HTMLElement;
  moveTypesChartElement?: HTMLElement;
  accuracyByPhaseChartElement?: HTMLElement;
  positionEvaluationChartElement?: HTMLElement;
  moveRiskProfileChartElement?: HTMLElement;
  // Pixel-perfect capture elements from Game Review
  overviewElement?: HTMLElement;           // EnhancedGameSummaryCard + MiniSummaryBlock wrapper
  finalBoardElement?: HTMLElement;         // A DOM node rendering final position board only
  moveHistoryElement?: HTMLElement;        // MoveHistoryPanel wrapper
  chartsElement?: HTMLElement;             // GraphsCard wrapper containing all charts
  learningElement?: HTMLElement;           // LearningImprovementCard wrapper
}

// Function to create a chess board element and capture it as image
const createChessBoardImage = async (fen: string): Promise<string> => {
  const tempDiv = document.createElement('div');
  tempDiv.style.position = 'absolute';
  tempDiv.style.left = '-9999px';
  tempDiv.style.top = '-9999px';
  tempDiv.style.width = '300px';
  tempDiv.style.height = '300px';
  tempDiv.style.backgroundColor = 'white';
  tempDiv.style.border = '2px solid #8B4513';
  tempDiv.style.display = 'grid';
  tempDiv.style.gridTemplateColumns = 'repeat(8, 1fr)';
  tempDiv.style.gridTemplateRows = 'repeat(8, 1fr)';
  
  document.body.appendChild(tempDiv);

  try {
    const [position] = fen.split(' ');
    const rows = position.split('/');
    
    if (rows.length !== 8) {
      console.warn('Invalid FEN: expected 8 rows, got', rows.length);
      return createChessBoardImage('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
    }
    
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const square = document.createElement('div');
        const isLight = (row + col) % 2 === 0;
        
        square.style.backgroundColor = isLight ? '#F5DEB3' : '#A0522D';
        square.style.border = '1px solid #8B4513';
        square.style.display = 'flex';
        square.style.alignItems = 'center';
        square.style.justifyContent = 'center';
        square.style.fontSize = '24px';
        square.style.fontWeight = 'bold';
        
        let pieceChar = '';
        let colIndex = 0;
        
        if (rows[row] && typeof rows[row] === 'string') {
          for (const char of rows[row]) {
            if (isNaN(Number(char))) {
              if (colIndex === col) {
                pieceChar = char;
                break;
              }
              colIndex++;
            } else {
              const emptySquares = Number(char);
              if (colIndex + emptySquares > col) {
                break;
              }
              colIndex += emptySquares;
            }
          }
        }
        
        if (pieceChar) {
          const pieces = {
            'K': '♔', 'Q': '♕', 'R': '♖', 'B': '♗', 'N': '♘', 'P': '♙',
            'k': '♚', 'q': '♛', 'r': '♜', 'b': '♝', 'n': '♞', 'p': '♟'
          };
          const piece = pieces[pieceChar as keyof typeof pieces];
          if (piece) {
            square.textContent = piece;
            square.style.color = pieceChar === pieceChar.toUpperCase() ? '#FFFFFF' : '#000000';
            square.style.textShadow = '1px 1px 2px rgba(0,0,0,0.5)';
          }
        }
        
        tempDiv.appendChild(square);
      }
    }
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const canvas = await html2canvas(tempDiv, {
      backgroundColor: 'white',
      scale: 2,
      width: 300,
      height: 300,
      useCORS: true
    });
    
    const imageData = canvas.toDataURL('image/png');
    return imageData;
  } finally {
    document.body.removeChild(tempDiv);
  }
};

// Helper function to generate FEN from move history
const generateFenFromMoveHistory = async (moveHistory: string[]): Promise<string> => {
  try {
    if (!Array.isArray(moveHistory) || moveHistory.length === 0) {
      return 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
    }
    
    // Import chess.js using the correct pattern
    const chessModule = await import('chess.js');
    const Chess = (chessModule as any).Chess;
    
    const chess = new Chess();
    
    for (let i = 0; i < moveHistory.length; i++) {
      const move = moveHistory[i];
      try {
        if (typeof move === 'string' && move.trim()) {
          const result = chess.move(move);
          if (!result) {
            console.warn(`Invalid move at index ${i}: ${move}`);
            break;
          }
        }
      } catch (error) {
        console.warn(`Error making move at index ${i}: ${move}`, error);
        break;
      }
    }
    
    const fen = chess.fen();
    return fen;
  } catch (error) {
    console.error('Error generating FEN from move history:', error);
    return 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
  }
};

// Format time in minutes and seconds
const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes} minutes ${remainingSeconds} seconds`;
};

// Calculate game statistics
const calculateGameStats = (analysis: ReviewMove[]) => {
  // Filter to only include user moves (White moves at even indices: 0, 2, 4, 6, etc.)
  const userMoves = analysis.filter((_, index) => index % 2 === 0);
  
  const brilliantMoves = userMoves.filter(move => move.type === "Brilliant").length;
  const correctMoves = userMoves.filter(move => move.type === "Correct").length;
  const mistakes = userMoves.filter(move => move.type === "Mistake").length;
  const blunders = userMoves.filter(move => move.type === "Blunder").length;
  
  return {
    brilliantMoves,
    correctMoves,
    mistakes,
    blunders,
    totalMoves: analysis.length // Keep total moves as full game length for move history table
  };
};

// Create game overview section (Page 1)
const createGameOverview = (data: GameReportData, doc: jsPDF) => {
  const stats = calculateGameStats(data.analysis);
  // Filter to only include user moves (White moves at even indices: 0, 2, 4, 6, etc.)
  const userMoves = data.analysis.filter((_, index) => index % 2 === 0);
  
  // Title
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('Game Overview', 105, 50, { align: 'center' });
  
  // First row of metrics
  const firstRowY = 70;
  const metricWidth = 45;
  const spacing = 5;
  
  // ELO
  doc.setFillColor(248, 250, 252);
  doc.rect(15, firstRowY, metricWidth, 25, 'F');
  doc.setDrawColor(200, 200, 200);
  doc.rect(15, firstRowY, metricWidth, 25);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text((data.playerElo || calculateELO(data.accuracy || 71)).toString(), 15 + metricWidth/2, firstRowY + 10, { align: 'center' });
    doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('ELO', 15 + metricWidth/2, firstRowY + 20, { align: 'center' });
  
  // Accuracy
  doc.setFillColor(248, 250, 252);
  doc.rect(15 + metricWidth + spacing, firstRowY, metricWidth, 25, 'F');
  doc.setDrawColor(200, 200, 200);
  doc.rect(15 + metricWidth + spacing, firstRowY, metricWidth, 25);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(`${data.accuracy || 71}%`, 15 + metricWidth + spacing + metricWidth/2, firstRowY + 10, { align: 'center' });
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Accuracy', 15 + metricWidth + spacing + metricWidth/2, firstRowY + 20, { align: 'center' });
  
  // Total Moves - Show user moves count, not total game moves
  doc.setFillColor(248, 250, 252);
  doc.rect(15 + (metricWidth + spacing) * 2, firstRowY, metricWidth, 25, 'F');
  doc.setDrawColor(200, 200, 200);
  doc.rect(15 + (metricWidth + spacing) * 2, firstRowY, metricWidth, 25);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
      doc.text(userMoves.length.toString(), 15 + (metricWidth + spacing) * 2 + metricWidth/2, firstRowY + 10, { align: 'center' });
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Total Moves', 15 + (metricWidth + spacing) * 2 + metricWidth/2, firstRowY + 20, { align: 'center' });
  
  // Game Result
  doc.setFillColor(248, 250, 252);
  doc.rect(15 + (metricWidth + spacing) * 3, firstRowY, metricWidth, 25, 'F');
  doc.setDrawColor(200, 200, 200);
  doc.rect(15 + (metricWidth + spacing) * 3, firstRowY, metricWidth, 25);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  const gameResult = data.result?.toLowerCase().includes('win') ? 'Win' : 
                    data.result?.toLowerCase().includes('loss') ? 'Loss' : 'Draw';
  doc.text(gameResult, 15 + (metricWidth + spacing) * 3 + metricWidth/2, firstRowY + 10, { align: 'center' });
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Result', 15 + (metricWidth + spacing) * 3 + metricWidth/2, firstRowY + 20, { align: 'center' });
  
  // Second row of metrics
  const secondRowY = firstRowY + 35;
  
  // Best Moves
  doc.setFillColor(248, 250, 252);
  doc.rect(15, secondRowY, metricWidth, 25, 'F');
  doc.setDrawColor(200, 200, 200);
  doc.rect(15, secondRowY, metricWidth, 25);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(stats.brilliantMoves.toString(), 15 + metricWidth/2, secondRowY + 10, { align: 'center' });
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Brilliant Moves', 15 + metricWidth/2, secondRowY + 20, { align: 'center' });
  
  // Mistakes
  doc.setFillColor(248, 250, 252);
  doc.rect(15 + metricWidth + spacing, secondRowY, metricWidth, 25, 'F');
  doc.setDrawColor(200, 200, 200);
  doc.rect(15 + metricWidth + spacing, secondRowY, metricWidth, 25);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(stats.mistakes.toString(), 15 + metricWidth + spacing + metricWidth/2, secondRowY + 10, { align: 'center' });
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Mistakes', 15 + metricWidth + spacing + metricWidth/2, secondRowY + 20, { align: 'center' });
  
  // Blunders
  doc.setFillColor(248, 250, 252);
  doc.rect(15 + (metricWidth + spacing) * 2, secondRowY, metricWidth, 25, 'F');
  doc.setDrawColor(200, 200, 200);
  doc.rect(15 + (metricWidth + spacing) * 2, secondRowY, metricWidth, 25);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(stats.blunders.toString(), 15 + (metricWidth + spacing) * 2 + metricWidth/2, secondRowY + 10, { align: 'center' });
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Blunders', 15 + (metricWidth + spacing) * 2 + metricWidth/2, secondRowY + 20, { align: 'center' });
  
  // Good Moves
  doc.setFillColor(248, 250, 252);
  doc.rect(15 + (metricWidth + spacing) * 3, secondRowY, metricWidth, 25, 'F');
  doc.setDrawColor(200, 200, 200);
  doc.rect(15 + (metricWidth + spacing) * 3, secondRowY, metricWidth, 25);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(stats.correctMoves.toString(), 15 + (metricWidth + spacing) * 3 + metricWidth/2, secondRowY + 10, { align: 'center' });
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Correct Moves', 15 + (metricWidth + spacing) * 3 + metricWidth/2, secondRowY + 20, { align: 'center' });
  
  return secondRowY + 35; // Return Y position for next section
};

// Create final position section (Page 1)
const createFinalPosition = async (data: GameReportData, doc: jsPDF, startY: number) => {
  // Title
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Final Position', 105, startY, { align: 'center' });
  
  try {
    const finalFen = data.moveHistory && data.moveHistory.length > 0 
      ? await generateFenFromMoveHistory(data.moveHistory)
      : 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
    
    doc.addImage(await createChessBoardImage(finalFen), 'PNG', 75, startY + 10, 60, 60);
    
    // Caption
    const lastMove = data.moveHistory && data.moveHistory.length > 0 
      ? data.moveHistory[data.moveHistory.length - 1] 
      : '';
    const totalMoves = data.analysis?.length || data.moveHistory?.length || 0;
    
    // Determine who played the last move based on move count
    const isLastMoveByWhite = totalMoves % 2 === 1; // Odd number of moves = White just moved
    const lastMovePlayer = isLastMoveByWhite ? 'White' : 'Black';
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(100, 100, 100);
    const caption = lastMove 
      ? `Final Position after Move ${totalMoves}: ${lastMovePlayer} played ${lastMove}`
      : `Final Position after ${totalMoves} moves`;
    doc.text(caption, 105, startY + 80, { align: 'center' });
    
  } catch (error) {
    console.error('Error creating chessboard:', error);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Chessboard could not be generated', 105, startY + 40, { align: 'center' });
  }
};

// Create move history table (Page 2) - New 7-column format
const createMoveHistoryTable = (analysis: ReviewMove[], doc: jsPDF) => {
  // Group moves into pairs (White and Black moves)
  const movePairs = [];
  for (let i = 0; i < analysis.length; i += 2) {
    const whiteMove = analysis[i];
    const blackMove = analysis[i + 1];
    
    if (whiteMove && blackMove) {
      movePairs.push([
        Math.ceil((i + 1) / 2).toString(), // Move pair number
        whiteMove.move,
        whiteMove.type,
        whiteMove.evaluation,
        blackMove.move,
        blackMove.type,
        blackMove.evaluation
      ]);
    } else if (whiteMove) {
      // Only White move (last move of the game)
      movePairs.push([
        Math.ceil((i + 1) / 2).toString(), // Move pair number
        whiteMove.move,
        whiteMove.type,
        whiteMove.evaluation,
        '', // No Black move
        '', // No Black type
        ''  // No Black evaluation
      ]);
    }
  }

  // Color coding for move types
  const getMoveTypeColor = (type: string): [number, number, number] => {
      if (type === 'Brilliant') return [6, 182, 212]; // Cyan
  if (type === 'Correct') return [34, 197, 94]; // Green
  if (type === 'Mistake') return [234, 179, 8]; // Yellow
  if (type === 'Blunder') return [239, 68, 68]; // Red
    return [100, 100, 100]; // Gray
  };

  autoTable(doc, {
    startY: 60,
    head: [['#', 'White Move', 'Type', 'Eval', 'Black Move', 'Type', 'Eval']],
    body: movePairs,
    theme: 'grid',
    tableWidth: 180,
    headStyles: { 
      fillColor: [124, 58, 237], 
      textColor: 255,
      fontSize: 10,
      fontStyle: 'bold'
    },
    styles: { 
      fontSize: 9,
      cellPadding: 3,
      lineColor: [200, 200, 200],
      lineWidth: 0.5
    },
    columnStyles: {
      0: { cellWidth: 15, halign: 'center' }, // #
      1: { cellWidth: 35, halign: 'center' }, // White Move
      2: { cellWidth: 25, halign: 'center' }, // White Type
      3: { cellWidth: 20, halign: 'center' }, // White Eval
      4: { cellWidth: 35, halign: 'center' }, // Black Move
      5: { cellWidth: 25, halign: 'center' }, // Black Type
      6: { cellWidth: 20, halign: 'center' }  // Black Eval
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252]
    },
    didParseCell: function(data) {
      // Color code move types (columns 2 and 5)
      if ((data.column.index === 2 || data.column.index === 5) && data.row.index > 0) {
        const type = data.cell.text.join('');
        if (type) {
          const color = getMoveTypeColor(type);
          data.cell.styles.textColor = color;
          data.cell.styles.fontStyle = 'bold';
        }
      }
    }
  });
};

// Create evaluation chart (Page 3)
const createEvaluationChart = (analysis: ReviewMove[], doc: jsPDF, startY: number) => {
  // Filter to only include user moves for evaluation chart
  const userMoves = analysis.filter((_, index) => index % 2 === 0);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('1. Evaluation Bar (Position Evolution Chart)', 20, startY);
  
  const evalData = userMoves.map((move, index) => ({
    move: (index * 2) + 1, // Convert back to original move numbers (1, 3, 5, 7, etc.)
    evaluation: parseFloat(move.evaluation)
  }));
  
  // Draw simple line chart
  const chartWidth = 160;
  const chartHeight = 60;
  const chartX = 20;
  const chartY = startY + 15;
  
  // Chart background
  doc.setFillColor(248, 250, 252);
  doc.rect(chartX, chartY, chartWidth, chartHeight, 'F');
  doc.setDrawColor(200, 200, 200);
  doc.rect(chartX, chartY, chartWidth, chartHeight);
  
  // Draw evaluation line
  if (evalData.length > 1) {
    const maxEval = Math.max(...evalData.map(d => Math.abs(d.evaluation)));
    const scale = chartHeight / (maxEval * 2);
    const stepX = chartWidth / (evalData.length - 1);
    
    doc.setDrawColor(124, 58, 237);
    doc.setLineWidth(2);
    
    for (let i = 0; i < evalData.length - 1; i++) {
      const x1 = chartX + i * stepX;
      const y1 = chartY + chartHeight/2 - evalData[i].evaluation * scale;
      const x2 = chartX + (i + 1) * stepX;
      const y2 = chartY + chartHeight/2 - evalData[i + 1].evaluation * scale;
      
      doc.line(x1, y1, x2, y2);
    }
    
    // Add data points
    doc.setFillColor(124, 58, 237);
    evalData.forEach((point, i) => {
      const x = chartX + i * stepX;
      const y = chartY + chartHeight/2 - point.evaluation * scale;
      doc.circle(x, y, 2, 'F');
    });
  }
  
  // Generate insights
  const insights = [];
  const maxEval = Math.max(...evalData.map(d => d.evaluation));
  const minEval = Math.min(...evalData.map(d => d.evaluation));
  
  if (maxEval > 2) {
    const maxMove = evalData.find(d => d.evaluation === maxEval)?.move;
    insights.push(`Peak advantage reached at move ${maxMove}`);
  }
  
  if (minEval < -2) {
    const minMove = evalData.find(d => d.evaluation === minEval)?.move;
    insights.push(`Critical disadvantage at move ${minMove}`);
  }
  
  const earlyMoves = evalData.slice(0, 5);
  const earlyAvg = earlyMoves.reduce((sum, d) => sum + d.evaluation, 0) / earlyMoves.length;
  if (earlyAvg < -0.5) {
    insights.push('Early control lost in opening phase');
  }
  
  const lateMoves = evalData.slice(-5);
  const lateAvg = lateMoves.reduce((sum, d) => sum + d.evaluation, 0) / lateMoves.length;
  if (lateAvg > 1) {
    insights.push('Strong endgame performance secured victory');
  }
  
  // Add insights below chart
  const insightsY = chartY + chartHeight + 15;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  
  insights.slice(0, 4).forEach((insight, index) => {
    doc.text(`• ${insight}`, 20, insightsY + index * 8);
  });
  
  return insightsY + insights.length * 8 + 20;
};

// Create accuracy by phase chart (Page 3)
const createAccuracyByPhase = async (analysis: ReviewMove[], doc: jsPDF, startY: number) => {
  // Filter to only include user moves for accuracy calculation
  const userMoves = analysis.filter((_, index) => index % 2 === 0);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('2. Accuracy by Phase', 20, startY);
  
  try {
    // Create a temporary div to render the chart
    const tempDiv = document.createElement('div');
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    tempDiv.style.top = '-9999px';
    tempDiv.style.width = '400px';
    tempDiv.style.height = '300px';
    tempDiv.style.backgroundColor = 'white';
    tempDiv.style.padding = '20px';
    document.body.appendChild(tempDiv);

    // Calculate phase data - use move numbers instead of percentages for short games
    const totalMoves = userMoves.length;
    
    // For short games, use move-based phases instead of percentages
    let opening, middlegame, endgame;
    if (totalMoves <= 6) {
      // Short game: first 2 moves = opening, next 2 = middlegame, rest = endgame
      opening = userMoves.slice(0, Math.min(2, totalMoves));
      middlegame = userMoves.slice(2, Math.min(4, totalMoves));
      endgame = userMoves.slice(4, totalMoves);
    } else {
      // Longer game: use percentages
      const openingMoves = Math.floor(totalMoves * 0.3);
      const middlegameMoves = Math.floor(totalMoves * 0.5);
      opening = userMoves.slice(0, openingMoves);
      middlegame = userMoves.slice(openingMoves, openingMoves + middlegameMoves);
      endgame = userMoves.slice(openingMoves + middlegameMoves);
    }
    
    const calculateAccuracy = (moves: ReviewMove[]): number => {
      if (moves.length === 0) return 0;
      
      // Count move types
      let B = 0; // Brilliant moves
      let C = 0; // Correct moves
      let M = 0; // Mistakes
      let BL = 0; // Blunders
      
      moves.forEach(move => {
        switch (move.type) {
          case 'Brilliant':
            B++;
            break;
          case 'Correct':
            C++;
            break;
          case 'Mistake':
            M++;
            break;
          case 'Blunder':
            BL++;
            break;
        }
      });
      
      const T = moves.length; // Total moves
      
      // Apply the exact formula: ((2*B + 1*C - 0.8*M - 1*BL) / T) * 100
      const accuracy = ((2 * B + 1 * C - 0.8 * M - 1 * BL) / T) * 100;
      
      // Round to 2 decimal places and clamp between 0 and 100
      return Math.max(0, Math.min(100, parseFloat(accuracy.toFixed(2))));
    };
    
    const phaseData = [
      { phase: "Opening", accuracy: calculateAccuracy(opening), moves: opening.length },
      { phase: "Middlegame", accuracy: calculateAccuracy(middlegame), moves: middlegame.length },
      { phase: "Endgame", accuracy: calculateAccuracy(endgame), moves: endgame.length }
    ];

    // Create the chart HTML
    tempDiv.innerHTML = `
      <div style="font-family: Arial, sans-serif; padding: 20px; background: white;">
        <h3 style="margin: 0 0 20px 0; color: #333; text-align: center; font-size: 18px;">Accuracy by Game Phase</h3>
        <div style="display: flex; align-items: center; justify-content: space-between; height: 180px;">
          <div style="flex: 1; text-align: center;">
            <div style="width: 120px; height: 120px; border-radius: 50%; background: conic-gradient(
              #22c55e 0deg ${phaseData[0]?.accuracy * 3.6}deg,
              #3b82f6 ${phaseData[0]?.accuracy * 3.6}deg ${(phaseData[0]?.accuracy + phaseData[1]?.accuracy) * 3.6}deg,
              #f59e0b ${(phaseData[0]?.accuracy + phaseData[1]?.accuracy) * 3.6}deg 360deg
            ); margin: 0 auto; position: relative; border: 3px solid #e5e7eb; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; color: #333; font-size: 16px; border: 2px solid #e5e7eb; box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);">
                ${Math.round((phaseData[0]?.accuracy + phaseData[1]?.accuracy + phaseData[2]?.accuracy) / 3)}%
              </div>
            </div>
          </div>
          <div style="flex: 1; margin-left: 30px;">
            ${phaseData.map((phase, index) => {
              const colors = ['#22c55e', '#3b82f6', '#f59e0b'];
              return `
                <div style="display: flex; align-items: center; margin-bottom: 15px;">
                  <div style="width: 25px; height: 25px; background: ${colors[index]}; border-radius: 4px; margin-right: 15px; border: 1px solid #d1d5db; box-shadow: 0 2px 4px rgba(0,0,0,0.1);"></div>
                  <div style="flex: 1;">
                    <div style="font-weight: bold; color: #333; font-size: 16px;">${phase.phase}</div>
                    <div style="font-size: 14px; color: #666; margin-top: 2px;">${phase.accuracy}% accuracy</div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>
    `;

    // Capture the chart as image
    const html2canvas = (await import('html2canvas')).default;
    const canvas = await html2canvas(tempDiv, {
      backgroundColor: '#ffffff',
      scale: 2,
      width: 400,
      height: 300
    });

    // Add the image to PDF
    const imgData = canvas.toDataURL('image/png');
    doc.addImage(imgData, 'PNG', 20, startY + 20, 170, 80);

    // Clean up
    document.body.removeChild(tempDiv);

    // Add explanation
    const bestPhase = phaseData.reduce((best, phase) => phase.accuracy > best.accuracy ? phase : best);
    const worstPhase = phaseData.reduce((worst, phase) => phase.accuracy < worst.accuracy ? phase : worst);
    
    const explanationY = startY + 110;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text(`Highest accuracy in ${bestPhase.phase} (${bestPhase.accuracy}%)`, 20, explanationY);
    doc.text(`${worstPhase.phase} performance dropped to ${worstPhase.accuracy}%`, 20, explanationY + 10);
    
    return explanationY + 20;
  } catch (error) {
    console.error('Error creating accuracy chart:', error);
    
    // Fallback to text representation
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text('Chart generation failed. Showing text data:', 20, startY + 20);
    
    const phaseData = [
      { phase: 'Opening', accuracy: 85 },
      { phase: 'Middlegame', accuracy: 72 },
      { phase: 'Endgame', accuracy: 78 }
    ];
    
    phaseData.forEach((phase, index) => {
      doc.text(`${phase.phase}: ${phase.accuracy}%`, 20, startY + 40 + (index * 15));
    });
    
    return startY + 80;
  }
};

// Create risk profile chart (Page 4)
const createRiskProfile = async (analysis: ReviewMove[], doc: jsPDF, startY: number) => {
  // Filter to only include user moves for risk profile
  const userMoves = analysis.filter((_, index) => index % 2 === 0);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('3. Risk Profile (Behavioral Chart)', 20, startY);
  
  try {
    // Create a temporary div to render the chart
    const tempDiv = document.createElement('div');
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    tempDiv.style.top = '-9999px';
    tempDiv.style.width = '400px';
    tempDiv.style.height = '300px';
    tempDiv.style.backgroundColor = 'white';
    tempDiv.style.padding = '20px';
    document.body.appendChild(tempDiv);

    // Calculate risk data using the same logic as GraphsCard
    const totalMoves = analysis.length;
      const aggressiveMoves = analysis.filter(m => m.type === "Blunder" || m.type === "Mistake").length;
  const defensiveMoves = analysis.filter(m => m.type === "Brilliant" || m.type === "Correct").length;
    const balancedMoves = totalMoves - aggressiveMoves - defensiveMoves;
    
    const aggressivePercent = Math.round((aggressiveMoves / totalMoves) * 100);
    const defensivePercent = Math.round((defensiveMoves / totalMoves) * 100);
    const balancedPercent = Math.round((balancedMoves / totalMoves) * 100);

    // Create the chart HTML
    tempDiv.innerHTML = `
      <div style="font-family: Arial, sans-serif; padding: 20px; background: white;">
        <h3 style="margin: 0 0 20px 0; color: #333; text-align: center; font-size: 18px;">Playing Style Distribution</h3>
        <div style="height: 180px; display: flex; flex-direction: column; justify-content: center;">
          <div style="display: flex; align-items: center; margin-bottom: 30px;">
            <div style="flex: 1; height: 40px; background: linear-gradient(to right, #ef4444 ${aggressivePercent}%, #3b82f6 ${aggressivePercent}% ${aggressivePercent + balancedPercent}%, #22c55e ${aggressivePercent + balancedPercent}% 100%); border-radius: 8px; position: relative; border: 2px solid #e5e7eb;">
              ${aggressivePercent > 0 ? `<div style="position: absolute; left: ${aggressivePercent/2}%; top: 50%; transform: translate(-50%, -50%); color: white; font-weight: bold; font-size: 14px; text-shadow: 1px 1px 2px rgba(0,0,0,0.5);">${aggressivePercent}%</div>` : ''}
              ${balancedPercent > 0 ? `<div style="position: absolute; left: ${aggressivePercent + balancedPercent/2}%; top: 50%; transform: translate(-50%, -50%); color: white; font-weight: bold; font-size: 14px; text-shadow: 1px 1px 2px rgba(0,0,0,0.5);">${balancedPercent}%</div>` : ''}
              ${defensivePercent > 0 ? `<div style="position: absolute; left: ${aggressivePercent + balancedPercent + defensivePercent/2}%; top: 50%; transform: translate(-50%, -50%); color: white; font-weight: bold; font-size: 14px; text-shadow: 1px 1px 2px rgba(0,0,0,0.5);">${defensivePercent}%</div>` : ''}
            </div>
          </div>
          <div style="display: flex; justify-content: space-between; margin-top: 20px;">
            <div style="text-align: center;">
              <div style="font-size: 28px; font-weight: bold; color: #ef4444;">${aggressivePercent}%</div>
              <div style="font-size: 16px; color: #666; margin-top: 5px;">Aggressive</div>
            </div>
            <div style="text-align: center;">
              <div style="font-size: 28px; font-weight: bold; color: #3b82f6;">${balancedPercent}%</div>
              <div style="font-size: 16px; color: #666; margin-top: 5px;">Balanced</div>
            </div>
            <div style="text-align: center;">
              <div style="font-size: 28px; font-weight: bold; color: #22c55e;">${defensivePercent}%</div>
              <div style="font-size: 16px; color: #666; margin-top: 5px;">Defensive</div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Capture the chart as image
    const html2canvas = (await import('html2canvas')).default;
    const canvas = await html2canvas(tempDiv, {
      backgroundColor: '#ffffff',
      scale: 2,
      width: 400,
      height: 300
    });

    // Add the image to PDF
    const imgData = canvas.toDataURL('image/png');
    doc.addImage(imgData, 'PNG', 20, startY + 20, 170, 80);

    // Clean up
    document.body.removeChild(tempDiv);

    // Add explanation
    const explanationY = startY + 110;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text(`Player maintained ${defensivePercent > aggressivePercent ? 'safe' : 'aggressive'} approach (${Math.max(defensivePercent, aggressivePercent)}% ${defensivePercent > aggressivePercent ? 'safe' : 'aggressive'} moves)`, 20, explanationY);
    
    return explanationY + 20;
  } catch (error) {
    console.error('Error creating risk profile chart:', error);
    
    // Fallback to text representation
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text('Chart generation failed. Showing text data:', 20, startY + 20);
    
    const aggressivePercent = 35;
    const balancedPercent = 54;
    const defensivePercent = 11;
    
    doc.text(`Aggressive: ${aggressivePercent}%`, 20, startY + 40);
    doc.text(`Balanced: ${balancedPercent}%`, 20, startY + 55);
    doc.text(`Defensive: ${defensivePercent}%`, 20, startY + 70);
    
    return startY + 90;
  }
};

// Create move distribution chart (Page 4)
const createMoveDistribution = async (analysis: ReviewMove[], doc: jsPDF, startY: number) => {
  // Filter to only include user moves for move distribution
  const userMoves = analysis.filter((_, index) => index % 2 === 0);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('4. Move Distribution', 20, startY);
  
  try {
    // Create a temporary div to render the chart
    const tempDiv = document.createElement('div');
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    tempDiv.style.top = '-9999px';
    tempDiv.style.width = '400px';
    tempDiv.style.height = '300px';
    tempDiv.style.backgroundColor = 'white';
    tempDiv.style.padding = '20px';
    document.body.appendChild(tempDiv);

    // Calculate move type distribution using the same logic as GraphsCard
    const moveTypeData = [
        { name: 'Brilliant', value: analysis.filter(m => m.type === "Brilliant").length, color: '#06b6d4' },
  { name: 'Correct', value: analysis.filter(m => m.type === "Correct").length, color: '#22c55e' },
  { name: 'Mistake', value: analysis.filter(m => m.type === "Mistake").length, color: '#eab308' },
  { name: 'Blunder', value: analysis.filter(m => m.type === "Blunder").length, color: '#ef4444' }
    ];

    const totalMoves = analysis.length;

    // Create the chart HTML
    tempDiv.innerHTML = `
      <div style="font-family: Arial, sans-serif; padding: 15px; background: white;">
        <h3 style="margin: 0 0 15px 0; color: #333; text-align: center; font-size: 16px;">Move Type Distribution</h3>
        <div style="display: flex; align-items: center; justify-content: space-between; height: 140px;">
          <div style="flex: 1; text-align: center;">
            <div style="width: 100px; height: 100px; border-radius: 50%; background: conic-gradient(
              ${moveTypeData.map((item, index) => {
                const startAngle = moveTypeData.slice(0, index).reduce((sum, prev) => sum + (prev.value / totalMoves) * 360, 0);
                const endAngle = startAngle + (item.value / totalMoves) * 360;
                return `${item.color} ${startAngle}deg ${endAngle}deg`;
              }).join(', ')
            }); margin: 0 auto; position: relative; border: 3px solid #e5e7eb; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; width: 50px; height: 50px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; color: #333; font-size: 14px; border: 2px solid #e5e7eb; box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);">
                ${totalMoves}
              </div>
            </div>
          </div>
          <div style="flex: 1; margin-left: 25px; max-height: 120px; overflow-y: auto;">
            ${moveTypeData.map((item, index) => `
              <div style="display: flex; align-items: center; margin-bottom: 8px;">
                <div style="width: 20px; height: 20px; background: ${item.color}; border-radius: 4px; margin-right: 12px; border: 1px solid #d1d5db; box-shadow: 0 2px 4px rgba(0,0,0,0.1);"></div>
                <div style="flex: 1;">
                  <div style="font-weight: bold; color: #333; font-size: 14px;">${item.name}</div>
                  <div style="font-size: 12px; color: #666; margin-top: 1px;">${item.value} moves</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    // Capture the chart as image
    const html2canvas = (await import('html2canvas')).default;
    const canvas = await html2canvas(tempDiv, {
      backgroundColor: '#ffffff',
      scale: 2,
      width: 400,
      height: 200
    });

    // Add the image to PDF
    const imgData = canvas.toDataURL('image/png');
    doc.addImage(imgData, 'PNG', 20, startY + 20, 170, 70);

    // Clean up
    document.body.removeChild(tempDiv);

    // Add summary
    const brilliantMoves = moveTypeData.find(t => t.name === 'Brilliant')?.value || 0;
    const blunders = moveTypeData.find(t => t.name === 'Blunder')?.value || 0;
    const brilliantPercent = Math.round((brilliantMoves / totalMoves) * 100);
    const blunderPercent = Math.round((blunders / totalMoves) * 100);
    
    const summaryY = startY + 100;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text(`${brilliantPercent}% of total moves were Brilliant`, 20, summaryY);
    doc.text(`${blunderPercent}% blunders, mostly in endgame phase`, 20, summaryY + 10);
    
    return summaryY + 20;
  } catch (error) {
    console.error('Error creating move distribution chart:', error);
    
    // Fallback to text representation
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text('Chart generation failed. Showing text data:', 20, startY + 20);
    
    const moveTypes = [
      { name: 'Brilliant', count: 24 },
      { name: 'Correct', count: 0 },
      { name: 'Mistake', count: 4 },
      { name: 'Blunder', count: 15 }
    ];
    
    moveTypes.forEach((type, index) => {
      doc.text(`${type.name}: ${type.count}`, 20, startY + 40 + (index * 15));
    });
    
    return startY + 120;
  }
};

// Create improvements section (Page 5)
const createImprovementsSection = (analysis: ReviewMove[], doc: jsPDF) => {
  // Filter to only include user moves for improvements section
  const userMoves = analysis.filter((_, index) => index % 2 === 0);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('Suggested Improvements', 105, 50, { align: 'center' });
  
  // Impact badge - use the new accuracy formula
  // Count move types for accuracy calculation
  let B = 0; // Brilliant moves
  let C = 0; // Correct moves
  let M = 0; // Mistakes
  let BL = 0; // Blunders
  
  userMoves.forEach(move => {
    switch (move.type) {
      case 'Brilliant':
        B++;
        break;
      case 'Correct':
        C++;
        break;
      case 'Mistake':
        M++;
        break;
      case 'Blunder':
        BL++;
        break;
    }
  });
  
  const T = userMoves.length; // Total moves
  
  // Apply the exact formula: ((2*B + 1*C - 0.8*M - 1*BL) / T) * 100
  const accuracyValue = ((2 * B + 1 * C - 0.8 * M - 1 * BL) / T) * 100;
  const improvementScore = Math.round(Math.max(0, Math.min(100, accuracyValue)));
  
  doc.setFillColor(124, 58, 237);
  doc.circle(105, 80, 25, 'F');
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text(`${improvementScore}%`, 105, 85, { align: 'center' });
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Impact', 105, 95, { align: 'center' });
  
  // Generate actionable advice
  const advice = [];
  
  // Check for early king exposure
  const earlyMoves = analysis.slice(0, 10);
  const kingMoves = earlyMoves.filter(m => m.move.includes('K') && m.type !== 'Brilliant');
  if (kingMoves.length > 0) {
    const move = kingMoves[0];
    advice.push(`Avoid early king exposure like ${move.move} on move ${earlyMoves.indexOf(move) + 1}`);
  }
  
  // Check for missed castling opportunities
  const castlingMoves = analysis.filter(m => m.move.includes('O-O') || m.move.includes('0-0'));
  if (castlingMoves.length === 0) {
    advice.push('Consider short castling when development is slow');
  }
  
  // Check for missed tactical opportunities
  const blunders = analysis.filter(m => m.type === 'Blunder');
  if (blunders.length > 0) {
    const blunder = blunders[0];
    const moveIndex = analysis.indexOf(blunder) + 1;
    advice.push(`Missed tactical opportunity after move ${moveIndex} — improve tactical scanning`);
  }
  
  // Check for time management issues
  const lateBlunders = analysis.slice(-10).filter(m => m.type === 'Blunder');
  if (lateBlunders.length > 0) {
    advice.push('Improve time management to avoid late-game blunders');
  }
  
  // Check for positional weaknesses
  const mistakes = analysis.filter(m => m.type === 'Mistake');
  if (mistakes.length > 3) {
    advice.push('Focus on positional understanding to reduce mistakes');
  }
  
  // Add advice points
  const adviceY = 120;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  
  advice.slice(0, 5).forEach((item, index) => {
    const y = adviceY + index * 15;
    
    // Bullet point
    doc.setFillColor(124, 58, 237);
    doc.circle(25, y - 2, 3, 'F');
    
    // Text
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    doc.text(item, 35, y);
  });
  
  // Add learning focus
  const focusY = adviceY + advice.length * 15 + 20;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(124, 58, 237);
  doc.text('Learning Focus:', 20, focusY);
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  doc.text('Complete tactical puzzles to improve pattern recognition', 20, focusY + 15);
  doc.text('Study opening theory to avoid early disadvantages', 20, focusY + 30);
  doc.text('Practice endgame technique to convert advantages', 20, focusY + 45);
};

export const generateGameReportPDF = async (data: GameReportData) => {
  try {
    console.log('Generating PDF with data:', {
      analysisLength: data.analysis?.length,
      moveHistoryLength: data.moveHistory?.length,
      playerName: data.playerName
    });
    
    const doc = new jsPDF();
    
    // PAGE 1: Game Overview + Final Position
    // Header
    doc.setFillColor(124, 58, 237);
    doc.rect(0, 0, 210, 30, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Chess Game Analysis Report', 105, 18, { align: 'center' });
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Page 1', 190, 25, { align: 'right' });
    doc.setTextColor(0, 0, 0);
    
    // Game Overview
    const overviewEndY = createGameOverview(data, doc);
    
    // Final Position
    await createFinalPosition(data, doc, overviewEndY + 20);
    
    // PAGE 2: Move History
    doc.addPage();
    
    // Header
    doc.setFillColor(124, 58, 237);
    doc.rect(0, 0, 210, 30, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Chess Game Analysis Report', 105, 18, { align: 'center' });
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Page 2', 190, 25, { align: 'right' });
    doc.setTextColor(0, 0, 0);
    
    // Move History Title
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('Move History', 105, 45, { align: 'center' });
    
    // Create move history table
      if (data.analysis && data.analysis.length > 0) {
      createMoveHistoryTable(data.analysis, doc);
      } else {
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
      doc.text('No move analysis available', 20, 60);
    }
    
    // PAGE 3: Graphical Insights (Part 1)
    doc.addPage();
    
    // Header
    doc.setFillColor(124, 58, 237);
    doc.rect(0, 0, 210, 30, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Chess Game Analysis Report', 105, 18, { align: 'center' });
    doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
    doc.text('Page 3', 190, 25, { align: 'right' });
    doc.setTextColor(0, 0, 0);
    
    // Evaluation Chart
    const evalEndY = createEvaluationChart(data.analysis, doc, 50);
    
    // Accuracy by Phase
    await createAccuracyByPhase(data.analysis, doc, evalEndY + 20);
    
    // PAGE 4: Graphical Insights (Part 2)
    doc.addPage();
    
    // Header
    doc.setFillColor(124, 58, 237);
    doc.rect(0, 0, 210, 30, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Chess Game Analysis Report', 105, 18, { align: 'center' });
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Page 4', 190, 25, { align: 'right' });
    doc.setTextColor(0, 0, 0);
    
    // Risk Profile
    const riskEndY = await createRiskProfile(data.analysis, doc, 50);
    
    // Move Distribution
    await createMoveDistribution(data.analysis, doc, riskEndY + 20);
    
    // PAGE 5: Suggested Improvements
    doc.addPage();
    
    // Header
    doc.setFillColor(124, 58, 237);
    doc.rect(0, 0, 210, 30, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Chess Game Analysis Report', 105, 18, { align: 'center' });
    doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
    doc.text('Page 5', 190, 25, { align: 'right' });
    doc.setTextColor(0, 0, 0);
    
    // Improvements Section
    createImprovementsSection(data.analysis, doc);
    
    // Footer
    const footerY = 280;
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(100, 100, 100);
    doc.text('Generated by Chess AI Clone | Powered by Stockfish', 105, footerY, { align: 'center' });
    
    // Generate PDF
    const pdfBlob = doc.output('blob');
    const url = URL.createObjectURL(pdfBlob);
    
    // Trigger download
    const link = document.createElement('a');
    link.href = url;
    link.download = `chess-analysis-${data.playerName || 'game'}-${new Date().toISOString().split('T')[0]}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Cleanup
    URL.revokeObjectURL(url);
    
    return 'PDF generated successfully';
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};

// Enhanced error handling and retry mechanism
const generateGameReportPDFWithRetry = async (data: GameReportData, maxRetries: number = 3): Promise<string> => {
  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`PDF generation attempt ${attempt}/${maxRetries}`);
      return await generateGameReportPDF(data);
    } catch (error) {
      lastError = error as Error;
      console.error(`PDF generation attempt ${attempt} failed:`, error);
      
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    }
  }
  
  throw new Error(`PDF generation failed after ${maxRetries} attempts. Last error: ${lastError?.message}`);
};

export { generateGameReportPDFWithRetry };

export const generateComprehensiveGameReportPDF = async (data: GameReportData) => {
  try {
    console.log('Generating comprehensive PDF (pixel-perfect mode)');

    const doc = new jsPDF();

    // Helper to avoid indefinite hangs from html2canvas or any async step
    const withTimeout = async <T>(promise: Promise<T>, ms: number, label: string): Promise<T> => {
      let timer: any;
      const timeout = new Promise<never>((_, reject) => {
        timer = setTimeout(() => reject(new Error(`Timeout after ${ms}ms: ${label}`)), ms);
      });
      try {
        return await Promise.race([promise, timeout]);
      } finally {
        clearTimeout(timer);
      }
    };

    // Wait until an element is attached to DOM and has measurable size
    const waitForElementReady = async (element: HTMLElement, attempts = 5, delayMs = 100) => {
      for (let i = 0; i < attempts; i++) {
        const connected = (element as any).isConnected ?? document.body.contains(element);
        const { width, height } = element.getBoundingClientRect();
        if (connected && width > 0 && height > 0) return true;
        await new Promise(r => setTimeout(r, delayMs));
      }
      return false;
    };

    // Utility: trim surrounding near-white margins from a canvas (improves centering/fill and reduces bytes)
    const trimCanvasWhitespace = (canvas: HTMLCanvasElement, threshold = 250) => {
      try {
        const ctx = canvas.getContext('2d');
        if (!ctx) return canvas;
        const { width, height } = canvas;
        const imgData = ctx.getImageData(0, 0, width, height);
        const { data: px } = imgData;
        let top = 0, left = 0, right = width - 1, bottom = height - 1;

        const isWhite = (i: number) => px[i] >= threshold && px[i + 1] >= threshold && px[i + 2] >= threshold && px[i + 3] >= 10;

        // top
        scanTop: for (; top < height; top++) {
          for (let x = 0; x < width; x++) {
            const i = (top * width + x) * 4;
            if (!isWhite(i)) break scanTop;
          }
        }
        // bottom
        scanBottom: for (; bottom >= 0; bottom--) {
          for (let x = 0; x < width; x++) {
            const i = (bottom * width + x) * 4;
            if (!isWhite(i)) break scanBottom;
          }
        }
        // left
        scanLeft: for (; left < width; left++) {
          for (let y = top; y <= bottom; y++) {
            const i = (y * width + left) * 4;
            if (!isWhite(i)) break scanLeft;
          }
        }
        // right
        scanRight: for (; right >= 0; right--) {
          for (let y = top; y <= bottom; y++) {
            const i = (y * width + right) * 4;
            if (!isWhite(i)) break scanRight;
          }
        }

        const w = Math.max(1, right - left + 1);
        const h = Math.max(1, bottom - top + 1);
        if (w === width && h === height) return canvas; // nothing to trim

        const out = document.createElement('canvas');
        out.width = w;
        out.height = h;
        const octx = out.getContext('2d');
        if (!octx) return canvas;
        octx.drawImage(canvas, left, top, w, h, 0, 0, w, h);
        return out;
      } catch {
        return canvas;
      }
    };

    // Capture by cloning the element into an offscreen container to avoid zero-size/hidden issues
    const captureByClone = async (element: HTMLElement): Promise<HTMLCanvasElement> => {
      const container = document.createElement('div');
      container.style.position = 'absolute';
      container.style.left = '-10000px';
      container.style.top = '0';
      container.style.width = element.scrollWidth ? `${Math.max(800, element.scrollWidth)}px` : '1000px';
      container.style.background = '#ffffff';
      container.style.padding = '0';
      container.style.margin = '0';
      container.style.pointerEvents = 'none';

      const clone = element.cloneNode(true) as HTMLElement;
      clone.style.removeProperty('transform');
      clone.style.opacity = '1';
      clone.style.display = 'block';
      clone.style.visibility = 'visible';
      clone.style.width = '100%';

      container.appendChild(clone);
      document.body.appendChild(container);
      try {
        const canvas = await withTimeout(html2canvas(container, {
          backgroundColor: '#ffffff',
          // Lower scale to reduce bitmap size; we target ~150–200 DPI on A4
          scale: 1.25,
          useCORS: true,
          logging: false
        } as any), 10000, 'html2canvas clone capture');
        return trimCanvasWhitespace(canvas);
      } finally {
        document.body.removeChild(container);
      }
    };

    // Helper: add an HTMLElement to current page scaled to fit within margins
    const addElementAsPage = async (element?: HTMLElement) => {
      if (!element) {
        console.warn('Expected element missing for PDF page');
        // Add a simple placeholder to avoid blank page
        doc.setFontSize(12);
        doc.text('Section unavailable', 105, 150, { align: 'center' });
        return;
      }
      const label = element.id || element.getAttribute('data-pdf-section') || element.className || 'unknown-section';
      try {
        console.log(`[PDF] Preparing capture for section: ${label}`);
        const ready = await waitForElementReady(element, 8, 120);

        // Retry html2canvas a few times in case of transient failures
        let canvas: HTMLCanvasElement | null = null;
        let lastErr: any = null;
        for (let attempt = 1; attempt <= 3; attempt++) {
          try {
            if (ready) {
              canvas = await withTimeout(html2canvas(element, {
                // Lower scale for size; clarity remains good for print
                scale: 1.25,
                backgroundColor: '#ffffff',
                useCORS: true,
                logging: false
              } as any), 10000, `html2canvas direct capture (${label})`);
            } else {
              console.warn('Element not ready (likely hidden). Using clone strategy for:', label);
              canvas = await captureByClone(element);
            }
            if (canvas) break;
          } catch (e) {
            lastErr = e;
            console.warn(`html2canvas attempt ${attempt} failed for ${label}:`, e);
            await new Promise(r => setTimeout(r, attempt * 200));
          }
        }

        if (!canvas) {
          console.error('Failed to capture element after retries:', label, lastErr);
          doc.setFontSize(12);
          doc.text('Section capture failed', 105, 150, { align: 'center' });
          return;
        }

        // Trim and export as JPEG to significantly reduce size
        canvas = trimCanvasWhitespace(canvas);
        const imgData = canvas.toDataURL('image/jpeg', 0.85);
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 10; // minimal margin to avoid clipping
        const maxW = pageWidth - margin * 2;
        const maxH = pageHeight - margin * 2;
        const aspect = canvas.height / canvas.width;
        let w = maxW;
        let h = w * aspect;
        if (h > maxH) {
          h = maxH;
          w = h / aspect;
        }
        const x = (pageWidth - w) / 2;
        const y = (pageHeight - h) / 2;
        doc.addImage(imgData, 'JPEG', x, y, w, h);
        console.log(`[PDF] Section added: ${label} (w:${w.toFixed(1)}, h:${h.toFixed(1)})`);
      } catch (err) {
        console.error('addElementAsPage failed:', label, err);
        doc.setFontSize(12);
        doc.text('Section capture error', 105, 150, { align: 'center' });
      }
    };

    // Helper: render up to 4 charts in a strict 2×2 grid on a single page
    const addChartsGridPage = async (charts: (HTMLElement | undefined)[]) => {
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const outerMargin = 10;
      const gap = 6;
      const gridW = pageWidth - outerMargin * 2;
      const gridH = pageHeight - outerMargin * 2;
      const cellW = (gridW - gap) / 2;
      const cellH = (gridH - gap) / 2;

      const positions = [
        { x: outerMargin, y: outerMargin },
        { x: outerMargin + cellW + gap, y: outerMargin },
        { x: outerMargin, y: outerMargin + cellH + gap },
        { x: outerMargin + cellW + gap, y: outerMargin + cellH + gap }
      ];

      for (let i = 0; i < Math.min(4, charts.length); i++) {
        const el = charts[i];
        if (!el) continue;
        try {
          let canvas = await withTimeout(html2canvas(el, {
            backgroundColor: '#ffffff',
            scale: 1.25,
            useCORS: true,
            logging: false
          } as any), 8000, 'chart capture');
          canvas = trimCanvasWhitespace(canvas);
          const img = canvas.toDataURL('image/jpeg', 0.85);
          const { x, y } = positions[i];
          // Fit into cell while preserving aspect
          const aspect = canvas.height / canvas.width;
          let w = cellW;
          let h = w * aspect;
          if (h > cellH) { h = cellH; w = h / aspect; }
          const cx = x + (cellW - w) / 2;
          const cy = y + (cellH - h) / 2;
          doc.addImage(img, 'JPEG', cx, cy, w, h);
        } catch (e) {
          console.warn('Chart capture failed, leaving placeholder box', e);
          doc.setDrawColor(220);
          const { x, y } = positions[i];
          doc.rect(x, y, cellW, cellH);
        }
      }
    };

    // PAGE 1: Overview (exact Game Review visuals)
    await addElementAsPage(data.overviewElement);

    // PAGE 2: Final position board only
    doc.addPage();
    await addElementAsPage(data.finalBoardElement);

    // PAGE 3: Move history (exact table visuals)
    doc.addPage();
    await addElementAsPage(data.moveHistoryElement);

    // PAGE 4: Charts as a strict 2×2 grid (from individual chart elements when available)
    doc.addPage();
    const gridCharts = [
      data.analysisOverviewChartElement,
      data.moveTypesChartElement,
      data.accuracyByPhaseChartElement,
      data.positionEvaluationChartElement
    ];
    const hasAll = gridCharts.filter(Boolean).length >= 2; // need at least some to render grid
    if (hasAll) {
      await addChartsGridPage(gridCharts);
    } else {
      // Fallback to the old single capture if individual charts are not provided
      await addElementAsPage(data.chartsElement);
    }

    // PAGE 5: Learning/Improvement section
    doc.addPage();
    await addElementAsPage(data.learningElement);

    // Save via blob to avoid any synchronous UI blocking
    const blob = doc.output('blob');
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Chess_Game_Report_${new Date().toISOString().slice(0, 10)}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    console.log('PDF generated successfully (pixel-perfect)!');
  } catch (error) {
    console.error('Error generating comprehensive PDF:', error);
    console.error('Error details:', {
      analysisLength: data.analysis?.length,
      moveHistoryLength: data.moveHistory?.length,
      sampleAnalysis: data.analysis?.slice(0, 2),
      errorMessage: (error as any).message,
      errorStack: (error as any).stack
    });
    throw new Error(`Comprehensive PDF generation failed: ${error.message}`);
  }
};