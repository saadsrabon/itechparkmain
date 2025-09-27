import { useState } from 'react'
import type { FormEvent } from 'react'
import { useAuth } from '../auth/AuthContext'
import { Navigate, useNavigate } from 'react-router-dom'

export default function Login() {
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('admin@itechpark.com')
  const [password, setPassword] = useState('admin123')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  if (user) return <Navigate to="/hero" replace />

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await login(email, password)
      navigate('/hero', { replace: true })
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'grid', placeItems: 'center', minHeight: '100vh' }}>
      <form onSubmit={handleSubmit} style={{ width: 360, display: 'grid', gap: 12, padding: 24, border: '1px solid var(--border)', background: 'var(--panel)', borderRadius: 12 }}>
        <h2 style={{ margin: 0, color: 'var(--primary)' }}>Admin Login</h2>
        {error && <div style={{ color: '#f87171' }}>{error}</div>}
        <div>
          <label style={{ display: 'block', marginBottom: 4 }}>Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} style={input} type="email" required />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: 4 }}>Password</label>
          <input value={password} onChange={(e) => setPassword(e.target.value)} style={input} type="password" required />
        </div>
        <button type="submit" disabled={loading} style={button}>{loading ? 'Signing in...' : 'Sign in'}</button>
      </form>
    </div>
  )
}

const input: React.CSSProperties = { width: '100%', padding: 10, borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }
const button: React.CSSProperties = { background: 'var(--primary)', color: '#0b0f1a', padding: '10px 12px', border: 'none', borderRadius: 8, cursor: 'pointer' }






