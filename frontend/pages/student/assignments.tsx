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
        <h1 className="text-4xl font-bold text-white mb-8">📝 Course Assignments</h1>

        {items.length === 0 ? (
          <div className="bg-white/5 rounded-2xl border border-white/10 p-8 text-center">
            <p className="text-white/50">No assignments yet</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((a) => (
              <Link key={a.id} href={`/student/assignment-detail?id=${a.id}`}>
                <div className="bg-white/5 rounded-2xl border border-white/10 p-6 backdrop-blur-sm hover:border-white/25 transition cursor-pointer h-full flex flex-col">
                  <h3 className="text-lg font-bold text-white mb-2">📋 {a.title}</h3>
                  <p className="text-sm text-white/60 mb-4 flex-1">{a.description}</p>
                  
                  <div className="flex justify-between items-center pt-4 border-t border-white/10">
                    <span className="text-xs text-white/45">📅 {a.due_date ? new Date(a.due_date).toLocaleDateString() : 'TBD'}</span>
                    <span className="text-xl text-white/60">→</span>
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
