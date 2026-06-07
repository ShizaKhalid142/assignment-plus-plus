type Props = { title: string; description: string; dueDate?: string | null };

export default function AssignmentCard({ title, description, dueDate }: Props) {
  return (
    <div className="card transition hover:-translate-y-0.5 hover:shadow-md">
      <h3 className="font-semibold text-lg">{title}</h3>
      <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{description}</p>
      <p className="mt-3 text-xs text-brand-600">Due: {dueDate || 'TBD'}</p>
    </div>
  );
}
