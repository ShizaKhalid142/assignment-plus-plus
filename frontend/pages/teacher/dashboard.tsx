import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { apiFetch } from '../../lib/api';
import { getRole } from '../../lib/auth';

export default function TeacherDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({ pending: 0, submitted: 0, courses: 0, assignments: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (getRole() !== 'teacher') {
      router.push('/');
      return;
    }
    loadStats();
  }, [router]);

  const loadStats = async () => {
    try {
      const submissions = await apiFetch('/submissions');
      const courses = await apiFetch('/courses');
      const assignments = await apiFetch('/assignments');

      setStats({
        pending: submissions?.filter((s: any) => !s.graded).length || 0,
        submitted: submissions?.length || 0,
        courses: courses?.length || 0,
        assignments: assignments?.length || 0,
      });
    } catch (err) {
      console.error('Failed to load stats', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Layout><div className="text-center p-6">Loading teacher dashboard...</div></Layout>;

  return (
    <Layout>
      <div className="max-w-7xl mx-auto p-6 text-white">
        <h1 className="text-4xl font-bold text-white mb-8">🏫 Teacher Dashboard</h1>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-red-500 to-red-700 text-white rounded-3xl p-6 shadow-lg">
            <p className="text-sm opacity-90">Pending Reviews</p>
            <p className="text-4xl font-bold">{stats.pending}</p>
          </div>
          <div className="bg-gradient-to-br from-yellow-500 to-yellow-700 text-black rounded-3xl p-6 shadow-lg">
            <p className="text-sm opacity-90">Submissions</p>
            <p className="text-4xl font-bold">{stats.submitted}</p>
          </div>
          <div className="bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-3xl p-6 shadow-lg">
            <p className="text-sm opacity-90">Courses</p>
            <p className="text-4xl font-bold">{stats.courses}</p>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-700 text-white rounded-3xl p-6 shadow-lg">
            <p className="text-sm opacity-90">Assignments</p>
            <p className="text-4xl font-bold">{stats.assignments}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <a href="/teacher/courses" className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_60px_rgba(255,255,255,0.05)] transition hover:border-white/20 hover:bg-white/10">
            <p className="text-4xl mb-3">🏫</p>
            <h3 className="font-semibold text-white">Courses</h3>
            <p className="mt-2 text-sm text-white/70">Manage classes and register students.</p>
          </a>
          <a href="/teacher/assignment-builder" className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_60px_rgba(255,255,255,0.05)] transition hover:border-white/20 hover:bg-white/10">
            <p className="text-4xl mb-3">🛠️</p>
            <h3 className="font-semibold text-white">Assignment Builder</h3>
            <p className="mt-2 text-sm text-white/70">Create rubrics, deadlines, and hint policies.</p>
          </a>
          <a href="/teacher/grading-queue" className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_60px_rgba(255,255,255,0.05)] transition hover:border-white/20 hover:bg-white/10">
            <p className="text-4xl mb-3">🧠</p>
            <h3 className="font-semibold text-white">Grading Queue</h3>
            <p className="mt-2 text-sm text-white/70">Review AI drafts and override grades.</p>
          </a>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_60px_rgba(255,255,255,0.04)]">
            <h2 className="text-xl font-semibold text-white">Workflow Overview</h2>
            <p className="mt-3 text-sm text-white/70">Teachers can manage courses, build assignments, review student submissions, and analyze results from one central portal.</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_60px_rgba(255,255,255,0.04)]">
            <h2 className="text-xl font-semibold text-white">Next step</h2>
            <p className="mt-3 text-sm text-white/70">Use the sidebar to navigate between assignments, submissions, analytics, and student registration.</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
