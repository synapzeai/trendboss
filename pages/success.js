import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import { Flame, Check } from 'lucide-react';

export default function Success() {
  const [status, setStatus] = useState('processing');
  const router = useRouter();
  const { signUp, signIn } = useAuth();
  const { session_id } = router.query;

  useEffect(() => {
    if (!session_id) return;

    const handleSuccess = async () => {
      try {
        // Get session details from Stripe
        const response = await fetch(`/api/verify-session?session_id=${session_id}`);
        const data = await response.json();

        if (data.error) {
          setStatus('error');
          return;
        }

        // Create account with email from Stripe
        const email = data.customer_email;
        const password = Math.random().toString(36).slice(-8); // Temporary password
        
        const { error: signUpError } = await signUp(email, password);
        
        if (signUpError && !signUpError.message.includes('already registered')) {
          setStatus('error');
          return;
        }

        // Sign in
        await signIn(email, password);
        
        setStatus('success');
        
        // Redirect to dashboard
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
        
      } catch (error) {
        console.error('Error:', error);
        setStatus('error');
      }
    };

    handleSuccess();
  }, [session_id]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-orange-950 text-white flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-10 border border-white/20 shadow-2xl text-center">
          {status === 'processing' && (
            <>
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-orange-500 mx-auto mb-6"></div>
              <h2 className="text-2xl font-bold mb-2">Processing Payment...</h2>
              <p className="text-gray-400">Please wait while we set up your account</p>
            </>
          )}
          
          {status === 'success' && (
            <>
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-full mb-6">
                <Check className="w-8 h-8 text-green-400" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Payment Successful! 🎉</h2>
              <p className="text-gray-400 mb-4">Your account has been created</p>
              <p className="text-sm text-orange-300">Redirecting to dashboard...</p>
            </>
          )}
          
          {status === 'error' && (
            <>
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500/20 rounded-full mb-6">
                <Flame className="w-8 h-8 text-red-400" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
              <p className="text-gray-400 mb-6">Please contact support</p>
              <button 
                onClick={() => router.push('/')}
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3 px-6 rounded-xl transition-all hover:scale-105"
              >
                Back to Home
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}