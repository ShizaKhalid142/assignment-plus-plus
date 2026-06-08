import { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { apiFetch } from '../../lib/api';

export default function StudentSettings() {
  const router = useRouter();
  const [profile, setProfile] = useState({ name: '', email: '' });
  const [password, setPassword] = useState({ old: '', new: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [tab, setTab] = useState('profile');

  const handleProfileUpdate = async () => {
    if (!profile.name || !profile.email) {
      setError('Name and email are required');
      return;
    }
    setLoading(true);
    setError('');
    setMessage('');
    try {
      await apiFetch('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify({ name: profile.name, email: profile.email }),
      });
      setMessage('✓ Profile updated successfully!');
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!password.old || !password.new) {
      setError('All fields required');
      return;
    }
    if (password.new !== password.confirm) {
      setError('New passwords do not match');
      return;
    }
    if (password.new.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    if (!/[A-Z]/.test(password.new) || !/[a-z]/.test(password.new) || !/[0-9]/.test(password.new)) {
      setError('Password must have uppercase, lowercase, and digit');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');
    try {
      await apiFetch('/auth/change-password', {
        method: 'PUT',
        body: JSON.stringify({ current_password: password.old, new_password: password.new }),
      });
      setMessage('✓ Password changed successfully!');
      setPassword({ old: '', new: '', confirm: '' });
    } catch (err: any) {
      setError(err.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-navy-900 mb-6">⚙️ Settings</h1>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-navy-200">
          <button
            onClick={() => { setTab('profile'); setMessage(''); setError(''); }}
            className={`pb-3 px-4 font-semibold transition ${
              tab === 'profile'
                ? 'text-navy-700 border-b-2 border-navy-700'
                : 'text-gray-500 hover:text-navy-600'
            }`}
          >
            👤 Profile
          </button>
          <button
            onClick={() => { setTab('password'); setMessage(''); setError(''); }}
            className={`pb-3 px-4 font-semibold transition ${
              tab === 'password'
                ? 'text-navy-700 border-b-2 border-navy-700'
                : 'text-gray-500 hover:text-navy-600'
            }`}
          >
            🔐 Password
          </button>
        </div>

        {/* Messages */}
        {message && <div className="mb-4 p-4 bg-green-100 border border-green-300 rounded-lg text-green-700">{message}</div>}
        {error && <div className="mb-4 p-4 bg-red-100 border border-red-300 rounded-lg text-red-700">❌ {error}</div>}

        {/* Profile Tab */}
        {tab === 'profile' && (
          <div className="bg-white rounded-2xl border border-navy-100 p-6 shadow-sm">
            <h2 className="text-xl font-bold text-navy-900 mb-4">Update Profile</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Full Name"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full px-4 py-2 border-2 border-navy-300 rounded-lg focus:border-navy-700 outline-none"
              />
              <input
                type="email"
                placeholder="Email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="w-full px-4 py-2 border-2 border-navy-300 rounded-lg focus:border-navy-700 outline-none"
              />
              <button
                onClick={handleProfileUpdate}
                disabled={loading}
                className="w-full bg-navy-700 text-white py-2 rounded-lg font-semibold hover:bg-navy-800 transition disabled:opacity-50"
              >
                {loading ? '⏳ Updating...' : '✓ Update Profile'}
              </button>
            </div>
          </div>
        )}

        {/* Password Tab */}
        {tab === 'password' && (
          <div className="bg-white rounded-2xl border border-navy-100 p-6 shadow-sm">
            <h2 className="text-xl font-bold text-navy-900 mb-4">Change Password</h2>
            <div className="space-y-4">
              <input
                type="password"
                placeholder="Current Password"
                value={password.old}
                onChange={(e) => setPassword({ ...password, old: e.target.value })}
                className="w-full px-4 py-2 border-2 border-navy-300 rounded-lg focus:border-navy-700 outline-none"
              />
              <input
                type="password"
                placeholder="New Password"
                value={password.new}
                onChange={(e) => setPassword({ ...password, new: e.target.value })}
                className="w-full px-4 py-2 border-2 border-navy-300 rounded-lg focus:border-navy-700 outline-none"
              />
              <input
                type="password"
                placeholder="Confirm Password"
                value={password.confirm}
                onChange={(e) => setPassword({ ...password, confirm: e.target.value })}
                className="w-full px-4 py-2 border-2 border-navy-300 rounded-lg focus:border-navy-700 outline-none"
              />
              <p className="text-sm text-gray-600">Password must have: 8+ chars, uppercase, lowercase, digit</p>
              <button
                onClick={handlePasswordChange}
                disabled={loading}
                className="w-full bg-navy-700 text-white py-2 rounded-lg font-semibold hover:bg-navy-800 transition disabled:opacity-50"
              >
                {loading ? '⏳ Changing...' : '✓ Change Password'}
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
