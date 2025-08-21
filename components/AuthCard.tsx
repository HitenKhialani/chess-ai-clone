'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { User, Mail, Lock, GraduationCap } from 'lucide-react';
import { useTheme } from "next-themes";

export default function AuthCard() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const { theme } = useTheme();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
    const url = isLogin ? `${backendUrl}/api/users/login` : `${backendUrl}/api/users/signup`;
    setMessage('');

    const body = isLogin ? { email, password } : { username, email, password };

    try {
      const res = await axios.post(url, body, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = res.data;

      if (res.status === 200) {
        setMessage(isLogin ? 'Login successful!' : 'Signup successful!');
        if (data.token) {
          localStorage.setItem('token', data.token);
          // Redirect or update UI for authenticated user
        }
      } else {
        setMessage(data.msg || 'An error occurred.');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setMessage('Failed to connect to the server.');
    }
  };

  return (
    <div className={`border rounded-2xl shadow-2xl p-8 w-[400px] max-w-full 
      bg-[var(--card)] border-[var(--border)] text-[var(--card-foreground)]
      transition-colors duration-300 will-change-transform
      hover:shadow-[0_10px_40px_-10px_var(--shadow-color,#00000040)]`}
      style={{
        // subtle theme-aware shadow tint using CSS variables if present
        // fallback handled in class via rgba hex
      }}
    >
      <div className="text-center mb-8">
        <h2 className={`text-3xl font-bold mb-2 text-[var(--card-foreground)]`}>
          {isLogin ? 'Welcome Back!' : 'Create Your Profile'}
        </h2>
        <p className={`text-sm text-[var(--muted-foreground)]`}>
          {isLogin ? 'Sign in to continue your chess journey' : 'Join Endgame to start your learning journey'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {!isLogin && (
          <div className="space-y-2">
            <label className={`block text-sm font-medium mb-2 text-[var(--muted-foreground)]`} htmlFor="username">
              Full Name *
            </label>
            <div className="relative">
              <User className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--muted-foreground)]`} />
              <input
                type="text"
                id="username"
                placeholder="Enter your full name"
                className={`w-full pl-10 pr-4 py-3 border rounded-lg 
                  bg-[var(--input)] border-[var(--border)] 
                  text-[var(--foreground)] placeholder-[color:var(--muted-foreground)]
                  focus:outline-none focus:ring-2 focus:border-transparent focus:ring-[color:var(--ring)]
                  transition-all duration-200`}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required={!isLogin}
              />
            </div>
          </div>
        )}

        <div className="space-y-2">
          <label className={`block text-sm font-medium mb-2 text-[var(--muted-foreground)]`} htmlFor="email">
            Email Address *
          </label>
          <div className="relative">
            <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--muted-foreground)]`} />
            <input
              type="email"
              id="email"
              placeholder="Enter your email address"
              className={`w-full pl-10 pr-4 py-3 border rounded-lg 
                bg-[var(--input)] border-[var(--border)] 
                text-[var(--foreground)] placeholder-[color:var(--muted-foreground)]
                focus:outline-none focus:ring-2 focus:border-transparent focus:ring-[color:var(--ring)]
                transition-all duration-200`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className={`block text-sm font-medium mb-2 text-[var(--muted-foreground)]`} htmlFor="password">
            Password *
          </label>
          <div className="relative">
            <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--muted-foreground)]`} />
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              className={`w-full pl-10 pr-4 py-3 border rounded-lg 
                bg-[var(--input)] border-[var(--border)] 
                text-[var(--foreground)] placeholder-[color:var(--muted-foreground)]
                focus:outline-none focus:ring-2 focus:border-transparent focus:ring-[color:var(--ring)]
                transition-all duration-200`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>

        {message && (
          <div className={`text-center text-sm font-medium p-3 rounded-lg border transition-colors duration-300 
            ${message.includes('successful') 
              ? 'bg-[color:rgb(16_185_129_/0.15)] text-[color:rgb(16_185_129)] border-[color:rgb(16_185_129_/0.3)]' 
              : 'bg-[color:rgb(239_68_68_/0.15)] text-[color:rgb(239_68_68)] border-[color:rgb(239_68_68_/0.3)]'
            }`}>
            {message}
          </div>
        )}

        <Button
          type="submit"
          className={`w-full py-3 px-6 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl 
            transition-all duration-200 transform hover:scale-[1.02]
            bg-[var(--primary)] text-[var(--primary-foreground)] hover:brightness-110`}
        >
          {isLogin ? 'Sign In' : 'Create Profile'}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className={`text-sm text-[var(--muted-foreground)]`}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className={`font-semibold focus:outline-none transition-colors duration-200 
              text-[var(--primary)] hover:opacity-90`}
          >
            {isLogin ? 'Sign Up' : 'Sign In'}
          </button>
        </p>
      </div>
    </div>
  );
} 