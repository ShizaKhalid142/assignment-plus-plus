import Link from 'next/link';
import { FormEvent, useState } from 'react';

import { apiFetch } from '../../lib/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const data = await apiFetch<{ message: string }>('/api/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
      setMessage(data.message);
    } catch (err: any) {
      setError(err?.detail || err?.message || 'Unable to send reset instructions.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page min-h-screen bg-black px-4 py-10 text-white">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 rounded-[36px] border border-white/10 bg-white/5 p-8 shadow-[0_40px_120px_rgba(0,0,0,0.55)] backdrop-blur-xl">
        <div className="space-y-3 text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-white/50">Assignment++</p>
          <h1 className="text-3xl font-semibold text-white md:text-4xl">Forgot your password?</h1>
          <p className="mx-auto max-w-2xl text-sm leading-7 text-white/70">
            Enter the email for your Assignment++ account and we’ll send a secure password reset link.
          </p>
        </div>

        <div className="rounded-[32px] border border-white/10 bg-black/40 p-8 backdrop-blur-xl">
          <form className="space-y-6" onSubmit={onSubmit}>
            <div className="space-y-3">
              <label className="block text-sm font-medium uppercase tracking-[0.15em] text-white/70">Email address</label>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="name@example.com"
                className="input-glass w-full rounded-[28px] border px-5 py-4 text-white placeholder-white/40"
                required
              />
            </div>

            {error && (
              <div className="rounded-3xl border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-100">
                {error}
              </div>
            )}

            {message && (
              <div className="rounded-3xl border border-emerald-400/20 bg-emerald-500/10 p-4 text-sm text-emerald-100">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="glass-pill w-full rounded-full bg-white/10 px-6 py-4 text-sm font-semibold text-white transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Sending reset link…' : 'Send reset instructions'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-white/60">
            Remembered your password?{' '}
            <Link href="/auth/login" className="font-semibold text-white underline-offset-2 hover:text-white/90 hover:underline">
              Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
