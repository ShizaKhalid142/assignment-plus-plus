import { ReactNode } from 'react';

type Course = { id: number; name: string; description: string; code: string };

export default function CourseCard({ course, action }: { course: Course; action?: ReactNode }) {
  return (
    <div className="card">
      <div className="flex justify-between items-start gap-3">
        <div>
          <h3 className="font-semibold text-lg text-navy-900">{course.name}</h3>
          <p className="text-sm text-slate-600">{course.code}</p>
        </div>
        <span className="text-3xl">📘</span>
      </div>
      <p className="mt-2 text-sm text-slate-700">{course.description || 'No description provided.'}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
