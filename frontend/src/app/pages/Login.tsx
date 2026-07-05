import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Flower2, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import { useAuthStore } from '../store/authStore'
import { authApi } from '../services/api'

// En mode dev (pas d'API), on utilise un mock localStorage
function mockLogin(email: string, password: string) {
  const users = JSON.parse(localStorage.getItem('lily_users') || '[]')
  const found = users.find((u: any) => u.email === email && u.password === password)
  if (found) {
    const { password: _, ...user } = found
    return { user: { id: user.id, email: user.email, first_name: user.name || '', last_name: '', phone: '' }, access: 'mock_access', refresh: 'mock_refresh' }
  }
  return null
}

const schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})
type FormData = z.infer<typeof schema>

const MAX_ATTEMPTS = 3
const LOCKOUT_MS = 30 * 60 * 1000 // 30 min

export function Login() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const [attempts, setAttempts] = useState(0)
  const [locked, setLocked] = useState(false)
  const [serverError, setServerError] = useState('')

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  if (isAuthenticated) {
    navigate('/account', { replace: true })
    return null
  }

  const onSubmit = async (data: FormData) => {
    if (locked) return
    setServerError('')

    try {
      // Essayer l'API, sinon fallback mock
      let result
      try {
        result = await authApi.login(data.email, data.password)
      } catch {
        result = mockLogin(data.email, data.password)
      }

      if (result) {
        setAuth(result.user, result.access, result.refresh)
        toast.success('Welcome back!')
        navigate('/account')
      } else {
        const next = attempts + 1
        setAttempts(next)
        if (next >= MAX_ATTEMPTS) {
          setLocked(true)
          setServerError('Account locked after 3 failed attempts. Try again in 30 minutes.')
          setTimeout(() => { setLocked(false); setAttempts(0) }, LOCKOUT_MS)
        } else {
          setServerError(`Invalid email or password. ${MAX_ATTEMPTS - next} attempt${MAX_ATTEMPTS - next !== 1 ? 's' : ''} remaining.`)
        }
      }
    } catch {
      setServerError('An error occurred. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <Flower2 className="size-10 text-pink-500" />
            <span className="text-2xl font-semibold text-gray-900">Lily's Florist</span>
          </Link>
          <h1 className="text-3xl mb-2 text-gray-900">Welcome Back</h1>
          <p className="text-gray-600">Sign in to your account</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          {serverError && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md flex gap-3">
              <AlertCircle className="size-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{serverError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                {...register('email')}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                {...register('password')}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={locked || isSubmitting}
              className="w-full bg-pink-500 text-white py-3 rounded-md hover:bg-pink-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <p className="mt-6 text-center text-gray-600 text-sm">
            Don't have an account?{' '}
            <Link to="/register" className="text-pink-500 hover:text-pink-600 font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
