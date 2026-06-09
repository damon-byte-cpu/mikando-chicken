// src/app/admin/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!password.trim()) {
      setError('Please enter the admin password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push('/admin/dashboard');
        router.refresh();
      } else {
        setError(data.error || 'Wrong password. Try again.');
        setPassword('');
      }
    } catch {
      setError('Something went wrong. Check your connection.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#D32F2F] to-[#B71C1C] flex items-center
                    justify-center px-4 py-12">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8">
        {/* Logo area */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🍗</div>
          <h1
            className="text-2xl font-bold text-gray-900"
            style={{ fontFamily: 'Oswald, serif' }}
          >
            MIKANDO ADMIN
          </h1>
          <p className="text-gray-500 text-sm mt-1">Enter password to manage your menu</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="form-label" htmlFor="password">
              Admin Password
            </label>
            <input
              id="password"
              type="password"
              className="form-input"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              autoComplete="current-password"
              autoFocus
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-xl flex items-center gap-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full py-4 bg-[#D32F2F] text-white font-bold text-lg rounded-xl
                       active:bg-[#B71C1C] transition-colors disabled:opacity-60 disabled:cursor-not-allowed
                       flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="spinner" />
                Checking...
              </>
            ) : (
              'Login →'
            )}
          </button>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          <a href="/" className="hover:text-gray-600 transition-colors">
            ← Back to website
          </a>
        </p>
      </div>
    </div>
  );
}
