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

  if (!item) return <Layout><div className="text-center p-6 text-gray-600">No assignment available</div></Layout>;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-4xl font-bold text-navy-900 mb-8">📝 {item.title}</h1>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl border border-red-200 p-6">
            <p className="text-sm text-red-600 font-semibold">📅 Due Date</p>
            <p className="text-2xl font-bold text-red-900 mt-2">{item.due_date || 'TBD'}</p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-200 p-6">
            <p className="text-sm text-blue-600 font-semibold">📊 Points</p>
            <p className="text-2xl font-bold text-blue-900 mt-2">{(item.rubric || []).reduce((sum, r) => sum + (r.points || 0), 0)}</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl border border-green-200 p-6">
            <p className="text-sm text-green-600 font-semibold">✅ Status</p>
            <p className="text-2xl font-bold text-green-900 mt-2">Not Submitted</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-navy-100 p-8 mb-8 shadow-sm">
          <h2 className="text-2xl font-bold text-navy-900 mb-4">📖 Assignment Brief</h2>
          <p className="text-gray-700 leading-relaxed">{item.description}</p>
          
          <div className="mt-6 pt-6 border-t border-navy-200">
            <p className="text-sm font-semibold text-navy-900 mb-2">📚 Allowed Resources:</p>
            <p className="text-gray-700">{item.resources || 'Course notes and official documentation only'}</p>
          </div>
        </div>

        <RubricDisplay rubric={item.rubric || []} />

        <Link href="/student/submit" className="inline-block mt-8 bg-gradient-to-r from-navy-700 to-navy-900 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition">
          📤 Submit Assignment
        </Link>
      </div>
    </Layout>
  );
}
