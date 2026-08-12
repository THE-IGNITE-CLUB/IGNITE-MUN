import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import PageWrapper from '../components/PageWrapper'

export default function EBCommandCenter() {
  const [committee, setCommittee] = useState('UNSC')
  const [topic, setTopic] = useState('')
  const [delegates, setDelegates] = useState([])
  const [scores, setScores] = useState({})
  const [search, setSearch] = useState('')
  const [sessionType, setSessionType] = useState('Moderated Caucus')
  const [totalTime, setTotalTime] = useState(15)
  const [speakTime, setSpeakTime] = useState(60)
  const [timerRunning, setTimerRunning] = useState(false)
  const [timeLeft, setTimeLeft] = useState(60)
  const [activeTab, setActiveTab] = useState('scoring') // 'scoring' or 'queries'
  const [queries, setQueries] = useState([])
  const [responses, setResponses] = useState({})
  const timerRef = useRef(null)

  const playAlarmSound = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(880, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.6)
      gain.gain.setValueAtTime(0.5, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()
      osc.stop(ctx.currentTime + 0.6)
    } catch (e) {
      console.log('Audio Error:', e)
    }
  }

  const loadQueries = () => {
    axios.get('/api/queries/all').then(r => setQueries(r.data)).catch(() => {})
  }

  useEffect(() => {
    axios.get('/api/delegates').then(r => setDelegates(r.data)).catch(() => {})
    loadQueries()
  }, [])

  // Session timer with alarm sound
  useEffect(() => {
    if (timerRunning && timeLeft > 0) {
      timerRef.current = setTimeout(() => setTimeLeft(t => t - 1), 1000)
    } else if (timeLeft === 0 && timerRunning) {
      setTimerRunning(false)
      playAlarmSound()
      setTimeout(playAlarmSound, 400)
      toast('⏰ Time is UP! Speaker timer expired.', { icon: '🔔', duration: 6000 })
    }
    return () => clearTimeout(timerRef.current)
  }, [timerRunning, timeLeft])

  const startTimer = () => { setTimerRunning(true) }
  const pauseTimer = () => setTimerRunning(false)
  const resetTimer = () => { setTimerRunning(false); setTimeLeft(speakTime) }

  const publishTopic = async () => {
    try {
      const res = await axios.post('/api/admin/session', {
        committee,
        session_type: sessionType,
        topic,
        total_time: totalTime,
        speaking_time: speakTime,
        broadcast_message: `Active ${sessionType}: "${topic || 'General Debate'}" (${totalTime} min total)`
      })
      toast.success('Live Session & Agenda Broadcasted to all Delegates!')
    } catch {
      toast.error('Failed to publish update.')
    }
  }

  const handleRespondQuery = async (queryId) => {
    const text = responses[queryId]?.strip ? responses[queryId].strip() : responses[queryId]
    if (!text) {
      toast.error('Please enter a response.')
      return
    }
    try {
      const res = await axios.post(`/api/queries/respond/${queryId}`, { response: text })
      toast.success(res.data.message || 'Response sent to delegate!')
      loadQueries()
    } catch {
      toast.error('Failed to send response.')
    }
  }

  const saveScore = async (delegateId) => {
    const s = scores[delegateId] || {}
    try {
      await axios.post('/api/admin/scores', { delegate_id: delegateId, session_id: 1, ...s })
      toast.success('Score saved successfully!')
    } catch {
      toast.error('Failed to save score.')
    }
  }

  const filtered = delegates.filter(d =>
    d.committee === committee &&
    (d.name?.toLowerCase().includes(search.toLowerCase()) || d.delegation_assigned?.toLowerCase().includes(search.toLowerCase()))
  )

  const timerPct = Math.round((timeLeft / speakTime) * 100)
  const timerColor = timeLeft > 30 ? 'text-secondary' : timeLeft > 10 ? 'text-on-tertiary-container' : 'text-error'

  const navItems = [
    { id: 'UNSC', icon: 'public', label: 'UNSC' },
    { id: 'LOK_SABHA', icon: 'account_balance', label: 'Lok Sabha (Parliamentary Proceedings)' },
    { id: 'INTERNATIONAL_PRESS', icon: 'newspaper', label: 'International Press (IP)' },
  ]

  return (
    <PageWrapper className="!flex-row">
      {/* Sidebar */}
      <nav className="bg-primary-container h-screen w-64 shadow-lg flex flex-col z-50 py-6 fixed left-0 top-0 hidden md:flex">
        <div className="px-6 mb-8">
          <h1 className="font-headline-md text-headline-md text-on-primary font-bold">EB Command</h1>
          <p className="font-label-md text-label-md text-on-primary-container mt-1">IGNITE MUN 2026</p>
        </div>
        <div className="flex-1 px-4 flex flex-col gap-1">
          {navItems.map(item => (
            <button key={item.id} onClick={() => setCommittee(item.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg mx-2 my-1 font-label-md text-label-md w-full text-left transition-all ${committee === item.id ? 'bg-secondary text-on-secondary font-bold' : 'text-on-primary-container hover:bg-on-primary-fixed-variant/10'}`}>
              <span className={`material-symbols-outlined ${committee === item.id ? 'icon-filled' : ''}`}>{item.icon}</span>
              {item.label}
            </button>
          ))}
          <div className="border-t border-on-primary-container/20 my-4 pt-4">
            <button onClick={() => setActiveTab('scoring')}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg mx-2 my-1 font-label-md text-label-md w-full text-left transition-all ${activeTab === 'scoring' ? 'bg-secondary/20 text-on-primary font-bold' : 'text-on-primary-container hover:bg-on-primary-fixed-variant/10'}`}>
              <span className="material-symbols-outlined">grade</span>
              Scoring Matrix
            </button>
            <button onClick={() => setActiveTab('queries')}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg mx-2 my-1 font-label-md text-label-md w-full text-left transition-all ${activeTab === 'queries' ? 'bg-secondary/20 text-on-primary font-bold' : 'text-on-primary-container hover:bg-on-primary-fixed-variant/10'}`}>
              <span className="material-symbols-outlined">question_answer</span>
              Delegate Queries ({queries.filter(q => q.status === 'pending').length})
            </button>
          </div>
        </div>
      </nav>

      {/* Main */}
      <main className="flex-1 md:ml-64 min-h-screen bg-background overflow-y-auto">
        <div className="px-[16px] md:px-[48px] py-8 max-w-[1280px] mx-auto flex flex-col gap-[24px]">
          <header className="flex justify-between items-end border-b border-outline-variant pb-6">
            <div>
              <h2 className="font-headline-xl text-headline-xl text-primary font-bold mb-1">Executive Board Command Center</h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant">Active Session: {committee === 'UNSC' ? 'United Nations Security Council' : 'Lok Sabha'}</p>
            </div>
            <span className="flex items-center gap-2 bg-surface-container text-on-surface-variant px-4 py-2 rounded-full font-label-sm text-label-sm border border-outline-variant">
              <span className={`w-2.5 h-2.5 rounded-full ${timerRunning ? 'bg-secondary animate-ping' : 'bg-outline'}`} />
              {timerRunning ? 'Session Timer Active' : 'Session Paused'}
            </span>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-[24px]">
            {/* Left: Theme + Timer with Alarm Sound */}
            <div className="lg:col-span-5 flex flex-col gap-[24px]">
              {/* Theme & Broadcast */}
              <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <span className="material-symbols-outlined text-secondary">campaign</span>
                  <h3 className="font-headline-md text-headline-md text-primary font-bold">Caucus Declaration &amp; Broadcast</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="font-label-md text-label-md text-on-surface-variant block mb-2 font-semibold">
                      {committee === 'LOK_SABHA' ? 'Parliamentary Session Type' : committee === 'INTERNATIONAL_PRESS' ? 'Press Corps Activity' : 'Session Type'}
                    </label>
                    <select value={sessionType} onChange={e => setSessionType(e.target.value)}
                      className="w-full border border-outline-variant rounded px-3 py-2.5 font-body-md text-body-md focus:ring-1 focus:ring-secondary outline-none bg-surface-container-lowest font-semibold">
                      {(committee === 'LOK_SABHA' ? [
                        'Question Hour (Parliamentary Proceedings)',
                        'Zero Hour Motion',
                        'Calling Attention Motion',
                        'Legislative Debate',
                        'Private Member Bill Discussion'
                      ] : committee === 'INTERNATIONAL_PRESS' ? [
                        'Press Conference & Media Briefing',
                        'Investigative Report Submission',
                        'Photojournalism & Caricature Review',
                        'Editorial Newsletter Edition'
                      ] : [
                        'Moderated Caucus',
                        'Unmoderated Caucus',
                        'GSL (General Speakers List)',
                        'Voting Bloc',
                        'Crisis Motion'
                      ]).map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="font-label-md text-label-md text-on-surface-variant block mb-2 font-semibold">Live Motion / Agenda Topic</label>
                    <textarea value={topic} onChange={e => setTopic(e.target.value)} rows={3} placeholder="Enter the caucus motion or agenda topic to broadcast to delegates..."
                      className="w-full bg-surface-container-low border border-outline-variant rounded p-3 font-body-md text-body-md resize-none outline-none focus:ring-1 focus:ring-secondary" />
                  </div>
                  <button onClick={publishTopic}
                    className="w-full bg-primary text-on-primary font-label-md text-label-md py-3 rounded hover:bg-secondary transition-colors flex items-center justify-center gap-2 font-bold shadow-sm">
                    <span className="material-symbols-outlined text-sm">notifications_active</span>
                    Notify All Delegates &amp; Publish
                  </button>
                </div>
              </div>

              {/* Timer with Audio Alarm */}
              <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary">timer</span>
                    <h3 className="font-headline-md text-headline-md text-primary font-bold">Caucus Speaker Timer</h3>
                  </div>
                  <button onClick={playAlarmSound} title="Test Audio Alarm Chime" className="text-xs bg-surface-container-low border border-outline-variant px-2.5 py-1 rounded flex items-center gap-1 text-on-surface-variant hover:text-primary">
                    <span className="material-symbols-outlined text-sm">volume_up</span> Test Alarm
                  </button>
                </div>
                <div className="text-center mb-4">
                  <span className={`font-headline-xl text-6xl font-mono font-bold ${timerColor}`}>
                    {String(Math.floor(timeLeft / 60)).padStart(2, '0')}:{String(timeLeft % 60).padStart(2, '0')}
                  </span>
                  <div className="mt-3 h-2.5 bg-surface-container rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-1000 ${timeLeft > 30 ? 'bg-secondary' : timeLeft > 10 ? 'bg-on-tertiary-container' : 'bg-error'}`}
                      style={{ width: `${timerPct}%` }} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div>
                    <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1 font-semibold">Speaking Time (s)</label>
                    <input type="number" value={speakTime} onChange={e => { setSpeakTime(+e.target.value); setTimeLeft(+e.target.value) }} min={10} max={600}
                      className="w-full border border-outline-variant rounded px-3 py-2 font-body-md text-body-md outline-none text-center bg-surface-container-lowest font-bold" />
                  </div>
                  <div>
                    <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1 font-semibold">Caucus Duration (min)</label>
                    <input type="number" value={totalTime} onChange={e => setTotalTime(+e.target.value)} min={1} max={120}
                      className="w-full border border-outline-variant rounded px-3 py-2 font-body-md text-body-md outline-none text-center bg-surface-container-lowest font-bold" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={timerRunning ? pauseTimer : startTimer}
                    className={`flex-1 py-3 rounded font-label-md text-label-md font-bold flex items-center justify-center gap-2 transition-colors ${timerRunning ? 'bg-error text-on-error' : 'bg-secondary text-on-secondary'}`}>
                    <span className="material-symbols-outlined text-base icon-filled">{timerRunning ? 'pause' : 'play_arrow'}</span>
                    {timerRunning ? 'Pause Timer' : 'Start Speaker Timer'}
                  </button>
                  <button onClick={resetTimer}
                    className="px-4 py-3 border border-outline-variant rounded text-on-surface-variant hover:bg-surface-container transition-colors" title="Reset to Speaking Time">
                    <span className="material-symbols-outlined text-base">restart_alt</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right: Scoring or Delegate Queries */}
            <div className="lg:col-span-7 flex flex-col gap-[24px]">
              {activeTab === 'scoring' && (
                <>
                  <div className="flex justify-between items-center bg-surface-container-low p-4 rounded-xl border border-outline-variant">
                    <h3 className="font-headline-md text-headline-md text-primary font-bold">{committee} Scoring Matrix</h3>
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Filter by delegate or portfolio..." type="text"
                      className="bg-surface-container-lowest border border-outline-variant rounded px-3 py-2 font-body-md text-sm focus:ring-1 focus:ring-secondary outline-none" />
                  </div>
                  <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-surface-container-low border-b border-outline-variant">
                            {['Delegate / Portfolio', 'Decorum', 'Policy', 'Resolution', 'Oratory', 'Actions'].map(h => (
                              <th key={h} className="p-4 font-label-sm text-label-sm text-primary uppercase text-center first:text-left">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {filtered.map(d => (
                            <tr key={d.id} className="border-b border-surface-variant hover:bg-surface-container/50 transition-colors">
                              <td className="p-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded bg-primary/10 text-primary font-bold flex items-center justify-center text-xs">
                                    {(d.delegation_assigned || d.name)?.slice(0, 2).toUpperCase()}
                                  </div>
                                  <div>
                                    <p className="font-label-md text-label-md text-on-surface font-semibold">{d.delegation_assigned || d.name}</p>
                                    <p className="font-label-sm text-label-sm text-on-surface-variant">{d.name}</p>
                                  </div>
                                </div>
                              </td>
                              {['decorum', 'policy', 'resolution', 'oratory'].map(field => (
                                <td key={field} className="p-4 text-center">
                                  <input type="number" min={0} max={10} step={0.5}
                                    value={scores[d.id]?.[field] ?? ''}
                                    onChange={e => setScores(prev => ({ ...prev, [d.id]: { ...prev[d.id], [field]: e.target.value } }))}
                                    className="w-14 bg-surface-container-low border border-outline-variant rounded p-1 text-center font-body-md outline-none focus:border-secondary font-bold" />
                                </td>
                              ))}
                              <td className="p-4 text-center">
                                <button onClick={() => saveScore(d.id)} className="p-2 bg-primary text-on-primary rounded hover:bg-secondary transition-colors" title="Save Evaluation Score">
                                  <span className="material-symbols-outlined text-sm">save</span>
                                </button>
                              </td>
                            </tr>
                          ))}
                          {filtered.length === 0 && (
                            <tr><td colSpan={6} className="p-8 text-center text-on-surface-variant font-body-md">No delegates registered for this committee yet.</td></tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}

              {/* Delegate Queries & Support Response Tab */}
              {activeTab === 'queries' && (
                <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm">
                  <div className="p-4 border-b border-outline-variant bg-surface-container-low flex justify-between items-center">
                    <div>
                      <h3 className="font-headline-md text-headline-md text-primary font-bold">Delegate Inquiries &amp; Secretariat Support</h3>
                      <p className="text-xs text-on-surface-variant">Respond individually to questions submitted by delegates.</p>
                    </div>
                    <button onClick={loadQueries} className="px-3 py-1.5 bg-surface-container border border-outline-variant rounded text-xs text-on-surface flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">refresh</span> Refresh
                    </button>
                  </div>

                  <div className="divide-y divide-outline-variant max-h-[600px] overflow-y-auto">
                    {queries.length === 0 && (
                      <div className="p-12 text-center text-on-surface-variant font-body-md">No queries submitted by delegates yet.</div>
                    )}
                    {queries.map(q => (
                      <div key={q.id} className="p-5 space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-xs font-bold px-2 py-0.5 rounded bg-primary/10 text-primary mr-2">{q.delegate_name}</span>
                            <span className="text-xs text-on-surface-variant">{q.created_at ? new Date(q.created_at).toLocaleTimeString() : ''}</span>
                            <h4 className="font-bold text-on-surface text-base mt-1">{q.subject}</h4>
                          </div>
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${q.status === 'answered' ? 'bg-secondary/10 text-secondary' : 'bg-error/10 text-error'}`}>
                            {q.status === 'answered' ? '✓ Answered' : '⏳ Pending Response'}
                          </span>
                        </div>

                        <div className="p-3 bg-surface-container-low rounded border border-outline-variant/60 text-sm text-on-surface font-body-md">
                          <strong>Question:</strong> {q.question}
                        </div>

                        {q.response && (
                          <div className="p-3 bg-secondary/10 rounded border border-secondary/20 text-sm text-on-surface font-body-md">
                            <strong className="text-secondary">Secretariat Response:</strong> {q.response}
                          </div>
                        )}

                        <div className="pt-2">
                          <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                            {q.response ? 'Update Secretariat Response:' : 'Type Individual Response:'}
                          </label>
                          <div className="flex gap-2">
                            <input type="text" placeholder="Type your response to this delegate..."
                              value={responses[q.id] ?? q.response ?? ''}
                              onChange={e => setResponses({ ...responses, [q.id]: e.target.value })}
                              className="flex-1 border border-outline-variant rounded px-3 py-2 text-sm bg-surface-container-lowest text-on-surface outline-none focus:border-secondary" />
                            <button onClick={() => handleRespondQuery(q.id)}
                              className="px-4 py-2 bg-primary text-on-primary rounded text-xs font-bold hover:bg-secondary transition-colors flex items-center gap-1">
                              <span className="material-symbols-outlined text-sm">send</span> Send Response
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </PageWrapper>
  )
}
