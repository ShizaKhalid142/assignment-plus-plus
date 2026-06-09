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
        <h1 className="text-4xl font-bold text-white mb-8">📜 Submission History</h1>
        
        {items.length === 0 ? (
          <div className="bg-white/5 rounded-2xl border border-white/10 p-8 text-center">
            <p className="text-white/50">No submissions yet. Start by submitting an assignment!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/10">
                <tr>
                  <th className="px-6 py-4 text-left text-white/80">📝 Assignment</th>
                  <th className="px-6 py-4 text-left text-white/80">📅 Date</th>
                  <th className="px-6 py-4 text-center text-white/80">✅ Status</th>
                  <th className="px-6 py-4 text-center text-white/80">⭐ Grade</th>
                  <th className="px-6 py-4 text-center text-white/80">📎 File</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-b border-white/5 hover:bg-white/5 transition">
                    <td className="px-6 py-4 font-semibold text-white">{item.title || `Assignment ${item.assignment_id}`}</td>
                    <td className="px-6 py-4 text-white/70">{new Date(item.created_at || Date.now()).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-center"><span className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-sm font-semibold">✓ Submitted</span></td>
                    <td className="px-6 py-4 text-center font-bold text-lg text-white">{item.grade || <span className="text-white/40">⏳ Pending</span>}</td>
                    <td className="px-6 py-4 text-center text-white/70">{item.file_name ? <span className="text-lg">📎</span> : <span className="text-white/30">-</span>}</td>
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
