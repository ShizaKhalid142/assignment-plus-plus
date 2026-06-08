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
        '/auth/register',
        {
          method: 'POST',
          body: JSON.stringify({ name, email, password, role, id_number: idNumber || null }),
        }
      );
      saveSession(data.access_token, data.role, data.user_id);
      router.push(data.role === 'teacher' ? '/teacher/dashboard' : '/student/dashboard');
    } catch (err: any) {
      setError(err.message || 'Unable to sign up');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="card border-2 border-navy-200">
          <div className="text-center mb-6">
            <div className="text-4xl mb-2">✍️</div>
            <h1 className="text-3xl font-bold text-navy-900">Create Account</h1>
            <p className="text-slate-600 mt-2">Join Assignment++ today</p>
          </div>

          <form className="mt-6 space-y-4" onSubmit={onSubmit}>
            <div>
              <label className="block text-sm font-medium text-navy-900 mb-2">Full Name</label>
              <input
                className="w-full rounded-lg border-2 border-navy-200 px-4 py-2.5 text-sm focus:outline-none focus:border-navy-900 transition"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

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
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-navy-900 mb-2">ID Number (Optional)</label>
              <input
                className="w-full rounded-lg border-2 border-navy-200 px-4 py-2.5 text-sm focus:outline-none focus:border-navy-900 transition"
                placeholder="e.g., S-1001 or T-9001"
                value={idNumber}
                onChange={(e) => setIdNumber(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-navy-900 mb-2">I am a...</label>
              <select
                className="w-full rounded-lg border-2 border-navy-200 px-4 py-2.5 text-sm focus:outline-none focus:border-navy-900 transition"
                value={role}
                onChange={(e) => setRole(e.target.value as 'student' | 'teacher')}
              >
                <option value="student">🎓 Student</option>
                <option value="teacher">🏫 Teacher / Instructor</option>
              </select>
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
              {loading ? '⏳ Creating account...' : '🚀 Sign Up'}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-navy-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-slate-500">or</span>
              </div>
            </div>

            <Link
              href="/auth/login"
              className="block text-center text-sm font-medium text-navy-900 hover:text-navy-700 mt-4"
            >
              Already have an account? <span className="text-navy-600 font-semibold">Log in →</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
