import Link from 'next/link';
import { useRouter } from 'next/router';

import { apiFetch } from '../lib/api';
import { clearSession } from '../lib/auth';

type NavItem = { href: string; label: string; icon: string };

const studentItems: NavItem[] = [
  { href: '/student/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/student/courses', label: 'Courses', icon: '📚' },
  { href: '/student/assignments', label: 'Assignments', icon: '📝' },
  { href: '/student/assignment-detail', label: 'Assignment Detail', icon: '📋' },
  { href: '/student/submit', label: 'Submit', icon: '📤' },
  { href: '/student/feedback', label: 'Feedback', icon: '✅' },
  { href: '/student/history', label: 'History', icon: '🕘' },
  { href: '/student/settings', label: 'Settings', icon: '⚙️' }
];

const teacherItems: NavItem[] = [
  { href: '/teacher/dashboard', label: 'Dashboard', icon: '📈' },
  { href: '/teacher/courses', label: 'Courses', icon: '🏫' },
  { href: '/teacher/assignment-builder', label: 'Assignment Builder', icon: '🧱' },
  { href: '/teacher/submissions', label: 'Submissions', icon: '📂' },
  { href: '/teacher/grading-queue', label: 'Grading Queue', icon: '🧠' },
  { href: '/teacher/analytics', label: 'Analytics', icon: '📉' },
  { href: '/teacher/student-register', label: 'Student Register', icon: '🪪' },
  { href: '/teacher/settings', label: 'Settings', icon: '⚙️' }
];

const adminItems: NavItem[] = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: '👑' },
  { href: '/admin/dashboard', label: 'Platform Stats', icon: '📊' },
  { href: '/admin/dashboard', label: 'Users', icon: '👥' },
  { href: '/admin/dashboard', label: 'Courses', icon: '📚' },
];

export default function Sidebar({ role }: { role: 'student' | 'teacher' | 'admin' | null }) {
  const { pathname, push } = useRouter();
  const items = role === 'admin' ? adminItems : role === 'teacher' ? teacherItems : studentItems;

  return (
    <aside className="w-full md:w-72 shrink-0">
      <div className="card bg-navy-900 text-white border-navy-800">
        <h2 className="text-xl font-semibold">{role === 'admin' ? 'Admin Panel' : role === 'teacher' ? 'Teacher Portal' : 'Student Portal'}</h2>
        <p className="text-sm text-white/70 mt-1">Assignment++ Navigation</p>
        <nav className="mt-4 space-y-2">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block rounded-xl px-3 py-2 text-sm transition ${pathname === item.href ? 'bg-white text-navy-900 font-semibold' : 'hover:bg-white/10'}`}
            >
              <span className="text-lg mr-2">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <button
          className="mt-4 w-full rounded-xl bg-white/10 hover:bg-white/20 px-3 py-2 text-sm"
          onClick={async () => {
            await apiFetch('/auth/logout', { method: 'POST' }).catch(() => undefined);
            clearSession();
            push('/');
          }}
        >
          Logout
        </button>
      </div>
    </aside>
  );
}
