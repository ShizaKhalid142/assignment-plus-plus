import { useState } from 'react';
import Layout from '../../components/Layout';
import SubmissionPolicyManager from '../../components/SubmissionPolicyManager';
import { apiFetch } from '../../lib/api';

export default function TeacherSettings() {
  const [activeTab, setActiveTab] = useState('policies');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage('❌ Passwords do not match');
      setMessageType('error');
      return;
    }
    try {
      await apiFetch('/api/auth/change-password', {
        method: 'PUT',
        body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
      });
      setMessage('✓ Password changed successfully!');
      setMessageType('success');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('❌ Failed to change password');
      setMessageType('error');
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-4xl font-bold text-white mb-8">⚙️ Teacher Settings</h1>

        {message && (
          <div className={`mb-6 p-4 rounded-lg font-semibold border-l-2 ${messageType === 'success' ? 'bg-green-500/10 border-green-500 text-green-300' : 'bg-red-500/10 border-red-500 text-red-300'}`}>
            {message}
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-8 border-b border-white/10">
          <button onClick={() => setActiveTab('policies')} className={`pb-3 px-4 font-semibold transition border-b-2 ${activeTab === 'policies' ? 'border-blue-400 text-white' : 'border-transparent text-white/50 hover:text-white'}`}>
            📋 Assignment Policies
          </button>
          <button onClick={() => setActiveTab('templates')} className={`pb-3 px-4 font-semibold transition border-b-2 ${activeTab === 'templates' ? 'border-blue-400 text-white' : 'border-transparent text-white/50 hover:text-white'}`}>
            📝 Feedback Templates
          </button>
          <button onClick={() => setActiveTab('password')} className={`pb-3 px-4 font-semibold transition border-b-2 ${activeTab === 'password' ? 'border-blue-400 text-white' : 'border-transparent text-white/50 hover:text-white'}`}>
            🔐 Change Password
          </button>
        </div>

        {/* Policies & Templates Tab */}
        {(activeTab === 'policies' || activeTab === 'templates') && (
          <SubmissionPolicyManager />
        )}

        {/* Password Tab */}
        {activeTab === 'password' && (
          <div className="bg-white/5 rounded-2xl border border-white/10 p-8 backdrop-blur-sm">
            <form onSubmit={changePassword} className="space-y-6 max-w-md">
              <div>
                <label className="block text-sm font-semibold text-white mb-2">Current Password</label>
                <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="w-full px-4 py-3 bg-white/8 border border-white/15 rounded-lg text-white placeholder:text-white/30 focus:border-white/30 outline-none" required />
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-2">New Password</label>
                <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full px-4 py-3 bg-white/8 border border-white/15 rounded-lg text-white placeholder:text-white/30 focus:border-white/30 outline-none" required />
                <p className="text-xs text-white/50 mt-1">Must be at least 8 characters with uppercase, lowercase, and number</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-2">Confirm Password</label>
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full px-4 py-3 bg-white/8 border border-white/15 rounded-lg text-white placeholder:text-white/30 focus:border-white/30 outline-none" required />
              </div>

              <button type="submit" className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition">
                🔐 Update Password
              </button>
            </form>
          </div>
        )}
      </div>
    </Layout>
  );
}
