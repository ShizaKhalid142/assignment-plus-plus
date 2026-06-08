import { useState } from 'react';
import Layout from '../../components/Layout';
import { apiFetch } from '../../lib/api';

export default function TeacherStudentRegister() {
  const [courseId, setCourseId] = useState('1');
  const [registrationType, setRegistrationType] = useState('individual');
  const [idNumber, setIdNumber] = useState('');
  const [bulkIds, setBulkIds] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [loading, setLoading] = useState(false);
  const [registeredCount, setRegisteredCount] = useState(0);

  const registerStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await apiFetch(`/courses/${courseId}/register-student`, {
        method: 'POST',
        body: JSON.stringify({ id_number: idNumber }),
      });
      setMessage(`✓ ${data.message}`);
      setMessageType('success');
      setIdNumber('');
      setRegisteredCount(registeredCount + 1);
      setTimeout(() => setMessage(''), 3000);
    } catch (err: any) {
      setMessage(`❌ ${err.message || 'Registration failed'}`);
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const registerBulk = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const ids = bulkIds.split('\n').filter(id => id.trim());
    let successCount = 0;

    for (const id of ids) {
      try {
        await apiFetch(`/courses/${courseId}/register-student`, {
          method: 'POST',
          body: JSON.stringify({ id_number: id.trim() }),
        });
        successCount++;
      } catch (err) {
        console.error(`Failed to register ${id}`);
      }
    }

    setMessage(`✓ Registered ${successCount}/${ids.length} students`);
    setMessageType('success');
    setBulkIds('');
    setRegisteredCount(registeredCount + successCount);
    setLoading(false);
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-4xl font-bold text-navy-900 mb-8">👥 Register Students</h1>

        {message && (
          <div className={`mb-6 p-4 rounded-lg font-semibold border-l-4 ${messageType === 'success' ? 'bg-green-100 border-green-600 text-green-700' : 'bg-red-100 border-red-600 text-red-700'}`}>
            {message}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          {/* Individual Registration */}
          <div className="bg-white rounded-2xl border border-navy-100 p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-navy-900 mb-6 flex items-center">👤 Individual Registration</h2>
            <form onSubmit={registerStudent} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-navy-900 mb-2">📚 Select Course</label>
                <select value={courseId} onChange={(e) => setCourseId(e.target.value)} className="w-full px-4 py-3 border-2 border-navy-300 rounded-lg focus:border-navy-700 outline-none">
                  <option value="1">Python Basics</option>
                  <option value="2">Web Development</option>
                  <option value="3">Data Science</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-navy-900 mb-2">🆔 Student ID</label>
                <input type="text" value={idNumber} onChange={(e) => setIdNumber(e.target.value)} placeholder="e.g., STU12345" className="w-full px-4 py-3 border-2 border-navy-300 rounded-lg focus:border-navy-700 outline-none" required />
              </div>

              <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-navy-700 to-navy-900 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50">
                {loading ? '⏳ Registering...' : '✓ Register Student'}
              </button>
            </form>
            {registeredCount > 0 && <p className="text-sm text-green-600 mt-4 text-center">Total registered today: <strong>{registeredCount}</strong></p>}
          </div>

          {/* Bulk Registration */}
          <div className="bg-white rounded-2xl border border-navy-100 p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-navy-900 mb-6 flex items-center">📋 Bulk Registration</h2>
            <form onSubmit={registerBulk} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-navy-900 mb-2">📚 Select Course</label>
                <select value={courseId} onChange={(e) => setCourseId(e.target.value)} className="w-full px-4 py-3 border-2 border-navy-300 rounded-lg focus:border-navy-700 outline-none">
                  <option value="1">Python Basics</option>
                  <option value="2">Web Development</option>
                  <option value="3">Data Science</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-navy-900 mb-2">📄 Paste Student IDs (one per line)</label>
                <textarea value={bulkIds} onChange={(e) => setBulkIds(e.target.value)} placeholder="STU12345&#10;STU12346&#10;STU12347" className="w-full px-4 py-3 border-2 border-navy-300 rounded-lg focus:border-navy-700 outline-none h-32 font-mono text-sm" />
              </div>

              <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50">
                {loading ? '⏳ Processing...' : '📤 Bulk Register'}
              </button>
            </form>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-navy-50 rounded-2xl border border-navy-200 p-8">
          <h3 className="text-lg font-bold text-navy-900 mb-4">📖 How to Register Students</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>✓ Get student IDs from your institution's system</li>
            <li>✓ For bulk registration, use one ID per line (paste from spreadsheet)</li>
            <li>✓ Students will receive email notifications when added to course</li>
            <li>✓ Duplicate IDs will be skipped automatically</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
}
