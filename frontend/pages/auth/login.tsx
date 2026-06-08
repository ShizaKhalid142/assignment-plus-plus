import { FormEvent, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

import { apiFetch } from '../../lib/api';
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
        '/api/auth/login',
        {
          method: 'POST',
          body: JSON.stringify({ email, password }),
        }
      );

      saveSession(data.access_token, data.role, data.user_id);
      router.push(data.role === 'teacher' ? '/teacher/dashboard' : '/student/dashboard');
    } catch (err: any) {
      setError(err?.detail || err?.message || 'Unable to login');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="auth-card rounded-[32px] p-10">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl border border-white/10 bg-white/5 text-3xl text-white">+</div>
            <h1 className="text-3xl font-semibold text-white">Welcome Back</h1>
            <p className="mt-3 text-sm text-white/70">Log in to your Assignment++ account</p>
          </div>

          <form className="space-y-5" onSubmit={onSubmit}>
            <label className="block text-sm font-medium text-white/80">Email Address</label>
            <input
              className="input-glass w-full rounded-full border px-5 py-3 text-sm text-white placeholder-white/40"
              placeholder="you@example.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label className="block text-sm font-medium text-white/80">Password</label>
            <input
              className="input-glass w-full rounded-full border px-5 py-3 text-sm text-white placeholder-white/40"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {error && (
              <div className="rounded-3xl border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-100">
                ❌ {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="glass-pill w-full rounded-full px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? 'Logging in…' : 'Log In'}
            </button>
          </form>

          <div className="mt-8 flex flex-col gap-4 text-center text-sm text-white/70">
            <Link href="/auth/forgot-password" className="hover:text-white">
              Forgot your password?
            </Link>
            <div className="flex items-center justify-center gap-3 text-white/40">or</div>
            <Link href="/auth/signup" className="hover:text-white">
              Don&apos;t have an account? <span className="font-semibold text-white">Sign up →</span>
            </Link>
          </div>

          <div className="mt-8 rounded-[28px] border border-white/10 bg-white/5 p-5 text-sm text-white/70">
            <p className="mb-2 font-semibold text-white">Demo Accounts</p>
            <p>Teacher: teacher@assignmentpp.com / Teacher123</p>
            <p>Student: student@assignmentpp.com / Student123</p>
          </div>
        </div>
      </div>
    </div>
  );
}
