import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [role, setRole] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get('/api/me').then(res => {
      setUser(res.data.data)
      setRole(res.data.role)
    }).catch(() => {
      setUser(null); setRole(null)
    }).finally(() => setLoading(false))
  }, [])

  const login = async (userId, password) => {
    const res = await axios.post('/api/login', { user_id: userId, password })
    setUser(res.data.data)
    setRole(res.data.role)
    return res.data
  }

  const logout = async () => {
    await axios.post('/api/logout')
    setUser(null); setRole(null)
  }

  return (
    <AuthContext.Provider value={{ user, role, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
