import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { apiFetch } from '@/lib/api';
import { isAuthenticated, getRole } from '@/lib/auth';

export default function TeacherDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({ pending: 0, submitted: 0, courses: 0, assignments: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (getRole() !== 'teacher') router.push('/');
    loadStats();
  }, []);

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
      console.error('Failed to load stats');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Layout><div className="text-center p-6">Loading...</div></Layout>;

  return (
    <Layout>
      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-4xl font-bold text-navy-900 mb-8">🏫 Teacher Dashboard</h1>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-red-400 to-red-600 text-white rounded-2xl p-6 shadow-lg">
            <p className="text-sm opacity-90">Pending Review</p>
            <p className="text-4xl font-bold">{stats.pending}</p>
          </div>
          <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 text-white rounded-2xl p-6 shadow-lg">
            <p className="text-sm opacity-90">Submissions</p>
            <p className="text-4xl font-bold">{stats.submitted}</p>
          </div>
          <div className="bg-gradient-to-br from-blue-400 to-blue-600 text-white rounded-2xl p-6 shadow-lg">
            <p className="text-sm opacity-90">Courses</p>
            <p className="text-4xl font-bold">{stats.courses}</p>
          </div>
          <div className="bg-gradient-to-br from-green-400 to-green-600 text-white rounded-2xl p-6 shadow-lg">
            <p className="text-sm opacity-90">Assignments</p>
            <p className="text-4xl font-bold">{stats.assignments}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <a href="/teacher/courses" className="bg-white rounded-2xl border border-navy-100 p-6 hover:shadow-lg transition cursor-pointer">
            <p className="text-4xl mb-2">🏫</p>
            <h3 className="font-bold text-navy-900">Courses</h3>
            <p className="text-sm text-gray-600 mt-2">Manage courses and register students</p>
          </a>
          <a href="/teacher/assignments" className="bg-white rounded-2xl border border-navy-100 p-6 hover:shadow-lg transition cursor-pointer">
            <p className="text-4xl mb-2">📝</p>
            <h3 className="font-bold text-navy-900">Assignments</h3>
            <p className="text-sm text-gray-600 mt-2">Create and manage assignments with rubrics</p>
          </a>
          <a href="/teacher/submissions" className="bg-white rounded-2xl border border-navy-100 p-6 hover:shadow-lg transition cursor-pointer">
            <p className="text-4xl mb-2">📬</p>
            <h3 className="font-bold text-navy-900">Submissions</h3>
            <p className="text-sm text-gray-600 mt-2">Review and grade student submissions</p>
          </a>
        </div>
      </div>
    </Layout>
  );
}
