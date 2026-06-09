import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { apiFetch } from '../../lib/api';
import { getRole, isAuthenticated } from '../../lib/auth';

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
      // Get counts from admin API
      const [teachers, students, courses, submissions] = await Promise.all([
        apiFetch('/api/admin/users?role=teacher').catch(() => []),
        apiFetch('/api/admin/users?role=student').catch(() => []),
        apiFetch('/courses').catch(() => []),
        apiFetch('/submissions').catch(() => []),
      ]);
      
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
        <h1 className="text-4xl font-bold text-white mb-8">👑 Admin Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-2xl p-6 shadow-lg">
            <p className="text-sm opacity-80">Teachers</p>
            <p className="text-3xl font-bold">{stats.teachers}</p>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-700 text-white rounded-2xl p-6 shadow-lg">
            <p className="text-sm opacity-80">Students</p>
            <p className="text-3xl font-bold">{stats.students}</p>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-700 text-white rounded-2xl p-6 shadow-lg">
            <p className="text-sm opacity-80">Courses</p>
            <p className="text-3xl font-bold">{stats.courses}</p>
          </div>
          <div className="bg-gradient-to-br from-orange-500 to-orange-700 text-white rounded-2xl p-6 shadow-lg">
            <p className="text-sm opacity-80">Submissions</p>
            <p className="text-3xl font-bold">{stats.submissions}</p>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white/5 rounded-2xl border border-white/10 p-6 backdrop-blur-sm">
          <h2 className="text-xl font-bold text-white mb-4">📋 Registered Students</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-white/10">
                <tr>
                  <th className="text-left py-3 px-4 text-white/70 font-medium">Name</th>
                  <th className="text-left py-3 px-4 text-white/70 font-medium">Email</th>
                  <th className="text-left py-3 px-4 text-white/70 font-medium">ID#</th>
                  <th className="text-left py-3 px-4 text-white/70 font-medium">Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user: any) => (
                  <tr key={user.id} className="border-b border-white/5 hover:bg-white/5 transition">
                    <td className="py-3 px-4 text-white/85">{user.name}</td>
                    <td className="py-3 px-4 text-white/70">{user.email}</td>
                    <td className="py-3 px-4 text-white/70">{user.id_number || '-'}</td>
                    <td className="py-3 px-4 text-xs text-white/50">{new Date(user.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {users.length === 0 && <p className="text-center py-6 text-white/50">No students yet</p>}
          </div>
        </div>
      </div>
    </Layout>
  );
}
