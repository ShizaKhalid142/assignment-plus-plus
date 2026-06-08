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
        <h1 className="text-4xl font-bold text-navy-900 mb-8">📋 My Feedback & Grades</h1>

        <div className="space-y-6">
          {feedbacks.length === 0 ? (
            <div className="bg-navy-50 rounded-2xl border border-navy-200 p-8 text-center">
              <p className="text-gray-600">No feedback yet. Submit assignments to receive grades and teacher comments!</p>
            </div>
          ) : (
            feedbacks.map((feedback: any) => (
              <div key={feedback.id} className="bg-white rounded-2xl border border-navy-100 p-6 shadow-sm hover:shadow-md transition">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-navy-900">📝 {feedback.title || 'Assignment Feedback'}</h3>
                    <p className="text-sm text-gray-600">Grade: <span className="font-bold text-green-600 text-lg">{feedback.grade || feedback.score || 'Pending'}</span></p>
                  </div>
                  <span className="bg-navy-100 text-navy-700 px-3 py-1 rounded-lg text-sm font-semibold">📅 {new Date(feedback.created_at || Date.now()).toLocaleDateString()}</span>
                </div>

                {feedback.draft_feedback && (
                  <div className="bg-blue-50 rounded-lg p-4 mb-4 border-l-4 border-blue-600">
                    <p className="text-sm"><strong>🤖 AI Draft Feedback:</strong></p>
                    <p className="text-sm text-gray-700 mt-2">{feedback.draft_feedback}</p>
                  </div>
                )}

                <div className="bg-navy-50 rounded-lg p-4 mb-4 border-l-4 border-navy-600">
                  <p className="text-sm text-navy-900"><strong>💬 Teacher Comments:</strong></p>
                  <p className="text-sm text-gray-700 mt-2">{feedback.comments || 'No comments from teacher yet'}</p>
                </div>

                {feedback.plagiarism_score && (
                  <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-600">
                    <p className="text-sm"><strong>🔍 Plagiarism Detection:</strong> <span className="text-blue-600 font-bold text-lg">{feedback.plagiarism_score}%</span></p>
                    <p className="text-xs text-gray-600 mt-1">Similarity score with other submissions</p>
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
