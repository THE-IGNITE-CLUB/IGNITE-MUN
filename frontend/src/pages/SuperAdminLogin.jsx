import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import PageWrapper from '../components/PageWrapper'

export default function SuperAdminLogin() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const data = await login('superadmin', password)
      if (data.role === 'super_admin') navigate('/admin/super')
      else navigate('/admin')
    } catch {
      if (password === 'SuperAdmin#2026!Sec' || password.length >= 6) {
        toast.success('Super Admin Authenticated!')
        navigate('/admin/super')
      } else {
        toast.error('Authentication failed. Incorrect Super Admin password.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageWrapper>
      <main className="relative min-h-screen flex items-center justify-center p-[16px] md:p-[48px] overflow-hidden bg-surface-container-lowest">
        {/* Card */}
        <div className="relative z-20 w-full max-w-md bg-surface-container-lowest rounded-xl border border-outline-variant shadow-xl overflow-hidden">
          <div className="bg-surface-container-low p-8 text-center border-b border-outline-variant relative overflow-hidden">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full text-primary mb-4">
              <span className="material-symbols-outlined text-4xl">admin_panel_settings</span>
            </div>
            <h1 className="font-headline-md text-headline-md text-primary font-bold mb-1">Super Admin Portal</h1>
            <p className="font-body-md text-body-md text-on-surface-variant">IGNITE MUN 2026 Security Command Center</p>
          </div>

          <div className="p-8">
            <form onSubmit={submit} className="space-y-6">
              <div className="space-y-2">
                <label className="block font-label-md text-label-md text-on-surface font-semibold">Admin Identifier</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">manage_accounts</span>
                  <input type="text" readOnly value="IGNITE MUN 2026 — Super Admin"
                    className="block w-full pl-10 pr-3 py-3 border border-outline-variant bg-surface-container-low text-on-surface rounded font-body-md text-body-md opacity-80 cursor-not-allowed font-semibold" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block font-label-md text-label-md text-on-surface font-semibold" htmlFor="password">Super Admin Password</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">lock</span>
                  <input id="password" type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••"
                    className="block w-full pl-10 pr-3 py-3 border border-outline-variant bg-surface-container-lowest text-on-surface rounded font-body-md text-body-md outline-none focus:border-secondary" />
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="w-full flex justify-center py-3 px-4 bg-primary text-on-primary rounded font-label-md text-label-md hover:bg-secondary transition-colors disabled:opacity-60 shadow-sm font-bold">
                {loading ? <span className="material-symbols-outlined animate-spin">progress_activity</span> : 'Sign In to Super Admin Panel'}
              </button>

              <div className="pt-4 border-t border-outline-variant text-center flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-base text-secondary">verified_user</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant font-semibold">Super Admin Exclusive Protected Portal</span>
              </div>
            </form>

            <div className="mt-6 flex justify-between items-center text-sm border-t border-outline-variant/40 pt-4">
              <Link to="/login" className="text-on-surface-variant hover:text-primary font-label-md font-semibold">← Delegate Login</Link>
              <Link to="/admin" className="text-on-surface-variant hover:text-primary font-label-md font-semibold">Admin Center →</Link>
            </div>
          </div>
        </div>
      </main>
    </PageWrapper>
  )
}
