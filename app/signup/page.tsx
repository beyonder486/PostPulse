'use client';
import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setError('Check your email to confirm your account before logging in.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0e0b25] via-[#201c42] to-[#1f1f32]">
      <div className="w-full max-w-md bg-white/20 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/30 shadow-blue-400/30">
        <h1 className="text-3xl font-extrabold text-center mb-6 bg-gradient-to-r from-[#00a6ff] to-[#00ff77] bg-clip-text text-transparent">
          Sign up for PostPulse
        </h1>
        <form onSubmit={handleSignup} className="space-y-5">
          <div>
            <label className="block text-white/80 mb-1 text-sm font-medium">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#00a6ff] transition"
              placeholder="you@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoFocus
            />
          </div>
          <div>
            <label className="block text-white/80 mb-1 text-sm font-medium">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#00a6ff] transition"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-gradient-to-r from-[#00a6ff] to-[#00ff77] text-white font-bold text-lg shadow-md hover:scale-105 transition-all duration-200 disabled:opacity-60"
          >
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>
        <button
          type="button"
          onClick={async () => {
            setLoading(true);
            setError('');
            const { error } = await supabase.auth.signInWithOAuth({
              provider: 'google',
              options: { redirectTo: window.location.origin + '/dashboard' }
            });
            setLoading(false);
            if (error) setError(error.message);
          }}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-white/80 text-gray-800 font-semibold shadow hover:bg-white transition-all duration-200 mt-6"
        >
          <svg className="w-5 h-5" viewBox="0 0 48 48"><g><path fill="#4285F4" d="M44.5 20H24v8.5h11.7C34.7 33.1 29.8 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c2.7 0 5.2.9 7.2 2.5l6.4-6.4C34.2 5.1 29.4 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21c10.5 0 20-7.5 20-21 0-1.3-.1-2.7-.5-4z"/><path fill="#34A853" d="M6.3 14.7l7 5.1C15.5 16.1 19.4 13 24 13c2.7 0 5.2.9 7.2 2.5l6.4-6.4C34.2 5.1 29.4 3 24 3c-7.2 0-13.4 4.1-16.7 10.1z"/><path fill="#FBBC05" d="M24 45c5.4 0 10.2-1.8 13.9-4.9l-6.4-5.3C29.7 36.7 27 37.5 24 37.5c-5.7 0-10.6-3.8-12.3-9.1l-7 5.4C7.9 41.2 15.4 45 24 45z"/><path fill="#EA4335" d="M44.5 20H24v8.5h11.7c-1.2 3.2-4.2 5.5-7.7 5.5-2.2 0-4.2-.7-5.7-2l-7 5.4C15.4 41.2 19.4 45 24 45c10.5 0 20-7.5 20-21 0-1.3-.1-2.7-.5-4z"/></g></svg>
          Sign up with Google
        </button>
        {error && <div className="text-red-400 text-center mt-4">{error}</div>}
            <div className="flex justify-between items-center mt-6 text-sm">
              <Link href="/login" className="text-[#00a6ff] hover:underline">
                Already have an account? Log in
              </Link>
            </div>
          </div>
        </div>
  )}