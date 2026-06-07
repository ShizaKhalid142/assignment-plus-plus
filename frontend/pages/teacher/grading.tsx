import Layout from "../../components/Layout";

export default function TeacherGradingPage() {
  return (
    <Layout title="Grading Queue">
      <p className="text-sm text-slate-700">Submissions waiting for review:</p>
      <ul className="mt-2 list-disc pl-5">
        <li>Student #12 - Essay 1</li>
        <li>Student #27 - Lab Report</li>
      </ul>
    </Layout>
  );
}
