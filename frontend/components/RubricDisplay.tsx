export default function RubricDisplay({ rubric }: { rubric: { criterion: string; points: number }[] }) {
  return (
    <div className="card">
      <h3 className="font-semibold mb-2">Rubric</h3>
      <ul className="space-y-2">
        {rubric.map((item) => (
          <li key={item.criterion} className="flex justify-between text-sm">
            <span>{item.criterion}</span>
            <span className="font-medium">{item.points} pts</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
