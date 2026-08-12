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
  const timerRef = useRef(null)

  useEffect(() => {
    axios.get('/api/delegates').then(r => setDelegates(r.data)).catch(() => {})
  }, [])

  // Session timer
  useEffect(() => {
    if (timerRunning && timeLeft > 0) {
      timerRef.current = setTimeout(() => setTimeLeft(t => t - 1), 1000)
    } else if (timeLeft === 0) {
      setTimerRunning(false)
      toast('⏰ Time is up!', { icon: '🔔' })
    }
    return () => clearTimeout(timerRef.current)
  }, [timerRunning, timeLeft])

  const startTimer = () => { setTimeLeft(speakTime); setTimerRunning(true) }
  const pauseTimer = () => setTimerRunning(false)
  const resetTimer = () => { setTimerRunning(false); setTimeLeft(speakTime) }

  const publishTopic = async () => {
    try {
      await axios.post('/api/admin/session', { committee, session_type: sessionType, topic, total_time: totalTime, speaking_time: speakTime })
      toast.success('Topic published to all delegates!')
    } catch { toast.error('Failed to publish.') }
  }

  const saveScore = async (delegateId) => {
    const s = scores[delegateId] || {}
    try {
      await axios.post('/api/admin/scores', { delegate_id: delegateId, session_id: 1, ...s })
      toast.success('Score saved!')
    } catch { toast.error('Failed to save.') }
  }

  const filtered = delegates.filter(d =>
    d.committee === committee &&
    (d.name?.toLowerCase().includes(search.toLowerCase()) || d.delegation_assigned?.toLowerCase().includes(search.toLowerCase()))
  )

  const timerPct = Math.round((timeLeft / speakTime) * 100)
  const timerColor = timeLeft > 30 ? 'text-secondary' : timeLeft > 10 ? 'text-on-tertiary-container' : 'text-error'

  const navItems = [
    { id: 'UNSC', icon: 'public', label: 'UNSC' },
    { id: 'LOK_SABHA', icon: 'account_balance', label: 'Lok Sabha' },
  ]

  return (
    <PageWrapper className="!flex-row">
      {/* Sidebar */}
      <nav className="bg-primary-container h-screen w-64 shadow-lg flex flex-col z-50 py-6 fixed left-0 top-0 hidden md:flex">
        <div className="px-6 mb-8">
          <h1 className="font-headline-md text-headline-md text-on-primary">EB Command</h1>
          <p className="font-label-md text-label-md text-on-primary-container mt-1">IGNITE MUN 2026</p>
        </div>
        <div className="flex-1 px-4 flex flex-col gap-1">
          {navItems.map(item => (
            <button key={item.id} onClick={() => setCommittee(item.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg mx-2 my-1 font-label-md text-label-md w-full text-left transition-all ${committee === item.id ? 'bg-secondary text-on-secondary' : 'text-on-primary-container hover:bg-on-primary-fixed-variant/10'}`}>
              <span className={`material-symbols-outlined ${committee === item.id ? 'icon-filled' : ''}`}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Main */}
      <main className="flex-1 md:ml-64 min-h-screen bg-background overflow-y-auto">
        <div className="px-[16px] md:px-[48px] py-8 max-w-[1280px] mx-auto flex flex-col gap-[24px]">
          <header className="flex justify-between items-end border-b border-outline-variant pb-6">
            <div>
              <h2 className="font-headline-xl text-headline-xl text-primary mb-1">Command Center</h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant">Executive Board — {committee === 'UNSC' ? 'United Nations Security Council' : 'Lok Sabha'}</p>
            </div>
            <span className="flex items-center gap-2 bg-surface-container text-on-surface-variant px-4 py-2 rounded-full font-label-sm text-label-sm border border-outline-variant">
              <span className={`w-2 h-2 rounded-full ${timerRunning ? 'bg-secondary animate-pulse' : 'bg-outline'}`} />
              {timerRunning ? 'Session Active' : 'Session Paused'}
            </span>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-[24px]">
            {/* Left: Theme + Timer */}
            <div className="lg:col-span-5 flex flex-col gap-[24px]">
              {/* Theme */}
              <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 institutional-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <span className="material-symbols-outlined text-secondary">campaign</span>
                  <h3 className="font-headline-md text-headline-md text-primary-container">Theme Declaration</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="font-label-md text-label-md text-on-surface-variant block mb-2">Session Type</label>
                    <select value={sessionType} onChange={e => setSessionType(e.target.value)}
                      className="w-full border border-outline-variant rounded px-3 py-2.5 font-body-md text-body-md focus:ring-1 focus:ring-on-tertiary-container outline-none bg-surface-container-lowest">
                      {['Moderated Caucus', 'Unmoderated Caucus', 'GSL', 'Voting Bloc', 'Crisis Session'].map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="font-label-md text-label-md text-on-surface-variant block mb-2">Live Agenda / Crisis Topic</label>
                    <textarea value={topic} onChange={e => setTopic(e.target.value)} rows={3} placeholder="Enter the current agenda topic or crisis to broadcast..."
                      className="w-full bg-surface-container-low border border-outline-variant rounded p-3 font-body-md text-body-md resize-none outline-none focus:ring-1 focus:ring-on-tertiary-container" />
                  </div>
                  <button onClick={publishTopic}
                    className="w-full bg-primary-container text-on-primary font-label-md text-label-md py-3 rounded hover:bg-tertiary-container transition-colors flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-sm">publish</span>Publish Update
                  </button>
                </div>
              </div>

              {/* Timer */}
              <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 institutional-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <span className="material-symbols-outlined text-secondary">timer</span>
                  <h3 className="font-headline-md text-headline-md text-primary-container">Session Timer</h3>
                </div>
                <div className="text-center mb-4">
                  <span className={`font-headline-xl text-6xl digital-timer ${timerColor}`}>
                    {String(Math.floor(timeLeft / 60)).padStart(2, '0')}:{String(timeLeft % 60).padStart(2, '0')}
                  </span>
                  <div className="mt-3 h-2 bg-surface-container rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-1000 ${timeLeft > 30 ? 'bg-secondary' : timeLeft > 10 ? 'bg-on-tertiary-container' : 'bg-error'}`}
                      style={{ width: `${timerPct}%` }} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div>
                    <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">Speaking Time (s)</label>
                    <input type="number" value={speakTime} onChange={e => { setSpeakTime(+e.target.value); setTimeLeft(+e.target.value) }} min={10} max={600}
                      className="w-full border border-outline-variant rounded px-3 py-2 font-body-md text-body-md outline-none text-center bg-surface-container-lowest" />
                  </div>
                  <div>
                    <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">Total Duration (min)</label>
                    <input type="number" value={totalTime} onChange={e => setTotalTime(+e.target.value)} min={1} max={120}
                      className="w-full border border-outline-variant rounded px-3 py-2 font-body-md text-body-md outline-none text-center bg-surface-container-lowest" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={timerRunning ? pauseTimer : startTimer}
                    className={`flex-1 py-2.5 rounded font-label-md text-label-md flex items-center justify-center gap-2 transition-colors ${timerRunning ? 'bg-on-tertiary-container/10 text-on-tertiary-container border border-on-tertiary-container/30' : 'bg-secondary text-on-secondary'}`}>
                    <span className="material-symbols-outlined text-sm icon-filled">{timerRunning ? 'pause' : 'play_arrow'}</span>
                    {timerRunning ? 'Pause' : 'Start'}
                  </button>
                  <button onClick={resetTimer}
                    className="px-4 py-2.5 border border-outline-variant rounded text-on-surface-variant hover:bg-surface-container transition-colors">
                    <span className="material-symbols-outlined text-sm">restart_alt</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right: Scoring */}
            <div className="lg:col-span-7 flex flex-col gap-[24px]">
              <div className="flex justify-between items-center bg-surface-container-low p-4 rounded-xl border border-outline-variant">
                <h3 className="font-headline-md text-headline-md text-primary-container">{committee} Scoring Matrix</h3>
                <div className="flex gap-2">
                  <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search delegate..." type="text"
                    className="bg-surface-container-lowest border border-outline-variant rounded px-3 py-1.5 font-body-md text-sm focus:ring-1 focus:ring-on-tertiary-container outline-none" />
                </div>
              </div>
              <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden institutional-shadow">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-surface-container-low border-b border-outline-variant">
                        {['Delegate / Portfolio', 'Decorum', 'Policy', 'Resolution', 'Oratory', 'Actions'].map(h => (
                          <th key={h} className="p-4 font-label-sm text-label-sm text-primary-container uppercase text-center first:text-left">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map(d => (
                        <tr key={d.id} className="border-b border-surface-variant hover:bg-surface-container/50 transition-colors">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded bg-surface-variant flex items-center justify-center font-label-md text-on-surface-variant text-xs">
                                {(d.delegation_assigned || d.name)?.slice(0, 2).toUpperCase()}
                              </div>
                              <div>
                                <p className="font-label-md text-label-md text-on-surface">{d.delegation_assigned || d.name}</p>
                                <p className="font-label-sm text-label-sm text-on-surface-variant">{d.name}</p>
                              </div>
                            </div>
                          </td>
                          {['decorum', 'policy', 'resolution', 'oratory'].map(field => (
                            <td key={field} className="p-4 text-center">
                              <input type="number" min={0} max={10} step={0.5}
                                value={scores[d.id]?.[field] ?? ''}
                                onChange={e => setScores(prev => ({ ...prev, [d.id]: { ...prev[d.id], [field]: e.target.value } }))}
                                className="w-14 bg-transparent border-b border-outline-variant focus:border-on-tertiary-container focus:ring-0 p-1 text-center font-body-md outline-none" />
                            </td>
                          ))}
                          <td className="p-4 text-center">
                            <button onClick={() => saveScore(d.id)} className="text-on-tertiary-container hover:text-tertiary-container transition-colors">
                              <span className="material-symbols-outlined">save</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                      {filtered.length === 0 && (
                        <tr><td colSpan={6} className="p-8 text-center text-on-surface-variant font-body-md">No delegates for this committee yet.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </PageWrapper>
  )
}
