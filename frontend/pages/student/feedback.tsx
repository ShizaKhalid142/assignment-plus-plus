import GradeDisplay from "../../components/GradeDisplay";
import Layout from "../../components/Layout";

export default function StudentFeedbackPage() {
  return (
    <Layout title="Grades & Feedback">
      <GradeDisplay grade={88} feedback="Strong reasoning. Add one more citation to improve evidence." />
    </Layout>
  );
}
