import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect('/dashboard');
  }

  return (
    <main className="min-h-screen bg-[#0a0f1e]">
      {/* Hero */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-900/20 to-transparent" />
        <nav className="relative max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎬</span>
            <span className="text-xl font-bold text-amber-400">WhatToWatch</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-slate-300 hover:text-white transition-colors">
              Sign In
            </Link>
            <Link
              href="/register"
              className="bg-amber-500 hover:bg-amber-400 text-black font-semibold px-5 py-2 rounded-lg transition-colors"
            >
              Get Started
            </Link>
          </div>
        </nav>

        <div className="relative max-w-4xl mx-auto px-6 py-24 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Find Your Next{' '}
            <span className="text-amber-400">Favorite Movie</span> with AI
          </h1>
          <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
            Just describe what you&apos;re in the mood for and our AI will recommend the perfect movies — with posters, ratings, and descriptions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="bg-amber-500 hover:bg-amber-400 text-black font-bold px-8 py-4 rounded-xl text-lg transition-colors"
            >
              Start Free — 3 Credits
            </Link>
            <Link
              href="/login"
              className="bg-slate-800 hover:bg-slate-700 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-colors border border-slate-700"
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-white text-center mb-12">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: '🤖',
              title: 'AI-Powered Search',
              description: 'Describe the movie you want in plain English. Our AI understands context, mood, and themes.',
            },
            {
              icon: '🎬',
              title: 'Rich Movie Data',
              description: 'Get movie posters, genre tags, descriptions, TMDB ratings, and release years.',
            },
            {
              icon: '📋',
              title: 'Personal Watchlist',
              description: "Save movies you want to watch and track what you've already seen.",
            },
          ].map((feature) => (
            <div key={feature.title} className="bg-slate-800 rounded-2xl p-8 border border-slate-700 text-center">
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-slate-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-white text-center mb-4">Simple Pay-As-You-Go Pricing</h2>
        <p className="text-slate-400 text-center mb-12">Start free with 3 credits. Each search costs 1 credit.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {[
            { credits: 10, price: '$2.99', best: false },
            { credits: 25, price: '$5.99', best: true },
            { credits: 50, price: '$9.99', best: false },
            { credits: 100, price: '$14.99', best: false },
          ].map((pkg) => (
            <div
              key={pkg.credits}
              className={`rounded-xl p-6 border text-center ${
                pkg.best
                  ? 'bg-amber-500/10 border-amber-500 ring-1 ring-amber-500'
                  : 'bg-slate-800 border-slate-700'
              }`}
            >
              {pkg.best && (
                <div className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">Best Value</div>
              )}
              <div className="text-3xl font-bold text-white mb-1">{pkg.credits}</div>
              <div className="text-slate-400 text-sm mb-3">credits</div>
              <div className="text-2xl font-bold text-amber-400">{pkg.price}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h2 className="text-4xl font-bold text-white mb-6">Ready to Find Your Next Movie?</h2>
        <Link
          href="/register"
          className="inline-block bg-amber-500 hover:bg-amber-400 text-black font-bold px-10 py-4 rounded-xl text-lg transition-colors"
        >
          Get Started Free
        </Link>
      </section>

      <footer className="border-t border-slate-800 py-8 text-center text-slate-500 text-sm">
        © 2024 WhatToWatch. Powered by OpenAI &amp; TMDB.
      </footer>
    </main>
  );
}
