import { useEffect, useState } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { apiFetch } from '../../lib/api';

type Course = { id: number; name: string; description: string; code: string; instructor?: string };

export default function StudentCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch<Course[]>('/courses')
      .then(setCourses)
      .catch(() => setCourses([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Layout><div className="text-center p-6">⏳ Loading courses...</div></Layout>;

  return (
    <Layout>
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-4xl font-bold text-navy-900 mb-8">🎓 My Courses</h1>

        {courses.length === 0 ? (
          <div className="bg-navy-50 rounded-2xl border border-navy-200 p-8 text-center">
            <p className="text-gray-600">You are not enrolled in any courses yet</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Link key={course.id} href={`/student/assignments?course=${course.id}`}>
                <div className="bg-gradient-to-br from-navy-50 to-blue-50 rounded-2xl border border-navy-200 p-6 shadow-sm hover:shadow-md transition cursor-pointer h-full flex flex-col">
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-3xl">📚</span>
                    <span className="text-xs font-semibold text-navy-700 bg-navy-100 px-3 py-1 rounded-full">{course.code}</span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-navy-900 mb-2">{course.name}</h3>
                  <p className="text-sm text-gray-600 mb-4 flex-1">{course.description}</p>
                  
                  <div className="flex justify-between items-center pt-4 border-t border-navy-200">
                    <span className="text-xs text-gray-600">👨‍🏫 {course.instructor || 'Instructor'}</span>
                    <span className="text-lg text-navy-600">→</span>
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
