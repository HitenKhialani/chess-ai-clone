# AI Move Explanations Setup

## Overview
This feature adds AI-powered explanations for chess moves when users hover over them in the game review. It uses the OpenRouter API to generate educational explanations.

## Setup Instructions

### 1. Get OpenRouter API Key
1. Go to https://openrouter.ai/
2. Sign up for an account
3. Get your API key from the dashboard

### 2. Create Environment File
Create a `.env.local` file in the root directory with:

```
OPENROUTER_API_KEY=your_actual_api_key_here
```

### 3. How It Works
- When users **click** on a move in the game review, an AI explanation appears below the move history table
- The explanation panel shows:
  - Move analysis and classification
  - Educational explanation of the move
  - Position evaluation
  - Move type (Brilliant, Correct, Mistake, Blunder)
  - Close button (X) to dismiss the explanation

### 4. Features
- **Click Interaction**: Click on any move to see AI explanation
- **Dedicated Panel**: Explanation appears in a dedicated panel below the move history
- **Easy Dismissal**: Close button (X) to hide the explanation
- **Smart Caching**: Explanations are cached to avoid repeated API calls
- **FEN Position Data**: Uses actual chess positions for accurate analysis
- **Educational Content**: Provides chess coaching insights
- **Responsive Design**: Works on desktop and mobile

### 5. API Endpoint
- `/api/explain-move` - Handles AI explanation requests
- Uses Claude 3.5 Sonnet model via OpenRouter
- Returns concise, educational explanations

### 6. Components
- `MoveExplanationTooltip` - The clickable move component
- `MoveExplanationPanel` - The explanation display panel below the move history
- `MoveHistoryPanel` - Updated to include clickable moves and explanation panel
- `useMoveExplanation` - Custom hook for API calls

## Testing
1. Start a game and complete it
2. Go to the game review page
3. **Click** on any move in the move history
4. You should see an AI explanation panel appear below the move history table
5. Click the "X" button to close the explanation

## Troubleshooting
- If explanations don't appear, check your OpenRouter API key
- Ensure the `.env.local` file is in the root directory
- Check browser console for any API errors 