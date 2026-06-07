type Criterion = { name: string; maxPoints: number; description: string };

export default function RubricDisplay({ criteria }: { criteria: Criterion[] }) {
  return (
    <div className="rounded border p-4">
      <h3 className="mb-2 text-lg font-semibold">Rubric</h3>
      <ul className="space-y-2">
        {criteria.map((criterion) => (
          <li key={criterion.name} className="rounded bg-slate-50 p-2">
            <p className="font-medium">{criterion.name} ({criterion.maxPoints} pts)</p>
            <p className="text-sm text-slate-600">{criterion.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
