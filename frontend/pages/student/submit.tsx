import { useState } from 'react';
import Layout from '../../components/Layout';
import { apiFetch } from '../../lib/api';

export default function StudentSubmit() {
  const [content, setContent] = useState('');
  const [assignmentId, setAssignmentId] = useState('1');
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content && !fileName) {
      setError('Provide content or upload a file');
      return;
    }
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const response = await apiFetch('/submissions', {
        method: 'POST',
        body: JSON.stringify({
          assignment_id: parseInt(assignmentId),
          content: content || 'File submission',
          file_name: fileName || null,
        }),
      });
      setMessage('✓ Submission successful!');
      setContent('');
      setFileName('');
    } catch (err: any) {
      setError(err.message || 'Submission failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-4xl font-bold text-navy-900 mb-8">📤 Submit Assignment</h1>

        {message && <div className="mb-4 p-4 bg-green-100 border-l-4 border-green-600 text-green-700 rounded-lg font-semibold">{message}</div>}
        {error && <div className="mb-4 p-4 bg-red-100 border-l-4 border-red-600 text-red-700 rounded-lg font-semibold">❌ {error}</div>}

        <div className="bg-white rounded-2xl border border-navy-100 p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-navy-900 mb-3">📋 Select Assignment</label>
              <select value={assignmentId} onChange={(e) => setAssignmentId(e.target.value)} className="w-full px-4 py-3 border-2 border-navy-300 rounded-lg focus:border-navy-700 outline-none bg-white">
                <option value="1">Build Assignment++ API</option>
                <option value="2">Create Frontend Pages</option>
                <option value="3">Implement Features</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-navy-900 mb-3">✍️ Write Your Answer</label>
              <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Write your submission here or upload a file below..." className="w-full px-4 py-3 border-2 border-navy-300 rounded-lg focus:border-navy-700 outline-none h-40 font-mono text-sm"></textarea>
            </div>

            <div>
              <label className="block text-sm font-semibold text-navy-900 mb-3">📎 Upload File</label>
              <input type="text" value={fileName} onChange={(e) => setFileName(e.target.value)} placeholder="filename.pdf or filename.zip" className="w-full px-4 py-3 border-2 border-navy-300 rounded-lg focus:border-navy-700 outline-none" />
              <p className="text-xs text-gray-600 mt-2">Enter filename to simulate file upload</p>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-navy-700 to-navy-900 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50">
              {loading ? '⏳ Submitting...' : '✓ Submit Assignment'}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}
