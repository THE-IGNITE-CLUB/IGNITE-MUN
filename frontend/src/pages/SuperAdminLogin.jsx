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
      toast.error('Authentication failed. Check your credentials.')
    } finally { setLoading(false) }
  }

  return (
    <PageWrapper>
      <main className="relative min-h-screen flex items-center justify-center p-[16px] md:p-[48px] overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-primary-container/80 z-10 backdrop-blur-sm" />
          <img className="w-full h-full object-cover z-0"
            src="https://lh3.googleusercontent.com/aida/AP1WRLt6UCF_nmMOf65MN7rHCMRylWau4wAolYqU0OrHaI2r7U-3va2Bnw0K2eDaCH3LOF_ebqhO9c1DP9ehhz69kcq-FFCogSZc1DZWk3NQKevBFpRmpoqvrBjjtjRw4HClcZiP_yI7nm0cvfVe5RUghEnkdJxh8zHYxsTdtm75U_nOYJmPWtUhRnj8LbgHkMTupbXINp-bfC5aXQ90SlfSxgPrEVlZ0F5g9yyhp_nVDVCbKcpB74Nr1DMUqs0"
            alt="" aria-hidden="true" />
        </div>

        {/* Card */}
        <div className="relative z-20 w-full max-w-md bg-surface-container-lowest rounded-xl border border-outline/10 shadow-[0_24px_48px_-12px_rgba(15,23,42,0.2)] overflow-hidden">
          <div className="bg-surface-container-low p-8 text-center border-b border-outline/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-secondary/10 rounded-full blur-2xl" />
            <div className="inline-flex items-center justify-center w-20 h-20 bg-surface-container-lowest rounded-full shadow-sm border border-outline/10 mb-6 p-1 relative z-10">
              <img className="w-full h-full object-cover rounded-full"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDQvZshXrDrnMo3q4Hz5ZIWgkyB42Ba5CKJV_Ri2WbQgOER1VbgShDszopdQWyKp5SlOu5UbdTNvwnmoPxCo8L80mlRcIURTr8MMXB3HEDIs1CT2IoY0ygLcx8MBW_jQVRUT8oqhwNVsTY_kqMv8XmO23CKJDGBTjnoD7gEnJ49xAohc5Q5881Tj8ginqFIEf_fFQfllA686tH2cAxNtBrLZcR_iXDhfd6luphFVICnnb1gEc9B06Hi-SvvYYqOEAfQaA"
                alt="Ignite MUN Logo" />
            </div>
            <h1 className="font-headline-lg text-headline-lg text-primary mb-2 relative z-10">Command Center</h1>
            <p className="font-body-md text-body-md text-on-surface-variant relative z-10">Super Admin Authentication Protocol</p>
          </div>

          <div className="p-8">
            <form onSubmit={submit} className="space-y-6">
              <div className="space-y-2">
                <label className="block font-label-md text-label-md text-on-surface">Institutional Email</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">mail</span>
                  <input type="email" readOnly value="manas.malla13@gmail.com"
                    className="block w-full pl-10 pr-3 py-3 border border-outline/20 bg-surface-container-low text-on-surface rounded font-body-md text-body-md opacity-80 cursor-not-allowed" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="block font-label-md text-label-md text-on-surface" htmlFor="password">Secure Credential</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">lock</span>
                  <input id="password" type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••"
                    className="block w-full pl-10 pr-3 py-3 border border-outline/20 bg-surface-container-lowest text-on-surface rounded focus:ring-1 focus:ring-on-tertiary-container font-body-md text-body-md outline-none" />
                </div>
              </div>
              <button type="submit" disabled={loading}
                className="w-full flex justify-center py-3 px-4 bg-primary text-on-primary rounded font-label-md text-label-md hover:bg-primary/90 transition-colors disabled:opacity-60">
                {loading ? <span className="material-symbols-outlined animate-spin">progress_activity</span> : 'Sign In to Command Center'}
              </button>
              <div className="mt-4 pt-4 border-t border-outline/10 text-center flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-base text-secondary">verified_user</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">Encrypted Session</span>
              </div>
            </form>
            <p className="text-center mt-4 text-sm">
              <Link to="/login" className="text-on-surface-variant hover:text-secondary font-label-md text-label-md">← Delegate Login</Link>
            </p>
          </div>
        </div>
      </main>
    </PageWrapper>
  )
}
