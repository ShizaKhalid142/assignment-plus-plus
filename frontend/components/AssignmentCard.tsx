type Props = { title: string; description: string; dueDate?: string | null };

export default function AssignmentCard({ title, description, dueDate }: Props) {
  return (
    <div className="card transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex justify-between">
        <h3 className="font-semibold text-lg text-white/90">{title}</h3>
        <span className="text-3xl">📝</span>
      </div>
      <p className="text-sm text-white/60 mt-1">{description}</p>
      <p className="mt-3 text-xs text-white/50 font-medium">Due: {dueDate || 'TBD'}</p>
    </div>
  );
}
