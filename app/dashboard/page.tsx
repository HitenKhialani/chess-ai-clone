'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import GameReviewDisplay from '../../components/GameReviewDisplay';
import { useTimeTracker } from '../../components/TimeTrackerProvider';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, Legend, PieChart, Pie, Cell } from 'recharts';
import GameReview from '../../components/GameReview';
import { useUser } from '@/components/UserProvider';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useTheme } from "next-themes"
import SimploChatHistory from '../../components/SimploChatHistory';
import { Settings, Clock, Trophy, Target, User, Calendar, LogOut, Edit, TrendingUp, Activity, BarChart3 } from 'lucide-react';

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
  const [puzzlesSolved, setPuzzlesSolved] = useState<number>(0);
  // Removed puzzlesByCategory; we only show overall puzzles solved
  const [timeLog, setTimeLog] = useState<{ date: string; seconds: number }[]>([]);
  const [openGameReport, setOpenGameReport] = useState<null | { moves: string[], id: number }>(null);
  const { user } = useUser();
  const { theme } = useTheme();
  const [activeMode, setActiveMode] = useState<'profile' | 'edit' | 'settings'>('profile');
  const [showGameReports, setShowGameReports] = useState(false);

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;
    
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
    // Only run on client side
    if (typeof window === 'undefined') return;
    
    const token = localStorage.getItem('token');
    if (!token) return;
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
    fetch(`${backendUrl}/api/users/puzzles-solved`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setPuzzlesSolved(data.puzzles_solved || 0));
  }, []);

  // Removed puzzles-solved-by-category fetch; no per-type breakdown needed

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;
    
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
    return <div className="flex items-center justify-center h-96 text-xl text-blue-500">Loading dashboard...</div>;
  }
  if (error) {
    return <div className="flex items-center justify-center h-96 text-xl text-red-500">{error}</div>;
  }

  const getHeadingText = () => {
    switch (activeMode) {
      case 'edit':
        return 'Edit Profile - Endgame';
      case 'settings':
        return 'Settings - Endgame';
      default:
        return 'Your Profile - Endgame';
    }
  };

  // Format time for display
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  // Prepare data for charts
  const timeSpentData = Object.entries(sectionTimes).map(([section, seconds]) => ({
    name: section,
    value: Number(seconds),
    time: formatTime(Number(seconds))
  }));

  // Removed puzzle distribution data; only overall metrics are shown

  const timeTrendData = timeLog.map((entry, index) => ({
    day: `Day ${index + 1}`,
    time: entry.seconds
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const renderProfileContent = () => {
    switch (activeMode) {
      case 'edit':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-bold text-[var(--card-foreground)] mb-4">Edit Your Profile</h3>
              <p className="text-[var(--muted-foreground)]">Update your profile information</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--muted-foreground)] mb-2">Username</label>
                <input
                  type="text"
                  defaultValue={user?.username || ''}
                  className="w-full px-4 py-3 bg-[var(--input)] border border-[var(--border)] rounded-lg text-[var(--card-foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--muted-foreground)] mb-2">Email</label>
                <input
                  type="email"
                  defaultValue={user?.email || ''}
                  className="w-full px-4 py-3 bg-[var(--input)] border border-[var(--border)] rounded-lg text-[var(--card-foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)] focus:border-transparent"
                />
              </div>
              <div className="flex space-x-2 pt-4">
                <Button 
                  onClick={() => setActiveMode('profile')}
                  className="bg-[var(--primary)] hover:opacity-90 text-[var(--primary-foreground)]"
                >
                  Save Changes
                </Button>
                <Button 
                  onClick={() => setActiveMode('profile')}
                  variant="outline"
                  className="border-[var(--border)] text-[var(--muted-foreground)] hover:bg-[var(--secondary)] hover:text-[var(--secondary-foreground)]"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-bold text-[var(--card-foreground)] mb-4">Settings</h3>
              <p className="text-[var(--muted-foreground)]">Manage your account settings</p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-[var(--card)] border border-[var(--border)]">
                <div>
                  <h4 className="font-medium text-[var(--card-foreground)]">Theme</h4>
                  <p className="text-sm text-[var(--muted-foreground)]">Switch between light and dark mode</p>
                </div>
                <Button variant="outline" className="border-[var(--border)] text-[var(--muted-foreground)] hover:bg-[var(--secondary)] hover:text-[var(--secondary-foreground)]">
                  <Settings className="w-4 h-4 mr-2" />
                  Light Mode
                </Button>
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-[var(--card)] border border-[var(--border)]">
                <div>
                  <h4 className="font-medium text-[var(--card-foreground)]">Notifications</h4>
                  <p className="text-sm text-[var(--muted-foreground)]">Manage your notification preferences</p>
                </div>
                <Button variant="outline" className="border-[var(--border)] text-[var(--muted-foreground)] hover:bg-[var(--secondary)] hover:text-[var(--secondary-foreground)]">
                  Configure
                </Button>
              </div>
              <div className="flex space-x-2 pt-4">
                <Button 
                  onClick={() => setActiveMode('profile')}
                  className="bg-[var(--primary)] hover:opacity-90 text-[var(--primary-foreground)]"
                >
                  Save Settings
                </Button>
                <Button 
                  onClick={() => setActiveMode('profile')}
                  variant="outline"
                  className="border-[var(--border)] text-[var(--muted-foreground)] hover:bg-[var(--secondary)] hover:text-[var(--secondary-foreground)]"
                >
                  Back to Profile
                </Button>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <>
            {/* Profile Information Card */}
            <div className={"border rounded-2xl shadow-2xl p-6 mb-8 transition-transform duration-300 ease-out hover:-translate-y-1 hover:shadow-2xl bg-[var(--card)] border-[var(--border)]"}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold bg-[var(--primary)] text-[var(--primary-foreground)]`}>
                    {user?.username?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div>
                    <h2 className={`text-2xl font-bold text-[var(--card-foreground)]`}>{user?.username || 'User'}</h2>
                    <p className={`text-[var(--muted-foreground)]`}>{user?.email || 'user@example.com'}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className={`flex items-center text-sm text-[var(--muted-foreground)]`}>
                        <Calendar className="w-4 h-4 mr-1" />
                        Member since {new Date().toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    className={`border-[var(--border)] text-[var(--muted-foreground)] hover:bg-[var(--secondary)] hover:text-[var(--secondary-foreground)] ${activeMode === 'edit' ? 'bg-[var(--primary)] text-[var(--primary-foreground)]' : ''}`}
                    onClick={() => setActiveMode('edit')}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>
              </div>
            </div>

            {/* Metrics Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className={`border rounded-xl p-6 text-center bg-[var(--card)] border-[var(--border)] transition-transform duration-300 ease-out hover:-translate-y-1 hover:shadow-xl`}>
                <div className="flex items-center justify-center mb-3">
                  <Trophy className={`w-8 h-8 text-[var(--accent)]`} />
                </div>
                <h3 className={`text-sm font-medium mb-1 text-[var(--muted-foreground)]`}>Games Played</h3>
                <p className={`text-3xl font-bold text-[var(--card-foreground)]`}>{uniqueGameReports.length}</p>
              </div>
              
              <div className={`border rounded-xl p-6 text-center bg-[var(--card)] border-[var(--border)]`}>
                <div className="flex items-center justify-center mb-3">
                  <Target className={`w-8 h-8 text-[var(--accent)]`} />
                </div>
                <h3 className={`text-sm font-medium mb-1 text-[var(--muted-foreground)]`}>Puzzles Solved</h3>
                <p className={`text-3xl font-bold text-[var(--card-foreground)]`}>
                  {puzzlesSolved}
                </p>
              </div>
              
              <div className={`border rounded-xl p-6 text-center bg-[var(--card)] border-[var(--border)]`}>
                <div className="flex items-center justify-center mb-3">
                  <Clock className={`w-8 h-8 text-[var(--accent)]`} />
                </div>
                <h3 className={`text-sm font-medium mb-1 text-[var(--muted-foreground)]`}>Total Time</h3>
                <p className={`text-3xl font-bold text-[var(--card-foreground)]`}>{formatTime(totalTime)}</p>
              </div>
            </div>

            {/* Analytics Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Time Spent by Section */}
              <div className={`border rounded-2xl shadow-2xl p-6 transition-transform duration-300 ease-out hover:-translate-y-1 hover:shadow-2xl bg-[var(--card)] border-[var(--border)]`}>
                <h3 className={`text-xl font-bold mb-4 text-[var(--card-foreground)]`}>Time Spent by Section</h3>
                <div className="w-full h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={timeSpentData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, time }) => `${name}: ${time}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {timeSpentData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Removed Puzzle Distribution chart */}
            </div>

            {/* Game Reports Section */}
            <div className={`border rounded-2xl shadow-2xl p-6 mb-8 bg-[var(--card)] border-[var(--border)]`}>
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-xl font-bold text-[var(--card-foreground)]`}>Game Reports</h3>
                <Button
                  onClick={() => setShowGameReports(!showGameReports)}
                  className={`bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90`}
                >
                  {showGameReports ? 'Hide Reports' : 'View Reports'}
                </Button>
              </div>
              
              {showGameReports && (
                <div className="space-y-4">
                  {uniqueGameReports.length === 0 ? (
                    <div className="text-center py-8">
                      <Trophy className={`w-16 h-16 mx-auto mb-4 text-[var(--muted-foreground)]`} />
                      <p className={'text-[var(--muted-foreground)]'}>
                        No games played yet. Start playing to see your progress!
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {uniqueGameReports.map((game, idx) => (
                        <div
                          key={game.id}
                          className={`rounded-xl p-4 border-l-4 cursor-pointer transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lg bg-[var(--card)] border border-[var(--border)]`}
                          onClick={() => setOpenGameReport({ moves: game.game_report.map((m: any) => m.move), id: game.id })}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className={`font-bold text-[var(--accent)]`}>Match {idx + 1}</span>
                            <span className={`text-sm text-[var(--muted-foreground)]`}>{new Date(game.played_at).toLocaleString()}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className={`text-lg font-semibold ${
                              game.result === 'win' 
                                ? 'text-[var(--accent)]'
                                : 'text-[var(--destructive)]'
                            }`}>
                              Result: {game.result}
                            </span>
                            <Button
                              size="sm"
                              className={`bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90`}
                              onClick={e => {
                                e.stopPropagation();
                                window.open(`/review?moves=${encodeURIComponent(JSON.stringify(game.game_report.map((m: any) => m.move)))}&existing=true`, '_blank');
                              }}
                            >
                              View Report
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Time Trend */}
            {timeLog.length > 0 && (
              <div className={`border rounded-2xl shadow-2xl p-6 bg-[var(--card)] border-[var(--border)]`}>
                <h3 className={`text-xl font-bold mb-4 text-[var(--card-foreground)]`}>Activity Trend</h3>
                <div className="w-full h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={timeTrendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke={'var(--border)'} />
                      <XAxis dataKey="day" stroke={'var(--muted-foreground)'} />
                      <YAxis stroke={'var(--muted-foreground)'} />
                      <Line 
                        type="monotone" 
                        dataKey="time" 
                        name="Time (sec)" 
                        stroke={'var(--accent)'} 
                        strokeWidth={3}
                        dot={{ fill: 'var(--accent)', strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Simplo Chat History */}
            <div className={`border rounded-2xl shadow-2xl p-6 transition-transform duration-300 ease-out hover:-translate-y-1 hover:shadow-2xl bg-[var(--card)] border-[var(--border)]`}>
              <SimploChatHistory />
            </div>

            {/* Modal for game report */}
            {openGameReport && (
              <div className="fixed bottom-4 right-4 z-50 w-full max-w-xl">
                <div className={`border rounded-xl shadow-2xl p-4 relative bg-[var(--card)] border-[var(--border)]`}>
                  <button
                    className={`absolute top-2 right-2 text-xl text-[var(--muted-foreground)] hover:text-[var(--card-foreground)]`}
                    onClick={() => setOpenGameReport(null)}
                  >
                    ✕
                  </button>
                  <GameReview
                    moveHistory={openGameReport.moves}
                    onClose={() => setOpenGameReport(null)}
                    shouldSave={false}
                    gameResult="draw"
                    playerColor="white"
                  />
                </div>
              </div>
            )}
          </>
        );
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="max-w-6xl mx-auto py-8 px-4 relative z-10">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 rounded-full bg-gradient-to-r from-[#00F5D4]/20 to-[#57CC99]/20 backdrop-blur-sm border border-[#00F5D4]/30">
              							<Activity className="w-8 h-8 text-[#00F5D4]" />
            </div>
          </div>
          <h1 className={`text-5xl font-bold mb-4 text-[var(--primary-text)]`}>{getHeadingText()}</h1>
          <p className={`text-xl text-[var(--secondary-text)] max-w-2xl mx-auto leading-relaxed`}>Track your learning progress and performance</p>
        </div>

        {renderProfileContent()}
      </div>
    </div>
  );
} 