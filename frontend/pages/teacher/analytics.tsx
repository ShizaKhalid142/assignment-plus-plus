import { FormEvent, useState } from 'react';

import { apiFetch } from '../../lib/api';

type CourseAnalytics = {
  students: number;
  assignments: number;
  submission_count: number;
  average_grade: number | null;
};

export default function TeacherAnalytics() {
  const [courseId, setCourseId] = useState(1);
  const [data, setData] = useState<CourseAnalytics | null>(null);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    const result = await apiFetch(`/courses/${courseId}/analytics`).catch(() => null);
    setData(result);
  }

  return (
    <div className="space-y-4">
      <form className="card max-w-sm space-y-3" onSubmit={onSubmit}>
        <h1 className="text-xl font-semibold text-navy-900">Class Analytics</h1>
        <input className="w-full rounded-xl border px-3 py-2" type="number" min={1} value={courseId} onChange={(e) => setCourseId(Number(e.target.value))} />
        <button className="btn-primary w-full">Load Analytics</button>
      </form>
      {data && (
        <div className="card">
          <p className="text-sm">Students: <strong>{data.students}</strong></p>
          <p className="text-sm">Assignments: <strong>{data.assignments}</strong></p>
          <p className="text-sm">Submissions: <strong>{data.submission_count}</strong></p>
          <p className="text-sm">Average Grade: <strong>{data.average_grade}</strong></p>
        </div>
      )}
    </div>
  );
}
