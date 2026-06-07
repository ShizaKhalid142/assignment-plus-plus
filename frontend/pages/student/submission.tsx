import SubmissionForm from '../../components/SubmissionForm';

export default function StudentSubmission() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Submit Your Work</h1>
      <SubmissionForm assignmentId={1} />
    </div>
  );
}
