'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';
import CreditBadge from './CreditBadge';

export default function Navbar() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  if (!session) return null;

  return (
    <nav className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="text-2xl">🎬</span>
            <span className="text-xl font-bold text-amber-400">WhatToWatch</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/dashboard" className="text-slate-300 hover:text-amber-400 transition-colors">
              Search
            </Link>
            <Link href="/watchlist" className="text-slate-300 hover:text-amber-400 transition-colors">
              Watchlist
            </Link>
            <Link href="/credits" className="text-slate-300 hover:text-amber-400 transition-colors">
              <CreditBadge />
            </Link>
            <Link href="/profile" className="text-slate-300 hover:text-amber-400 transition-colors">
              Profile
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg transition-colors text-sm"
            >
              Sign Out
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-slate-300 hover:text-white"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link href="/dashboard" className="block px-4 py-2 text-slate-300 hover:text-amber-400">Search</Link>
            <Link href="/watchlist" className="block px-4 py-2 text-slate-300 hover:text-amber-400">Watchlist</Link>
            <Link href="/credits" className="block px-4 py-2 text-slate-300 hover:text-amber-400">Credits</Link>
            <Link href="/profile" className="block px-4 py-2 text-slate-300 hover:text-amber-400">Profile</Link>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="block w-full text-left px-4 py-2 text-slate-300 hover:text-amber-400"
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
