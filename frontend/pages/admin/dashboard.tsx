import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { apiFetch } from '@/lib/api';
import { getRole, isAuthenticated } from '@/lib/auth';

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({ teachers: 0, students: 0, courses: 0, submissions: 0 });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const role = getRole();

  useEffect(() => {
    if (role !== 'admin') router.push('/');
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      // Get counts from API
      const teachers = await apiFetch('/users?role=teacher');
      const students = await apiFetch('/users?role=student');
      const courses = await apiFetch('/courses');
      const submissions = await apiFetch('/submissions');
      
      setStats({
        teachers: teachers?.length || 0,
        students: students?.length || 0,
        courses: courses?.length || 0,
        submissions: submissions?.length || 0,
      });
      
      setUsers(students || []);
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
        <h1 className="text-4xl font-bold text-navy-900 mb-8">👑 Admin Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-400 to-blue-600 text-white rounded-2xl p-6 shadow-lg">
            <p className="text-sm opacity-90">Teachers</p>
            <p className="text-3xl font-bold">{stats.teachers}</p>
          </div>
          <div className="bg-gradient-to-br from-green-400 to-green-600 text-white rounded-2xl p-6 shadow-lg">
            <p className="text-sm opacity-90">Students</p>
            <p className="text-3xl font-bold">{stats.students}</p>
          </div>
          <div className="bg-gradient-to-br from-purple-400 to-purple-600 text-white rounded-2xl p-6 shadow-lg">
            <p className="text-sm opacity-90">Courses</p>
            <p className="text-3xl font-bold">{stats.courses}</p>
          </div>
          <div className="bg-gradient-to-br from-orange-400 to-orange-600 text-white rounded-2xl p-6 shadow-lg">
            <p className="text-sm opacity-90">Submissions</p>
            <p className="text-3xl font-bold">{stats.submissions}</p>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-2xl border border-navy-100 p-6 shadow-sm">
          <h2 className="text-xl font-bold text-navy-900 mb-4">📋 Registered Students</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b-2 border-navy-200">
                <tr>
                  <th className="text-left py-2 px-4">Name</th>
                  <th className="text-left py-2 px-4">Email</th>
                  <th className="text-left py-2 px-4">ID#</th>
                  <th className="text-left py-2 px-4">Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user: any) => (
                  <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-2 px-4">{user.name}</td>
                    <td className="py-2 px-4">{user.email}</td>
                    <td className="py-2 px-4">{user.id_number || '-'}</td>
                    <td className="py-2 px-4 text-xs text-gray-600">{new Date(user.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {users.length === 0 && <p className="text-center py-4 text-gray-600">No students yet</p>}
          </div>
        </div>
      </div>
    </Layout>
  );
}
