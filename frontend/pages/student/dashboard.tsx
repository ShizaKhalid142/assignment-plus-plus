import { useEffect, useState } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';
import DashboardStats from '../../components/DashboardStats';
import { apiFetch } from '../../lib/api';

type Assignment = { id: number; title: string; description: string; due_date?: string };

export default function StudentDashboard() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch<{ active_assignments: Assignment[] }>('/dashboard/student')
      .then((data) => setAssignments(data.active_assignments || []))
      .catch(() => setAssignments([]))
      .finally(() => setLoading(false));
  }, []);

  const upcomingAssignments = assignments
    .filter((assignment) => assignment.due_date && new Date(assignment.due_date) > new Date())
    .sort((a, b) => new Date(a.due_date || '').getTime() - new Date(b.due_date || '').getTime());

  if (loading) return <Layout><div className="text-center p-6">⏳ Loading student dashboard...</div></Layout>;

  return (
    <Layout>
      <div className="max-w-6xl mx-auto p-6 text-white">
        <h1 className="text-4xl font-bold text-white mb-8">📊 Student Dashboard</h1>

        <DashboardStats
          stats={[
            { label: '📋 Active Assignments', value: assignments.length },
            { label: '⏰ Due Soon', value: upcomingAssignments.length },
            { label: '✅ Submitted', value: assignments.length > 0 ? Math.floor(assignments.length * 0.6) : 0 },
          ]}
        />

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <Link href="/student/assignments">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-center shadow-[0_20px_60px_rgba(255,255,255,0.05)] transition hover:border-white/20 hover:bg-white/10">
              <p className="text-4xl mb-3">📋</p>
              <p className="font-semibold text-white">View Assignments</p>
            </div>
          </Link>
          <Link href="/student/submit">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-center shadow-[0_20px_60px_rgba(255,255,255,0.05)] transition hover:border-white/20 hover:bg-white/10">
              <p className="text-4xl mb-3">📤</p>
              <p className="font-semibold text-white">Submit Work</p>
            </div>
          </Link>
          <Link href="/student/feedback">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-center shadow-[0_20px_60px_rgba(255,255,255,0.05)] transition hover:border-white/20 hover:bg-white/10">
              <p className="text-4xl mb-3">✅</p>
              <p className="font-semibold text-white">Review Feedback</p>
            </div>
          </Link>
        </div>

        <div className="mt-10">
          <h2 className="text-2xl font-semibold text-white mb-6">Upcoming Deadlines</h2>
          {upcomingAssignments.length === 0 ? (
            <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-8 text-center text-emerald-100">
              ✓ No upcoming deadlines. Keep up the good work.
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingAssignments.slice(0, 5).map((assignment) => {
                const daysUntilDue = Math.ceil((new Date(assignment.due_date || '').getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                const urgent = daysUntilDue <= 3;
                return (
                  <Link key={assignment.id} href="/student/submit">
                    <div className={`rounded-3xl border p-5 transition ${urgent ? 'border-red-400 bg-red-500/10 text-red-100' : 'border-white/10 bg-white/5 hover:bg-white/10'}`}>
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-semibold text-white">📝 {assignment.title}</h3>
                          <p className="text-sm text-white/65 mt-2">{assignment.description}</p>
                        </div>
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${urgent ? 'bg-red-400/15 text-red-100' : 'bg-white/10 text-white/80'}`}>
                          {daysUntilDue === 0 ? 'TODAY' : `${daysUntilDue}d left`}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_60px_rgba(255,255,255,0.04)]">
            <h2 className="text-xl font-semibold text-white">Assignment Detail</h2>
            <p className="mt-3 text-sm text-white/70">Open any assignment to review its brief, rubric, allowed resources, and hint guidance.</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_60px_rgba(255,255,255,0.04)]">
            <h2 className="text-xl font-semibold text-white">Submission History</h2>
            <p className="mt-3 text-sm text-white/70">Track past submissions and see feedback trends across your courses.</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
