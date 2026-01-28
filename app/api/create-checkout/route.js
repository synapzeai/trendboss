'use client';
import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle } from 'lucide-react';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    if (sessionId) {
      sessionStorage.setItem('trendboss_paid', 'true');
      setTimeout(() => window.location.href = '/', 3000);
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-orange-950 text-white flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <CheckCircle className="w-24 h-24 text-green-400 mx-auto mb-6" />
        <h1 className="text-5xl font-bold mb-4">Welcome to TrendBoss Pro! 🎉</h1>
        <p className="text-xl text-orange-200/80">Redirecting...</p>
      </div>
    </div>
  );
}