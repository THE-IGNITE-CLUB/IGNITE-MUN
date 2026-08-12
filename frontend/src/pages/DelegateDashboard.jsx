import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import PageWrapper from '../components/PageWrapper'

export default function DelegateDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)

  if (!user) { navigate('/login'); return null }

  const handleLogout = async () => { await logout(); navigate('/') }

  const navItems = [
    { id: 'dashboard', icon: 'dashboard', label: 'Dashboard' },
    { id: 'assignment', icon: 'assignment', label: 'My Assignment' },
    { id: 'resources', icon: 'library_books', label: 'Background Guide' },
    { id: 'position_paper', icon: 'upload_file', label: 'Position Paper' },
    { id: 'messages', icon: 'chat_bubble', label: 'Messages' },
  ]

  const backgrounds = {
    UNSC: {
      title: 'Iran–Israel Escalation & Regional Stability',
      subtitle: 'UNSC Background Paper',
      color: 'bg-tertiary-container',
      points: [
        'Iran\'s nuclear enrichment programme exceeding JCPOA limits',
        'Israeli military strikes on Iranian proxies in Syria and Lebanon',
        'Houthi missile threats disrupting Red Sea shipping lanes',
        'Risk of full-scale regional war and UNSC P5 paralysis',
        'Potential triggers for Article 51 self-defence claims',
      ],
    },
    LOK_SABHA: {
      title: 'NEET-UG 2024 Paper Leak & Higher Education Reform',
      subtitle: 'Lok Sabha Background Paper',
      color: 'bg-secondary-container',
      points: [
        'Systemic failure in NTA examination security protocols',
        'Impact on 2.3 million aspirants and medical seat allocation',
        'Demand for scrapping NTA and creating an independent body',
        'Criminal liability of paper leak kingpins under new laws',
        'Proposed National Testing Framework and digital proctoring',
      ],
    },
  }

  const bg = backgrounds[user.committee] || backgrounds.UNSC

  return (
    <PageWrapper className="!flex-row">
      {/* Sidebar */}
      <nav className="bg-primary-container h-screen w-64 shadow-lg flex flex-col z-50 py-6 fixed left-0 top-0 hidden md:flex">
        <div className="px-6 mb-8 flex flex-col items-start gap-4">
          <div className="h-12 w-12 rounded-full bg-surface-container-low flex items-center justify-center overflow-hidden border border-outline-variant">
            <span className="material-symbols-outlined text-on-primary-container text-2xl">person</span>
          </div>
          <div>
            <h1 className="font-headline-md text-headline-md text-on-primary">{user.name?.split(' ')[0] || 'Delegate'}</h1>
            <p className="font-label-md text-label-md text-on-primary-container mt-1">{user.user_id}</p>
            <span className={`mt-1 inline-block px-2 py-0.5 rounded text-xs font-semibold ${user.committee === 'UNSC' ? 'bg-tertiary-container text-on-tertiary-container' : 'bg-secondary-container text-on-secondary-container'}`}>
              {user.committee}
            </span>
          </div>
        </div>

        <div className="flex-1 px-4 flex flex-col gap-1 overflow-y-auto">
          {navItems.map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg mx-2 my-1 transition-all duration-300 font-label-md text-label-md w-full text-left ${activeTab === item.id ? 'bg-secondary text-on-secondary' : 'text-on-primary-container hover:bg-on-primary-fixed-variant/10'}`}>
              <span className={`material-symbols-outlined ${activeTab === item.id ? 'icon-filled' : ''}`}>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        <div className="px-4 mt-auto flex flex-col gap-1">
          <button onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 text-on-primary-container hover:bg-on-primary-fixed-variant/10 rounded-lg mx-2 my-1 transition-all font-label-md text-label-md w-full">
            <span className="material-symbols-outlined">logout</span>
            <span>Logout</span>
          </button>
        </div>
      </nav>

      {/* Main */}
      <main className="flex-1 md:ml-64 min-h-screen overflow-y-auto bg-background">
        <div className="px-[16px] md:px-[48px] py-8 max-w-[1280px] mx-auto flex flex-col gap-[24px]">

          {/* Header */}
          <header className="flex justify-between items-end border-b border-outline-variant pb-6">
            <div>
              <h2 className="font-headline-xl text-headline-xl text-primary mb-2">Welcome, {user.name?.split(' ')[0]}!</h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant">IGNITE MUN 2026 — {user.committee} · Delegate Dashboard</p>
            </div>
            <span className="flex items-center gap-2 bg-secondary/10 text-secondary px-4 py-2 rounded-full font-label-sm text-label-sm border border-secondary/20">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
              {user.delegation_assigned ? `Portfolio: ${user.delegation_assigned}` : 'Awaiting Portfolio'}
            </span>
          </header>

          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-[24px]">
              {/* Status cards */}
              <div className="md:col-span-12 grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: 'badge', label: 'Delegate ID', value: user.user_id || '—', color: 'text-primary-container' },
                  { icon: 'account_balance', label: 'Committee', value: user.committee || '—', color: 'text-secondary' },
                  { icon: 'how_to_vote', label: 'Portfolio', value: user.delegation_assigned || 'Pending', color: 'text-on-tertiary-container' },
                  { icon: 'payments', label: 'Payment', value: user.payment_status === 'free' ? 'Free' : user.payment_status === 'paid' ? 'Paid ✓' : 'Pending', color: user.payment_status === 'free' || user.payment_status === 'paid' ? 'text-secondary' : 'text-error' },
                ].map((card, i) => (
                  <div key={i} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 institutional-shadow">
                    <span className={`material-symbols-outlined ${card.color} mb-2`}>{card.icon}</span>
                    <p className="font-label-sm text-label-sm text-on-surface-variant uppercase mb-1">{card.label}</p>
                    <p className={`font-headline-md text-headline-md ${card.color} text-lg`}>{card.value}</p>
                  </div>
                ))}
              </div>

              {/* Background brief */}
              <div className={`md:col-span-7 ${bg.color} rounded-xl p-6 border border-outline-variant/30`}>
                <div className="flex items-center gap-2 mb-4">
                  <span className="material-symbols-outlined text-primary-container">article</span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">{bg.subtitle}</span>
                </div>
                <h3 className="font-headline-md text-headline-md text-primary-container mb-4">{bg.title}</h3>
                <ul className="space-y-2">
                  {bg.points.map((p, i) => (
                    <li key={i} className="flex items-start gap-2 font-body-md text-body-md text-on-surface-variant text-sm">
                      <span className="material-symbols-outlined text-sm mt-0.5 text-secondary flex-shrink-0">chevron_right</span>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Quick actions */}
              <div className="md:col-span-5 bg-surface-container-lowest border border-outline-variant rounded-xl p-6 institutional-shadow flex flex-col gap-3">
                <h3 className="font-headline-md text-headline-md text-primary-container mb-2">Quick Actions</h3>
                {[
                  { label: 'Upload Position Paper', icon: 'upload_file', action: () => setActiveTab('position_paper'), primary: true },
                  { label: 'Read Background Guide', icon: 'library_books', action: () => setActiveTab('resources'), primary: false },
                  { label: 'View My Assignment', icon: 'assignment', action: () => setActiveTab('assignment'), primary: false },
                ].map((btn, i) => (
                  <button key={i} onClick={btn.action}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-label-md text-label-md transition-colors ${btn.primary ? 'bg-primary-container text-on-primary hover:bg-tertiary-container' : 'bg-surface-container border border-outline-variant text-on-surface hover:bg-surface-container-high'}`}>
                    <span className={`material-symbols-outlined ${btn.primary ? '' : 'text-on-surface-variant'}`}>{btn.icon}</span>
                    {btn.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Position Paper Upload Tab */}
          {activeTab === 'position_paper' && (
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-8 institutional-shadow">
              <h3 className="font-headline-md text-headline-md text-primary-container mb-2">Position Paper Submission</h3>
              <p className="font-body-md text-body-md text-on-surface-variant mb-6">Upload your position paper in PDF or DOCX format (max 5MB). Deadline: November 25, 2026.</p>
              <label className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${file ? 'border-secondary bg-secondary/5' : 'border-outline-variant hover:border-secondary hover:bg-secondary/5'}`}>
                <input type="file" accept=".pdf,.docx,.doc" className="hidden" onChange={e => setFile(e.target.files[0])} />
                <span className={`material-symbols-outlined text-4xl mb-3 ${file ? 'text-secondary' : 'text-on-surface-variant'}`}>
                  {file ? 'check_circle' : 'cloud_upload'}
                </span>
                <p className="font-label-md text-label-md text-on-surface-variant">
                  {file ? file.name : 'Click to upload or drag & drop'}
                </p>
                <p className="font-body-md text-body-md text-sm text-on-surface-variant mt-1">PDF, DOCX — max 5 MB</p>
              </label>
              {file && (
                <button onClick={() => { toast.success(`"${file.name}" submitted successfully!`); setFile(null) }}
                  className="mt-4 w-full bg-primary-container text-on-primary py-3 rounded font-label-md text-label-md hover:bg-tertiary-container transition-colors flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined icon-filled">upload</span>
                  Submit Position Paper
                </button>
              )}
            </div>
          )}

          {/* Background Guide Tab */}
          {activeTab === 'resources' && (
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-8 institutional-shadow">
              <h3 className="font-headline-md text-headline-md text-primary-container mb-6">Background Guide — {user.committee}</h3>
              <div className="space-y-4">
                {bg.points.map((p, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 bg-surface-container rounded-lg border border-outline-variant/50">
                    <div className="w-8 h-8 rounded bg-primary-container text-on-primary flex items-center justify-center flex-shrink-0 font-label-md text-label-md">{i+1}</div>
                    <p className="font-body-md text-body-md text-on-surface-variant">{p}</p>
                  </div>
                ))}
                <a href="/api/export/delegates.pdf" target="_blank"
                  className="inline-flex items-center gap-2 mt-4 px-6 py-3 bg-primary-container text-on-primary rounded font-label-md text-label-md hover:bg-tertiary-container transition-colors">
                  <span className="material-symbols-outlined">download</span>
                  Download Full Background Guide (PDF)
                </a>
              </div>
            </div>
          )}

          {/* Assignment Tab */}
          {activeTab === 'assignment' && (
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-8 institutional-shadow text-center">
              {user.delegation_assigned ? (
                <>
                  <div className="w-20 h-20 rounded-full bg-secondary mx-auto flex items-center justify-center mb-6">
                    <span className="material-symbols-outlined text-on-secondary text-4xl icon-filled">how_to_vote</span>
                  </div>
                  <h3 className="font-headline-md text-headline-md text-primary-container mb-2">Your Portfolio</h3>
                  <p className="font-headline-xl text-headline-xl text-secondary my-4">{user.delegation_assigned}</p>
                  <p className="font-body-md text-body-md text-on-surface-variant">Committee: <strong>{user.committee}</strong></p>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-5xl text-on-surface-variant mb-4">hourglass_top</span>
                  <h3 className="font-headline-md text-headline-md text-primary-container mb-2">Portfolio Pending</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant">Your portfolio will be assigned by the secretariat and emailed to you before the conference.</p>
                </>
              )}
            </div>
          )}

          {/* Messages Tab */}
          {activeTab === 'messages' && (
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-8 institutional-shadow text-center">
              <span className="material-symbols-outlined text-5xl text-on-surface-variant mb-4">mark_email_unread</span>
              <h3 className="font-headline-md text-headline-md text-primary-container mb-2">No New Messages</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">Official secretariat communications will appear here.</p>
            </div>
          )}
        </div>
      </main>
    </PageWrapper>
  )
}
