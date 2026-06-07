import Layout from "../../components/Layout";

export default function StudentDashboardPage() {
  return (
    <Layout title="Student Dashboard">
      <ul className="list-disc space-y-2 pl-5">
        <li>Active assignments: 3</li>
        <li>Upcoming due date: Essay 1 (2 days left)</li>
        <li>Latest feedback available: Lab 2</li>
      </ul>
    </Layout>
  );
}
