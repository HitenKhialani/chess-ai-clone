"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trash2, RefreshCw, Eye } from "lucide-react"

interface GameReviewCacheDebugProps {
  movesParam: string
  gameResult: string
}

export default function GameReviewCacheDebug({ movesParam, gameResult }: GameReviewCacheDebugProps) {
  const [cacheInfo, setCacheInfo] = useState<any>(null)
  const [savedGames, setSavedGames] = useState<string[]>([])

  useEffect(() => {
    updateCacheInfo()
  }, [movesParam, gameResult])

  const updateCacheInfo = () => {
    // Check analysis cache
    const analysisKey = `analysis-${movesParam}`
    const cachedAnalysis = localStorage.getItem(analysisKey)
    
    // Check saved games
    const savedGamesList = JSON.parse(localStorage.getItem('savedGames') || '[]')
    
    setCacheInfo({
      analysisKey,
      hasCachedAnalysis: !!cachedAnalysis,
      cachedAnalysisData: cachedAnalysis ? JSON.parse(cachedAnalysis) : null,
      savedGames: savedGamesList,
      gameKey: `${movesParam}-${gameResult}`,
      isGameSaved: savedGamesList.includes(`${movesParam}-${gameResult}`)
    })
    setSavedGames(savedGamesList)
  }

  const clearAnalysisCache = () => {
    const analysisKey = `analysis-${movesParam}`
    localStorage.removeItem(analysisKey)
    updateCacheInfo()
  }

  const clearAllCache = () => {
    // Clear all analysis caches
    const keys = Object.keys(localStorage)
    keys.forEach(key => {
      if (key.startsWith('analysis-')) {
        localStorage.removeItem(key)
      }
    })
    updateCacheInfo()
  }

  const clearSavedGames = () => {
    localStorage.removeItem('savedGames')
    updateCacheInfo()
  }

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString()
  }

  if (!cacheInfo) return null

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <Eye className="h-4 w-4" />
          Cache Debug Info
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <strong>Analysis Cache:</strong>
            <div className="mt-1">
              <div>Key: {cacheInfo.analysisKey}</div>
              <div>Cached: {cacheInfo.hasCachedAnalysis ? 'Yes' : 'No'}</div>
              {cacheInfo.cachedAnalysisData?.timestamp && (
                <div>Cached at: {formatTimestamp(cacheInfo.cachedAnalysisData.timestamp)}</div>
              )}
            </div>
          </div>
          <div>
            <strong>Game Save Status:</strong>
            <div className="mt-1">
              <div>Game Key: {cacheInfo.gameKey}</div>
              <div>Saved: {cacheInfo.isGameSaved ? 'Yes' : 'No'}</div>
              <div>Total Saved: {savedGames.length}</div>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={clearAnalysisCache}
            className="text-xs"
          >
            <Trash2 className="h-3 w-3 mr-1" />
            Clear Analysis Cache
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={clearAllCache}
            className="text-xs"
          >
            <Trash2 className="h-3 w-3 mr-1" />
            Clear All Cache
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={clearSavedGames}
            className="text-xs"
          >
            <Trash2 className="h-3 w-3 mr-1" />
            Clear Saved Games
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={updateCacheInfo}
            className="text-xs"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Refresh
          </Button>
        </div>
      </CardContent>
    </Card>
  )
} 