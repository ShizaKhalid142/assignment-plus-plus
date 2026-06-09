export default function RubricDisplay({ rubric }: { rubric: { criterion: string; points: number }[] }) {
  return (
    <div className="card">
      <h3 className="font-semibold mb-2 text-white/90">Rubric</h3>
      <ul className="space-y-2">
        {rubric.map((item) => (
          <li key={item.criterion} className="flex justify-between text-sm text-white/70">
            <span>{item.criterion}</span>
            <span className="font-medium text-white/90">{item.points} pts</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
