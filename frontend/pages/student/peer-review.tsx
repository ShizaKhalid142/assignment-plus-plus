import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { apiFetch, peerReviewApi } from '../../lib/api';

type Submission = {
  id: number;
  assignment_id: number;
  student_id: number;
  content: string;
  file_name?: string;
};

type PeerReview = {
  id: number;
  submission_id: number;
  reviewer_id: number;
  score: number;
  comments: string;
  created_at: string;
};

type ReviewStats = {
  submission_id: number;
  review_count: number;
  average_score: number | null;
  min_score?: number;
  max_score?: number;
  reviews?: PeerReview[];
};

export default function PeerReviewPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedSub, setSelectedSub] = useState<Submission | null>(null);
  const [reviews, setReviews] = useState<PeerReview[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [score, setScore] = useState(75);
  const [comments, setComments] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadSubmissions();
  }, []);

  const loadSubmissions = async () => {
    try {
      const data = await apiFetch<Submission[]>('/submissions');
      setSubmissions((data || []).filter((s: any) => s.student_id !== undefined));
    } catch {
      setSubmissions([]);
    } finally {
      setLoading(false);
    }
  };

  const selectSubmission = async (sub: Submission) => {
    setSelectedSub(sub);
    try {
      const [rev, stat] = await Promise.all([
        peerReviewApi.list(sub.id),
        peerReviewApi.getStats(sub.id),
      ]);
      setReviews(rev || []);
      setStats(stat || null);
    } catch {
      setReviews([]);
      setStats(null);
    }
  };

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSub) return;
    if (!comments.trim()) {
      setMessage('❌ Add comments to your review');
      return;
    }
    setSubmitting(true);
    try {
      await peerReviewApi.create({
        submission_id: selectedSub.id,
        reviewer_id: 0, // Backend uses auth token
        score,
        comments,
      });
      setMessage('✓ Peer review submitted!');
      setComments('');
      setScore(75);
      // Refresh
      selectSubmission(selectedSub);
    } catch (err: any) {
      setMessage(`❌ ${err.message || 'Review failed'}`);
    } finally {
      setSubmitting(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const getScoreColor = (s: number) =>
    s >= 80 ? 'text-green-400' : s >= 60 ? 'text-yellow-400' : 'text-red-400';

  if (loading) return <Layout><div className="text-center p-6">⏳ Loading submissions...</div></Layout>;

  return (
    <Layout>
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-4xl font-bold text-white mb-8">👥 Peer Review</h1>
        <p className="text-white/60 mb-8">Review your classmates' submissions and provide constructive feedback.</p>

        {message && (
          <div className={`mb-4 p-4 rounded-lg font-semibold border-l-2 ${message.startsWith('✓') ? 'bg-green-500/10 border-green-500 text-green-300' : 'bg-red-500/10 border-red-500 text-red-300'}`}>
            {message}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {/* Submission List */}
          <div className="space-y-3">
            <h2 className="text-xl font-bold text-white mb-4">Available Submissions ({submissions.length})</h2>
            {submissions.length === 0 ? (
              <div className="bg-white/5 rounded-2xl border border-white/10 p-8 text-center">
                <p className="text-white/50">No submissions available for review</p>
              </div>
            ) : (
              submissions.map((sub) => (
                <div
                  key={sub.id}
                  onClick={() => selectSubmission(sub)}
                  className={`p-4 rounded-xl border cursor-pointer transition ${
                    selectedSub?.id === sub.id
                      ? 'bg-white/10 border-blue-400/50'
                      : 'bg-white/5 border-white/10 hover:border-white/25'
                  }`}
                >
                  <p className="font-semibold text-white">📄 Submission #{sub.id}</p>
                  <p className="text-xs text-white/50 mt-1">Assignment #{sub.assignment_id} • Student #{sub.student_id}</p>
                  <p className="text-sm text-white/60 mt-2 line-clamp-2">{sub.content}</p>
                </div>
              ))
            )}
          </div>

          {/* Review Panel */}
          {selectedSub ? (
            <div className="bg-white/5 rounded-2xl border border-white/10 p-6 backdrop-blur-sm h-fit sticky top-6 space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white">Review: Submission #{selectedSub.id}</h3>
                <div className="bg-white/10 rounded-lg p-4 mt-3 border-l-2 border-blue-500">
                  <p className="text-sm text-white/70">{selectedSub.content}</p>
                </div>
              </div>

              {/* Stats */}
              {stats && stats.review_count > 0 && (
                <div className="bg-blue-500/10 rounded-xl p-4 border border-blue-500/20">
                  <h4 className="font-semibold text-white mb-2">📊 Peer Review Stats</h4>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div>
                      <p className="text-xs text-white/50">Reviews</p>
                      <p className="text-2xl font-bold text-white">{stats.review_count}</p>
                    </div>
                    <div>
                      <p className="text-xs text-white/50">Avg Score</p>
                      <p className={`text-2xl font-bold ${stats.average_score ? getScoreColor(stats.average_score) : 'text-white/40'}`}>
                        {stats.average_score ?? '—'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-white/50">Range</p>
                      <p className="text-2xl font-bold text-white">
                        {stats.min_score ?? '—'}–{stats.max_score ?? '—'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Existing Reviews */}
              {reviews.length > 0 && (
                <div>
                  <h4 className="font-semibold text-white mb-3">Previous Reviews</h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {reviews.map((r) => (
                      <div key={r.id} className="bg-white/5 rounded-lg p-3 border border-white/10">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-white/50">Reviewer #{r.reviewer_id}</span>
                          <span className={`text-sm font-bold ${getScoreColor(r.score)}`}>{r.score}/100</span>
                        </div>
                        <p className="text-xs text-white/60">{r.comments}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Review Form */}
              <form onSubmit={submitReview} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Your Score (0–100)</label>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={score}
                    onChange={(e) => setScore(parseInt(e.target.value))}
                    className="w-full accent-blue-500"
                  />
                  <div className="flex justify-between text-xs text-white/50 mt-1">
                    <span>0</span>
                    <span className={`text-lg font-bold ${getScoreColor(score)}`}>{score}</span>
                    <span>100</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Comments</label>
                  <textarea
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    placeholder="What did they do well? What could be improved? Be specific and constructive..."
                    className="w-full px-4 py-3 bg-white/8 border border-white/15 rounded-lg text-white placeholder:text-white/30 focus:border-white/30 outline-none h-28"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-700 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50"
                >
                  {submitting ? '⏳ Submitting...' : '✏️ Submit Review'}
                </button>
              </form>
            </div>
          ) : (
            <div className="bg-white/5 rounded-2xl border border-white/10 p-8 text-center flex flex-col items-center justify-center">
              <span className="text-5xl mb-4">👈</span>
              <p className="text-white/50">Select a submission to review</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
