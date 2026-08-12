import { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import PageWrapper from '../components/PageWrapper'

export default function SuperAdminPanel() {
  const [delegates, setDelegates] = useState([])
  const [organizers, setOrganizers] = useState([])
  const [stats, setStats] = useState({})
  const [activeTab, setActiveTab] = useState('delegates')

  useEffect(() => {
    axios.get('/api/delegates').then(r => setDelegates(r.data)).catch(() => {})
    axios.get('/api/organizers').then(r => setOrganizers(r.data)).catch(() => {})
    axios.get('/api/admin/stats').then(r => setStats(r.data)).catch(() => {})
  }, [])

  const resendCredentials = (id, name) => toast.success(`Credentials resent to ${name}.`)

  return (
    <PageWrapper className="!flex-row">
      <nav className="bg-primary-container h-screen w-64 shadow-lg flex flex-col z-50 py-6 fixed left-0 top-0 hidden md:flex">
        <div className="px-6 mb-8">
          <h1 className="font-headline-md text-headline-md text-on-primary">Super Admin</h1>
          <p className="font-label-md text-label-md text-on-primary-container mt-1">IGNITE MUN 2026</p>
        </div>
        <div className="flex-1 px-4 flex flex-col gap-1">
          {[
            { id: 'delegates', icon: 'people', label: 'Delegates' },
            { id: 'organizers', icon: 'manage_accounts', label: 'Staff/EB' },
            { id: 'comms', icon: 'send', label: 'Communications' },
          ].map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg mx-2 my-1 font-label-md text-label-md w-full text-left transition-all ${activeTab === item.id ? 'bg-secondary text-on-secondary' : 'text-on-primary-container hover:bg-on-primary-fixed-variant/10'}`}>
              <span className={`material-symbols-outlined ${activeTab === item.id ? 'icon-filled' : ''}`}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>
        <div className="px-4 mt-auto flex flex-col gap-3">
          <a href="/api/export/delegates.xlsx" target="_blank"
            className="w-[calc(100%-1rem)] mx-2 bg-primary-container border border-outline text-on-primary-container font-label-md text-label-md py-2 rounded flex justify-center items-center gap-2 hover:bg-surface-variant transition-colors">
            <span className="material-symbols-outlined text-sm">download</span>Export Excel
          </a>
          <a href="/api/export/delegates.pdf" target="_blank"
            className="w-[calc(100%-1rem)] mx-2 bg-primary-container border border-outline text-on-primary-container font-label-md text-label-md py-2 rounded flex justify-center items-center gap-2 hover:bg-surface-variant transition-colors">
            <span className="material-symbols-outlined text-sm">picture_as_pdf</span>Export PDF
          </a>
        </div>
      </nav>

      <main className="flex-1 md:ml-64 min-h-screen bg-background overflow-y-auto">
        <div className="px-[16px] md:px-[48px] py-8 max-w-[1280px] mx-auto flex flex-col gap-[24px]">
          <header className="flex justify-between items-end border-b border-outline-variant pb-6">
            <div>
              <h2 className="font-headline-xl text-headline-xl text-primary mb-1">Super Admin Command</h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant">Full control over credentialing &amp; communications</p>
            </div>
          </header>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Delegates', val: stats.total_delegates || 0, icon: 'people' },
              { label: 'Staff/EB', val: organizers.length, icon: 'manage_accounts' },
              { label: 'Paid', val: stats.paid || 0, icon: 'payments' },
              { label: 'Free', val: stats.free || 0, icon: 'local_offer' },
            ].map((c, i) => (
              <div key={i} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5">
                <span className="material-symbols-outlined text-primary-container mb-2">{c.icon}</span>
                <p className="font-label-sm text-label-sm text-on-surface-variant uppercase mb-1">{c.label}</p>
                <p className="font-headline-xl text-3xl text-primary-container">{c.val}</p>
              </div>
            ))}
          </div>

          {/* Delegates tab */}
          {activeTab === 'delegates' && (
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden">
              <div className="p-4 border-b border-outline-variant bg-surface-container-low">
                <h3 className="font-headline-md text-headline-md text-primary-container">Delegate Credentials &amp; Status</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-container-low border-b border-outline-variant">
                      {['Name', 'Email', 'Delegate ID', 'Committee', 'Payment', 'Portfolio', 'Actions'].map(h => (
                        <th key={h} className="p-4 font-label-sm text-label-sm text-primary-container uppercase">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {delegates.map(d => (
                      <tr key={d.id} className="border-b border-surface-variant hover:bg-surface-container/50 transition-colors">
                        <td className="p-4 font-label-md text-label-md text-on-surface">{d.name}</td>
                        <td className="p-4 text-sm text-on-surface-variant font-body-md">{d.email}</td>
                        <td className="p-4 font-mono text-sm">{d.user_id}</td>
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

          {/* Organizers tab */}
          {activeTab === 'organizers' && (
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden">
              <div className="p-4 border-b border-outline-variant bg-surface-container-low">
                <h3 className="font-headline-md text-headline-md text-primary-container">Staff &amp; EB Applications</h3>
              </div>
              <div className="divide-y divide-outline-variant">
                {organizers.length === 0 && <div className="p-12 text-center text-on-surface-variant font-body-md">No applications yet.</div>}
                {organizers.map(o => (
                  <div key={o.id} className="p-4 flex justify-between items-center gap-4">
                    <div>
                      <p className="font-label-md text-label-md text-on-surface">{o.name}</p>
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

          {/* Communications tab */}
          {activeTab === 'comms' && (
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6">
              <h3 className="font-headline-md text-headline-md text-primary-container mb-4">Send Communication</h3>
              <div className="space-y-4">
                <div>
                  <label className="block font-label-md text-label-md text-primary-container mb-1">Subject</label>
                  <input placeholder="e.g. Important Notice — Portfolio Assignment" className="w-full border border-outline-variant rounded px-4 py-3 font-body-md text-body-md focus:ring-1 focus:ring-on-tertiary-container outline-none" />
                </div>
                <div>
                  <label className="block font-label-md text-label-md text-primary-container mb-1">Message</label>
                  <textarea rows={5} placeholder="Type your message to all delegates..."
                    className="w-full border border-outline-variant rounded px-4 py-3 font-body-md text-body-md focus:ring-1 focus:ring-on-tertiary-container outline-none resize-none" />
                </div>
                <button onClick={() => toast.success('Communication sent to all delegates!')}
                  className="px-6 py-3 bg-primary-container text-on-primary rounded font-label-md text-label-md hover:bg-tertiary-container transition-colors flex items-center gap-2">
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
