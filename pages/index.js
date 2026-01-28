import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { Flame, Crown, LogOut, Sparkles, Search, Check, ArrowRight } from 'lucide-react'

export default function TrendBoss() {
  const { user, loading: authLoading, signOut } = useAuth()
  const router = useRouter()

  const isAuthenticated = !!user

  const handleGetStarted = () => {
    router.push('/signup')
  }

  const handleGoToDashboard = () => {
    router.push('/dashboard')
  }

  const handleSignOut = async () => {
    await signOut()
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-orange-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-orange-300">Loading...</p>
        </div>
      </div>
    )
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
              {isAuthenticated ? (
                <>
                  <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500/20 to-purple-500/20 border border-orange-500/30 rounded-full">
                    <Crown className="w-4 h-4 text-orange-400" />
                    <span className="text-sm text-orange-300 font-semibold hidden md:inline">{user.email}</span>
                  </div>
                  <button 
                    onClick={handleGoToDashboard}
                    className="px-6 py-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 rounded-full text-sm font-semibold transition-all hover:scale-105"
                  >
                    Dashboard
                  </button>
                  <button 
                    onClick={handleSignOut}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                    title="Sign Out"
                  >
                    <LogOut className="w-5 h-5 text-orange-300" />
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    href="/login"
                    className="text-sm text-orange-300 hover:text-white transition-colors hidden md:block"
                  >
                    Login
                  </Link>
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

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        {!isAuthenticated ? (
          // Landing Page for Non-Authenticated Users
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
              <button 
                onClick={handleGetStarted} 
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-5 px-10 rounded-xl transition-all hover:scale-105 shadow-xl shadow-orange-500/30 flex items-center gap-2 text-lg mx-auto"
              >
                Get Started
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            {/* Features Section */}
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

            {/* Pricing Section */}
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

                <button 
                  onClick={handleGetStarted} 
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-5 px-8 rounded-2xl transition-all hover:scale-105 shadow-xl shadow-orange-500/30 flex items-center justify-center gap-2 text-lg"
                >
                  Get Started Now
                  <ArrowRight className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Stats Section */}
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
          // Authenticated User View
          <div className="text-center max-w-3xl mx-auto">
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-12 border border-white/20 shadow-2xl">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-orange-500/20 to-purple-500/20 rounded-full mb-6">
                <Crown className="w-10 h-10 text-orange-400" />
              </div>
              <h2 className="text-4xl font-bold mb-4 text-white">Welcome Back! 👋</h2>
              <p className="text-xl text-orange-200/80 mb-8">
                You're logged in as <span className="text-orange-400 font-semibold">{user.email}</span>
              </p>
              
              <button 
                onClick={handleGoToDashboard}
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-4 px-8 rounded-xl transition-all hover:scale-105 shadow-xl shadow-orange-500/30 flex items-center justify-center gap-2 mx-auto mb-8"
              >
                <Sparkles className="w-5 h-5" />
                Go to Dashboard
              </button>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
                  <div className="text-purple-200 text-sm font-medium mb-1">Trends Found</div>
                  <div className="text-white text-2xl font-bold">0</div>
                </div>
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4">
                  <div className="text-orange-200 text-sm font-medium mb-1">Searches</div>
                  <div className="text-white text-2xl font-bold">0</div>
                </div>
                <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                  <div className="text-green-200 text-sm font-medium mb-1">Status</div>
                  <div className="text-white text-lg font-bold">Free</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-white/10 bg-black/20 backdrop-blur-sm mt-20">
        <div className="max-w-7xl mx-auto px-6 py-6 text-center">
          <p className="text-orange-200/60 text-sm">© 2026 Trendboss.xyz All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}