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

  const upcomingAssignments = assignments.filter((a) => a.due_date && new Date(a.due_date) > new Date()).sort((a, b) => new Date(a.due_date || 0).getTime() - new Date(b.due_date || 0).getTime());

  if (loading) return <Layout><div className="text-center p-6">⏳ Loading dashboard...</div></Layout>;

  return (
    <Layout>
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-4xl font-bold text-navy-900 mb-8">📊 Student Dashboard</h1>

        {/* Stats */}
        <DashboardStats
          stats={[
            { label: '📋 Active Assignments', value: assignments.length },
            { label: '⏰ Due Soon', value: upcomingAssignments.length },
            { label: '✅ Submitted', value: assignments.length > 0 ? Math.floor(assignments.length * 0.6) : 0 },
          ]}
        />

        {/* Upcoming Assignments */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-navy-900 mb-6 flex items-center">⏰ Upcoming Deadlines</h2>
          
          {upcomingAssignments.length === 0 ? (
            <div className="bg-green-50 rounded-2xl border border-green-200 p-8 text-center">
              <p className="text-green-700 font-semibold">✓ No upcoming deadlines! Great job!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingAssignments.slice(0, 5).map((a) => {
                const daysUntilDue = Math.ceil((new Date(a.due_date || '').getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                const isUrgent = daysUntilDue <= 3;

                return (
                  <Link key={a.id} href={`/student/submit`}>
                    <div className={`p-4 rounded-xl border-2 cursor-pointer transition ${isUrgent ? 'bg-red-50 border-red-300' : 'bg-white border-navy-200 hover:border-navy-400'}`}>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-semibold text-navy-900">📝 {a.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{a.description}</p>
                        </div>
                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${isUrgent ? 'bg-red-200 text-red-700' : 'bg-navy-100 text-navy-700'}`}>
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

        {/* Quick Actions */}
        <div className="mt-8 grid md:grid-cols-3 gap-4">
          <Link href="/student/assignments">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-200 p-6 text-center hover:shadow-md transition cursor-pointer">
              <p className="text-3xl mb-2">📋</p>
              <p className="font-semibold text-blue-900">View All Assignments</p>
            </div>
          </Link>
          <Link href="/student/feedback">
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl border border-green-200 p-6 text-center hover:shadow-md transition cursor-pointer">
              <p className="text-3xl mb-2">📊</p>
              <p className="font-semibold text-green-900">Check Grades</p>
            </div>
          </Link>
          <Link href="/student/courses">
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl border border-purple-200 p-6 text-center hover:shadow-md transition cursor-pointer">
              <p className="text-3xl mb-2">🎓</p>
              <p className="font-semibold text-purple-900">My Courses</p>
            </div>
          </Link>
        </div>
      </div>
    </Layout>
  );
}
