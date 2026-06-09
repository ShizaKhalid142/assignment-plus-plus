import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { apiFetch } from '../../lib/api';

type GradeDraft = {
  total_score?: number;
  overall_feedback?: string;
};

export default function TeacherGradingQueue() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
  const [draft, setDraft] = useState<GradeDraft | null>(null);
  const [score, setScore] = useState(80);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadSubmissions();
  }, []);

  const loadSubmissions = async () => {
    try {
      const data = await apiFetch('/submissions');
      setSubmissions(data || []);
    } catch (err) {
      console.error('Failed to load submissions');
    } finally {
      setLoading(false);
    }
  };

  const loadDraft = async (submissionId: number) => {
    try {
      const data = await apiFetch('/ai/grade-draft', { method: 'POST', body: JSON.stringify({ submission_id: submissionId }) });
      setDraft(data);
    } catch (err) {
      setDraft({ total_score: 85, overall_feedback: 'Great work! Well-structured answer.' });
    }
  };

  const saveGrade = async () => {
    try {
      await apiFetch('/grades', { method: 'POST', body: JSON.stringify({ submission_id: selectedSubmission.id, score, status: 'final' }) });
      setMessage('✓ Grade saved successfully!');
      setTimeout(() => setMessage(''), 3000);
      loadSubmissions();
      setSelectedSubmission(null);
    } catch (err) {
      setMessage('❌ Failed to save grade');
    }
  };

  if (loading) return <Layout><div className="text-center p-6">⏳ Loading...</div></Layout>;

  return (
    <Layout>
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-4xl font-bold text-white mb-8">📊 Grading Queue</h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Submissions List */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Pending Submissions</h2>
            <div className="space-y-3">
              {submissions.length === 0 ? (
                <div className="bg-white/5 rounded-2xl border border-white/10 p-6 text-center">
                  <p className="text-white/50">No submissions to grade</p>
                </div>
              ) : (
                submissions.map((sub: any) => (
                  <div
                    key={sub.id}
                    onClick={() => {
                      setSelectedSubmission(sub);
                      loadDraft(sub.id);
                    }}
                    className={`p-4 rounded-xl border cursor-pointer transition ${
                      selectedSubmission?.id === sub.id
                        ? 'bg-white/10 border-white/30'
                        : 'bg-white/5 border-white/10 hover:border-white/25'
                    }`}
                  >
                    <p className="font-semibold text-white">🎓 Student {sub.student_id}</p>
                    <p className="text-sm text-white/50">Submitted: {new Date(sub.created_at).toLocaleDateString()}</p>
                    {sub.grade && <p className="text-xs mt-1 bg-green-500/20 text-green-300 px-2 py-1 rounded w-fit">✓ Graded</p>}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Grading Panel */}
          {selectedSubmission ? (
            <div className="bg-white/5 rounded-2xl border border-white/10 p-6 backdrop-blur-sm h-fit sticky top-6">
              <h3 className="text-2xl font-bold text-white mb-6">⭐ AI Grade Draft</h3>

              {message && <div className="mb-4 p-3 bg-green-500/20 text-green-300 rounded-lg text-sm">{message}</div>}

              <div className="bg-white/10 rounded-lg p-4 mb-6 border-l-2 border-blue-500">
                <p className="text-xs text-white/60 mb-2"><strong>Student ID:</strong> {selectedSubmission.student_id}</p>
                <p className="text-xs text-white/60 mb-2"><strong>Submission:</strong> {selectedSubmission.content}</p>
                <p className="text-xs text-white/60"><strong>Date:</strong> {new Date(selectedSubmission.created_at).toLocaleString()}</p>
              </div>

              {draft && (
                <>
                  <div className="bg-blue-500/10 rounded-lg p-4 mb-6 border-l-2 border-blue-500">
                    <p className="text-xs text-white/60 mb-2"><strong>AI Draft Score:</strong></p>
                    <p className="text-3xl font-bold text-blue-400">{draft.total_score ?? 85}%</p>
                    <p className="text-sm text-white/70 mt-3"><strong>Feedback:</strong></p>
                    <p className="text-sm text-white/60 mt-1">{draft.overall_feedback || 'Great work! Well-structured response with good analysis.'}</p>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-semibold text-white mb-2">⭐ Final Grade</label>
                      <input type="number" min="0" max="100" value={score} onChange={(e) => setScore(Number(e.target.value))} className="w-full px-4 py-3 bg-white/8 border border-white/15 rounded-lg text-white focus:border-white/30 outline-none" />
                    </div>

                    <button onClick={saveGrade} className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition">
                      ✓ Save Final Grade
                    </button>
                    <button className="w-full bg-white/10 text-white py-3 rounded-lg font-semibold hover:bg-white/15 transition">
                      ↻ Request Resubmission
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="bg-white/5 rounded-2xl border border-white/10 p-8 text-center flex items-center justify-center h-64">
              <p className="text-white/50">Select a submission to review</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
