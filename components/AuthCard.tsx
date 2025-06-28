'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import axios from 'axios';

export default function AuthCard() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

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
    <div className="krishna-card border border-rgb(153, 0, 255)/30 rounded-2xl card-shadow p-8 w-[370px] max-w-full flex flex-col items-center purple-glow">
      <h2 className="text-white text-2xl font-semibold mb-6 text-center">{isLogin ? 'Login' : 'Sign Up'}</h2>
      <form onSubmit={handleSubmit} className="w-full space-y-4">
        {!isLogin && (
          <div>
            <label className="block text-rgb(200, 200, 200) text-sm font-bold mb-2" htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              className="shadow appearance-none border border-rgb(153, 0, 255)/30 rounded w-full py-2 px-3 krishna-card text-white leading-tight focus:outline-none focus:shadow-outline focus:border-rgb(153, 0, 255) placeholder:text-rgb(200, 200, 200)"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required={!isLogin}
            />
          </div>
        )}
        <div>
          <label className="block text-rgb(200, 200, 200) text-sm font-bold mb-2" htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            className="shadow appearance-none border border-rgb(153, 0, 255)/30 rounded w-full py-2 px-3 krishna-card text-white leading-tight focus:outline-none focus:shadow-outline focus:border-rgb(153, 0, 255) placeholder:text-rgb(200, 200, 200)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-rgb(200, 200, 200) text-sm font-bold mb-2" htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            className="shadow appearance-none border border-rgb(153, 0, 255)/30 rounded w-full py-2 px-3 krishna-card text-white mb-3 leading-tight focus:outline-none focus:shadow-outline focus:border-rgb(153, 0, 255) placeholder:text-rgb(200, 200, 200)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {message && <p className="text-center text-sm font-semibold" style={{ color: message.includes('successful') ? 'rgb(153, 0, 255)' : '#e11d48' }}>{message}</p>}
        <Button
          type="submit"
          className="bg-gradient-to-r from-rgb(76, 0, 255) to-rgb(153, 0, 255) hover:from-rgb(153, 0, 255) hover:to-rgb(76, 0, 255) text-white px-6 py-3 text-lg font-semibold rounded-lg shadow-lg w-full btn-glow"
        >
          {isLogin ? 'Login' : 'Sign Up'}
        </Button>
      </form>
      <p className="text-center text-rgb(200, 200, 200) text-sm mt-4">
        {isLogin ? "Don't have an account? " : "Already have an account? "}
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="text-rgb(153, 0, 255) hover:text-white font-bold focus:outline-none transition-colors"
        >
          {isLogin ? 'Sign Up' : 'Login'}
        </button>
      </p>
    </div>
  );
} 