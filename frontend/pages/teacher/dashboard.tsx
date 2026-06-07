import { useEffect, useState } from 'react';

import DashboardStats from '../../components/DashboardStats';

export default function TeacherDashboard() {
  const [stats, setStats] = useState({ total_assignments: 0, total_submissions: 0, pending_reviews: 0 });

  useEffect(() => {
    fetch('http://localhost:8000/api/dashboard/teacher')
      .then((r) => r.json())
      .then(setStats)
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Teacher Dashboard</h1>
      <DashboardStats
        stats={[
          { label: 'Assignments', value: stats.total_assignments },
          { label: 'Submissions', value: stats.total_submissions },
          { label: 'Pending Reviews', value: stats.pending_reviews }
        ]}
      />
      <div className="card">Pending reviews and grading insights will appear here.</div>
    </div>
  );
}
