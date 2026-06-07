export default function GradeDisplay({ grade }: { grade: number | null | undefined }) {
  const value = grade ?? 0;
  const color = value >= 80 ? 'text-emerald-600' : value >= 60 ? 'text-amber-500' : 'text-rose-600';
  return <span className={`font-bold ${color}`}>{grade == null ? 'Pending' : `${value.toFixed(1)}%`}</span>;
}
