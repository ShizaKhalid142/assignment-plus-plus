export type AssignmentCardProps = {
  title: string;
  course: string;
  dueDate: string;
};

export default function AssignmentCard({ title, course, dueDate }: AssignmentCardProps) {
  return (
    <article className="rounded border p-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-sm text-slate-600">Course: {course}</p>
      <p className="text-sm text-slate-600">Due: {dueDate}</p>
    </article>
  );
}
