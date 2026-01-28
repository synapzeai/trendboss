'use client';

import React, { useState, useEffect } from 'react';
import { Search, Zap, TrendingUp, Target, Sparkles, ChevronRight, RefreshCw, Clock, Flame, ArrowUpRight, Crown, X, Check, ArrowRight } from 'lucide-react';

export default function TrendBoss() {
  const [activeTab, setActiveTab] = useState('landing');
  const [topic, setTopic] = useState('');
  const [platform, setPlatform] = useState('TikTok');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [trends, setTrends] = useState<any[]>([]);
  const [trendsLoading, setTrendsLoading] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  
  const STRIPE_PRICE_ID = 'price_1SuUttC8WQiKTNRfFn36VTLS';

  useEffect(() => {
    const paidStatus = sessionStorage.getItem('trendboss_paid');
    if (paidStatus === 'true') {
      setIsPaid(true);
      setActiveTab('trends');
    }
  }, []);

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

  const generateResearchBrief = async () => {
    if (!isPaid) {
      setShowSignup(true);
      return;
    }
    
    setLoading(true);
    setResult(null);

    const prompt = `Create a comprehensive content research brief for: ${topic}

Include:
1. Overview (2-3 sentences)
2. Key Statistics (5-7 data points)
3. Expert Perspectives (3-4 quotes)
4. Content Angles (5 unique angles)
5. Viral Hooks (3 opening lines)
6. SEO Keywords (top 10)

Keep it actionable with clear section headers.`;

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 4000,
          messages: [{ role: 'user', content: prompt }],
        }),
      });

      const data = await response.json();
      const content = data.content.find((item: any) => item.type === 'text')?.text || '';
      setResult(content);
    } catch (error) {
      setResult('Error generating research brief. Please try again.');
    }

    setLoading(false);
  };

  const generateHooks = async () => {
    if (!isPaid) {
      setShowSignup(true);
      return;
    }
    
    setLoading(true);
    setResult(null);

    const combinedPrompt = `Generate 10 viral hooks for ${platform} about "${topic}". Search for 3-5 recent viral examples. Then generate NEW hooks based on patterns. For each hook: HOOK: [bold text], Why It Works: [trigger + pattern], Potential: [High/Medium]. Keep brief, prioritize speed.`;

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 3000,
          tools: [{ type: 'web_search_20250305', name: 'web_search' }],
          messages: [{ role: 'user', content: combinedPrompt }],
        }),
      });

      const data = await response.json();
      let fullText = '';
      if (data.content) {
        for (const block of data.content) {
          if (block.type === 'text') fullText += block.text + '\n';
        }
      }
      
      setResult(`🔍 RESEARCH-BACKED HOOKS (Based on real ${platform} content)\n\n${fullText}`);
    } catch (error) {
      setResult('Error generating hooks. Please try again.');
    }

    setLoading(false);
  };

  const discoverTrends = async () => {
    if (!isPaid) {
      setShowSignup(true);
      return;
    }
    
    setTrendsLoading(true);
    setTrends([]);

    const topicQuery = topic.trim() ? `related to "${topic}"` : 'across all niches';
    const prompt = `Search for 5-8 trending topics RIGHT NOW on social media ${topicQuery}. Be concise.

For each trend, format as:
TREND: [name]
PLATFORMS: [list]
SCORE: [70-95]
WHY: [1 sentence]

Keep it brief. Focus on what's viral TODAY.`;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 2000,
          tools: [{ type: 'web_search_20250305', name: 'web_search' }],
          messages: [{ role: 'user', content: prompt }],
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      
      let fullText = '';
      if (data.content) {
        for (const block of data.content) {
          if (block.type === 'text') fullText += block.text + '\n';
        }
      }
      
      if (!fullText || fullText.trim().length === 0) {
        throw new Error('Empty response from API');
      }
      
      const trendBlocks = fullText.split(/\n\n+/).filter(block => 
        block.includes('TREND:') && block.trim().length > 0
      );
      
      const parsedTrends = trendBlocks.map(block => {
        const lines = block.split('\n').map(l => l.trim()).filter(l => l);
        const trendData: any = { 
          name: '', 
          platforms: 'Multiple Platforms', 
          score: 75, 
          days: '3-5 days', 
          why: '', 
          opportunity: 'Create content around this trending topic'
        };
        
        lines.forEach(line => {
          if (line.startsWith('TREND:')) {
            trendData.name = line.replace('TREND:', '').trim();
          } else if (line.startsWith('PLATFORMS:')) {
            trendData.platforms = line.replace('PLATFORMS:', '').trim();
          } else if (line.startsWith('SCORE:')) {
            const scoreMatch = line.match(/\d+/);
            trendData.score = scoreMatch ? parseInt(scoreMatch[0]) : 75;
          } else if (line.startsWith('WHY:')) {
            trendData.why = line.replace('WHY:', '').trim();
          } else if (line.startsWith('DAYS:')) {
            trendData.days = line.replace('DAYS:', '').trim();
          } else if (line.startsWith('OPPORTUNITY:')) {
            trendData.opportunity = line.replace('OPPORTUNITY:', '').trim();
          }
        });
        
        return trendData;
      }).filter(t => t.name && t.name.length > 0);
      
      if (parsedTrends.length > 0) {
        setTrends(parsedTrends);
      } else {
        const sentences = fullText.split(/[.!?]+/).filter(s => s.trim().length > 20);
        const fallbackTrends = sentences.slice(0, 5).map((sentence, idx) => ({
          name: `Trend ${idx + 1}`,
          platforms: 'Multiple Platforms',
          score: 75 + idx * 3,
          days: '3-5 days',
          why: sentence.trim(),
          opportunity: 'Create content around this topic'
        }));
        setTrends(fallbackTrends.length > 0 ? fallbackTrends : [{
          name: 'Trends Found',
          platforms: 'All Platforms',
          score: 75,
          days: '3-5 days',
          why: fullText.substring(0, 200),
          opportunity: 'Review the trends above'
        }]);
      }
    } catch (error: any) {
      console.error('Trends error:', error);
      
      let errorMessage = 'Please try again.';
      if (error.name === 'AbortError') {
        errorMessage = 'Request timed out. The search took too long. Please try again.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setTrends([{ 
        name: 'Unable to load trends', 
        why: errorMessage,
        platforms: '',
        score: 0,
        days: '',
        opportunity: 'Click the button to try again'
      }]);
    }

    setTrendsLoading(false);
  };

  const handleGenerate = () => {
    if (!topic.trim()) return;
    if (activeTab === 'research') generateResearchBrief();
    else generateHooks();
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
              <Flame className="w-8 h-8 text-orange-500" />
              <h1 className="text-2xl font-bold text-white">TrendBoss</h1>
            </div>
            <div className="flex items-center gap-4">
              {!isPaid && (
                <button onClick={handleGetStarted} className="px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 rounded-full text-sm font-semibold transition-all hover:scale-105">
                  Get Started
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-6xl font-bold mb-8 bg-gradient-to-r from-orange-400 via-purple-400 to-orange-400 bg-clip-text text-transparent">
            Find Trends Before They Blow Up
          </h2>
          <p className="text-2xl text-orange-200/80 mb-10">
            Stop chasing trends. Start leading them.
          </p>
          <button onClick={handleGetStarted} className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-5 px-10 rounded-xl transition-all hover:scale-105 shadow-xl shadow-orange-500/30">
            Get Started
          </button>
        </div>
      </div>
      <div className="border-t border-white/10 bg-black/20 backdrop-blur-sm mt-20">
        <div className="max-w-7xl mx-auto px-6 py-6 text-center">
          <p className="text-orange-200/60 text-sm">© 2026 Trendboss.xyz All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}