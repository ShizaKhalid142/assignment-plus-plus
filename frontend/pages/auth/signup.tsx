import { FormEvent, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

import { apiFetch } from '../../lib/api';
import { saveSession } from '../../lib/auth';

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [role, setRole] = useState<'student' | 'teacher'>('student');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await apiFetch<{ access_token: string; role: 'student' | 'teacher' | 'admin'; user_id?: number }>(
        '/api/auth/register',
        {
          method: 'POST',
          body: JSON.stringify({ name, email, password, role, id_number: idNumber || null }),
        }
      );
      saveSession(data.access_token, data.role, data.user_id);
      router.push(
        data.role === 'admin' ? '/admin/dashboard' :
        data.role === 'teacher' ? '/teacher/dashboard' :
        '/student/dashboard'
      );
    } catch (err: any) {
      setError(err?.detail || err?.message || 'Unable to sign up');
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
            <h1 className="text-3xl font-semibold text-white">Create your account</h1>
            <p className="mt-3 text-sm text-white/70">Join Assignment++ and get your classroom moving faster.</p>
          </div>

          <form className="space-y-5" onSubmit={onSubmit}>
            <div>
              <label className="block text-sm font-medium text-white/80">Full Name</label>
              <input
                className="input-glass w-full rounded-full border px-5 py-3 text-sm text-white placeholder-white/40"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80">Email Address</label>
              <input
                className="input-glass w-full rounded-full border px-5 py-3 text-sm text-white placeholder-white/40"
                placeholder="you@example.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80">Password</label>
              <input
                className="input-glass w-full rounded-full border px-5 py-3 text-sm text-white placeholder-white/40"
                type="password"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80">ID Number (Optional)</label>
              <input
                className="input-glass w-full rounded-full border px-5 py-3 text-sm text-white placeholder-white/40"
                placeholder="e.g. S-1001 or T-9001"
                value={idNumber}
                onChange={(e) => setIdNumber(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80">I am a</label>
              <select
                className="input-glass w-full rounded-full border px-5 py-3 text-sm text-white"
                value={role}
                onChange={(e) => setRole(e.target.value as 'student' | 'teacher')}
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
              </select>
            </div>

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
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-white/70">
            <p>Already have an account?</p>
            <Link href="/auth/login" className="mt-3 inline-block text-white underline-offset-4 hover:underline">
              Log in →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
