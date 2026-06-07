import AssignmentCard from "../../components/AssignmentCard";
import Layout from "../../components/Layout";

const assignments = [
  { title: "Essay 1", course: "English 101", dueDate: "2026-06-15" },
  { title: "Lab Report", course: "Physics 201", dueDate: "2026-06-18" },
];

export default function TeacherAssignmentsPage() {
  return (
    <Layout title="Teacher Assignments">
      <div className="space-y-3">
        {assignments.map((assignment) => (
          <AssignmentCard key={assignment.title} {...assignment} />
        ))}
      </div>
    </Layout>
  );
}
