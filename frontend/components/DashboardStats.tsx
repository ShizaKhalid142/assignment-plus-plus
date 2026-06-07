type Props = { stats: { label: string; value: number }[] };

export default function DashboardStats({ stats }: Props) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {stats.map((s) => (
        <div key={s.label} className="card">
          <p className="text-sm text-slate-500">{s.label}</p>
          <p className="text-2xl font-bold text-navy-900 mt-1">{s.value}</p>
        </div>
      ))}
    </div>
  );
}
