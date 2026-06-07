import Link from 'next/link';
import { useRouter } from 'next/router';

const links = [
  { href: '/teacher/dashboard', label: 'Teacher Dashboard' },
  { href: '/teacher/assignments', label: 'Teacher Assignments' },
  { href: '/student/dashboard', label: 'Student Dashboard' },
  { href: '/student/assignments', label: 'Student Assignments' }
];

export default function Navigation() {
  const { pathname } = useRouter();
  return (
    <nav className="sticky top-0 z-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur border-b border-slate-200 dark:border-slate-800">
      <div className="mx-auto max-w-6xl p-4 flex flex-wrap gap-2 items-center justify-between">
        <Link href="/" className="text-lg font-semibold text-brand-600">Assignment++</Link>
        <div className="flex flex-wrap gap-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-1.5 rounded-lg text-sm transition ${pathname === link.href ? 'bg-brand-600 text-white' : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
