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
      setTimeout(() => {
        window.location.href = '/';
      }, 3000);
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-orange-950 text-white flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <CheckCircle className="w-24 h-24 text-green-400 mx-auto mb-6 animate-bounce" />
        <h1 className="text-5xl font-bold mb-4">Welcome to TrendBoss Pro!</h1>
        <p className="text-xl text-orange-200/80 mb-6">
          Your subscription is active! Redirecting you to the dashboard...
        </p>
        <div className="bg-gradient-to-r from-orange-500/20 to-purple-500/20 border border-orange-500/30 rounded-2xl p-6">
          <p className="text-orange-100 font-semibold mb-2">You now have unlimited access to:</p>
          <ul className="text-left text-orange-200/80 space-y-2 text-sm">
            <li>Unlimited trend discovery</li>
            <li>Unlimited research briefs</li>
            <li>Unlimited viral hooks</li>
            <li>All platforms supported</li>
          </ul>
        </div>
        <p className="text-orange-300 text-sm mt-6">Redirecting in 3 seconds...</p>
      </div>
    </div>
  );
}