import { FormEvent, useState } from 'react';
import { useRouter } from 'next/router';

import { apiFetch } from '../../lib/api';
import { saveSession } from '../../lib/auth';

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [role, setRole] = useState<'student' | 'teacher'>('student');
  const [message, setMessage] = useState('');

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setMessage('');
    try {
      const data = await apiFetch<{ access_token: string; role: 'student' | 'teacher' }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password, role, id_number: idNumber || null })
      });
      saveSession(data.access_token, data.role);
      router.push(data.role === 'teacher' ? '/teacher/dashboard' : '/student/dashboard');
    } catch (err: any) {
      setMessage(err.message || 'Unable to sign up');
    }
  }

  return (
    <div className="max-w-md mx-auto card">
      <h1 className="text-2xl font-bold text-navy-900">Sign Up</h1>
      <form className="mt-4 space-y-3" onSubmit={onSubmit}>
        <input className="w-full rounded-xl border px-3 py-2" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} required />
        <input className="w-full rounded-xl border px-3 py-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input className="w-full rounded-xl border px-3 py-2" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <input className="w-full rounded-xl border px-3 py-2" placeholder="ID number" value={idNumber} onChange={(e) => setIdNumber(e.target.value)} />
        <select className="w-full rounded-xl border px-3 py-2" value={role} onChange={(e) => setRole(e.target.value as 'student' | 'teacher')}>
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
        </select>
        <button className="btn-primary w-full">Create Account</button>
      </form>
      {message && <p className="text-sm text-red-600 mt-2">{message}</p>}
    </div>
  );
}
