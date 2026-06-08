import { useState } from 'react';
import Layout from '../../components/Layout';
import { apiFetch } from '../../lib/api';

export default function TeacherSettings() {
  const [activeTab, setActiveTab] = useState('policies');
  const [policy, setPolicy] = useState('Rubric-first grading with constructive comments.');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');

  const savePolicy = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiFetch('/settings/policy', {
        method: 'POST',
        body: JSON.stringify({ policy }),
      });
      setMessage('✓ Grading policy saved!');
      setMessageType('success');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('❌ Failed to save policy');
      setMessageType('error');
    }
  };

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage('❌ Passwords do not match');
      setMessageType('error');
      return;
    }
    try {
      await apiFetch('/auth/change-password', {
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
        <h1 className="text-4xl font-bold text-navy-900 mb-8">⚙️ Teacher Settings</h1>

        {message && (
          <div className={`mb-6 p-4 rounded-lg font-semibold border-l-4 ${messageType === 'success' ? 'bg-green-100 border-green-600 text-green-700' : 'bg-red-100 border-red-600 text-red-700'}`}>
            {message}
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-8 border-b-2 border-navy-200">
          <button onClick={() => setActiveTab('policies')} className={`pb-3 px-4 font-semibold transition border-b-2 ${activeTab === 'policies' ? 'border-navy-600 text-navy-900' : 'border-transparent text-gray-600 hover:text-navy-900'}`}>
            📋 Grading Policies
          </button>
          <button onClick={() => setActiveTab('password')} className={`pb-3 px-4 font-semibold transition border-b-2 ${activeTab === 'password' ? 'border-navy-600 text-navy-900' : 'border-transparent text-gray-600 hover:text-navy-900'}`}>
            🔐 Change Password
          </button>
        </div>

        {/* Policies Tab */}
        {activeTab === 'policies' && (
          <div className="bg-white rounded-2xl border border-navy-100 p-8 shadow-sm">
            <form onSubmit={savePolicy} className="space-y-6">
              <div>
                <label className="block text-lg font-bold text-navy-900 mb-3">📊 Grading Policy Template</label>
                <textarea value={policy} onChange={(e) => setPolicy(e.target.value)} className="w-full px-4 py-3 border-2 border-navy-300 rounded-lg focus:border-navy-700 outline-none h-40" placeholder="Enter your default grading policy and feedback template..." />
                <p className="text-xs text-gray-600 mt-2">This template will be used as a default for all your assignments</p>
              </div>

              <div>
                <label className="block text-lg font-bold text-navy-900 mb-3">⏰ Late Submission Policy</label>
                <select className="w-full px-4 py-3 border-2 border-navy-300 rounded-lg focus:border-navy-700 outline-none">
                  <option>5% penalty per day late</option>
                  <option>10% penalty per day late</option>
                  <option>25% max penalty</option>
                  <option>No penalty</option>
                </select>
              </div>

              <button type="submit" className="w-full bg-gradient-to-r from-navy-700 to-navy-900 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition">
                💾 Save Policies
              </button>
            </form>
          </div>
        )}

        {/* Password Tab */}
        {activeTab === 'password' && (
          <div className="bg-white rounded-2xl border border-navy-100 p-8 shadow-sm">
            <form onSubmit={changePassword} className="space-y-6 max-w-md">
              <div>
                <label className="block text-sm font-semibold text-navy-900 mb-2">Current Password</label>
                <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="w-full px-4 py-3 border-2 border-navy-300 rounded-lg focus:border-navy-700 outline-none" required />
              </div>

              <div>
                <label className="block text-sm font-semibold text-navy-900 mb-2">New Password</label>
                <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full px-4 py-3 border-2 border-navy-300 rounded-lg focus:border-navy-700 outline-none" required />
                <p className="text-xs text-gray-600 mt-1">Must be at least 8 characters with uppercase, lowercase, and number</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-navy-900 mb-2">Confirm Password</label>
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full px-4 py-3 border-2 border-navy-300 rounded-lg focus:border-navy-700 outline-none" required />
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
}
