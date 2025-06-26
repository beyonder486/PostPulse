'use client';
import { useState,useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
  // Run session check but don't block rendering
  const checkSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) router.push('/dashboard');
  };
  checkSession();
}, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      router.push('/dashboard');
    }
  };

  const handleGoogleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/dashboard',
      },
    });
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0e0b25] via-[#201c42] to-[#1f1f32]">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/30 shadow-blue-500/30 md:mx-auto mx-5 md:mt-5 mt-30">
        <h1 className="text-3xl font-extrabold text-center mb-6 bg-gradient-to-r from-[#00a6ff] to-[#00ff77] bg-clip-text text-transparent">
          Log in to PostPulse
        </h1>
        <form onSubmit={handleLogin} className="space-y-5">
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
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-gradient-to-r from-[#00a6ff] to-[#57fea5] text-white font-bold text-lg shadow-md hover:scale-105 transition-all duration-200 disabled:opacity-60 cursor-pointer"
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>
        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-white text-gray-800 font-semibold shadow hover:bg-white transition-all duration-200 mt-6"
        >
          <img src="google-logo-icon-png-transparent-background-osteopathy-16.png" alt="google" className='w-6 h-6'/>
          Sign in with Google
        </button>
        <div className="flex justify-between items-center mt-6 text-sm">
          <Link href="/signup" className="text-[#00a6ff] hover:underline">
            Don&apos;t have an account? Sign up
          </Link>
          <Link href="#" className="text-white/60 hover:underline">
            Forgot password?
          </Link>
        </div>
      </div>
    </div>
  );
}