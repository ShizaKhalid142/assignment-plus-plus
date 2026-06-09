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
        <h1 className="text-4xl font-bold text-white mb-8">🎓 My Courses</h1>

        {courses.length === 0 ? (
          <div className="bg-white/5 rounded-2xl border border-white/10 p-8 text-center">
            <p className="text-white/50">You are not enrolled in any courses yet</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Link key={course.id} href={`/student/assignments?course=${course.id}`}>
                <div className="bg-white/5 rounded-2xl border border-white/10 p-6 backdrop-blur-sm hover:border-white/25 transition cursor-pointer h-full flex flex-col">
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-3xl">📚</span>
                    <span className="text-xs font-semibold text-blue-300 bg-blue-500/20 px-3 py-1 rounded-full">{course.code}</span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-white mb-2">{course.name}</h3>
                  <p className="text-sm text-white/60 mb-4 flex-1">{course.description}</p>
                  
                  <div className="flex justify-between items-center pt-4 border-t border-white/10">
                    <span className="text-xs text-white/45">👨‍🏫 {course.instructor || 'Instructor'}</span>
                    <span className="text-lg text-white/60">→</span>
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
