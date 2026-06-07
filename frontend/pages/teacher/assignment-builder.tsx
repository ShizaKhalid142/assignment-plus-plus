import Layout from "../../components/Layout";
import RubricDisplay from "../../components/RubricDisplay";

const criteria = [
  { name: "Structure", maxPoints: 30, description: "Clear intro, body, and conclusion" },
  { name: "Accuracy", maxPoints: 40, description: "Correct concepts and references" },
  { name: "Clarity", maxPoints: 30, description: "Readable explanations and examples" },
];

export default function AssignmentBuilderPage() {
  return (
    <Layout title="Assignment Builder">
      <p className="mb-4 text-sm text-slate-700">Create and edit assignments with rubric criteria.</p>
      <RubricDisplay criteria={criteria} />
    </Layout>
  );
}
