import { useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useRouter } from 'next/router'

export default function Dashboard() {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-black">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black">
      <header className="bg-white/5 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white">
              Trend<span className="text-purple-400">Boss</span>
            </h1>
            <div className="flex items-center gap-4">
              <span className="text-gray-300 text-sm">{user.email}</span>
              <button
                onClick={signOut}
                className="bg-red-500/20 hover:bg-red-500/30 text-red-200 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
          <h2 className="text-3xl font-bold text-white mb-6">
            Welcome to Your Dashboard! 🚀
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-purple-500/20 border border-purple-500/30 rounded-xl p-6">
              <div className="text-purple-200 text-sm font-medium mb-2">Total Trends</div>
              <div className="text-white text-3xl font-bold">0</div>
            </div>
            
            <div className="bg-blue-500/20 border border-blue-500/30 rounded-xl p-6">
              <div className="text-blue-200 text-sm font-medium mb-2">Searches This Month</div>
              <div className="text-white text-3xl font-bold">0</div>
            </div>
            
            <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-6">
              <div className="text-green-200 text-sm font-medium mb-2">Subscription</div>
              <div className="text-white text-xl font-bold">Free</div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-white/10">
            <h3 className="text-lg font-semibold text-white mb-4">Account Information</h3>
            <div className="space-y-2 text-gray-300">
              <p><span className="text-gray-400">Email:</span> {user.email}</p>
              <p><span className="text-gray-400">User ID:</span> {user.id}</p>
              <p><span className="text-gray-400">Account Created:</span> {new Date(user.created_at).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}