import { useState } from 'react';
import Layout from '../../components/Layout';
import PlagiarismSelfCheck from '../../components/PlagiarismSelfCheck';
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
        <h1 className="text-4xl font-bold text-white mb-8">📤 Submit Assignment</h1>

        {message && <div className="mb-4 p-4 bg-green-500/10 border-l-2 border-green-500 text-green-300 rounded-lg font-semibold">{message}</div>}
        {error && <div className="mb-4 p-4 bg-red-500/10 border-l-2 border-red-500 text-red-300 rounded-lg font-semibold">❌ {error}</div>}

        {/* Plagiarism Self-Check */}
        <div className="mb-6">
          <PlagiarismSelfCheck assignmentId={parseInt(assignmentId) || 1} />
        </div>

        <div className="bg-white/5 rounded-2xl border border-white/10 p-8 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-white mb-3">📋 Select Assignment</label>
              <select value={assignmentId} onChange={(e) => setAssignmentId(e.target.value)} className="w-full px-4 py-3 bg-white/8 border border-white/15 rounded-lg text-white focus:border-white/30 outline-none">
                <option value="1">Build Assignment++ API</option>
                <option value="2">Create Frontend Pages</option>
                <option value="3">Implement Features</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-white mb-3">✍️ Write Your Answer</label>
              <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Write your submission here or upload a file below..." className="w-full px-4 py-3 bg-white/8 border border-white/15 rounded-lg text-white placeholder:text-white/30 focus:border-white/30 outline-none h-40 font-mono text-sm"></textarea>
            </div>

            <div>
              <label className="block text-sm font-semibold text-white mb-3">📎 Upload File</label>
              <input type="text" value={fileName} onChange={(e) => setFileName(e.target.value)} placeholder="filename.pdf or filename.zip" className="w-full px-4 py-3 bg-white/8 border border-white/15 rounded-lg text-white placeholder:text-white/30 focus:border-white/30 outline-none" />
              <p className="text-xs text-white/50 mt-2">Enter filename to simulate file upload</p>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50">
              {loading ? '⏳ Submitting...' : '✓ Submit Assignment'}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}
