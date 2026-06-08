import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getRole, isAuthenticated, clearSession } from '../lib/auth';
import { apiFetch } from '../lib/api';

const links = [
  { href: '/', label: 'Home' },
];

export default function Navigation() {
  const { pathname, push } = useRouter();
  const [authenticated, setAuthenticated] = useState(false);
  const [role, setRole] = useState<'student' | 'teacher' | 'admin' | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = isAuthenticated();
    const userRole = getRole();
    setAuthenticated(auth);
    setRole(userRole);
    setLoading(false);
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await apiFetch('/auth/logout', { method: 'POST' });
    } catch {
      // Ignore errors
    }
    clearSession();
    push('/');
  };

  if (loading) {
    return null;
  }

  return (
    <nav className="sticky top-0 z-50 bg-white border-b-2 border-navy-200 shadow-sm">
      <div className="mx-auto max-w-7xl px-4 py-3 flex gap-3 items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-navy-900 hover:text-navy-700 transition">
          🎓 Assignment++
        </Link>
        
        <div className="flex gap-2 items-center">
          {/* Main Links */}
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                pathname === link.href
                  ? 'bg-navy-900 text-white'
                  : 'text-navy-900 hover:bg-navy-100'
              }`}
            >
              {link.label}
            </Link>
          ))}

          {/* Auth Links or User Menu */}
          {!authenticated ? (
            <>
              <Link
                href="/auth/login"
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                  pathname === '/auth/login'
                    ? 'bg-navy-900 text-white'
                    : 'text-navy-900 hover:bg-navy-100'
                }`}
              >
                🔐 Log In
              </Link>
              <Link
                href="/auth/signup"
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                  pathname === '/auth/signup'
                    ? 'bg-navy-900 text-white'
                    : 'text-navy-900 hover:bg-navy-100'
                }`}
              >
                ✍️ Sign Up
              </Link>
              <Link
                href="/student/dashboard"
                className="rounded-lg px-4 py-2 text-sm font-medium bg-blue-100 text-blue-900 hover:bg-blue-200 transition"
              >
                👁️ Guest
              </Link>
            </>
          ) : (
            <>
              <span className="px-3 py-2 text-sm text-slate-600">
                {role === 'teacher' ? '🏫' : role === 'admin' ? '👑' : '🎓'} {role === 'teacher' ? 'Teacher' : role === 'admin' ? 'Admin' : 'Student'}
              </span>
              {role === 'admin' && (
                <Link href="/admin/dashboard" className="rounded-lg px-4 py-2 text-sm font-medium bg-purple-100 text-purple-900 hover:bg-purple-200 transition">
                  👑 Admin Panel
                </Link>
              )}
              {role === 'teacher' && (
                <Link href="/teacher/dashboard" className="rounded-lg px-4 py-2 text-sm font-medium text-navy-900 hover:bg-navy-100 transition">
                  🏫 Dashboard
                </Link>
              )}
              {role === 'student' && (
                <Link href="/student/dashboard" className="rounded-lg px-4 py-2 text-sm font-medium text-navy-900 hover:bg-navy-100 transition">
                  📊 Dashboard
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="rounded-lg px-4 py-2 text-sm font-medium bg-red-100 text-red-900 hover:bg-red-200 transition"
              >
                🚪 Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
