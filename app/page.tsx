'use client';

import React, { useState, useEffect } from 'react';
import { Search, Zap, TrendingUp, Target, Sparkles, ChevronRight, RefreshCw, Clock, Flame, ArrowUpRight, Crown, X, Check, ArrowRight } from 'lucide-react';

export default function TrendBoss() {
  const [activeTab, setActiveTab] = useState('landing');
  const [topic, setTopic] = useState('');
  const [platform, setPlatform] = useState('TikTok');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [trends, setTrends] = useState([]);
  const [trendsLoading, setTrendsLoading] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  
  const STRIPE_PRICE_ID = 'price_1SuUttC8WQiKTNRfFn36VTLS';

  const handleGetStarted = () => {
    setShowSignup(true);
  };

  const handleSignup = async () => {
  try {
    setShowSignup(false);
    const response = await fetch('/api/create-checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ priceId: STRIPE_PRICE_ID }),
    });
    
    const { sessionId, error } = await response.json();
    
    if (error) {
      alert('Error creating checkout session. Please try again.');
      setShowSignup(true);
      return;
    }
    
    const { loadStripe } = await import('@stripe/stripe-js');
    const stripe = await loadStripe(
      process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || 'pk_test_DzRLtJ39RAvSkMzxMJR6IDs500mK7bMnzV'
    );
    
    if (!stripe) {
      alert('Failed to load Stripe.');
      setShowSignup(true);
      return;
    }
    
    const { error: checkoutError } = await (stripe as any).redirectToCheckout({ 
      sessionId 
    });

    if (checkoutError) {
      alert('Error redirecting to checkout.');
      setShowSignup(true);
    }
  } catch (error) {
    console.error('Signup error:', error);
    alert('An error occurred. Please try again.');
    setShowSignup(true);
  }
};

