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
cat > pages/api/verify-session.js << 'EOF'
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  const { session_id } = req.query;

  if (!session_id) {
    return res.status(400).json({ error: 'Missing session_id' });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);
    
    return res.status(200).json({
      customer_email: session.customer_details.email,
      customer_id: session.customer,
      subscription_id: session.subscription,
    });
  } catch (error) {
    console.error('Stripe error:', error);
    return res.status(500).json({ error: error.message });
  }
}
