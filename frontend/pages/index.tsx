import Link from 'next/link';

export default function Home() {
  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold">Assignment++ Demo</h1>
      <p className="text-slate-600 dark:text-slate-300">AI-assisted grading, hints, and plagiarism analysis.</p>
      <div className="flex gap-3">
        <Link className="rounded bg-brand-600 text-white px-4 py-2" href="/teacher/dashboard">Teacher Portal</Link>
        <Link className="rounded bg-slate-800 text-white px-4 py-2" href="/student/dashboard">Student Portal</Link>
      </div>
    </div>
  );
}
