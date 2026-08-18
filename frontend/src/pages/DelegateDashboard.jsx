import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../utils/api'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import PageWrapper from '../components/PageWrapper'

export default function DelegateDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [file, setFile] = useState(null)
  const [activeSession, setActiveSession] = useState(null)
  const [showReceiptModal, setShowReceiptModal] = useState(false)

  // Query & Secretariat Support state
  const [queries, setQueries] = useState([])
  const [querySubject, setQuerySubject] = useState('')
  const [queryQuestion, setQueryQuestion] = useState('')
  const [submittingQuery, setSubmittingQuery] = useState(false)

  if (!user) { navigate('/login'); return null }

  const handleLogout = async () => { await logout(); navigate('/') }

  const loadQueries = () => {
    if (user && user.id) {
      api.get(`/api/queries/delegate/${user.id}`).then(r => setQueries(r.data)).catch(() => {})
    }
  }

  const loadActiveSession = () => {
    if (user && user.committee) {
      api.get(`/api/admin/active-session?committee=${user.committee}`).then(r => setActiveSession(r.data)).catch(() => {})
    }
  }

  useEffect(() => {
    loadQueries()
    loadActiveSession()
    const interval = setInterval(loadActiveSession, 5000)
    return () => clearInterval(interval)
  }, [user])

  const handleCreateQuery = async (e) => {
    e.preventDefault()
    if (!queryQuestion.trim()) {
      toast.error('Question cannot be empty.')
      return
    }
    setSubmittingQuery(true)
    try {
      const res = await api.post('/api/queries/create', {
        delegate_id: user.id,
        subject: querySubject || 'General Secretariat Inquiry',
        question: queryQuestion
      })
      toast.success(res.data.message || 'Query submitted to the Secretariat!')
      setQuerySubject('')
      setQueryQuestion('')
      loadQueries()
    } catch {
      toast.error('Failed to submit query.')
    } finally {
      setSubmittingQuery(false)
    }
  }

  const navItems = [
    { id: 'dashboard', icon: 'dashboard', label: 'Dashboard' },
    { id: 'assignment', icon: 'assignment', label: 'My Assignment' },
    { id: 'queries', icon: 'question_answer', label: 'Ask Secretariat' },
    { id: 'resources', icon: 'library_books', label: 'Background Guide' },
    { id: 'position_paper', icon: 'upload_file', label: 'Position Paper' },
  ]

  const backgrounds = {
    UNSC: {
      title: 'Iran–Israel Escalation & Regional Stability',
      subtitle: 'UNSC Background Paper',
      color: 'bg-surface-container-lowest',
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
      color: 'bg-surface-container-lowest',
      points: [
        'Systemic failure in NTA examination security protocols',
        'Impact on 2.3 million aspirants and medical seat allocation',
        'Demand for scrapping NTA and creating an independent body',
        'Criminal liability of paper leak kingpins under new laws',
        'Proposed National Testing Framework and digital proctoring',
      ],
    },
    INTERNATIONAL_PRESS: {
      title: 'Media Ethics, Crisis Reporting, and Press Freedom in Conflict Zones',
      subtitle: 'International Press Background Paper',
      color: 'bg-surface-container-lowest',
      points: [
        'Journalistic verification protocols in fast-moving crisis reporting',
        'Ethical boundaries in photojournalism and political caricature',
        'Combatting state disinformation and AI-generated synthetic media',
        'Protection of press corps delegates in hostile environment zones',
        'Standards for editorial dispatches and live conference reporting',
      ],
    },
  }

  const bg = backgrounds[user.committee] || backgrounds.UNSC

  const downloadBackgroundGuidePDF = () => {
    const committeeName = user.committee || 'UNSC'
    const bgData = backgrounds[committeeName] || backgrounds.UNSC
    const printWindow = window.open('', '_blank')
    if (!printWindow) {
      toast.error('Pop-up blocked. Please allow pop-ups to download PDF.')
      return
    }
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>IGNITE MUN 2026 — Background Guide (${committeeName})</title>
        <style>
          body { font-family: 'Georgia', 'Times New Roman', serif; margin: 40px; color: #111; line-height: 1.6; }
          .header { text-align: center; border-bottom: 3px double #111; padding-bottom: 16px; margin-bottom: 24px; }
          .header h1 { margin: 0; font-size: 26px; text-transform: uppercase; letter-spacing: 1px; }
          .header p { margin: 4px 0 0; font-size: 13px; font-weight: bold; color: #444; }
          .meta { display: flex; justify-content: space-between; font-size: 13px; font-style: italic; border-bottom: 1px solid #ccc; padding-bottom: 8px; margin-bottom: 24px; }
          .section-title { font-size: 16px; font-weight: bold; margin-top: 24px; margin-bottom: 10px; color: #000; border-bottom: 1px solid #000; text-transform: uppercase; }
          .point { margin-bottom: 14px; font-size: 14px; background: #f9f9f9; padding: 10px 14px; border-left: 4px solid #111; }
          .footer { margin-top: 50px; text-align: center; font-size: 11px; color: #666; border-top: 1px solid #ddd; pt: 12px; }
          @media print {
            body { margin: 20px; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>IGNITE MUN 2026</h1>
          <p>OFFICIAL BACKGROUND GUIDE & CONFERENCE DOSSIER</p>
          <p>Sri Venkateswara University College of Engineering (SVUCE), Tirupati</p>
        </div>

        <div class="meta">
          <span>Committee: <strong>${committeeName}</strong></span>
          <span>Conference Year: <strong>2026</strong></span>
        </div>

        <h2 style="font-size: 20px; margin-bottom: 4px;">${bgData.title}</h2>
        <p style="font-size: 13px; color: #444; font-weight: bold; margin-top: 0;">${bgData.subtitle}</p>

        <div class="section-title">I. Executive Summary &amp; Agenda Overview</div>
        <p style="font-size: 14px;">This official background guide serves as the primary research dossier for delegates allotted to ${committeeName} at IGNITE MUN 2026. Delegates are instructed to review historical precedents, institutional mandates, and foreign policy directives outlined in this document before drafting Position Papers.</p>

        <div class="section-title">II. Key Points of Debate &amp; Research Mandate</div>
        ${bgData.points.map((p, i) => `<div class="point"><strong>Topic ${i+1}:</strong> ${p}</div>`).join('')}

        <div class="section-title">III. Position Paper Guidelines</div>
        <p style="font-size: 14px;">All delegates must submit a 1 to 2 page Position Paper covering: (1) Foreign Policy Stance &amp; Precedents, (2) UN / Parliamentary Measures &amp; Debates, and (3) Actionable Resolution Clauses &amp; Directives.</p>

        <div class="footer">
          <p>© IGNITE MUN 2026 Secretariat · SVUCE Campus, Tirupati · Official Conference Guide</p>
        </div>

        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 300);
          }
        </script>
      </body>
      </html>
    `)
    printWindow.document.close()
  }

  return (
    <PageWrapper className="!flex-row">
      {/* Sidebar */}
      <nav className="bg-primary-container h-screen w-64 shadow-lg flex flex-col z-50 py-6 fixed left-0 top-0 hidden md:flex">
        <div className="px-6 mb-8 flex flex-col items-start gap-4">
          <div className="h-12 w-12 rounded-full bg-surface-container-low flex items-center justify-center overflow-hidden border border-outline-variant">
            <span className="material-symbols-outlined text-on-primary-container text-2xl">person</span>
          </div>
          <div>
            <h1 className="font-headline-md text-headline-md text-on-primary font-bold">{user.name?.split(' ')[0] || 'Delegate'}</h1>
            <p className="font-label-md text-label-md text-on-primary-container mt-1 font-mono">{user.user_id}</p>
            <span className={`mt-1 inline-block px-2.5 py-0.5 rounded text-xs font-semibold ${user.committee === 'UNSC' ? 'bg-tertiary-container text-on-tertiary-container' : 'bg-secondary/20 text-on-primary'}`}>
              {user.committee}
            </span>
          </div>
        </div>

        <div className="flex-1 px-4 flex flex-col gap-1 overflow-y-auto">
          {navItems.map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg mx-2 my-1 transition-all duration-300 font-label-md text-label-md w-full text-left ${activeTab === item.id ? 'bg-secondary text-on-secondary font-bold' : 'text-on-primary-container hover:bg-on-primary-fixed-variant/10'}`}>
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
              <h2 className="font-headline-xl text-headline-xl text-primary font-bold mb-2">Welcome, {user.name?.split(' ')[0]}!</h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant">IGNITE MUN 2026 — {user.committee} · Delegate Dashboard</p>
            </div>
            <span className="flex items-center gap-2 bg-secondary/10 text-secondary px-4 py-2 rounded-full font-label-sm text-label-sm border border-secondary/20 font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse" />
              {user.delegation_assigned ? `Portfolio: ${user.delegation_assigned}` : 'Awaiting Portfolio'}
            </span>
          </header>

          {/* Live Parliamentary Caucus Broadcast Banner */}
          {activeSession && (
            <div className="bg-primary text-on-primary p-4 rounded-xl shadow-md border border-secondary flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-secondary text-3xl animate-bounce">campaign</span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-secondary text-on-secondary uppercase">{activeSession.session_type}</span>
                    <span className="text-xs opacity-80">{user.committee} Live Caucus Broadcast</span>
                  </div>
                  <h4 className="font-bold text-lg mt-0.5">{activeSession.topic || 'General Debate & Speaker List'}</h4>
                  {activeSession.broadcast_message && (
                    <p className="text-sm opacity-90 mt-1 font-body-md">📢 {activeSession.broadcast_message}</p>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs opacity-75 uppercase">Speaking Time</div>
                <div className="text-2xl font-bold font-mono text-secondary">{activeSession.speaking_time}s</div>
              </div>
            </div>
          )}

          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-[24px]">
              {/* Status cards */}
              <div className="md:col-span-12 grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: 'badge', label: 'Delegate ID', value: user.user_id || '—', color: 'text-primary' },
                  { icon: 'account_balance', label: 'Committee', value: user.committee || '—', color: 'text-secondary' },
                  { icon: 'how_to_vote', label: 'Portfolio', value: user.delegation_assigned || 'Pending', color: 'text-primary' },
                  { icon: 'payments', label: 'Payment Status', value: user.payment_status === 'free' ? 'Free Slot' : user.payment_status === 'paid' ? 'Paid ✓' : 'Pending', color: user.payment_status === 'free' || user.payment_status === 'paid' ? 'text-secondary' : 'text-error' },
                ].map((card, i) => (
                  <div key={i} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 shadow-sm">
                    <span className={`material-symbols-outlined ${card.color} mb-2`}>{card.icon}</span>
                    <p className="font-label-sm text-label-sm text-on-surface-variant uppercase mb-1">{card.label}</p>
                    <p className={`font-headline-md text-headline-md ${card.color} text-lg font-bold`}>{card.value}</p>
                  </div>
                ))}
              </div>

              {/* Background brief */}
              <div className={`md:col-span-7 bg-surface-container-lowest rounded-xl p-6 border border-outline-variant shadow-sm`}>
                <div className="flex items-center gap-2 mb-4">
                  <span className="material-symbols-outlined text-secondary">article</span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase font-bold">{bg.subtitle}</span>
                </div>
                <h3 className="font-headline-md text-headline-md text-primary font-bold mb-4">{bg.title}</h3>
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
              <div className="md:col-span-5 bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm flex flex-col gap-3">
                <h3 className="font-headline-md text-headline-md text-primary font-bold mb-2">Quick Actions</h3>
                <button onClick={() => setShowReceiptModal(true)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-label-md text-label-md transition-colors bg-secondary text-on-secondary hover:bg-primary font-bold shadow-sm">
                  <span className="material-symbols-outlined">receipt_long</span>
                  Download Official Payment Receipt (PDF)
                </button>
                {[
                  { label: 'Ask Secretariat & View Responses', icon: 'question_answer', action: () => setActiveTab('queries'), primary: true },
                  { label: 'Upload Position Paper', icon: 'upload_file', action: () => setActiveTab('position_paper'), primary: false },
                  { label: 'Read Background Guide', icon: 'library_books', action: () => setActiveTab('resources'), primary: false },
                ].map((btn, i) => (
                  <button key={i} onClick={btn.action}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-label-md text-label-md transition-colors ${btn.primary ? 'bg-primary text-on-primary hover:bg-secondary font-bold' : 'bg-surface-container-low border border-outline-variant text-on-surface hover:bg-surface-container'}`}>
                    <span className={`material-symbols-outlined ${btn.primary ? '' : 'text-on-surface-variant'}`}>{btn.icon}</span>
                    {btn.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Ask Secretariat & Support Queries Tab */}
          {activeTab === 'queries' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-[24px]">
              {/* Form */}
              <div className="lg:col-span-5 bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4 border-b border-outline-variant pb-3">
                  <span className="material-symbols-outlined text-secondary text-2xl">help</span>
                  <div>
                    <h3 className="font-headline-md text-headline-md text-primary font-bold">Ask Secretariat</h3>
                    <p className="text-xs text-on-surface-variant">Submit queries directly to the Secretariat &amp; Executive Board</p>
                  </div>
                </div>

                <form onSubmit={handleCreateQuery} className="space-y-4">
                  <div>
                    <label className="block text-label-md text-on-surface mb-1 font-semibold">Subject / Topic</label>
                    <input type="text" placeholder="e.g. Position Paper Deadline, Veto Rules"
                      value={querySubject} onChange={e => setQuerySubject(e.target.value)}
                      className="w-full border border-outline-variant rounded px-3 py-2 text-sm bg-surface-container-lowest text-on-surface outline-none focus:border-secondary" />
                  </div>

                  <div>
                    <label className="block text-label-md text-on-surface mb-1 font-semibold">Your Question</label>
                    <textarea rows={4} required placeholder="Type your detailed question here..."
                      value={queryQuestion} onChange={e => setQueryQuestion(e.target.value)}
                      className="w-full border border-outline-variant rounded p-3 text-sm bg-surface-container-lowest text-on-surface outline-none focus:border-secondary resize-none" />
                  </div>

                  <button type="submit" disabled={submittingQuery}
                    className="w-full py-3 bg-primary text-on-primary font-label-md rounded hover:bg-secondary transition-colors font-bold flex items-center justify-center gap-2">
                    {submittingQuery ? <span className="material-symbols-outlined animate-spin">progress_activity</span> : (
                      <>
                        <span className="material-symbols-outlined text-sm">send</span>
                        Submit Question to Secretariat
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Questions & Responses List */}
              <div className="lg:col-span-7 bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm">
                <div className="flex justify-between items-center mb-4 border-b border-outline-variant pb-3">
                  <h3 className="font-headline-md text-headline-md text-primary font-bold">My Inquiries &amp; Secretariat Responses</h3>
                  <button onClick={loadQueries} className="text-xs bg-surface-container border border-outline-variant px-3 py-1.5 rounded flex items-center gap-1 text-on-surface">
                    <span className="material-symbols-outlined text-sm">refresh</span> Refresh
                  </button>
                </div>

                <div className="space-y-4 max-h-[500px] overflow-y-auto">
                  {queries.length === 0 && (
                    <div className="p-8 text-center text-on-surface-variant text-sm">You have not submitted any questions yet. Use the form on the left to ask the Secretariat.</div>
                  )}

                  {queries.map(q => (
                    <div key={q.id} className="p-4 border border-outline-variant rounded-lg bg-surface-container-low/50 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="font-bold text-on-surface text-base">{q.subject}</span>
                          <span className="block text-xs text-on-surface-variant mt-0.5">{q.created_at ? new Date(q.created_at).toLocaleString() : ''}</span>
                        </div>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${q.status === 'answered' ? 'bg-secondary/10 text-secondary' : 'bg-error/10 text-error'}`}>
                          {q.status === 'answered' ? '✓ Response Received' : '⏳ Pending Review'}
                        </span>
                      </div>

                      <div className="text-sm text-on-surface bg-surface-container-lowest p-3 rounded border border-outline-variant/60">
                        <strong>My Question:</strong> {q.question}
                      </div>

                      {q.response ? (
                        <div className="text-sm text-on-surface bg-secondary/10 p-3 rounded border border-secondary/30">
                          <strong className="text-secondary block mb-1">💬 Individual Response from Secretariat:</strong>
                          {q.response}
                        </div>
                      ) : (
                        <p className="text-xs text-on-surface-variant italic">The Secretariat is reviewing your question. Your individual response will appear here.</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Position Paper Upload Tab */}
          {activeTab === 'position_paper' && (
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-8 shadow-sm">
              <h3 className="font-headline-md text-headline-md text-primary font-bold mb-2">Position Paper Submission</h3>
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
                  className="mt-4 w-full bg-primary text-on-primary py-3 rounded font-label-md text-label-md hover:bg-secondary transition-colors flex items-center justify-center gap-2 font-bold shadow-sm">
                  <span className="material-symbols-outlined icon-filled">upload</span>
                  Submit Position Paper
                </button>
              )}
            </div>
          )}

          {/* Background Guide Tab */}
          {activeTab === 'resources' && (
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-8 shadow-sm">
              <h3 className="font-headline-md text-headline-md text-primary font-bold mb-6">Background Guide — {user.committee}</h3>
              <div className="space-y-4">
                {bg.points.map((p, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 bg-surface-container-low rounded-lg border border-outline-variant">
                    <div className="w-8 h-8 rounded bg-primary text-on-primary flex items-center justify-center flex-shrink-0 font-label-md text-label-md font-bold">{i+1}</div>
                    <p className="font-body-md text-body-md text-on-surface">{p}</p>
                  </div>
                ))}
                <button onClick={downloadBackgroundGuidePDF}
                  className="inline-flex items-center gap-2 mt-4 px-6 py-3 bg-primary text-on-primary rounded font-label-md text-label-md hover:bg-secondary transition-colors font-bold shadow-sm cursor-pointer">
                  <span className="material-symbols-outlined">download</span>
                  Download Full Background Guide (PDF)
                </button>
              </div>
            </div>
          )}

          {/* Assignment Tab */}
          {activeTab === 'assignment' && (
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-8 shadow-sm text-center">
              {user.delegation_assigned ? (
                <>
                  <div className="w-20 h-20 rounded-full bg-secondary mx-auto flex items-center justify-center mb-6 shadow-md">
                    <span className="material-symbols-outlined text-on-secondary text-4xl icon-filled">how_to_vote</span>
                  </div>
                  <h3 className="font-headline-md text-headline-md text-primary font-bold mb-2">Your Portfolio Assignment</h3>
                  <p className="font-headline-xl text-headline-xl text-secondary my-4 font-bold">{user.delegation_assigned}</p>
                  <p className="font-body-md text-body-md text-on-surface-variant">Committee: <strong>{user.committee}</strong></p>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-5xl text-on-surface-variant mb-4">hourglass_top</span>
                  <h3 className="font-headline-md text-headline-md text-primary font-bold mb-2">Portfolio Pending</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant">Your portfolio will be assigned by the secretariat and emailed to you before the conference.</p>
                </>
              )}
            </div>
          )}

        {/* --- OFFICIAL PAYMENT RECEIPT MODAL --- */}
        {showReceiptModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="bg-white text-slate-900 rounded-xl max-w-xl w-full p-8 shadow-2xl relative border border-slate-200" id="printable-receipt">
              <button onClick={() => setShowReceiptModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 print:hidden">
                <span className="material-symbols-outlined text-2xl">close</span>
              </button>

              <div className="text-center border-b border-slate-200 pb-4 mb-6">
                <div className="inline-block px-3 py-1 bg-slate-900 text-amber-400 font-bold text-xs rounded-full uppercase tracking-wider mb-2">
                  IGNITE MUN 2026 OFFICIAL RECEIPT
                </div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Sri Venkateswara University</h2>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-0.5">College of Engineering (SVUCE), Tirupati</p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm mb-6 bg-slate-50 p-4 rounded-lg border border-slate-200/80">
                <div>
                  <span className="text-[11px] text-slate-500 uppercase font-bold block">Receipt Number</span>
                  <span className="font-mono font-bold text-slate-900 text-base">IGNITE-REC-2026-00{user.id || '1'}</span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 uppercase font-bold block">Issued Date</span>
                  <span className="font-mono font-bold text-slate-900 text-base">{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 uppercase font-bold block">Delegate Full Name</span>
                  <span className="font-bold text-slate-900">{user.name || 'Delegate'}</span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 uppercase font-bold block">Delegate Official ID</span>
                  <span className="font-mono font-bold text-slate-900 text-secondary">{user.user_id || 'DEL-2026-001'}</span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 uppercase font-bold block">Allotted Committee</span>
                  <span className="font-bold text-slate-900">{user.committee || 'UNSC'}</span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 uppercase font-bold block">Allotted Delegation</span>
                  <span className="font-bold text-slate-900">{user.delegation_assigned || 'Awaiting Portfolio'}</span>
                </div>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-lg mb-6">
                <div className="flex justify-between items-center text-sm font-bold border-b border-emerald-200/60 pb-2 mb-2">
                  <span className="text-slate-800">Delegate Registration Fee</span>
                  <span className="text-emerald-800 text-base font-extrabold">{user.payment_status === 'free' ? '₹0.00 (Free Early Slot)' : '₹1,200.00 INR'}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-600 font-semibold">Payment Status</span>
                  <span className="font-extrabold text-emerald-700 uppercase tracking-wide bg-emerald-100 px-2 py-0.5 rounded">PAID &amp; VERIFIED ✓</span>
                </div>
              </div>

              <div className="flex justify-between items-end text-xs text-slate-500 border-t border-slate-200 pt-4">
                <div>
                  <p className="font-bold text-slate-900 text-sm">IGNITE MUN 2026 Secretariat</p>
                  <p>SVUCE Campus, Tirupati, AP, India</p>
                </div>
                <div className="text-right">
                  <div className="inline-block border-b border-slate-400 px-6 py-1 text-slate-800 font-serif italic text-sm font-bold">Secretariat Registrar</div>
                  <p className="mt-1 text-[10px] text-slate-400">Computer Generated Official Receipt</p>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3 print:hidden border-t border-slate-100 pt-4">
                <button onClick={() => window.print()}
                  className="w-full py-3 bg-slate-900 text-white rounded-lg font-bold text-sm flex items-center justify-center gap-2 hover:bg-slate-800 shadow-md">
                  <span className="material-symbols-outlined text-lg">print</span>
                  Print / Save Official Receipt PDF
                </button>
              </div>
            </div>
          </div>
        )}
        </div>
      </main>
    </PageWrapper>
  )
}
