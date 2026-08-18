import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function SuperAdminLogin() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    if (!username.trim() || !password.trim()) {
      toast.error('Both username and password are required.')
      return
    }
    setLoading(true)
    try {
      const data = await login(username.trim(), password)
      if (data.role === 'super_admin') {
        toast.success('Welcome, Super Admin!')
        navigate('/admin/super')
      } else if (data.role === 'eb' || data.role === 'admin') {
        navigate('/admin/eb')
      } else {
        toast.error('Access denied. Super Admin privileges required.')
      }
    } catch {
      toast.error('Authentication failed. Invalid credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0612] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-purple-900/20 blur-[120px] animate-pulse" />
        <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full bg-indigo-900/20 blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-violet-900/10 blur-[80px]" />
      </div>

      {/* Grid overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      {/* Card */}
      <div className="relative z-10 w-full max-w-md">
        {/* Top badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
            Restricted Access — Authorized Personnel Only
          </div>
        </div>

        {/* Glass card */}
        <div className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="p-8 pb-6 text-center border-b border-white/8">
            {/* Shield icon with glow */}
            <div className="relative inline-flex items-center justify-center mb-6">
              <div className="absolute inset-0 rounded-full bg-purple-500/20 blur-xl scale-150" />
              <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-600/30 to-indigo-600/30 border border-purple-500/30 flex items-center justify-center">
                <span className="material-symbols-outlined text-5xl text-purple-300" style={{ fontVariationSettings: '"FILL" 1' }}>shield_lock</span>
              </div>
            </div>

            <h1 className="text-2xl font-black text-white mb-1 tracking-tight">Super Admin Portal</h1>
            <p className="text-sm text-purple-300/80 font-medium">IGNITE MUN 2026 — Command Center</p>
            <div className="mt-3 flex items-center justify-center gap-2">
              <span className="h-px w-12 bg-gradient-to-r from-transparent to-purple-500/40" />
              <span className="text-[10px] text-white/30 uppercase tracking-widest font-bold">Security Level: ALPHA</span>
              <span className="h-px w-12 bg-gradient-to-l from-transparent to-purple-500/40" />
            </div>
          </div>

          {/* Form */}
          <div className="p-8">
            <form onSubmit={submit} className="space-y-5">
              {/* Username */}
              <div>
                <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-2">Admin Username</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-400 text-base">manage_accounts</span>
                  <input
                    type="text"
                    required
                    autoComplete="username"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    placeholder="superadmin"
                    className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 text-sm outline-none focus:border-purple-500/60 focus:bg-white/8 transition-all font-mono"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-2">Clearance Password</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-400 text-base">lock</span>
                  <input
                    id="password"
                    type={showPass ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-11 pr-12 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 text-sm outline-none focus:border-purple-500/60 focus:bg-white/8 transition-all font-mono tracking-widest"
                  />
                  <button type="button" onClick={() => setShowPass(v => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                    <span className="material-symbols-outlined text-base">{showPass ? 'visibility_off' : 'visibility'}</span>
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 mt-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl font-bold text-sm tracking-wide transition-all shadow-lg shadow-purple-900/40 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading
                  ? <><span className="material-symbols-outlined animate-spin text-base">progress_activity</span> Authenticating...</>
                  : <><span className="material-symbols-outlined text-base">verified_user</span> Authenticate &amp; Enter</>}
              </button>
            </form>

            {/* Security notice */}
            <div className="mt-6 p-4 rounded-xl bg-amber-500/5 border border-amber-500/15">
              <div className="flex items-start gap-2.5">
                <span className="material-symbols-outlined text-amber-400 text-sm mt-0.5">warning</span>
                <div>
                  <p className="text-[11px] font-bold text-amber-400/80 uppercase tracking-wide mb-0.5">Security Notice</p>
                  <p className="text-[11px] text-white/30 leading-relaxed">All access attempts are logged. Unauthorized access is strictly prohibited and will be reported to the IGNITE MUN 2026 Secretariat.</p>
                </div>
              </div>
            </div>

            {/* Footer links */}
            <div className="mt-5 flex justify-between items-center">
              <Link to="/login" className="text-xs text-white/30 hover:text-purple-300 transition-colors font-medium flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">arrow_back</span>
                Delegate Login
              </Link>
              <Link to="/admin/eb" className="text-xs text-white/30 hover:text-purple-300 transition-colors font-medium flex items-center gap-1">
                EB Command
                <span className="material-symbols-outlined text-xs">arrow_forward</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom note */}
        <p className="text-center text-[11px] text-white/20 mt-5">
          Access URL: <span className="font-mono text-purple-400/50">/admin/login</span> · IGNITE MUN 2026 Secretariat
        </p>
      </div>
    </div>
  )
}
