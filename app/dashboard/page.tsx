'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import GameReviewDisplay from '../../components/GameReviewDisplay';
import { useTimeTracker } from '../../components/TimeTrackerProvider';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, Legend } from 'recharts';
import GameReview from '../../components/GameReview';
import Image from 'next/image';
import { useUser } from '@/components/UserProvider';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useTheme } from "next-themes"

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
  const { user } = useUser();
  const [totalPuzzles, setTotalPuzzles] = useState<number | null>(null);
  const { theme } = useTheme();

  const addTestCoins = async () => {
    const token = localStorage.getItem('token');
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
    if (!token) {
        toast.error("You must be logged in to add coins.");
        return;
    }
    try {
        const response = await fetch(`${backendUrl}/api/users/add-test-coins`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });
        const data = await response.json();
        if (response.ok) {
            toast.success("Added 10 test coins!");
        } else {
            toast.error(data.msg || "Failed to add coins.");
        }
    } catch (error) {
        toast.error("An error occurred while adding coins.");
    }
  };

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

  useEffect(() => {
    const fetchTotalPuzzles = async () => {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
        // Fetch counts for all puzzle types and sum them
        const endpoints = [
          '/api/puzzles/tactics/count',
          '/api/puzzles/endgame/count',
          '/api/puzzles/fork/count',
          '/api/puzzles/random/count',
          '/api/puzzles/pin/count',
          '/api/puzzles/pgn/count',
        ];
        const results = await Promise.all(
          endpoints.map((ep) => fetch(backendUrl + ep).then(res => res.json()).catch(() => ({ count: 0 })))
        );
        const total = results.reduce((sum, r) => sum + (r.count || 0), 0);
        setTotalPuzzles(total);
      } catch (e) {
        setTotalPuzzles(null);
      }
    };
    fetchTotalPuzzles();
  }, []);

  // Remove duplicate games by move history (stringified) and played_at
  const uniqueGameReports = Array.from(
    new Map(gameReports.map(g => [JSON.stringify(g.game_report) + '|' + g.played_at, g])).values()
  );

  // Count best moves at odd positions (1,3,5,...) across all games
  const bestMovesAtOddPositions = uniqueGameReports.reduce((sum, game) => {
    if (!Array.isArray(game.game_report)) return sum;
    return sum + game.game_report.filter((move: any, idx: number) => move.type === 'Best' && idx % 2 === 0).length;
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
            <div className="text-4xl font-bold mt-1 text-[var(--accent)]">
              {puzzlesSolved}
              {typeof totalPuzzles === 'number' && totalPuzzles > 0 && (
                <span className="text-2xl text-[var(--primary-text)]"> / {totalPuzzles}</span>
              )}
            </div>
          </div>
          <div className="flex-1 p-6 card border border-[var(--accent)] shadow-lg flex flex-col items-center justify-center">
            <div className="text-lg font-semibold text-[var(--primary-text)]">Games Played</div>
            <div className="text-4xl font-bold mt-1 text-[var(--accent)]">{uniqueGameReports.length}</div>
          </div>
          <div className="flex-1 p-6 card border border-[var(--accent)] shadow-lg flex flex-col items-center justify-center">
            <Image src="/images/coin-icon-3835.png" alt="Coin Icon" width={48} height={48} className="mb-2" />
            <div className="text-4xl font-bold mt-1 text-[var(--accent)]">{user?.coins ?? 0}</div>
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
                    <XAxis dataKey="section" stroke={theme === 'light' ? '#222' : 'white'} />
                    <YAxis stroke={theme === 'light' ? '#222' : 'white'} />
                    <Tooltip formatter={(v: number) => `${Math.floor(v / 60)}m ${v % 60}s`} contentStyle={{ backgroundColor: theme === 'light' ? '#fff' : 'rgb(20, 20, 40)', border: '1px solid #d4845c', color: theme === 'light' ? '#222' : 'white' }} />
                    <Bar dataKey="seconds" fill={theme === 'light' ? '#d4845c' : 'rgb(153, 0, 255)'} name="Time (sec)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <table className={`min-w-full text-sm ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
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
                        <span className={`text-lg font-semibold ${game.result === 'win' ? 'text-green-600' : 'text-red-500'}`}>Result: {game.result}</span>
                        <button
                          className={`${theme === 'light' ? 'bg-[#d4845c] hover:bg-[#b96a47]' : 'bg-purple-600 hover:bg-purple-700'} text-white font-bold px-4 py-1 rounded-lg shadow transition text-sm`}
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
                    <XAxis dataKey="category" stroke={theme === 'light' ? '#222' : 'white'} />
                    <YAxis allowDecimals={false} stroke={theme === 'light' ? '#222' : 'white'} />
                    <Tooltip contentStyle={{ backgroundColor: theme === 'light' ? '#fff' : 'rgb(20, 20, 40)', border: '1px solid #d4845c', color: theme === 'light' ? '#222' : 'white' }} />
                    <Bar dataKey="count" fill={theme === 'light' ? '#d4845c' : 'rgb(153, 0, 255)'} name="Puzzles Solved" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <table className={`min-w-full text-sm ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
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
                  <CartesianGrid strokeDasharray="3 3" stroke={theme === 'light' ? '#d4845c33' : 'rgb(153, 0, 255)/30'} />
                  <XAxis dataKey="date" stroke={theme === 'light' ? '#222' : 'white'} />
                  <YAxis stroke={theme === 'light' ? '#222' : 'white'} />
                  <Tooltip formatter={(v: number) => `${Math.floor(v / 60)}m ${v % 60}s`} contentStyle={{ backgroundColor: theme === 'light' ? '#fff' : 'rgb(20, 20, 40)', border: '1px solid #d4845c', color: theme === 'light' ? '#222' : 'white' }} />
                  <Legend />
                  <Line type="monotone" dataKey="seconds" name="Time (sec)" stroke={theme === 'light' ? '#d4845c' : 'rgb(153, 0, 255)'} strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 