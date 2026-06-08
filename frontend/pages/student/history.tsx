import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { apiFetch } from '../../lib/api';

type Submission = { id: number; file_name?: string; created_at?: string; draft_feedback?: string | null; title?: string; assignment_id?: number; grade?: any };

export default function StudentHistory() {
  const [items, setItems] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch<Submission[]>('/submissions')
      .then(setItems)
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Layout><div className="text-center p-6">⏳ Loading...</div></Layout>;

  return (
    <Layout>
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-4xl font-bold text-navy-900 mb-8">📜 Submission History</h1>
        
        {items.length === 0 ? (
          <div className="bg-navy-50 rounded-2xl border border-navy-200 p-8 text-center">
            <p className="text-gray-600">No submissions yet. Start by submitting an assignment!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-navy-900 text-white">
                <tr>
                  <th className="px-6 py-4 text-left">📝 Assignment</th>
                  <th className="px-6 py-4 text-left">📅 Date</th>
                  <th className="px-6 py-4 text-center">✅ Status</th>
                  <th className="px-6 py-4 text-center">⭐ Grade</th>
                  <th className="px-6 py-4 text-center">📎 File</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-b border-navy-200 hover:bg-navy-50 transition">
                    <td className="px-6 py-4 font-semibold text-navy-900">{item.title || `Assignment ${item.assignment_id}`}</td>
                    <td className="px-6 py-4">{new Date(item.created_at || Date.now()).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-center"><span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">✓ Submitted</span></td>
                    <td className="px-6 py-4 text-center font-bold text-lg">{item.grade || <span className="text-gray-500">⏳ Pending</span>}</td>
                    <td className="px-6 py-4 text-center">{item.file_name ? <span className="text-lg">📎</span> : <span className="text-gray-400">-</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
}
