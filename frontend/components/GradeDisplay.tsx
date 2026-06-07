export default function GradeDisplay({ grade, feedback }: { grade: number; feedback: string }) {
  return (
    <section className="rounded border p-4">
      <h3 className="text-lg font-semibold">Grade</h3>
      <p className="text-3xl font-bold text-indigo-700">{grade}%</p>
      <p className="mt-2 text-sm text-slate-700">{feedback}</p>
    </section>
  );
}
