import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Flower2, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import { useAuthStore } from '../store/authStore'
import { authApi } from '../services/api'

interface MockUserRecord {
  id: string
  name: string
  email: string
  password: string
}

// Mock register pour le dev sans API
function mockRegister(name: string, email: string, password: string) {
  const users: MockUserRecord[] = JSON.parse(localStorage.getItem('lily_users') || '[]')
  if (users.find((u) => u.email === email)) return null
  const user = { id: Date.now().toString(), name, email, password }
  users.push(user)
  localStorage.setItem('lily_users', JSON.stringify(users))
  return { user: { id: user.id, email, first_name: name, last_name: '', phone: '' }, access: 'mock_access', refresh: 'mock_refresh' }
}

const schema = z.object({
  name: z.string().min(2, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})
type FormData = z.infer<typeof schema>

export function Register() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  if (isAuthenticated) {
    navigate('/account', { replace: true })
    return null
  }

  const onSubmit = async (data: FormData) => {
    try {
      let result
      try {
        result = await authApi.register({
          email: data.email,
          password: data.password,
          first_name: data.name,
          last_name: '',
        })
      } catch {
        result = mockRegister(data.name, data.email, data.password)
      }

      if (result) {
        setAuth(result.user, result.access, result.refresh)
        toast.success('Account created!')
        navigate('/account')
      } else {
        setError('email', { message: 'Email already exists. Please sign in instead.' })
      }
    } catch {
      setError('root', { message: 'An error occurred. Please try again.' })
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
          <h1 className="text-3xl mb-2 text-gray-900">Create Account</h1>
          <p className="text-gray-600">Join us to save your preferences and track orders</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          {errors.root && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md flex gap-3">
              <AlertCircle className="size-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{errors.root.message}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            {[
              { label: 'Full Name', name: 'name' as const, type: 'text' },
              { label: 'Email Address', name: 'email' as const, type: 'email' },
              { label: 'Password', name: 'password' as const, type: 'password' },
              { label: 'Confirm Password', name: 'confirmPassword' as const, type: 'password' },
            ].map(({ label, name, type }) => (
              <div key={name}>
                <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
                <input
                  type={type}
                  {...register(name)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
                {errors[name] && (
                  <p className="text-red-500 text-xs mt-1">{errors[name]?.message}</p>
                )}
              </div>
            ))}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-pink-500 text-white py-3 rounded-md hover:bg-pink-600 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <p className="mt-6 text-center text-gray-600 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-pink-500 hover:text-pink-600 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
