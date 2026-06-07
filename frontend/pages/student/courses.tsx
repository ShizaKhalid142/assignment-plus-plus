import { useEffect, useState } from 'react';

import CourseCard from '../../components/CourseCard';
import { apiFetch } from '../../lib/api';

type Course = { id: number; name: string; description: string; code: string };

export default function StudentCourses() {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    apiFetch<Course[]>('/courses').then(setCourses).catch(() => setCourses([]));
  }, []);

  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-bold text-navy-900">My Courses</h1>
      <div className="grid md:grid-cols-2 gap-4">
        {courses.map((course) => <CourseCard key={course.id} course={course} />)}
      </div>
    </div>
  );
}