const getScoreColor = (score: number) => {
      if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-orange-400';
    return 'text-yellow-400';
  };

  if (showSignup) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-orange-950 text-white flex items-center justify-center p-6">
        <div className="max-w-md w-full">
          <button onClick={() => setShowSignup(false)} className="ml-auto mb-4 flex items-center gap-2 text-orange-300 hover:text-white transition-colors">
            <X className="w-5 h-5" />
            Close
          </button>
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-10 border border-white/20 shadow-2xl">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-500/20 rounded-full mb-6">
                <Flame className="w-8 h-8 text-orange-400" />
              </div>
              <h2 className="text-3xl font-bold mb-3 text-white">Start Finding Trends Early</h2>
              <p className="text-orange-200/80">Join creators who dominate with data-driven insights</p>
            </div>
            <div className="bg-gradient-to-br from-orange-500/10 to-purple-500/10 border border-orange-500/30 rounded-2xl p-6 mb-8">
              <div className="text-center mb-6">
                <div className="flex items-baseline justify-center gap-2 mb-2">
                  <span className="text-5xl font-bold text-white">$11</span>
                  <span className="text-xl text-orange-300">/month</span>
                </div>
                <p className="text-sm text-orange-300">Just $0.37/day • Cancel anytime</p>
              </div>
              <div className="space-y-3 mb-6">
                {['Unlimited trend discovery', 'Unlimited research briefs', 'Unlimited viral hooks', 'Real-time web analysis', 'All platforms supported', 'Priority support'].map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span className="text-orange-100">{feature}</span>
                  </div>
                ))}
              </div>
              <button onClick={handleSignup} className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-4 px-6 rounded-xl transition-all hover:scale-105 shadow-xl shadow-orange-500/30 flex items-center justify-center gap-2">
                <span>Get Started</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <p className="text-center text-xs text-orange-300/60 mt-4">Secure payment via Stripe</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-orange-950 text-white">
      <div className="border-b border-white/10 bg-black/30 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Flame className="w-8 h-8 text-orange-500" />
                <div className="absolute inset-0 blur-xl bg-orange-500/30"></div>
              </div>
              <h1 className="text-2xl font-bold text-white">TrendBoss</h1>
            </div>
            <div className="flex items-center gap-4">
              {isPaid ? (
                <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500/20 to-purple-500/20 border border-orange-500/30 rounded-full">
                  <Crown className="w-4 h-4 text-orange-400" />
                  <span className="text-sm text-orange-300 font-semibold">Pro Member</span>
                </div>
              ) : (
                <>
                  <button onClick={() => setActiveTab('landing')} className="text-sm text-orange-300 hover:text-white transition-colors hidden md:block">
                    Pricing
                  </button>
                  <button onClick={handleGetStarted} className="px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 rounded-full text-sm font-semibold transition-all hover:scale-105">
                    Get Started
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        {activeTab === 'landing' && !isPaid ? (
          <div className="space-y-20">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-block mb-6 px-4 py-2 bg-orange-500/10 border border-orange-500/30 rounded-full text-sm text-orange-400">
                ⚡ AI-Powered Trend Research
              </div>
              <h2 className="text-6xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-orange-400 via-purple-400 to-orange-400 bg-clip-text text-transparent leading-tight">
                Find Trends Before They Blow Up
              </h2>
              <p className="text-2xl text-orange-200/80 mb-10">
                Stop chasing trends. Start leading them with AI that predicts what's going viral 2-5 days early.
              </p>
              <button onClick={handleGetStarted} className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-5 px-10 rounded-xl transition-all hover:scale-105 shadow-xl shadow-orange-500/30 flex items-center gap-2 text-lg mx-auto">
                Get Started
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:scale-105 transition-all">
                <div className="p-4 bg-orange-500/10 rounded-2xl w-fit mb-4">
                  <Flame className="w-10 h-10 text-orange-500" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-white">Live Trend Discovery</h3>
                <p className="text-orange-200/80 leading-relaxed">Scan millions of posts across TikTok, Instagram, YouTube, Twitter, and more to find rising trends before they peak.</p>
              </div>
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:scale-105 transition-all">
                <div className="p-4 bg-purple-500/10 rounded-2xl w-fit mb-4">
                  <Sparkles className="w-10 h-10 text-purple-400" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-white">Viral Hook Generator</h3>
                <p className="text-orange-200/80 leading-relaxed">Generate 10 platform-specific hooks based on real viral content. AI analyzes what's working now.</p>
              </div>
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:scale-105 transition-all">
                <div className="p-4 bg-orange-500/10 rounded-2xl w-fit mb-4">
                  <Search className="w-10 h-10 text-orange-400" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-white">Instant Research</h3>
                <p className="text-orange-200/80 leading-relaxed">Get comprehensive research briefs with stats, quotes, content angles, and SEO keywords in 60 seconds.</p>
              </div>
            </div>

            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-12">
                <h3 className="text-4xl font-bold mb-4 text-white">Simple, Transparent Pricing</h3>
                <p className="text-xl text-orange-200/80">One price. Everything included. Cancel anytime.</p>
              </div>

              <div className="bg-gradient-to-br from-orange-500/20 to-purple-500/20 backdrop-blur-xl rounded-3xl p-10 border-2 border-orange-500/50 relative">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-2 rounded-full text-sm font-bold">
                    LIMITED TIME OFFER
                  </span>
                </div>

                <div className="text-center mb-8">
                  <h4 className="text-3xl font-bold text-white mb-4">TrendBoss Pro</h4>
                  <div className="flex items-baseline justify-center gap-2 mb-2">
                    <span className="text-6xl font-bold text-white">$11</span>
                    <span className="text-2xl text-orange-300">/month</span>
                  </div>
                  <p className="text-orange-200/80 mb-1">Just $0.37/day</p>
                  <p className="text-sm text-orange-300">Cancel anytime • Secure Stripe checkout</p>
                </div>

                <div className="space-y-4 mb-8">
                  {[
                    'Unlimited trend discovery',
                    'Unlimited research briefs',
                    'Unlimited viral hook generation',
                    'Real-time web research & analysis',
                    'All platforms (TikTok, Instagram, YouTube, Twitter, Facebook, LinkedIn)',
                    'Performance scores & predictions',
                    'Priority support',
                    'Early access to new features'
                  ].map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <Check className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
                      <span className="text-orange-100 text-lg">{feature}</span>
                    </div>
                  ))}
                </div>

                <button onClick={handleGetStarted} className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-5 px-8 rounded-2xl transition-all hover:scale-105 shadow-xl shadow-orange-500/30 flex items-center justify-center gap-2 text-lg">
                  Get Started Now
                  <ArrowRight className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="text-center max-w-4xl mx-auto">
              <p className="text-orange-200/60 mb-8 text-lg">Trusted by 1,000+ content creators</p>
              <div className="flex justify-center gap-12 flex-wrap">
                <div className="text-center">
                  <div className="text-4xl font-bold text-white mb-2">10M+</div>
                  <div className="text-orange-300">Trends Analyzed</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-white mb-2">73%</div>
                  <div className="text-orange-300">Prediction Accuracy</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-white mb-2">2-5 Days</div>
                  <div className="text-orange-300">Early Advantage</div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <h2 className="text-5xl font-bold mb-4 text-white">Dashboard Coming Soon</h2>
            <p className="text-xl text-orange-200/80 mb-8">Click "Get Started" to see the signup flow!</p>
            <button onClick={() => setActiveTab('landing')} className="text-orange-400 hover:text-orange-300">
              ← Back to Landing
            </button>
          </div>
        )}
      </div>

      <div className="border-t border-white/10 bg-black/20 backdrop-blur-sm mt-20">
        <div className="max-w-7xl mx-auto px-6 py-6 text-center">
          <p className="text-orange-200/60 text-sm">© 2026 Trendboss.xyz All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}