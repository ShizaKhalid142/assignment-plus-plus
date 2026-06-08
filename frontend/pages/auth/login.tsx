import { FormEvent, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

import { apiFetch, ApiError } from '../../lib/api';
import { saveSession } from '../../lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await apiFetch<{ access_token: string; role: 'student' | 'teacher' | 'admin'; user_id?: number }>(
        '/auth/login',
        {
          method: 'POST',
          body: JSON.stringify({ email, password }),
        }
      );
      saveSession(data.access_token, data.role, data.user_id);
      router.push(data.role === 'teacher' ? '/teacher/dashboard' : '/student/dashboard');
    } catch (err: any) {
      setError(err.message || 'Unable to login');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="card border-2 border-navy-200">
          <div className="text-center mb-6">
            <div className="text-4xl mb-2">🔐</div>
            <h1 className="text-3xl font-bold text-navy-900">Welcome Back</h1>
            <p className="text-slate-600 mt-2">Log in to your Assignment++ account</p>
          </div>

          <form className="mt-6 space-y-4" onSubmit={onSubmit}>
            <div>
              <label className="block text-sm font-medium text-navy-900 mb-2">Email Address</label>
              <input
                className="w-full rounded-lg border-2 border-navy-200 px-4 py-2.5 text-sm focus:outline-none focus:border-navy-900 transition"
                placeholder="your@email.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-navy-900 mb-2">Password</label>
              <input
                className="w-full rounded-lg border-2 border-navy-200 px-4 py-2.5 text-sm focus:outline-none focus:border-navy-900 transition"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
                ❌ {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-2.5 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '⏳ Logging in...' : '🚀 Log In'}
            </button>
          </form>

          <div className="mt-6 space-y-3">
            <Link href="/auth/forgot-password" className="block text-center text-sm text-navy-700 hover:text-navy-900 font-medium">
              Forgot your password?
            </Link>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-navy-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-slate-500">or</span>
              </div>
            </div>

            <Link
              href="/auth/signup"
              className="block text-center text-sm font-medium text-navy-900 hover:text-navy-700"
            >
              Don't have an account? <span className="text-navy-600 font-semibold">Sign up →</span>
            </Link>
          </div>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-xs font-semibold text-blue-900 mb-2">📝 Demo Accounts:</p>
            <div className="space-y-1 text-xs text-blue-800">
              <p><strong>Teacher:</strong> teacher@assignmentpp.com / Teacher123</p>
              <p><strong>Student:</strong> student@assignmentpp.com / Student123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
