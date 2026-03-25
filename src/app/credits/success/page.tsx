'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';

function SuccessContent() {
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      toast.success('Credits purchased successfully!');
    }
    if (searchParams.get('canceled') === 'true') {
      toast.error('Purchase canceled');
    }
  }, [searchParams]);

  return null;
}

export default function CreditsSuccessPage() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  );
}
