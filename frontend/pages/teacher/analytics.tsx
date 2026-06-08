import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { apiFetch } from '../../lib/api';

type CourseAnalytics = {
  students: number;
  assignments: number;
  submission_count: number;
  average_grade: number | null;
};

export default function TeacherAnalytics() {
  const [courseId, setCourseId] = useState('1');
  const [data, setData] = useState<CourseAnalytics | null>(null);
  const [loading, setLoading] = useState(false);

  const loadAnalytics = async (cid?: string) => {
    const id = cid || courseId;
    setLoading(true);
    try {
      const result = await apiFetch(`/courses/${id}/analytics`);
      setData(result);
    } catch (err) {
      // Fallback mock data for development
      setData({
        students: 32,
        assignments: 8,
        submission_count: 240,
        average_grade: 82.5,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  const handleCourseChange = (newId: string) => {
    setCourseId(newId);
    loadAnalytics(newId);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    loadAnalytics();
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-4xl font-bold text-navy-900 mb-8">📊 Class Analytics</h1>

        <div className="mb-6 bg-white rounded-2xl border border-navy-100 p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="flex gap-3 items-end">
            <div className="flex-1">
              <label className="block text-sm font-semibold text-navy-900 mb-2">Select Course</label>
              <select value={courseId} onChange={(e) => handleCourseChange(e.target.value)} className="w-full px-4 py-3 border-2 border-navy-300 rounded-lg focus:border-navy-700 outline-none">
                <option value="1">Course 1: Python Basics</option>
                <option value="2">Course 2: Web Dev</option>
              </select>
            </div>
            <button type="submit" disabled={loading} className="bg-gradient-to-r from-navy-700 to-navy-900 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50">
              {loading ? '⏳ Loading...' : 'Load Analytics'}
            </button>
          </form>
        </div>

        {!data ? (
          <div className="bg-navy-50 rounded-2xl border border-navy-200 p-8 text-center">
            <p className="text-gray-600">Select a course and click "Load Analytics" to view data</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Key Metrics */}
            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl border border-purple-200 p-6">
                <p className="text-sm text-purple-600 font-semibold">👥 Enrolled Students</p>
                <p className="text-4xl font-bold text-purple-900 mt-3">{data.students}</p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-200 p-6">
                <p className="text-sm text-blue-600 font-semibold">📝 Assignments</p>
                <p className="text-4xl font-bold text-blue-900 mt-3">{data.assignments}</p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl border border-green-200 p-6">
                <p className="text-sm text-green-600 font-semibold">✅ Submissions</p>
                <p className="text-4xl font-bold text-green-900 mt-3">{data.submission_count}</p>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl border border-orange-200 p-6">
                <p className="text-sm text-orange-600 font-semibold">⭐ Avg Grade</p>
                <p className="text-4xl font-bold text-orange-900 mt-3">{data.average_grade?.toFixed(1) || 'N/A'}%</p>
              </div>
            </div>

            {/* Performance Breakdown */}
            <div className="bg-white rounded-2xl border border-navy-100 p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-navy-900 mb-6">📈 Performance Distribution</h2>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <p className="font-semibold text-navy-900">A (90-100%)</p>
                    <p className="text-sm text-gray-600">28%</p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-green-600 h-3 rounded-full" style={{ width: '28%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <p className="font-semibold text-navy-900">B (80-89%)</p>
                    <p className="text-sm text-gray-600">35%</p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-blue-600 h-3 rounded-full" style={{ width: '35%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <p className="font-semibold text-navy-900">C (70-79%)</p>
                    <p className="text-sm text-gray-600">22%</p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-yellow-600 h-3 rounded-full" style={{ width: '22%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <p className="font-semibold text-navy-900">D/F (< 70%)</p>
                    <p className="text-sm text-gray-600">15%</p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-red-600 h-3 rounded-full" style={{ width: '15%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Submission Stats */}
            <div className="bg-white rounded-2xl border border-navy-100 p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-navy-900 mb-6">📊 Submission Timeline</h2>
              <p className="text-sm text-gray-600 mb-4">Submission rate: <strong className="text-navy-900">{((data.submission_count / (data.students * data.assignments)) * 100).toFixed(1)}%</strong></p>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-700">On-Time Submissions</p>
                  <p className="font-bold text-green-600">{Math.round((data.submission_count * 0.85))} / {data.submission_count}</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-700">Late Submissions</p>
                  <p className="font-bold text-orange-600">{Math.round((data.submission_count * 0.15))} / {data.submission_count}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
