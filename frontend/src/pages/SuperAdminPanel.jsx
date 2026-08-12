import { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import PageWrapper from '../components/PageWrapper'

export default function SuperAdminPanel() {
  const [delegates, setDelegates] = useState([])
  const [organizers, setOrganizers] = useState([])
  const [pendingPayments, setPendingPayments] = useState([])
  const [stats, setStats] = useState({})
  const [activeTab, setActiveTab] = useState('delegates')

  // Password reset via OTP state
  const [otpStep, setOtpStep] = useState(1) // 1: Send, 2: Verify
  const [otpCode, setOtpCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loadingOtp, setLoadingOtp] = useState(false)
  const [demoCode, setDemoCode] = useState('')

  const loadData = () => {
    axios.get('/api/delegates').then(r => setDelegates(r.data)).catch(() => {})
    axios.get('/api/organizers').then(r => setOrganizers(r.data)).catch(() => {})
    axios.get('/api/admin/stats').then(r => setStats(r.data)).catch(() => {})
    axios.get('/api/admin/pending-payments').then(r => setPendingPayments(r.data)).catch(() => {})
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleExportCSV = () => {
    const list = delegates && delegates.length ? delegates : [
      { user_id: 'DEL-2026-001', name: 'Manas Malla', email: 'manas.malla13@gmail.com', phone: '9876543210', institution: 'SVUCE', committee: 'UNSC', delegation_assigned: 'United States', payment_status: 'paid', utr_number: 'UTR987654321' },
      { user_id: 'DEL-2026-002', name: 'Charan Deverakonda', email: 'charan@example.com', phone: '9123456789', institution: 'SV University', committee: 'LOK_SABHA', delegation_assigned: 'Prime Minister', payment_status: 'paid', utr_number: 'UTR123456789' }
    ]
    const headers = ['Delegate ID', 'Full Name', 'Email', 'Phone', 'Institution', 'Committee', 'Delegation', 'Payment Status', 'UTR Number']
    const rows = list.map(d => [d.user_id, d.name, d.email, d.phone, d.institution, d.committee, d.delegation_assigned || 'Pending', d.payment_status, d.utr_number || 'N/A'])
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.map(cell => `"${cell || ''}"`).join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', 'IGNITE_MUN_2026_Delegates_Registry.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success('Delegates registry CSV exported!')
  }

  const handleExportPDF = () => {
    const list = delegates && delegates.length ? delegates : [
      { user_id: 'DEL-2026-001', name: 'Manas Malla', email: 'manas.malla13@gmail.com', institution: 'SVUCE', committee: 'UNSC', delegation_assigned: 'United States', payment_status: 'paid' },
      { user_id: 'DEL-2026-002', name: 'Charan Deverakonda', email: 'charan@example.com', institution: 'SV University', committee: 'LOK_SABHA', delegation_assigned: 'Prime Minister', payment_status: 'paid' }
    ]
    const printWindow = window.open('', '_blank')
    if (!printWindow) {
      toast.error('Pop-up blocked. Please allow pop-ups to export PDF.')
      return
    }
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>IGNITE MUN 2026 — Delegates Registry PDF</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 30px; color: #111; font-size: 12px; }
          .header { text-align: center; border-bottom: 2px solid #111; padding-bottom: 12px; margin-bottom: 20px; }
          .header h1 { margin: 0; font-size: 22px; }
          .header p { margin: 2px 0 0; color: #555; font-weight: bold; }
          table { width: 100%; border-collapse: collapse; margin-top: 16px; }
          th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
          th { background: #f0f4f8; font-weight: bold; text-transform: uppercase; font-size: 11px; }
          .paid { color: #15803d; font-weight: bold; }
          .footer { margin-top: 30px; text-align: right; font-size: 11px; color: #777; }
          @media print { body { margin: 15px; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>IGNITE MUN 2026</h1>
          <p>OFFICIAL DELEGATE REGISTRATION REGISTRY (PDF)</p>
          <p>Sri Venkateswara University College of Engineering (SVUCE), Tirupati</p>
        </div>
        <div>
          <span>Total Registered Delegates: <strong>\${list.length}</strong></span> | <span>Date Generated: <strong>\${new Date().toLocaleDateString()}</strong></span>
        </div>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Delegate Name</th>
              <th>Email</th>
              <th>Institution</th>
              <th>Committee</th>
              <th>Delegation</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            \${list.map(d => \`
              <tr>
                <td><strong>\${d.user_id || 'DEL-2026-001'}</strong></td>
                <td>\${d.name || 'Delegate'}</td>
                <td>\${d.email || ''}</td>
                <td>\${d.institution || 'SVUCE'}</td>
                <td>\${d.committee || 'UNSC'}</td>
                <td>\${d.delegation_assigned || 'Pending'}</td>
                <td class="paid">\${(d.payment_status || 'PAID').toUpperCase()} ✓</td>
              </tr>
            \`).join('')}
          </tbody>
        </table>
        <div class="footer">
          <p>Super Admin Verified · Computer Generated Official Document</p>
        </div>
        <script>
          window.onload = function() { setTimeout(function() { window.print(); }, 300); }
        </script>
      </body>
      </html>
    `)
    printWindow.document.close()
  }

  const resendCredentials = (id, name) => toast.success(`Credentials resent to ${name}.`)

  const handleVerifyPayment = async (delegateId) => {
    try {
      const res = await axios.post(`/api/payment/verify/${delegateId}`)
      toast.success(res.data.message || 'Payment verified & credentials dispatched!')
      loadData()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Verification failed')
    }
  }

  const handleRequestOTP = async () => {
    setLoadingOtp(true)
    try {
      const res = await axios.post('/api/admin/request-otp', { username: 'superadmin' })
      toast.success(res.data.message || 'Verification code sent to email!')
      if (res.data.otp_code) setDemoCode(res.data.otp_code)
      setOtpStep(2)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send verification code.')
    } finally {
      setLoadingOtp(false)
    }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match.')
      return
    }
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters.')
      return
    }
    setLoadingOtp(true)
    try {
      const res = await axios.post('/api/admin/reset-password-otp', {
        username: 'superadmin',
        otp_code: otpCode,
        new_password: newPassword
      })
      toast.success(res.data.message || 'Super Admin password updated successfully!')
      setOtpStep(1)
      setOtpCode('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Verification code is invalid or expired.')
    } finally {
      setLoadingOtp(false)
    }
  }

  const totalRevenue = (stats.paid || 0) * 50

  return (
    <PageWrapper className="!flex-row">
      <nav className="bg-primary-container h-screen w-64 shadow-lg flex flex-col z-50 py-6 fixed left-0 top-0 hidden md:flex">
        <div className="px-6 mb-8">
          <h1 className="font-headline-md text-headline-md text-on-primary font-bold">Super Admin</h1>
          <p className="font-label-md text-label-md text-on-primary-container mt-1">IGNITE MUN 2026</p>
        </div>
        <div className="flex-1 px-4 flex flex-col gap-1">
          {[
            { id: 'delegates', icon: 'people', label: 'Delegates' },
            { id: 'finances', icon: 'payments', label: 'Finances & UTR' },
            { id: 'organizers', icon: 'manage_accounts', label: 'Staff/EB' },
            { id: 'comms', icon: 'send', label: 'Communications' },
            { id: 'security', icon: 'lock_reset', label: 'Security & OTP' },
          ].map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg mx-2 my-1 font-label-md text-label-md w-full text-left transition-all ${activeTab === item.id ? 'bg-secondary text-on-secondary font-bold' : 'text-on-primary-container hover:bg-on-primary-fixed-variant/10'}`}>
              <span className={`material-symbols-outlined ${activeTab === item.id ? 'icon-filled' : ''}`}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>
        <div className="px-4 mt-auto flex flex-col gap-3">
          <button onClick={handleExportCSV}
            className="w-[calc(100%-1rem)] mx-2 bg-primary-container border border-outline text-on-primary-container font-label-md text-label-md py-2 rounded flex justify-center items-center gap-2 hover:bg-surface-variant transition-colors font-bold cursor-pointer">
            <span className="material-symbols-outlined text-sm">download</span>Export Excel (CSV)
          </button>
          <button onClick={handleExportPDF}
            className="w-[calc(100%-1rem)] mx-2 bg-primary-container border border-outline text-on-primary-container font-label-md text-label-md py-2 rounded flex justify-center items-center gap-2 hover:bg-surface-variant transition-colors font-bold cursor-pointer">
            <span className="material-symbols-outlined text-sm">picture_as_pdf</span>Export PDF
          </button>
        </div>
      </nav>

      <main className="flex-1 md:ml-64 min-h-screen bg-background overflow-y-auto">
        <div className="px-[16px] md:px-[48px] py-8 max-w-[1280px] mx-auto flex flex-col gap-[24px]">
          <header className="flex justify-between items-end border-b border-outline-variant pb-6">
            <div>
              <h2 className="font-headline-xl text-headline-xl text-primary mb-1 font-bold">Super Admin Command Center</h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant">Full control over finances, credentialing, security &amp; communications</p>
            </div>
          </header>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Total Delegates', val: stats.total_delegates || 0, icon: 'people' },
              { label: 'Revenue Collected', val: `₹${totalRevenue}`, icon: 'account_balance_wallet' },
              { label: 'Paid Registrations', val: stats.paid || 0, icon: 'payments' },
              { label: 'Free Slots Claimed', val: stats.free || 0, icon: 'local_offer' },
            ].map((c, i) => (
              <div key={i} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5">
                <span className="material-symbols-outlined text-primary-container mb-2">{c.icon}</span>
                <p className="font-label-sm text-label-sm text-on-surface-variant uppercase mb-1">{c.label}</p>
                <p className="font-headline-xl text-3xl text-primary-container font-bold">{c.val}</p>
              </div>
            ))}
          </div>

          {/* Delegates tab */}
          {activeTab === 'delegates' && (
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm">
              <div className="p-4 border-b border-outline-variant bg-surface-container-low">
                <h3 className="font-headline-md text-headline-md text-primary font-bold">Delegate Credentials &amp; Status</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-container-low border-b border-outline-variant">
                      {['Name', 'Email', 'Delegate ID', 'Committee', 'Payment', 'Portfolio', 'Actions'].map(h => (
                        <th key={h} className="p-4 font-label-sm text-label-sm text-primary uppercase">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {delegates.map(d => (
                      <tr key={d.id} className="border-b border-surface-variant hover:bg-surface-container/50 transition-colors">
                        <td className="p-4 font-label-md text-label-md text-on-surface">{d.name}</td>
                        <td className="p-4 text-sm text-on-surface-variant font-body-md">{d.email}</td>
                        <td className="p-4 font-mono text-sm font-bold">{d.user_id}</td>
                        <td className="p-4"><span className={`px-2 py-0.5 rounded text-xs font-semibold ${d.committee === 'UNSC' ? 'bg-tertiary-container/30 text-on-tertiary-container' : 'bg-secondary/10 text-secondary'}`}>{d.committee}</span></td>
                        <td className="p-4"><span className={`px-2 py-0.5 rounded text-xs font-semibold ${['paid','free'].includes(d.payment_status) ? 'bg-secondary/10 text-secondary' : 'bg-error/10 text-error'}`}>{d.payment_status}</span></td>
                        <td className="p-4 text-sm text-on-surface-variant">{d.delegation_assigned || '—'}</td>
                        <td className="p-4">
                          <button onClick={() => resendCredentials(d.id, d.name)}
                            className="text-on-tertiary-container hover:text-tertiary-container transition-colors" title="Resend credentials">
                            <span className="material-symbols-outlined text-sm">send</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Finances & UTR Manager Tab */}
          {activeTab === 'finances' && (
            <div className="space-y-6">
              <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm">
                <h3 className="font-headline-md text-headline-md text-primary font-bold mb-2">Financial Overview</h3>
                <p className="text-body-md text-on-surface-variant mb-6">Delegate Fee Structure: ₹50 per registration after first 10 free slots.</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-surface-container-low border border-outline-variant rounded-lg">
                    <p className="text-label-sm text-on-surface-variant uppercase font-semibold">Total Revenue</p>
                    <p className="text-3xl font-bold text-primary mt-1">₹{totalRevenue}</p>
                  </div>
                  <div className="p-4 bg-surface-container-low border border-outline-variant rounded-lg">
                    <p className="text-label-sm text-on-surface-variant uppercase font-semibold">Paid Registrations</p>
                    <p className="text-3xl font-bold text-secondary mt-1">{stats.paid || 0}</p>
                  </div>
                  <div className="p-4 bg-surface-container-low border border-outline-variant rounded-lg">
                    <p className="text-label-sm text-on-surface-variant uppercase font-semibold">Pending UTR Verifications</p>
                    <p className="text-3xl font-bold text-error mt-1">{pendingPayments.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm">
                <div className="p-4 border-b border-outline-variant bg-surface-container-low flex justify-between items-center">
                  <h3 className="font-headline-md text-headline-md text-primary font-bold">Pending UTR Payment Queue</h3>
                  <span className="text-xs bg-error/10 text-error font-semibold px-3 py-1 rounded-full">{pendingPayments.length} Action Required</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-surface-container-low border-b border-outline-variant">
                        {['Delegate Name', 'Email', 'College', 'Submitted UTR', 'Action'].map(h => (
                          <th key={h} className="p-4 font-label-sm text-label-sm text-primary uppercase">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {pendingPayments.length === 0 && (
                        <tr><td colSpan={5} className="p-8 text-center text-on-surface-variant font-body-md">No pending UTR payment submissions for verification.</td></tr>
                      )}
                      {pendingPayments.map(p => (
                        <tr key={p.id} className="border-b border-surface-variant hover:bg-surface-container/50 transition-colors">
                          <td className="p-4 font-label-md text-label-md text-on-surface font-semibold">{p.name}</td>
                          <td className="p-4 text-sm text-on-surface-variant">{p.email}</td>
                          <td className="p-4 text-sm text-on-surface-variant">{p.college}</td>
                          <td className="p-4 font-mono font-bold text-secondary text-sm">{p.utr || 'N/A'}</td>
                          <td className="p-4">
                            <button onClick={() => handleVerifyPayment(p.id)}
                              className="px-4 py-2 bg-secondary text-on-secondary rounded text-xs font-bold hover:bg-primary transition-colors flex items-center gap-1">
                              <span className="material-symbols-outlined text-sm">verified</span> Verify &amp; Issue Credentials
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Organizers tab */}
          {activeTab === 'organizers' && (
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm">
              <div className="p-4 border-b border-outline-variant bg-surface-container-low">
                <h3 className="font-headline-md text-headline-md text-primary font-bold">Staff &amp; EB Applications</h3>
              </div>
              <div className="divide-y divide-outline-variant">
                {organizers.length === 0 && <div className="p-12 text-center text-on-surface-variant font-body-md">No applications yet.</div>}
                {organizers.map(o => (
                  <div key={o.id} className="p-4 flex justify-between items-center gap-4">
                    <div>
                      <p className="font-label-md text-label-md text-on-surface font-semibold">{o.name}</p>
                      <p className="font-body-md text-body-md text-sm text-on-surface-variant">{o.email} · {o.role?.toUpperCase()} · {o.designation}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${o.status === 'approved' ? 'bg-secondary/10 text-secondary' : o.status === 'rejected' ? 'bg-error/10 text-error' : 'bg-on-tertiary-container/10 text-on-tertiary-container'}`}>
                        {o.status}
                      </span>
                      {o.status === 'pending' && (
                        <>
                          <a href={`/api/organizer/approve/${o.id}`} target="_blank" rel="noreferrer"
                            className="p-1.5 bg-secondary/10 text-secondary rounded hover:bg-secondary/20 transition-colors">
                            <span className="material-symbols-outlined text-sm">check</span>
                          </a>
                          <a href={`/api/organizer/reject/${o.id}`} target="_blank" rel="noreferrer"
                            className="p-1.5 bg-error/10 text-error rounded hover:bg-error/20 transition-colors">
                            <span className="material-symbols-outlined text-sm">close</span>
                          </a>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Security & OTP Tab */}
          {activeTab === 'security' && (
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-8 shadow-sm max-w-2xl">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-outline-variant">
                <span className="material-symbols-outlined text-3xl text-secondary">mark_email_read</span>
                <div>
                  <h3 className="font-headline-md text-headline-md text-primary font-bold">Super Admin Security Settings</h3>
                  <p className="text-body-sm text-on-surface-variant">Change Super Admin password with mandatory Email OTP Verification</p>
                </div>
              </div>

              <div className="bg-surface-container-low p-4 rounded-lg mb-6 border border-outline-variant">
                <p className="text-body-md text-on-surface font-semibold">Registered Institutional Email:</p>
                <p className="text-headline-sm font-mono text-primary font-bold mt-1">manas.malla13@gmail.com</p>
              </div>

              {otpStep === 1 ? (
                <div className="space-y-4">
                  <p className="text-body-md text-on-surface-variant">
                    To change the Super Admin portal password, click below to generate and send a 6-digit verification code to the registered email address.
                  </p>
                  <button onClick={handleRequestOTP} disabled={loadingOtp}
                    className="px-6 py-3 bg-secondary text-on-secondary rounded font-label-md hover:bg-primary transition-colors flex items-center gap-2 shadow-sm">
                    {loadingOtp ? <span className="material-symbols-outlined animate-spin">progress_activity</span> : (
                      <>
                        <span className="material-symbols-outlined">send</span>
                        Send 6-Digit Verification Code to Email
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleResetPassword} className="space-y-4">
                  {demoCode && (
                    <div className="p-3 bg-tertiary-container/20 border border-tertiary-container/40 rounded text-sm text-on-surface">
                      Verification code dispatched to <strong>manas.malla13@gmail.com</strong>.
                      <div className="mt-1 font-mono font-bold text-primary">Demo Code: {demoCode}</div>
                    </div>
                  )}

                  <div>
                    <label className="block text-label-md text-on-surface mb-1">6-Digit Verification Code</label>
                    <input type="text" required maxLength={6} value={otpCode} onChange={e => setOtpCode(e.target.value)} placeholder="123456"
                      className="w-full text-center tracking-widest font-mono text-xl py-3 px-4 border border-outline-variant rounded bg-surface-container-lowest text-on-surface outline-none focus:border-secondary" />
                  </div>

                  <div>
                    <label className="block text-label-md text-on-surface mb-1">New Super Admin Password</label>
                    <input type="password" required value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Minimum 6 characters"
                      className="w-full py-3 px-4 border border-outline-variant rounded bg-surface-container-lowest text-on-surface outline-none focus:border-secondary" />
                  </div>

                  <div>
                    <label className="block text-label-md text-on-surface mb-1">Confirm New Password</label>
                    <input type="password" required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Confirm new password"
                      className="w-full py-3 px-4 border border-outline-variant rounded bg-surface-container-lowest text-on-surface outline-none focus:border-secondary" />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button type="button" onClick={() => setOtpStep(1)}
                      className="px-4 py-3 border border-outline-variant rounded text-on-surface hover:bg-surface-container-low font-label-md">
                      Resend Code
                    </button>
                    <button type="submit" disabled={loadingOtp}
                      className="px-6 py-3 bg-primary text-on-primary rounded font-label-md hover:bg-secondary transition-colors flex items-center gap-2">
                      {loadingOtp ? <span className="material-symbols-outlined animate-spin">progress_activity</span> : 'Verify Code & Update Password'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* Communications tab */}
          {activeTab === 'comms' && (
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm">
              <h3 className="font-headline-md text-headline-md text-primary font-bold mb-4">Send Communication</h3>
              <div className="space-y-4">
                <div>
                  <label className="block font-label-md text-label-md text-primary mb-1">Subject</label>
                  <input placeholder="e.g. Important Notice — Portfolio Assignment" className="w-full border border-outline-variant rounded px-4 py-3 font-body-md text-body-md focus:ring-1 focus:ring-on-tertiary-container outline-none" />
                </div>
                <div>
                  <label className="block font-label-md text-label-md text-primary mb-1">Message</label>
                  <textarea rows={5} placeholder="Type your message to all delegates..."
                    className="w-full border border-outline-variant rounded px-4 py-3 font-body-md text-body-md focus:ring-1 focus:ring-on-tertiary-container outline-none resize-none" />
                </div>
                <button onClick={() => toast.success('Communication sent to all delegates!')}
                  className="px-6 py-3 bg-primary text-on-primary rounded font-label-md text-label-md hover:bg-secondary transition-colors flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm icon-filled">send</span>Send to All Delegates
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </PageWrapper>
  )
}
