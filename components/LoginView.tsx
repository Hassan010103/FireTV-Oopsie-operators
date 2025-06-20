
import React, { useState } from 'react';
import MovieGrid from './MovieGrid'; // Import the new MovieGrid component

interface LoginViewProps {
  onLogin: (username: string) => void;
  isLoggingIn: boolean;
}

const LoginView: React.FC<LoginViewProps> = ({ onLogin, isLoggingIn }) => {
  const [username, setUsername] = useState<string>('Hassan');
  const [password, setPassword] = useState<string>('password');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() === '') {
        alert("Please enter a username.");
        return;
    }
    onLogin(username);
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen animate-fadeIn p-4 overflow-hidden">
      {/* MovieGrid acts as the full-screen background */}
      <MovieGrid />

      {/* Login form container, positioned above the MovieGrid and its overlay */}
      <div className="relative z-20 bg-slate-800/80 backdrop-blur-sm p-8 rounded-xl shadow-2xl w-full max-w-md">
        <div className="text-center mb-8">
           <span className="font-bold text-5xl text-purple-400">
              Fire<span className="text-sky-400">Pulse</span>
            </span>
          <p className="text-slate-300 mt-2">Sign in to discover your next favorite show.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-slate-200 mb-1">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-700/70 border border-slate-600 rounded-lg text-slate-100 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-shadow placeholder-slate-400"
              placeholder="e.g., Hassan, Ananya"
              disabled={isLoggingIn}
              autoComplete="username"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-200 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-700/70 border border-slate-600 rounded-lg text-slate-100 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-shadow placeholder-slate-400"
              placeholder="••••••••"
              disabled={isLoggingIn}
              autoComplete="current-password"
            />
          </div>
          <button
            type="submit"
            disabled={isLoggingIn}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-lg shadow-md transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoggingIn ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing In...
              </div>
            ) : 'Sign In'}
          </button>
        </form>
        <p className="text-xs text-slate-400 mt-6 text-center">
          Hint: Use "Hassan" or "Ananya". Password can be anything.
        </p>
      </div>
    </div>
  );
};

export default LoginView;
