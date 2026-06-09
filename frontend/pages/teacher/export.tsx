import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { exportApi, apiFetch } from '../../lib/api';

type Course = { id: number; name: string; code: string };

export default function TeacherExport() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [format, setFormat] = useState<'csv' | 'excel' | 'json'>('csv');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const data = await apiFetch<Course[]>('/courses');
      setCourses(data || []);
    } catch {
      setCourses([]);
    }
  };

  const handleExport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse) {
      setMessage('❌ Select a course first');
      setMessageType('error');
      return;
    }
    setLoading(true);
    try {
      const response = await exportApi.exportCourse(parseInt(selectedCourse), format);
      if (response instanceof Blob) {
        const url = URL.createObjectURL(response);
        const a = document.createElement('a');
        a.href = url;
        a.download = `export_${new Date().toISOString().slice(0, 10)}.${format === 'excel' ? 'xlsx' : format}`;
        a.click();
        URL.revokeObjectURL(url);
      }
      setMessage(`✓ Export complete! Format: ${format.toUpperCase()}`);
      setMessageType('success');
      setTimeout(() => setMessage(''), 3000);
    } catch (err: any) {
      setMessage(`❌ ${err.message || 'Export failed'}`);
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-4xl font-bold text-white mb-8">📦 Bulk Export / Reports</h1>
        
        <p className="text-white/60 mb-8">
          Export grades, submissions, feedback, and plagiarism reports for any course in CSV, Excel, or JSON format.
        </p>

        {message && (
          <div className={`mb-6 p-4 rounded-lg font-semibold border-l-2 ${
            messageType === 'success'
              ? 'bg-green-500/10 border-green-500 text-green-300'
              : 'bg-red-500/10 border-red-500 text-red-300'
          }`}>
            {message}
          </div>
        )}

        <div className="bg-white/5 rounded-2xl border border-white/10 p-8 backdrop-blur-sm">
          <form onSubmit={handleExport} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-white mb-2">📚 Select Course</label>
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="w-full px-4 py-3 bg-white/8 border border-white/15 rounded-lg text-white focus:border-white/30 outline-none"
              >
                <option value="">— Choose a course —</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>{c.code}: {c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-white mb-2">📄 Export Format</label>
              <div className="grid grid-cols-3 gap-4">
                {(['csv', 'excel', 'json'] as const).map((fmt) => (
                  <button
                    key={fmt}
                    type="button"
                    onClick={() => setFormat(fmt)}
                    className={`p-4 rounded-xl border-2 text-center font-semibold transition ${
                      format === fmt
                        ? 'border-blue-400 bg-blue-500/10 text-white'
                        : 'border-white/10 bg-white/5 text-white/50 hover:border-white/20'
                    }`}
                  >
                    <span className="text-2xl block mb-1">
                      {fmt === 'csv' ? '📊' : fmt === 'excel' ? '📈' : '📋'}
                    </span>
                    {fmt.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white/5 rounded-xl border border-white/10 p-4">
              <h4 className="font-semibold text-white mb-2">📋 Export Includes:</h4>
              <ul className="text-sm text-white/60 space-y-1">
                <li>✓ Student names and ID numbers</li>
                <li>✓ Assignment titles and due dates</li>
                <li>✓ Submission content and file names</li>
                <li>✓ Grades and grade status</li>
                <li>✓ Teacher feedback comments</li>
                <li>✓ Plagiarism scores</li>
              </ul>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-700 text-white py-4 rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50 text-lg"
            >
              {loading ? '⏳ Generating export...' : `📥 Download ${format.toUpperCase()} Report`}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}
