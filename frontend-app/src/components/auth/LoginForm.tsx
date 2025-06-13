// src/pages/auth/components/LoginForm.tsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/useAuthStore'
import { Button } from '../Button'
import { Spinner } from '../Spinner'

interface LoginFormProps {
  onLoggedIn?: () => void
}

const LoginForm: React.FC<LoginFormProps> = ({ onLoggedIn }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const login = useAuthStore((s) => s.login)
  const loading = useAuthStore((s) => s.loading)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      await login({ login: email, password })
      onLoggedIn?.()
    } catch (err: any) {
      setError(err.message || 'Login failed')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <input
          type="email"
          id="email"
          className="w-full rounded border p-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div>
        <label htmlFor="password" className="text-sm font-medium">
          Password
        </label>
        <input
          type="password"
          id="password"
          className="w-full rounded border p-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? <Spinner /> : 'Log In'}
      </Button>

      <p className="text-sm text-center text-gray-500">
        Forgot your password?{' '}
        <a href="/forgot-password" className="text-primary underline">
          Reset it
        </a>
      </p>
    </form>
  )
}

export default LoginForm
