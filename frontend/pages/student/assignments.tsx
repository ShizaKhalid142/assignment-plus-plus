import { useEffect, useState } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { apiFetch } from '../../lib/api';

type Assignment = { id: number; title: string; description: string; due_date?: string };

export default function StudentAssignments() {
  const [items, setItems] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch<Assignment[]>('/assignments')
      .then(setItems)
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Layout><div className="text-center p-6">⏳ Loading...</div></Layout>;

  return (
    <Layout>
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-4xl font-bold text-navy-900 mb-8">📝 Course Assignments</h1>

        {items.length === 0 ? (
          <div className="bg-navy-50 rounded-2xl border border-navy-200 p-8 text-center">
            <p className="text-gray-600">No assignments yet</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((a) => (
              <Link key={a.id} href={`/student/assignment-detail?id=${a.id}`}>
                <div className="bg-white rounded-2xl border border-navy-100 p-6 shadow-sm hover:shadow-md transition cursor-pointer h-full flex flex-col">
                  <h3 className="text-lg font-bold text-navy-900 mb-2">📋 {a.title}</h3>
                  <p className="text-sm text-gray-600 mb-4 flex-1">{a.description}</p>
                  
                  <div className="flex justify-between items-center pt-4 border-t border-navy-200">
                    <span className="text-xs text-gray-600">📅 {a.due_date ? new Date(a.due_date).toLocaleDateString() : 'TBD'}</span>
                    <span className="text-xl">→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
