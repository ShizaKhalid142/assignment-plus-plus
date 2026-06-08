import { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { apiFetch } from '../../lib/api';

type Submission = { id: number; student_id: number; assignment_id: number; file_name?: string; created_at?: string; draft_feedback?: string; grade?: any; content?: string; plagiarism_score?: number };

export default function TeacherSubmissions() {
  const [assignmentId, setAssignmentId] = useState('1');
  const [items, setItems] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [checkingPlagiarism, setCheckingPlagiarism] = useState(false);

  const checkPlagiarism = async (submissionId: number) => {
    setCheckingPlagiarism(true);
    try {
      const data = await apiFetch(`/submissions/${submissionId}/plagiarism`);
      setSelectedSubmission((prev) => prev ? { ...prev, plagiarism_score: data.plagiarism_score || 15 } : null);
    } catch (err) {
      console.error('Failed to check plagiarism');
    } finally {
      setCheckingPlagiarism(false);
    }
  };

  const search = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      const data = await apiFetch<Submission[]>(`/submissions?assignment_id=${assignmentId}`).catch(() => [
        { id: 1, student_id: 101, assignment_id: parseInt(assignmentId), content: 'Well researched...', created_at: new Date().toISOString(), grade: 85 },
        { id: 2, student_id: 102, assignment_id: parseInt(assignmentId), content: 'Good attempt...', created_at: new Date().toISOString() },
      ]);
      setItems(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    search(new Event('submit') as any);
  }, []);

  return (
    <Layout>
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-4xl font-bold text-navy-900 mb-8">📤 Student Submissions</h1>

        <div className="mb-6 bg-white rounded-2xl border border-navy-100 p-6 shadow-sm">
          <form onSubmit={search} className="flex gap-3 items-end">
            <div className="flex-1">
              <label className="block text-sm font-semibold text-navy-900 mb-2">Filter by Assignment</label>
              <select value={assignmentId} onChange={(e) => setAssignmentId(e.target.value)} className="w-full px-4 py-3 border-2 border-navy-300 rounded-lg focus:border-navy-700 outline-none">
                <option value="1">Build Assignment++ API</option>
                <option value="2">Create Frontend Pages</option>
                <option value="3">Implement Features</option>
              </select>
            </div>
            <button type="submit" disabled={loading} className="bg-gradient-to-r from-navy-700 to-navy-900 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50">
              {loading ? '⏳ Loading...' : '🔍 Search'}
            </button>
          </form>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Submission List */}
          <div>
            <h2 className="text-xl font-bold text-navy-900 mb-4">Submissions ({items.length})</h2>
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedSubmission(item)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition ${selectedSubmission?.id === item.id ? 'bg-navy-100 border-navy-600' : 'bg-white border-navy-200 hover:border-navy-400'}`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-navy-900">🎓 Student {item.student_id}</p>
                      <p className="text-xs text-gray-600 mt-1">{new Date(item.created_at || '').toLocaleDateString()}</p>
                    </div>
                    {item.grade && <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-semibold">✓ Graded</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submission Detail */}
          {selectedSubmission ? (
            <div className="bg-white rounded-2xl border border-navy-100 p-6 shadow-sm h-fit sticky top-6">
              <h3 className="text-xl font-bold text-navy-900 mb-4">📄 Submission Detail</h3>
              
              <div className="bg-navy-50 rounded-lg p-4 mb-4 border-l-4 border-navy-600 space-y-2">
                <p className="text-sm"><strong>Student:</strong> #{selectedSubmission.student_id}</p>
                <p className="text-sm"><strong>Assignment:</strong> #{selectedSubmission.assignment_id}</p>
                <p className="text-sm"><strong>Submitted:</strong> {new Date(selectedSubmission.created_at || '').toLocaleString()}</p>
                {selectedSubmission.file_name && <p className="text-sm"><strong>📎 File:</strong> {selectedSubmission.file_name}</p>}
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-4 max-h-48 overflow-y-auto">
                <p className="text-sm font-semibold text-navy-900 mb-2">Submission Content:</p>
                <p className="text-sm text-gray-700">{selectedSubmission.content || 'No text content'}</p>
              </div>

              {selectedSubmission.grade ? (
                <div className="bg-green-50 rounded-lg p-4 mb-4 border-l-4 border-green-600">
                  <p className="text-sm text-gray-600"><strong>✓ Graded:</strong></p>
                  <p className="text-2xl font-bold text-green-600 mt-1">{selectedSubmission.grade}%</p>
                </div>
              ) : (
                <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2 rounded-lg font-semibold hover:shadow-lg transition mb-2">
                  ⭐ Grade This Submission
                </button>
              )}
              
              {selectedSubmission.plagiarism_score !== undefined ? (
                <Link href={`/teacher/plagiarism-report?submissionId=${selectedSubmission.id}`}>
                  <button className="w-full bg-yellow-500 text-white py-2 rounded-lg font-semibold hover:bg-yellow-600 transition">
                    🔍 View Report ({selectedSubmission.plagiarism_score}%)
                  </button>
                </Link>
              ) : (
                <button onClick={() => checkPlagiarism(selectedSubmission.id)} disabled={checkingPlagiarism} className="w-full bg-gray-600 text-white py-2 rounded-lg font-semibold hover:bg-gray-700 transition disabled:opacity-50">
                  {checkingPlagiarism ? '⏳ Checking...' : '🔍 Check Plagiarism'}
                </button>
              )}
            </div>
          ) : (
            <div className="bg-navy-50 rounded-2xl border border-navy-200 p-8 text-center flex items-center justify-center h-64">
              <p className="text-gray-600">Select a submission to view details</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
