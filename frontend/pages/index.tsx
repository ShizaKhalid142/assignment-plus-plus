import Link from 'next/link';

const features = [
  'Assignment builder with rubric designer',
  'AI-assisted grading draft with teacher override',
  'Student draft feedback and transparent rubric scoring',
  'Submission + plagiarism workflow in one place',
  'Role-based teacher and student portals'
];

const benefits = [
  'Save teacher grading time',
  'Give students clear expectations',
  'Improve fairness with consistent rubric usage',
  'Track course performance and trends',
  'Support academic integrity with policy-aware tooling'
];

export default function Home() {
  return (
    <div className="space-y-8">
      <section className="card bg-gradient-to-r from-navy-900 to-navy-700 text-white border-none">
        <p className="text-sm uppercase tracking-wide text-white/70">Assignment++</p>
        <h1 className="text-4xl font-bold mt-2">The Only Companion Teachers and Students Need</h1>
        <p className="mt-3 text-white/90 max-w-3xl">
          AI-assisted assignment management platform that unifies course workflows, grading, feedback, and analytics.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link className="rounded-xl bg-white text-navy-900 px-4 py-2 font-medium" href="/auth/login">Log In</Link>
          <Link className="rounded-xl border border-white/50 px-4 py-2" href="/auth/signup">Sign Up</Link>
          <Link className="rounded-xl border border-white/50 px-4 py-2" href="/student/dashboard">Access as Guest</Link>
        </div>
      </section>

      <section className="grid lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-2xl font-semibold text-navy-900">How Student Portal Works</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            <li>1. View enrollments and active assignments with deadlines.</li>
            <li>2. Open full assignment details, rubric, and allowed resources.</li>
            <li>3. Upload drafts for feedback and submit final work.</li>
            <li>4. Track grades, comments, plagiarism report, and submission history.</li>
          </ul>
        </div>
        <div className="card">
          <h2 className="text-2xl font-semibold text-navy-900">How Teacher Portal Works</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            <li>1. Create courses and register students with ID numbers.</li>
            <li>2. Build assignments with rubric criteria and policies.</li>
            <li>3. Review submissions and AI grading drafts in queue.</li>
            <li>4. Publish final grades, feedback, and monitor class analytics.</li>
          </ul>
        </div>
      </section>

      <section className="grid md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-xl font-semibold text-navy-900">Features</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">{features.map((item) => <li key={item}>• {item}</li>)}</ul>
        </div>
        <div className="card">
          <h3 className="text-xl font-semibold text-navy-900">Benefits</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">{benefits.map((item) => <li key={item}>• {item}</li>)}</ul>
        </div>
      </section>

      <section className="card">
        <h3 className="text-xl font-semibold text-navy-900">Created By</h3>
        <p className="mt-2 text-sm text-slate-700">Shiza Khalid, Misbah Riaz, Muhammad Sulaim, Muhammad Shehroz, Abdul Mannan</p>
      </section>
    </div>
  );
}
