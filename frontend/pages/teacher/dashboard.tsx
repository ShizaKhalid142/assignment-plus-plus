import { useEffect, useState } from 'react';

import DashboardStats from '../../components/DashboardStats';
import { apiFetch } from '../../lib/api';

export default function TeacherDashboard() {
  const [stats, setStats] = useState({ total_assignments: 0, total_submissions: 0, pending_reviews: 0 });

  useEffect(() => {
    apiFetch('/dashboard/teacher').then((data) => setStats(data)).catch(() => setStats({ total_assignments: 0, total_submissions: 0, pending_reviews: 0 }));
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-navy-900">Teacher Dashboard</h1>
      <DashboardStats
        stats={[
          { label: 'Assignments', value: stats.total_assignments },
          { label: 'Submissions', value: stats.total_submissions },
          { label: 'Pending Reviews', value: stats.pending_reviews }
        ]}
      />
      <div className="card text-sm text-slate-700">Use the grading queue to review AI drafts, accept grades, or override results.</div>
    </div>
  );
}
