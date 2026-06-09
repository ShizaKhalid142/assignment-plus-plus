import { useState } from 'react';

export default function PlagiarismSelfCheck({ assignmentId }: { assignmentId: number }) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const checkPlagiarism = async () => {
    if (!content.trim()) {
      setError('Paste your draft text first');
      return;
    }
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const token = localStorage.getItem('assignmentpp_token');
      const host = window.location.hostname;
      const port = process.env.NEXT_PUBLIC_API_PORT || '8000';
      const res = await fetch(`http://${host}:${port}/api/submissions/self-check`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ content, assignment_id: assignmentId }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || 'Check failed');
      }
      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Plagiarism check failed');
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (level: string) =>
    level === 'high' ? 'text-red-400 bg-red-500/10 border-red-500/30' :
    level === 'medium' ? 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30' :
    'text-green-400 bg-green-500/10 border-green-500/30';

  return (
    <div className="bg-white/5 rounded-2xl border border-white/10 p-6 backdrop-blur-sm">
      <h3 className="text-lg font-bold text-white mb-2">🔍 Self-Check Plagiarism</h3>
      <p className="text-sm text-white/50 mb-4">
        Paste your draft below to check for similarities before submitting. Results are NOT stored.
      </p>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Paste your assignment draft here..."
        className="w-full px-4 py-3 bg-white/8 border border-white/15 rounded-lg text-white placeholder:text-white/30 focus:border-white/30 outline-none h-32 mb-4"
      />

      <button
        onClick={checkPlagiarism}
        disabled={loading}
        className="w-full bg-gradient-to-r from-purple-600 to-indigo-700 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50"
      >
        {loading ? '⏳ Checking...' : '🔍 Check Similarity'}
      </button>

      {error && (
        <p className="mt-3 text-sm text-red-300">{error}</p>
      )}

      {result && (
        <div className={`mt-4 rounded-xl border p-4 ${getRiskColor(result.risk_level)}`}>
          <div className="flex justify-between items-center">
            <p className="font-semibold">{result.risk_level.toUpperCase()} RISK</p>
            <span className="text-2xl font-bold">{result.plagiarism_score}%</span>
          </div>
          <p className="text-sm mt-2 opacity-80">{result.message || result.summary}</p>
        </div>
      )}
    </div>
  );
}
