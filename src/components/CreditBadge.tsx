'use client';

import { useEffect, useState } from 'react';

export default function CreditBadge() {
  const [credits, setCredits] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/credits')
      .then((res) => res.json())
      .then((data) => setCredits(data.credits));
  }, []);

  return (
    <span className="flex items-center gap-1">
      <span className="text-amber-400">⚡</span>
      <span className="font-semibold">{credits ?? '...'} Credits</span>
    </span>
  );
}
