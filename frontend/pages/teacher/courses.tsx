import { FormEvent, useEffect, useState } from 'react';

import CourseCard from '../../components/CourseCard';
import { apiFetch } from '../../lib/api';

type Course = { id: number; name: string; description: string; code: string };

export default function TeacherCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [code, setCode] = useState('');

  async function loadCourses() {
    const data = await apiFetch<Course[]>('/courses').catch(() => []);
    setCourses(data);
  }

  useEffect(() => {
    loadCourses();
  }, []);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    await apiFetch('/courses', { method: 'POST', body: JSON.stringify({ name, description, code }) });
    setName('');
    setDescription('');
    setCode('');
    await loadCourses();
  }

  return (
    <div className="space-y-5">
      <form className="card space-y-3" onSubmit={onSubmit}>
        <h1 className="text-2xl font-bold text-navy-900">Manage Courses</h1>
        <div className="grid md:grid-cols-3 gap-3">
          <input className="rounded-xl border px-3 py-2" value={name} onChange={(e) => setName(e.target.value)} placeholder="Course name" required />
          <input className="rounded-xl border px-3 py-2" value={code} onChange={(e) => setCode(e.target.value)} placeholder="Course code" required />
          <input className="rounded-xl border px-3 py-2" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
        </div>
        <button className="btn-primary">Create Course</button>
      </form>
      <div className="grid md:grid-cols-2 gap-4">
        {courses.map((course) => <CourseCard key={course.id} course={course} />)}
      </div>
    </div>
  );
}
