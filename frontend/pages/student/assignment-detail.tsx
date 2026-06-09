import { useEffect, useState } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';
import RubricDisplay from '../../components/RubricDisplay';
import { apiFetch } from '../../lib/api';

type Assignment = {
  id: number;
  title: string;
  description: string;
  due_date?: string;
  resources?: string;
  rubric: { criterion: string; points: number; notes?: string }[];
};

export default function StudentAssignmentDetail() {
  const [item, setItem] = useState<Assignment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch<Assignment[]>('/assignments')
      .then((data) => setItem(data[0] || null))
      .catch(() => setItem(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Layout><div className="text-center p-6">⏳ Loading...</div></Layout>;

  if (!item) return <Layout><div className="text-center p-6 text-white/50">No assignment available</div></Layout>;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-4xl font-bold text-white mb-8">📝 {item.title}</h1>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/5 rounded-2xl border border-white/10 p-6 backdrop-blur-sm">
            <p className="text-sm text-red-300 font-semibold">📅 Due Date</p>
            <p className="text-2xl font-bold text-white mt-2">{item.due_date || 'TBD'}</p>
          </div>
          <div className="bg-white/5 rounded-2xl border border-white/10 p-6 backdrop-blur-sm">
            <p className="text-sm text-blue-300 font-semibold">📊 Points</p>
            <p className="text-2xl font-bold text-white mt-2">{(item.rubric || []).reduce((sum, r) => sum + (r.points || 0), 0)}</p>
          </div>
          <div className="bg-white/5 rounded-2xl border border-white/10 p-6 backdrop-blur-sm">
            <p className="text-sm text-green-300 font-semibold">✅ Status</p>
            <p className="text-2xl font-bold text-white mt-2">Not Submitted</p>
          </div>
        </div>

        <div className="bg-white/5 rounded-2xl border border-white/10 p-8 mb-8 backdrop-blur-sm">
          <h2 className="text-2xl font-bold text-white mb-4">📖 Assignment Brief</h2>
          <p className="text-white/70 leading-relaxed">{item.description}</p>
          
          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="text-sm font-semibold text-white mb-2">📚 Allowed Resources:</p>
            <p className="text-white/70">{item.resources || 'Course notes and official documentation only'}</p>
          </div>
        </div>

        <RubricDisplay rubric={item.rubric || []} />

        <Link href="/student/submit" className="inline-block mt-8 bg-gradient-to-r from-blue-600 to-blue-800 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition">
          📤 Submit Assignment
        </Link>
      </div>
    </Layout>
  );
}
