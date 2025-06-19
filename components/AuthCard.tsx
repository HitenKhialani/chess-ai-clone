'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function AuthCard() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage('');

    const url = isLogin ? 'http://localhost:5000/api/users/login' : 'http://localhost:5000/api/users/signup';
    const body = isLogin ? { email, password } : { username, email, password };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (response.ok) {
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
    <div className="bg-white/10 rounded-2xl shadow-2xl p-8 w-[370px] max-w-full flex flex-col items-center">
      <h2 className="text-white text-2xl font-semibold mb-6 text-center">{isLogin ? 'Login' : 'Sign Up'}</h2>
      <form onSubmit={handleSubmit} className="w-full space-y-4">
        {!isLogin && (
          <div>
            <label className="block text-white/80 text-sm font-bold mb-2" htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required={!isLogin}
            />
          </div>
        )}
        <div>
          <label className="block text-white/80 text-sm font-bold mb-2" htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-white/80 text-sm font-bold mb-2" htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {message && <p className="text-center text-sm font-semibold" style={{ color: message.includes('successful') ? '#4CAF50' : '#F44336' }}>{message}</p>}
        <Button
          type="submit"
          className="bg-[#a78bfa] hover:bg-[#7c3aed] text-white px-6 py-3 text-lg font-semibold rounded-lg shadow-lg w-full"
        >
          {isLogin ? 'Login' : 'Sign Up'}
        </Button>
      </form>
      <p className="text-center text-white/80 text-sm mt-4">
        {isLogin ? "Don't have an account? " : "Already have an account? "}
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="text-[#a78bfa] hover:text-[#7c3aed] font-bold focus:outline-none"
        >
          {isLogin ? 'Sign Up' : 'Login'}
        </button>
      </p>
    </div>
  );
} 