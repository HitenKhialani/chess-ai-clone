'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import GameReviewDisplay from '../../components/GameReviewDisplay';
import { useTimeTracker } from '../../components/TimeTrackerProvider';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, Legend } from 'recharts';
import GameReview from '../../components/GameReview';

interface GameReport {
  id: number;
  result: string;
  played_at: string;
  game_report: any[];
}

export default function DashboardPage() {
  const [gameReports, setGameReports] = useState<GameReport[]>([]);
  const [totalTime, setTotalTime] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { sectionTimes } = useTimeTracker();
  const [activeTab, setActiveTab] = useState<'time' | 'games' | 'puzzles'>('time');
  const [puzzlesSolved, setPuzzlesSolved] = useState<number>(0);
  const [puzzlesByCategory, setPuzzlesByCategory] = useState<Record<string, number>>({});
  const [timeLog, setTimeLog] = useState<{ date: string; seconds: number }[]>([]);
  const [openGameReport, setOpenGameReport] = useState<null | { moves: string[], id: number }>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    setLoading(true);
    Promise.all([
      fetch('/api/users/game-reports', {
        headers: { Authorization: `Bearer ${token}` },
      }).then(res => res.json()),
      fetch('/api/users/total-time', {
        headers: { Authorization: `Bearer ${token}` },
      }).then(res => res.json()),
    ])
      .then(([games, time]) => {
        setGameReports(Array.isArray(games) ? games : []);
        setTotalTime(time.total_time_spent || 0);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to load dashboard data.');
        setLoading(false);
      });

    // Time tracking
    let seconds = 0;
    const interval = setInterval(() => {
      seconds += 30;
      fetch('/api/users/increment-time', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ seconds: 30 }),
      });
    }, 30000);
    // On unmount, send remaining seconds
    return () => {
      clearInterval(interval);
      if (seconds > 0) {
        fetch('/api/users/increment-time', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ seconds }),
        });
      }
    };
  }, [router]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
    fetch(`${backendUrl}/api/users/puzzles-solved`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setPuzzlesSolved(data.puzzles_solved || 0));
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
    fetch(`${backendUrl}/api/users/puzzles-solved-by-category`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setPuzzlesByCategory(data || {}));
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
    fetch(`${backendUrl}/api/users/time-log`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setTimeLog(Array.isArray(data) ? data : []));
  }, []);

  // Remove duplicate games by move history (stringified) and played_at
  const uniqueGameReports = Array.from(
    new Map(gameReports.map(g => [JSON.stringify(g.game_report) + '|' + g.played_at, g])).values()
  );

  // Calculate total best moves across all unique game reports
  const totalBestMoves = uniqueGameReports.reduce((sum, game) => {
    if (!Array.isArray(game.game_report)) return sum;
    // Only count 'Best' moves at odd indices (user moves)
    return sum + game.game_report.reduce((moveSum: number, move: any, idx: number) => {
      if (move.type === 'Best' && idx % 2 === 0) { // 0-based: even idx = user move
        return moveSum + 1;
      }
      return moveSum;
    }, 0);
  }, 0);

  // Optimistically increment total time spent in UI
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (!loading && !error) {
      interval = setInterval(() => {
        setTotalTime((prev) => prev + 30);
      }, 30000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [loading, error]);

  if (loading) {
    return <div className="flex items-center justify-center h-96 text-xl text-rgb(153, 0, 255)">Loading dashboard...</div>;
  }
  if (error) {
    return <div className="flex items-center justify-center h-96 text-xl text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-[var(--background)] relative overflow-hidden">
      <div className="max-w-4xl mx-auto py-10 px-4 relative z-10">
        <h1 className="text-4xl font-bold text-[var(--primary-text)] mb-6">Your Dashboard</h1>
        <div className="mb-8 p-6 card border border-[var(--accent)] shadow-lg flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-lg font-semibold text-[var(--primary-text)]">Total Time Spent</div>
            <div className="text-3xl font-bold mt-1 text-[var(--accent)]">{Math.floor(totalTime / 60)} min {totalTime % 60} sec</div>
          </div>
          <div className="mt-4 md:mt-0">
            <span className="text-lg font-semibold text-[var(--primary-text)]">Games Played:</span> <span className="text-2xl font-bold text-[var(--accent)]">{uniqueGameReports.length}</span>
          </div>
        </div>
        {/* Puzzles Solved Card and Games Played Card */}
        <div className="mb-8 flex flex-col md:flex-row gap-6">
          <div className="flex-1 p-6 card border border-[var(--accent)] shadow-lg flex flex-col items-center justify-center">
            <div className="text-lg font-semibold text-[var(--primary-text)]">Puzzles Solved</div>
            <div className="text-4xl font-bold mt-1 text-[var(--accent)]">{puzzlesSolved}</div>
          </div>
          <div className="flex-1 p-6 card border border-[var(--accent)] shadow-lg flex flex-col items-center justify-center">
            <div className="text-lg font-semibold text-[var(--primary-text)]">Games Played</div>
            <div className="text-4xl font-bold mt-1 text-[var(--accent)]">{uniqueGameReports.length}</div>
          </div>
          <div className="flex-1 p-6 card border border-[var(--accent)] shadow-lg flex flex-col items-center justify-center">
            <div className="text-lg font-semibold text-[var(--primary-text)]">Best Moves</div>
            <div className="text-4xl font-bold mt-1 text-[var(--accent)]">{totalBestMoves}</div>
          </div>
        </div>
        {/* Tabs */}
        <div className="mb-8 flex gap-4">
          <button
            className={`px-4 py-2 rounded-t-lg font-semibold transition-colors border-b-2 ${activeTab === 'time' ? 'border-[var(--accent)] text-[var(--accent)] shadow' : 'border-transparent text-[var(--primary-text)] hover:text-[var(--accent)]'}`}
            onClick={() => setActiveTab('time')}
          >
            Time Spent by Section
          </button>
          <button
            className={`px-4 py-2 rounded-t-lg font-semibold transition-colors border-b-2 ${activeTab === 'games' ? 'border-[var(--accent)] text-[var(--accent)] shadow' : 'border-transparent text-[var(--primary-text)] hover:text-[var(--accent)]'}`}
            onClick={() => setActiveTab('games')}
          >
            Game Reports
          </button>
          <button
            className={`px-4 py-2 rounded-t-lg font-semibold transition-colors border-b-2 ${activeTab === 'puzzles' ? 'border-[var(--accent)] text-[var(--accent)] shadow' : 'border-transparent text-[var(--primary-text)] hover:text-[var(--accent)]'}`}
            onClick={() => setActiveTab('puzzles')}
          >
            Puzzles
          </button>
        </div>
        {/* Tab Content */}
        {activeTab === 'time' && (
          <div className="mb-8">
            <div className="card rounded-lg shadow p-4">
              {/* Bar chart for time spent by section */}
              <div className="w-full h-64 mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={Object.entries(sectionTimes).map(([section, seconds]) => ({ section, seconds: Number(seconds) }))}>
                    <XAxis dataKey="section" stroke="white" />
                    <YAxis stroke="white" />
                    <Tooltip formatter={(v: number) => `${Math.floor(v / 60)}m ${v % 60}s`} contentStyle={{ backgroundColor: 'rgb(20, 20, 40)', border: '1px solid rgb(153, 0, 255)', color: 'white' }} />
                    <Bar dataKey="seconds" fill="rgb(153, 0, 255)" name="Time (sec)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <table className="min-w-full text-sm text-white">
                <thead>
                  <tr className="bg-rgb(153, 0, 255)/20">
                    <th className="px-2 py-1 text-left">Section</th>
                    <th className="px-2 py-1 text-left">Time Spent</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(sectionTimes).map(([section, seconds]) => (
                    <tr key={section}>
                      <td className="px-2 py-1 font-semibold text-rgb(153, 0, 255)">{section}</td>
                      <td className="px-2 py-1">{Math.floor(Number(seconds) / 60)} min {Number(seconds) % 60} sec</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {activeTab === 'games' && (
          <>
            <h2 className="text-2xl font-semibold text-white mb-4">Game Reports</h2>
            {uniqueGameReports.length === 0 ? (
              <div className="text-rgb(200, 200, 200)">No games played yet.</div>
            ) : (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {uniqueGameReports.map((game, idx) => (
                    <div
                      key={game.id}
                      className="card rounded-lg shadow p-4 border-l-4 border-rgb(153, 0, 255) cursor-pointer hover:shadow-lg transition relative purple-glow"
                      onClick={() => setOpenGameReport({ moves: game.game_report.map((m: any) => m.move), id: game.id })}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-rgb(153, 0, 255)">Match {idx + 1}</span>
                        <span className="text-rgb(200, 200, 200) text-sm">{new Date(game.played_at).toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-semibold text-white">Result: {game.result}</span>
                        <button
                          className="bg-gradient-to-r from-rgb(76, 0, 255) to-rgb(153, 0, 255) hover:from-rgb(153, 0, 255) hover:to-rgb(76, 0, 255) text-white font-bold px-4 py-1 rounded-lg shadow transition text-sm"
                          onClick={e => {
                            e.stopPropagation();
                            window.open(`/review?moves=${encodeURIComponent(JSON.stringify(game.game_report.map((m: any) => m.move)))}`, '_blank');
                          }}
                        >
                          Start Review
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Modal for game report */}
                {openGameReport && (
                  <div className="fixed bottom-4 right-4 z-50 w-full max-w-xl">
                    <div className="card rounded-xl shadow-2xl p-4 relative border-2 border-rgb(153, 0, 255) purple-glow">
                      <button
                        className="absolute top-2 right-2 text-rgb(200, 200, 200) hover:text-white text-xl"
                        onClick={() => setOpenGameReport(null)}
                      >
                        ✕
                      </button>
                      <GameReview
                        moveHistory={openGameReport.moves}
                        onClose={() => setOpenGameReport(null)}
                        shouldSave={false}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
        {activeTab === 'puzzles' && (
          <div className="mb-8">
            <div className="card rounded-lg shadow p-4 purple-glow">
              {/* Bar chart for puzzles solved by category */}
              <div className="w-full h-64 mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={Object.entries(puzzlesByCategory).map(([category, count]) => ({ category, count }))}>
                    <XAxis dataKey="category" stroke="white" />
                    <YAxis allowDecimals={false} stroke="white" />
                    <Tooltip contentStyle={{ backgroundColor: 'rgb(20, 20, 40)', border: '1px solid rgb(153, 0, 255)', color: 'white' }} />
                    <Bar dataKey="count" fill="rgb(153, 0, 255)" name="Puzzles Solved" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <table className="min-w-full text-sm text-white">
                <thead>
                  <tr className="bg-rgb(153, 0, 255)/20">
                    <th className="px-2 py-1 text-left">Category</th>
                    <th className="px-2 py-1 text-left">Puzzles Solved</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(puzzlesByCategory).map(([category, count]) => (
                    <tr key={category}>
                      <td className="px-2 py-1 font-semibold text-rgb(153, 0, 255)">{category}</td>
                      <td className="px-2 py-1">{count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {/* Line chart for total time spent per day */}
        {timeLog.length > 0 && (
          <div className="mb-8 card rounded-lg shadow p-4 purple-glow">
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timeLog}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgb(153, 0, 255)/30" />
                  <XAxis dataKey="date" stroke="white" />
                  <YAxis stroke="white" />
                  <Tooltip formatter={(v: number) => `${Math.floor(v / 60)}m ${v % 60}s`} contentStyle={{ backgroundColor: 'rgb(20, 20, 40)', border: '1px solid rgb(153, 0, 255)', color: 'white' }} />
                  <Legend />
                  <Line type="monotone" dataKey="seconds" name="Time (sec)" stroke="rgb(153, 0, 255)" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 