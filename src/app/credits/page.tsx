'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import toast from 'react-hot-toast';

interface Purchase {
  id: string;
  credits: number;
  amount: number;
  status: string;
  createdAt: string;
}

const PACKAGES = [
  { id: 'credits_10', credits: 10, price: 2.99, label: '10 Credits', description: '10 movie searches' },
  { id: 'credits_25', credits: 25, price: 5.99, label: '25 Credits', description: '25 movie searches', popular: true },
  { id: 'credits_50', credits: 50, price: 9.99, label: '50 Credits', description: '50 movie searches' },
  { id: 'credits_100', credits: 100, price: 14.99, label: '100 Credits', description: '100 movie searches' },
];

export default function CreditsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [credits, setCredits] = useState<number | null>(null);
  const [loading, setLoading] = useState<string | null>(null);
  const [purchases, setPurchases] = useState<Purchase[]>([]);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login');
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetch('/api/credits').then((r) => r.json()).then((d) => setCredits(d.credits));
      fetch('/api/credits/history').then((r) => r.json()).then((d) => setPurchases(d.purchases || []));
    }
  }, [session]);

  const handlePurchase = async (packageId: string) => {
    setLoading(packageId);
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packageId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error('Failed to create checkout session');
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0f1e]">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-white mb-2">Credits</h1>
          <p className="text-slate-400">Each search costs 1 credit</p>
          {credits !== null && (
            <div className="inline-flex items-center gap-2 bg-slate-800 border border-slate-700 px-6 py-3 rounded-xl mt-4">
              <span className="text-2xl">⚡</span>
              <span className="text-2xl font-bold text-amber-400">{credits}</span>
              <span className="text-slate-400">credits remaining</span>
            </div>
          )}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {PACKAGES.map((pkg) => (
            <div
              key={pkg.id}
              className={`rounded-2xl p-6 border text-center ${
                pkg.popular
                  ? 'bg-amber-500/10 border-amber-500 ring-1 ring-amber-500'
                  : 'bg-slate-800 border-slate-700'
              }`}
            >
              {pkg.popular && (
                <div className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">
                  Most Popular
                </div>
              )}
              <div className="text-4xl font-bold text-white mb-1">{pkg.credits}</div>
              <div className="text-slate-400 text-sm mb-1">credits</div>
              <div className="text-xs text-slate-500 mb-4">{pkg.description}</div>
              <div className="text-2xl font-bold text-amber-400 mb-4">${pkg.price}</div>
              <button
                onClick={() => handlePurchase(pkg.id)}
                disabled={loading === pkg.id}
                className={`w-full py-2.5 rounded-lg font-semibold transition-colors ${
                  pkg.popular
                    ? 'bg-amber-500 hover:bg-amber-400 text-black'
                    : 'bg-slate-700 hover:bg-slate-600 text-white'
                } disabled:opacity-50`}
              >
                {loading === pkg.id ? 'Loading...' : 'Buy Now'}
              </button>
            </div>
          ))}
        </div>

        {purchases.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-white mb-4">Purchase History</h2>
            <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left px-6 py-3 text-slate-400 text-sm font-medium">Date</th>
                    <th className="text-left px-6 py-3 text-slate-400 text-sm font-medium">Credits</th>
                    <th className="text-left px-6 py-3 text-slate-400 text-sm font-medium">Amount</th>
                    <th className="text-left px-6 py-3 text-slate-400 text-sm font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {purchases.map((p) => (
                    <tr key={p.id} className="border-b border-slate-700 last:border-0">
                      <td className="px-6 py-4 text-slate-300 text-sm">
                        {new Date(p.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-amber-400 font-semibold">+{p.credits}</td>
                      <td className="px-6 py-4 text-slate-300 text-sm">${(p.amount / 100).toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`text-xs px-2 py-1 rounded-full font-semibold ${
                            p.status === 'COMPLETED'
                              ? 'bg-green-500/20 text-green-400'
                              : p.status === 'FAILED'
                              ? 'bg-red-500/20 text-red-400'
                              : 'bg-yellow-500/20 text-yellow-400'
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
