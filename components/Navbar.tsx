'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter, usePathname } from 'next/navigation';
import Image from "next/image";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    getUser();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push('/login');
  };

  return (
    <nav className="fixed w-full top-0 left-0 z-50 bg-white/5 backdrop-blur-md border-b border-none shadow-lg shadow-blue-400/30">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/pulse logo.png" // Place your logo image at public/logo.png
            alt="PostPulse Logo"
            width={45}
            height={45}
            className="rounded-full"
            priority
          />
          <span className="text-2xl font-bold text-white">PostPulse</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            href="/"
            className={`font-semibold ${pathname === '/' ? 'text-[#00A0DC]' : 'text-white'} hover:text-shadow transition-all duration-300`}
          >
            Home
          </Link>
          <Link
            href="/features"
            className={`font-semibold ${pathname.startsWith('/features') ? 'text-[#00A0DC]' : 'text-white'} hover:text-shadow transition-all duration-300`}
          >
            Features
          </Link>
          <Link
            href="/pricing"
            className={`font-semibold ${pathname.startsWith('/pricing') ? 'text-[#00A0DC]' : 'text-white'} hover:text-shadow transition-all duration-300`}
          >
            Pricing
          </Link>
          {user && (
            <Link
              href="/dashboard"
              className={`font-semibold ${pathname.startsWith('/dashboard') ? 'text-[#00A0DC]' : 'text-white'} hover:text-shadow transition-all duration-300`}
            >
              Dashboard
            </Link>
          )}
        </div>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-full bg-transparent border-1 border-blue-600/30 text-white font-semibold shadow-xl cursor-pointer shadow-blue-400/40 hover:shadow-blue-400/50 hover:border-blue-600 hover:scale-105 transition"
            >
              Logout
            </button>
          ) : (
            <>
              <Link href="/login" className="text-gray-300 hover:text-white">
                Log In
              </Link>
              <Link
                href="/signup"
                className="px-3 py-1.5 rounded-full bg-transparent border-1 border-blue-600/30 text-white font-semibold shadow-xl cursor-pointer shadow-blue-400/40 hover:shadow-blue-400/50 hover:border-blue-600 hover:scale-105 transition"
              >
                Sign Up Free
              </Link>
            </>
          )}
        </div>

        {/* Hamburger Icon */}
        <button
          className="md:hidden flex flex-col justify-center items-center w-10 h-10"
          aria-label="Toggle menu"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          <span className={`block h-0.5 w-6 bg-white transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
          <span className={`block h-0.5 w-6 bg-white my-1 transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`}></span>
          <span className={`block h-0.5 w-6 bg-white transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white/10 backdrop-blur-md border-b border-white/10 px-4 py-6">
          <div className="flex flex-col items-center gap-4">
            <Link
              href="/features"
              className={`${pathname.startsWith('/features') ? 'text-[#00A0DC]' : 'text-gray-300'} hover:text-[#00A0DC]`}
              onClick={() => setMenuOpen(false)}
            >
              Features
            </Link>
            <Link
              href="/pricing"
              className={`${pathname.startsWith('/pricing') ? 'text-[#00A0DC]' : 'text-gray-300'} hover:text-[#00A0DC]`}
              onClick={() => setMenuOpen(false)}
            >
              Pricing
            </Link>
            {user && (
              <Link
                href="/dashboard"
                className={`${pathname.startsWith('/dashboard') ? 'text-[#00A0DC]' : 'text-gray-300'} hover:text-[#00A0DC]`}
                onClick={() => setMenuOpen(false)}
              >
                Dashboard
              </Link>
            )}
            {user ? (
              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="bg-gradient-to-r from-[#0077B5] to-[#00A0DC] px-4 py-2 rounded-lg text-white font-semibold hover:scale-105 transition"
              >
                Logout
              </button>
            ) : (
              <>
                <Link href="/login" className="text-gray-300 hover:text-white" onClick={() => setMenuOpen(false)}>
                  Log In
                </Link>
                <Link
                  href="/signup"
                  className="px-3 py-1.5 rounded-full bg-transparent border-1 border-blue-600/30 text-white font-semibold shadow-xl cursor-pointer shadow-blue-400/40 hover:shadow-blue-400/50 hover:border-blue-600 hover:scale-105 transition"
                  onClick={() => setMenuOpen(false)}
                >
                  Sign Up Free
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}