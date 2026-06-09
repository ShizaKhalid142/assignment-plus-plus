import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { apiFetch } from '../../lib/api';

type Course = { id: number; name: string; description: string; code: string };

export default function TeacherCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  async function loadCourses() {
    try {
      const data = await apiFetch<Course[]>('/courses').catch(() => []);
      setCourses(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCourses();
  }, []);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    try {
      await apiFetch('/courses', { method: 'POST', body: JSON.stringify({ name, description, code }) });
      setMessage('✓ Course created successfully!');
      setMessageType('success');
      setName('');
      setDescription('');
      setCode('');
      await loadCourses();
      setTimeout(() => setMessage(''), 3000);
    } catch (err: any) {
      setMessage(err.message || '❌ Failed to create course');
      setMessageType('error');
    }
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-4xl font-bold text-white mb-8">📚 Manage Courses</h1>

        {message && (
          <div className={`mb-6 p-4 rounded-lg font-semibold border-l-2 ${messageType === 'success' ? 'bg-green-500/10 border-green-500 text-green-300' : 'bg-red-500/10 border-red-500 text-red-300'}`}>
            {message}
          </div>
        )}

        {/* Create Course Form */}
        <div className="mb-8 bg-white/5 rounded-2xl border border-white/10 p-8 backdrop-blur-sm">
          <h2 className="text-2xl font-bold text-white mb-6">➕ Create New Course</h2>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-white mb-2">Course Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Python Fundamentals" className="w-full px-4 py-3 bg-white/8 border border-white/15 rounded-lg text-white placeholder:text-white/30 focus:border-white/30 outline-none" required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-white mb-2">Course Code</label>
                <input type="text" value={code} onChange={(e) => setCode(e.target.value)} placeholder="e.g., CS101" className="w-full px-4 py-3 bg-white/8 border border-white/15 rounded-lg text-white placeholder:text-white/30 focus:border-white/30 outline-none" required />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-white mb-2">Description</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Course overview and objectives..." className="w-full px-4 py-3 bg-white/8 border border-white/15 rounded-lg text-white placeholder:text-white/30 focus:border-white/30 outline-none h-24" />
            </div>

            <button type="submit" className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition">
              ✓ Create Course
            </button>
          </form>
        </div>

        {/* Courses List */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Your Courses ({courses.length})</h2>
          
          {loading ? (
            <div className="text-center p-6 text-white/60">⏳ Loading courses...</div>
          ) : courses.length === 0 ? (
            <div className="bg-white/5 rounded-2xl border border-white/10 p-8 text-center">
              <p className="text-white/50">No courses yet. Create one to get started!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <Link key={course.id} href={`/teacher/assignments?course=${course.id}`}>
                  <div className="bg-white/5 rounded-2xl border border-white/10 p-6 backdrop-blur-sm hover:border-white/25 transition cursor-pointer h-full flex flex-col">
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-3xl">📚</span>
                      <span className="text-xs font-bold text-blue-300 bg-blue-500/20 px-2 py-1 rounded-full">{course.code}</span>
                    </div>
                    
                    <h3 className="text-lg font-bold text-white mb-2">{course.name}</h3>
                    <p className="text-sm text-white/60 mb-4 flex-1">{course.description}</p>
                    
                    <div className="flex gap-2 pt-4 border-t border-white/10">
                      <button className="flex-1 text-xs bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">📝 Assignments</button>
                      <button className="flex-1 text-xs bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition">👥 Students</button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
