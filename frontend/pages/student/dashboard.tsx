import { useEffect, useState } from 'react';

import AssignmentCard from '../../components/AssignmentCard';
import DashboardStats from '../../components/DashboardStats';
import { apiFetch } from '../../lib/api';

type Assignment = { id: number; title: string; description: string; due_date?: string };

export default function StudentDashboard() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);

  useEffect(() => {
    apiFetch<{ active_assignments: Assignment[] }>('/dashboard/student')
      .then((data) => setAssignments(data.active_assignments || []))
      .catch(() => setAssignments([]));
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-navy-900">Student Dashboard</h1>
      <DashboardStats
        stats={[
          { label: 'Active Assignments', value: assignments.length },
          { label: 'Upcoming Deadlines', value: assignments.filter((item) => Boolean(item.due_date)).length },
          { label: 'No Deadline Set', value: assignments.filter((item) => !item.due_date).length }
        ]}
      />
      <div className="grid md:grid-cols-2 gap-4">
        {assignments.map((item) => <AssignmentCard key={item.id} title={item.title} description={item.description} dueDate={item.due_date} />)}
      </div>
    </div>
  );
}
