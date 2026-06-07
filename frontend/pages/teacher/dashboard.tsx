import Layout from "../../components/Layout";

export default function TeacherDashboardPage() {
  return (
    <Layout title="Teacher Dashboard">
      <ul className="list-disc space-y-2 pl-5">
        <li>Pending reviews: 8</li>
        <li>Average class grade: 84%</li>
        <li>Potential plagiarism flags: 2</li>
      </ul>
    </Layout>
  );
}
