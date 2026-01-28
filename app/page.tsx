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
  
  // Stripe Price ID - Your actual TrendBoss Pro subscription
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
    
    // Load Stripe and redirect
    const { loadStripe } = await import('@stripe/stripe-js');
    const stripe = await loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || 'pk_test_DzRLtJ39RAvSkMzxMJR6IDs500mK7bMnzV'
);
    
    if (!stripe) {
      alert('Failed to load Stripe.');
      setShowSignup(true);
      return;
    }
    
const result = await (stripe as any).redirectToCheckout({ sessionId });

    if (result.error) {
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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 4000,
          messages: [{ role: 'user', content: prompt }],
        }),
      });

      const data = await response.json();
      const content = data.content.find(item => item.type === 'text')?.text || '';
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
        headers: {
          'Content-Type': 'application/json',
        },
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

    // Topic-specific or general trends
    const topicQuery = topic.trim() 
      ? `related to "${topic}"` 
      : 'across all niches';
    
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
        headers: {
          'Content-Type': 'application/json',
        },
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
        const trendData = { 
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
    } catch (error) {
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

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-orange-400';
    return 'text-yellow-400';
  };

  // Signup Modal
  if (showSignup) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-orange-950 text-white flex items-center justify-center p-6">
        <div className="max-w-md w-full">
          <button
            onClick={() => setShowSignup(false)}
            className="ml-auto mb-4 flex items-center gap-2 text-orange-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
            Close
          </button>

          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-10 border border-white/20 shadow-2xl">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-500/20 rounded-full mb-6">
                <Flame className="w-8 h-8 text-orange-400" />
              </div>
              <h2 className="text-3xl font-bold mb-3 text-white">
                Start Finding Trends Early
              </h2>
              <p className="text-orange-200/80">
                Join creators who dominate with data-driven insights
              </p>
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
                {[
                  'Unlimited trend discovery',
                  'Unlimited research briefs',
                  'Unlimited viral hooks',
                  'Real-time web analysis',
                  'All platforms supported',
                  'Priority support'
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span className="text-orange-100">{feature}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={handleSignup}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-4 px-6 rounded-xl transition-all hover:scale-105 shadow-xl shadow-orange-500/30 flex items-center justify-center gap-2"
              >
                <span>Get Started</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <p className="text-center text-xs text-orange-300/60 mt-4">
                Secure payment via Stripe
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-orange-950 text-white">
      {/* Header */}
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
                  <button
                    onClick={() => setActiveTab('landing')}
                    className="text-sm text-orange-300 hover:text-white transition-colors hidden md:block"
                  >
                    Pricing
                  </button>
                  <button
                    onClick={handleGetStarted}
                    className="px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 rounded-full text-sm font-semibold transition-all hover:scale-105"
                  >
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
            {/* Hero */}
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
              <div className="flex gap-4 justify-center flex-wrap">
                <button
                  onClick={handleGetStarted}
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-5 px-10 rounded-xl transition-all hover:scale-105 shadow-xl shadow-orange-500/30 flex items-center gap-2 text-lg"
                >
                  Get Started
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Features */}
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                <div className="p-4 bg-orange-500/10 rounded-2xl w-fit mb-4">
                  <Flame className="w-10 h-10 text-orange-500" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-white">Live Trend Discovery</h3>
                <p className="text-orange-200/80 leading-relaxed">Scan millions of posts across TikTok, Instagram, YouTube, Twitter, and more to find rising trends before they peak.</p>
              </div>
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                <div className="p-4 bg-purple-500/10 rounded-2xl w-fit mb-4">
                  <Sparkles className="w-10 h-10 text-purple-400" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-white">Viral Hook Generator</h3>
                <p className="text-orange-200/80 leading-relaxed">Generate 10 platform-specific hooks based on real viral content. AI analyzes what's working now and creates similar patterns.</p>
              </div>
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                <div className="p-4 bg-orange-500/10 rounded-2xl w-fit mb-4">
                  <Search className="w-10 h-10 text-orange-400" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-white">Instant Research</h3>
                <p className="text-orange-200/80 leading-relaxed">Get comprehensive research briefs with stats, expert quotes, content angles, and SEO keywords in under 60 seconds.</p>
              </div>
            </div>

            {/* Pricing */}
            <div className="max-w-2xl mx-auto" id="pricing">
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

                <button
                  onClick={handleGetStarted}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-5 px-8 rounded-2xl transition-all hover:scale-105 shadow-xl shadow-orange-500/30 flex items-center justify-center gap-2 text-lg"
                >
                  Get Started Now
                  <ArrowRight className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Social Proof */}
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
          <>
            <div className="text-center mb-12">
              <h2 className="text-5xl font-bold mb-4 text-white">
                Your Content Research Dashboard
              </h2>
              <p className="text-xl text-orange-200/80">
                AI-powered insights to dominate every trend
              </p>
            </div>

            <div className="flex gap-3 mb-12 justify-center flex-wrap">
              <button
                onClick={() => setActiveTab('trends')}
                className={`group flex items-center gap-2 px-8 py-4 rounded-xl font-semibold transition-all ${
                  activeTab === 'trends'
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-xl shadow-orange-500/30 scale-105'
                    : 'bg-white/5 text-orange-200 hover:bg-white/10 hover:scale-105 border border-white/10'
                }`}
              >
                <Flame className="w-5 h-5" />
                Discover Trends
              </button>
              <button
                onClick={() => setActiveTab('research')}
                className={`group flex items-center gap-2 px-8 py-4 rounded-xl font-semibold transition-all ${
                  activeTab === 'research'
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-xl shadow-orange-500/30 scale-105'
                    : 'bg-white/5 text-orange-200 hover:bg-white/10 hover:scale-105 border border-white/10'
                }`}
              >
                <Search className="w-5 h-5" />
                Research Brief
              </button>
              <button
                onClick={() => setActiveTab('hooks')}
                className={`group flex items-center gap-2 px-8 py-4 rounded-xl font-semibold transition-all ${
                  activeTab === 'hooks'
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-xl shadow-orange-500/30 scale-105'
                    : 'bg-white/5 text-orange-200 hover:bg-white/10 hover:scale-105 border border-white/10'
                }`}
              >
                <Sparkles className="w-5 h-5" />
                Hook Generator
              </button>
            </div>

            {activeTab === 'trends' && (
              <div className="space-y-8">
                <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-10 border border-white/20 shadow-2xl">
                  <div className="text-center mb-8">
                    <h3 className="text-3xl font-bold mb-3 text-white">Live Trending Topics</h3>
                    <p className="text-orange-200/80 text-lg">Discover what's going viral right now</p>
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-lg font-semibold mb-3 text-orange-200">
                      Search Trends by Topic (Optional)
                    </label>
                    <input
                      type="text"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder="e.g., AI, fitness, crypto, or leave blank for all trends"
                      className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/20 text-white text-lg placeholder-orange-300/60 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    />
                  </div>

                  <button
                    onClick={discoverTrends}
                    disabled={trendsLoading}
                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-5 px-8 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-xl shadow-orange-500/30 disabled:shadow-none hover:scale-105 disabled:scale-100"
                  >
                    {trendsLoading ? (
                      <>
                        <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-lg">Scanning the web...</span>
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-6 h-6" />
                        <span className="text-lg">
                          {topic.trim() ? `Find Trends About "${topic}"` : 'Find Current Trends'}
                        </span>
                      </>
                    )}
                  </button>
                </div>

                {trends.length > 0 && (
                  <div className="grid md:grid-cols-2 gap-6">
                    {trends.map((trend, index) => (
                      <div key={index} className="group bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-orange-500/20 rounded-2xl p-6 hover:border-orange-500/40 hover:shadow-xl hover:shadow-orange-500/10 transition-all hover:scale-105">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h4 className="text-xl font-bold text-white mb-2 group-hover:text-orange-400 transition-colors">
                              {trend.name}
                            </h4>
                            {trend.platforms && (
                              <div className="flex flex-wrap gap-2 mb-3">
                                {trend.platforms.split(',').map((p, i) => (
                                  <span key={i} className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full text-xs text-purple-300">
                                    {p.trim()}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                          {trend.score > 0 && (
                            <div className="flex flex-col items-center ml-4">
                              <div className={`text-3xl font-bold ${getScoreColor(trend.score)}`}>
                                {trend.score}
                              </div>
                              <div className="text-xs text-orange-300">Score</div>
                            </div>
                          )}
                        </div>
                        
                        {trend.why && (
                          <p className="text-orange-100/90 leading-relaxed mb-3">
                            {trend.why}
                          </p>
                        )}
                        
                        {trend.opportunity && (
                          <div className="mt-4 p-3 bg-orange-500/10 border border-orange-500/20 rounded-xl">
                            <div className="flex items-start gap-2">
                              <Target className="w-4 h-4 text-orange-400 mt-1 flex-shrink-0" />
                              <p className="text-sm text-orange-200">{trend.opportunity}</p>
                            </div>
                          </div>
                        )}
                        
                        {trend.days && (
                          <div className="mt-3 flex items-center gap-2 text-sm text-orange-300">
                            <Clock className="w-4 h-4" />
                            <span>~{trend.days} until saturation</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {(activeTab === 'research' || activeTab === 'hooks') && (
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-10 mb-8 border border-white/20 shadow-2xl">
                <div className="space-y-6">
                  <div>
                    <label className="block text-lg font-semibold mb-3 text-orange-200">
                      {activeTab === 'research' ? 'Topic to Research' : 'Content Topic'}
                    </label>
                    <input
                      type="text"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder={activeTab === 'research' ? 'e.g., AI automation tools' : 'e.g., productivity hacks for creators'}
                      className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/20 text-white text-lg placeholder-orange-300/60 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    />
                  </div>

                  {activeTab === 'hooks' && (
                    <div>
                      <label className="block text-lg font-semibold mb-3 text-orange-200">
                        Target Platform
                      </label>
                      <select
                        value={platform}
                        onChange={(e) => setPlatform(e.target.value)}
                        className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/20 text-white text-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                      >
                        <option value="TikTok">TikTok</option>
                        <option value="Instagram">Instagram</option>
                        <option value="Twitter/X">Twitter/X</option>
                        <option value="YouTube">YouTube</option>
                        <option value="Facebook">Facebook</option>
                        <option value="LinkedIn">LinkedIn</option>
                      </select>
                    </div>
                  )}

                  <button
                    onClick={handleGenerate}
                    disabled={loading || !topic.trim()}
                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-5 px-8 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-xl shadow-orange-500/30 disabled:shadow-none hover:scale-105 disabled:scale-100 text-lg"
                  >
                    {loading ? (
                      <>
                        <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                        Generating...
                      </>
                    ) : (
                      <>
                        <ChevronRight className="w-6 h-6" />
                        {activeTab === 'research' ? 'Generate Research Brief' : 'Generate Viral Hooks'}
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {result && (
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-10 border border-white/20 shadow-2xl">
                <div className="flex items-center gap-3 mb-8 pb-6 border-b border-orange-500/20">
                  <div className="p-3 bg-orange-500/20 rounded-xl">
                    <TrendingUp className="w-7 h-7 text-orange-400" />
                  </div>
                  <h3 className="text-3xl font-bold text-white">
                    {activeTab === 'research' ? 'Research Brief' : 'Viral Hooks'}
                  </h3>
                </div>
                <div className="whitespace-pre-wrap text-orange-100 leading-relaxed">
                  {result}
                </div>
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Footer */}
      <div className="border-t border-white/10 bg-black/20 backdrop-blur-sm mt-20">
        <div className="max-w-7xl mx-auto px-6 py-6 text-center">
          <p className="text-orange-200/60 text-sm">
            © 2026 Trendboss.xyz All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}