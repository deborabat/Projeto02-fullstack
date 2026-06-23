import { createContext, useContext, useState } from 'react'
import axios from 'axios'

const AuthContext = createContext()

const AUTH_URL = 'http://localhost:3001'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user')
    return saved ? JSON.parse(saved) : null
  })
  const [token, setToken] = useState(() => localStorage.getItem('token') || null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function login(email, password) {
    setLoading(true)
    setError('')
    try {
      const res = await axios.post(`${AUTH_URL}/auth/login`, { email, password })
      setUser(res.data.user)
      setToken(res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      localStorage.setItem('token', res.data.token)
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao fazer login')
    } finally {
      setLoading(false)
    }
  }

  async function logout() {
    try {
      await axios.post(`${AUTH_URL}/auth/logout`, {}, {
        headers: { authorization: `Bearer ${token}` }
      })
    } catch {}
    setUser(null)
    setToken(null)
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  }

  return (
    <AuthContext.Provider value={{ user, token, error, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}