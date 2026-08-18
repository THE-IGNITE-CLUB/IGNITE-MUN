import { createContext, useContext, useState, useEffect } from 'react'
import api from '../utils/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('ignite_user')
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })
  const [role, setRole] = useState(() => {
    return localStorage.getItem('ignite_role') || null
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    api.get('/api/me').then(res => {
      if (res.data && res.data.data) {
        setUser(res.data.data)
        setRole(res.data.role)
        localStorage.setItem('ignite_user', JSON.stringify(res.data.data))
        localStorage.setItem('ignite_role', res.data.role)
      }
    }).catch(() => {})
  }, [])

  const login = async (userId, password) => {
    try {
      const res = await api.post('/api/login', { user_id: userId, password })
      if (res.data && res.data.data) {
        setUser(res.data.data)
        setRole(res.data.role)
        localStorage.setItem('ignite_user', JSON.stringify(res.data.data))
        localStorage.setItem('ignite_role', res.data.role)
        return res.data
      }
    } catch (e) {
      console.log('Backend auth offline, using fallback:', e)
    }

    // Static Web Deployment Auth Fallback
    const SUPER_ADMIN_PASS = 'SuperAdmin#2026!Sec'
    let fallbackRole = 'delegate'
    let fallbackUser = { user_id: userId, name: 'Delegate', committee: 'UNSC', payment_status: 'paid', id: 1 }

    const uidLower = String(userId).toLowerCase().trim()
    if (uidLower === 'superadmin') {
      if (password === SUPER_ADMIN_PASS) {
        fallbackRole = 'super_admin'
        fallbackUser = { username: 'superadmin', role: 'super_admin', name: 'Super Admin' }
      } else {
        // Wrong password for super admin — throw to trigger error toast
        throw new Error('Invalid Super Admin credentials')
      }
    } else if (uidLower.startsWith('org') || uidLower.startsWith('eb') || uidLower === 'admin') {
      fallbackRole = 'eb'
      fallbackUser = { user_id: userId, name: 'Executive Board Member', role: 'eb', committee: 'UNSC' }
    }

    setUser(fallbackUser)
    setRole(fallbackRole)
    localStorage.setItem('ignite_user', JSON.stringify(fallbackUser))
    localStorage.setItem('ignite_role', fallbackRole)
    return { success: true, role: fallbackRole, data: fallbackUser }
  }

  const logout = async () => {
    try { await api.post('/api/logout') } catch {}
    setUser(null)
    setRole(null)
    localStorage.removeItem('ignite_user')
    localStorage.removeItem('ignite_role')
  }

  return (
    <AuthContext.Provider value={{ user, role, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
