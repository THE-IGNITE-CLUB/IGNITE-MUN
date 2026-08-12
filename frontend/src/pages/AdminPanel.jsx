import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import PageWrapper from '../components/PageWrapper'

export default function AdminPanel() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')
  const [stats, setStats] = useState({})
  const [delegates, setDelegates] = useState([])
  const [pendingPayments, setPendingPayments] = useState([])
  const [scores, setScores] = useState({})
  const [search, setSearch] = useState('')

  useEffect(() => {
    axios.get('/api/admin/stats').then(r => setStats(r.data)).catch(() => {})
    axios.get('/api/delegates').then(r => setDelegates(r.data)).catch(() => {})
    axios.get('/api/admin/pending-payments').then(r => setPendingPayments(r.data)).catch(() => {})
  }, [])

  const filtered = delegates.filter(d =>
    d.name?.toLowerCase().includes(search.toLowerCase()) ||
    d.college?.toLowerCase().includes(search.toLowerCase()) ||
    d.user_id?.toLowerCase().includes(search.toLowerCase())
  )

  const saveScore = async (delegateId, sessionId = 1) => {
    const s = scores[delegateId] || {}
    try {
      await axios.post('/api/admin/scores', { delegate_id: delegateId, session_id: sessionId, ...s })
      toast.success('Score saved!')
    } catch { toast.error('Failed to save score.') }
  }

  const verifyPayment = async (delegateId) => {
    try {
      await axios.post(`/api/payment/verify/${delegateId}`)
      toast.success('Payment verified! Credentials sent.')
      setPendingPayments(pp => pp.filter(p => p.id !== delegateId))
    } catch { toast.error('Failed to verify payment.') }
  }

  const assignDelegation = async (delegateId, delegation) => {
    if (!delegation.trim()) return
    try {
      await axios.post(`/api/delegates/${delegateId}/assign-delegation`, { delegation })
      toast.success(`Delegation "${delegation}" assigned!`)
    } catch { toast.error('Failed to assign delegation.') }
  }

  const navItems = [
    { id: 'overview', icon: 'dashboard', label: 'Overview' },
    { id: 'delegates', icon: 'people', label: 'Delegates' },
    { id: 'payments', icon: 'payments', label: 'Pending Payments' },
    { id: 'scoring', icon: 'grade', label: 'Scoring' },
    { id: 'export', icon: 'download', label: 'Export Data' },
  ]

  return (
    <PageWrapper className="!flex-row">
      {/* Sidebar */}
      <nav className="bg-primary-container h-screen w-64 shadow-lg flex flex-col z-50 py-6 fixed left-0 top-0 hidden md:flex">
        <div className="px-6 mb-8">
          <h1 className="font-headline-md text-headline-md text-on-primary">Admin Panel</h1>
          <p className="font-label-md text-label-md text-on-primary-container mt-1">IGNITE MUN 2026</p>
        </div>
        <div className="flex-1 px-4 flex flex-col gap-1">
          {navItems.map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg mx-2 my-1 font-label-md text-label-md w-full text-left transition-all ${activeTab === item.id ? 'bg-secondary text-on-secondary' : 'text-on-primary-container hover:bg-on-primary-fixed-variant/10'}`}>
              <span className={`material-symbols-outlined ${activeTab === item.id ? 'icon-filled' : ''}`}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>
        <div className="px-4 mt-auto">
          <button onClick={() => navigate('/')}
            className="flex items-center gap-3 px-4 py-3 text-on-primary-container hover:bg-on-primary-fixed-variant/10 rounded-lg mx-2 font-label-md text-label-md w-full">
            <span className="material-symbols-outlined">logout</span>Logout
          </button>
        </div>
      </nav>

      {/* Main */}
      <main className="flex-1 md:ml-64 min-h-screen bg-background overflow-y-auto">
        <div className="px-[16px] md:px-[48px] py-8 max-w-[1280px] mx-auto flex flex-col gap-[24px]">
          <header className="flex justify-between items-end border-b border-outline-variant pb-6">
            <div>
              <h2 className="font-headline-xl text-headline-xl text-primary mb-1">Admin Control Center</h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant">IGNITE MUN 2026 — Secretariat Dashboard</p>
            </div>
          </header>

          {/* Overview */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Total Delegates', val: stats.total_delegates || 0, icon: 'people', color: 'text-primary-container' },
                { label: 'Free Slots Used', val: stats.free || 0, icon: 'local_offer', color: 'text-secondary' },
                { label: 'Paid Delegates', val: stats.paid || 0, icon: 'payments', color: 'text-on-tertiary-container' },
                { label: 'Pending Verification', val: stats.pending_verification || 0, icon: 'hourglass_top', color: 'text-error' },
              ].map((c, i) => (
                <div key={i} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 institutional-shadow">
                  <span className={`material-symbols-outlined ${c.color} mb-2`}>{c.icon}</span>
                  <p className="font-label-sm text-label-sm text-on-surface-variant uppercase mb-1">{c.label}</p>
                  <p className={`font-headline-xl text-headline-xl ${c.color} text-3xl`}>{c.val}</p>
                </div>
              ))}
            </div>
          )}

          {/* Delegates */}
          {activeTab === 'delegates' && (
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden institutional-shadow">
              <div className="flex items-center justify-between p-4 border-b border-outline-variant bg-surface-container-low">
                <h3 className="font-headline-md text-headline-md text-primary-container">All Delegates ({delegates.length})</h3>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">search</span>
                  <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..."
                    className="pl-9 pr-4 py-2 bg-surface-container-lowest border border-outline-variant rounded text-sm font-body-md focus:ring-1 focus:ring-on-tertiary-container outline-none" />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-container-low border-b border-outline-variant">
                      {['Name', 'College', 'Committee', 'Delegate ID', 'Payment', 'Portfolio', 'Action'].map(h => (
                        <th key={h} className="p-4 font-label-sm text-label-sm text-primary-container uppercase">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(d => (
                      <tr key={d.id} className="border-b border-surface-variant hover:bg-surface-container/50 transition-colors">
                        <td className="p-4 font-label-md text-label-md text-on-surface">{d.name}</td>
                        <td className="p-4 font-body-md text-body-md text-on-surface-variant text-sm">{d.college}</td>
                        <td className="p-4"><span className={`px-2 py-0.5 rounded text-xs font-semibold ${d.committee === 'UNSC' ? 'bg-tertiary-container text-on-tertiary-container' : 'bg-secondary-container text-on-secondary-container'}`}>{d.committee}</span></td>
                        <td className="p-4 font-mono text-sm text-on-surface">{d.user_id}</td>
                        <td className="p-4"><span className={`px-2 py-0.5 rounded text-xs font-semibold ${d.payment_status === 'paid' || d.payment_status === 'free' ? 'bg-secondary/10 text-secondary' : 'bg-error/10 text-error'}`}>{d.payment_status}</span></td>
                        <td className="p-4 text-sm text-on-surface-variant">{d.delegation_assigned || '—'}</td>
                        <td className="p-4">
                          <button onClick={() => {
                            const del = prompt(`Assign delegation to ${d.name}:`)
                            if (del) assignDelegation(d.id, del)
                          }} className="text-on-tertiary-container hover:text-tertiary-container transition-colors" title="Assign delegation">
                            <span className="material-symbols-outlined text-sm">how_to_vote</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filtered.length === 0 && (
                  <div className="p-12 text-center text-on-surface-variant font-body-md">No delegates found.</div>
                )}
              </div>
            </div>
          )}

          {/* Pending Payments */}
          {activeTab === 'payments' && (
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden institutional-shadow">
              <div className="p-4 border-b border-outline-variant bg-surface-container-low">
                <h3 className="font-headline-md text-headline-md text-primary-container">Pending Payment Verifications ({pendingPayments.length})</h3>
              </div>
              {pendingPayments.length === 0 ? (
                <div className="p-12 text-center text-on-surface-variant font-body-md">No pending verifications.</div>
              ) : (
                <div className="divide-y divide-outline-variant">
                  {pendingPayments.map(p => (
                    <div key={p.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <p className="font-label-md text-label-md text-on-surface">{p.name}</p>
                        <p className="font-body-md text-body-md text-sm text-on-surface-variant">{p.college} · {p.email}</p>
                        <p className="font-body-md text-body-md text-sm mt-1">UTR: <span className="font-mono text-on-surface">{p.utr}</span></p>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <button onClick={() => verifyPayment(p.id)}
                          className="px-4 py-2 bg-secondary text-on-secondary rounded font-label-md text-label-md hover:bg-secondary/90 transition-colors flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm icon-filled">check_circle</span>Verify
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Scoring */}
          {activeTab === 'scoring' && (
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden institutional-shadow">
              <div className="p-4 border-b border-outline-variant bg-surface-container-low">
                <h3 className="font-headline-md text-headline-md text-primary-container">Delegate Scoring Matrix</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-container-low border-b border-outline-variant">
                      {['Delegate / Portfolio', 'Decorum', 'Policy', 'Resolution', 'Oratory', 'Save'].map(h => (
                        <th key={h} className="p-4 font-label-sm text-label-sm text-primary-container uppercase text-center first:text-left">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {delegates.filter(d => d.payment_status === 'paid' || d.payment_status === 'free').map(d => (
                      <tr key={d.id} className="border-b border-surface-variant hover:bg-surface-container/50 transition-colors">
                        <td className="p-4">
                          <p className="font-label-md text-label-md text-on-surface">{d.name}</p>
                          <p className="font-label-sm text-label-sm text-on-surface-variant">{d.delegation_assigned || d.committee}</p>
                        </td>
                        {['decorum', 'policy', 'resolution', 'oratory'].map(field => (
                          <td key={field} className="p-4 text-center">
                            <input type="number" min={0} max={10} step={0.5}
                              value={scores[d.id]?.[field] ?? ''}
                              onChange={e => setScores(prev => ({ ...prev, [d.id]: { ...prev[d.id], [field]: e.target.value } }))}
                              className="w-16 bg-transparent border-b border-outline-variant focus:border-on-tertiary-container focus:ring-0 p-1 text-center font-body-md outline-none" />
                          </td>
                        ))}
                        <td className="p-4 text-center">
                          <button onClick={() => saveScore(d.id)} className="text-on-tertiary-container hover:text-tertiary-container transition-colors">
                            <span className="material-symbols-outlined">save</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Export */}
          {activeTab === 'export' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: 'Delegate List (Excel)', icon: 'table_chart', desc: 'All delegate details in .xlsx format', href: '/api/export/delegates.xlsx', color: 'bg-secondary/10 text-secondary border-secondary/20' },
                { label: 'Scores (Excel)', icon: 'grade', desc: 'All delegate scores per session', href: '/api/export/scores.xlsx', color: 'bg-on-tertiary-container/10 text-on-tertiary-container border-on-tertiary-container/20' },
                { label: 'Delegate List (PDF)', icon: 'picture_as_pdf', desc: 'Formatted registry for printing', href: '/api/export/delegates.pdf', color: 'bg-error/10 text-error border-error/20' },
              ].map((e, i) => (
                <a key={i} href={e.href} target="_blank" rel="noreferrer"
                  className={`flex flex-col p-6 bg-surface-container-lowest border rounded-xl institutional-shadow hover:-translate-y-1 transition-all ${e.color}`}>
                  <span className="material-symbols-outlined text-3xl mb-3">{e.icon}</span>
                  <h3 className="font-headline-md text-headline-md mb-1">{e.label}</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant text-sm">{e.desc}</p>
                  <div className="mt-4 flex items-center gap-1 font-label-md text-label-md">
                    <span className="material-symbols-outlined text-sm">download</span>Download
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </main>
    </PageWrapper>
  )
}
