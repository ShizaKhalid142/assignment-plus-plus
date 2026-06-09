import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { apiFetch } from '../../lib/api';

export default function StudentFeedback() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeedback();
  }, []);

  const loadFeedback = async () => {
    try {
      const data = await apiFetch('/feedback');
      setFeedbacks(data || []);
    } catch (err) {
      console.error('Failed to load feedback');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Layout><div className="text-center p-6">⏳ Loading feedback...</div></Layout>;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-4xl font-bold text-white mb-8">📋 My Feedback & Grades</h1>

        <div className="space-y-6">
          {feedbacks.length === 0 ? (
            <div className="bg-white/5 rounded-2xl border border-white/10 p-8 text-center">
              <p className="text-white/50">No feedback yet. Submit assignments to receive grades and teacher comments!</p>
            </div>
          ) : (
            feedbacks.map((feedback: any) => (
              <div key={feedback.id} className="bg-white/5 rounded-2xl border border-white/10 p-6 backdrop-blur-sm hover:border-white/20 transition">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white">📝 {feedback.title || 'Assignment Feedback'}</h3>
                    <p className="text-sm text-white/60">Grade: <span className="font-bold text-green-400 text-lg">{feedback.grade || feedback.score || 'Pending'}</span></p>
                  </div>
                  <span className="bg-white/10 text-white/70 px-3 py-1 rounded-lg text-sm font-semibold">📅 {new Date(feedback.created_at || Date.now()).toLocaleDateString()}</span>
                </div>

                {feedback.draft_feedback && (
                  <div className="bg-blue-500/10 rounded-lg p-4 mb-4 border-l-2 border-blue-500">
                    <p className="text-sm text-white/70"><strong>🤖 AI Draft Feedback:</strong></p>
                    <p className="text-sm text-white/60 mt-2">{feedback.draft_feedback}</p>
                  </div>
                )}

                <div className="bg-white/10 rounded-lg p-4 mb-4 border-l-2 border-blue-500">
                  <p className="text-sm text-white"><strong>💬 Teacher Comments:</strong></p>
                  <p className="text-sm text-white/70 mt-2">{feedback.comments || 'No comments from teacher yet'}</p>
                </div>

                {feedback.plagiarism_score && (
                  <div className="bg-blue-500/10 rounded-lg p-4 border-l-2 border-blue-500">
                    <p className="text-sm text-white/70"><strong>🔍 Plagiarism Detection:</strong> <span className="text-blue-400 font-bold text-lg">{feedback.plagiarism_score}%</span></p>
                    <p className="text-xs text-white/50 mt-1">Similarity score with other submissions</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}
