import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getRole, isAuthenticated, clearSession } from '../lib/auth';
import { apiFetch } from '../lib/api';

const navLinks = [
  { href: '/#features', label: 'Features' },
  { href: '/#teacher-flow', label: 'Teacher Flow' },
  { href: '/#student-flow', label: 'Student Flow' },
  { href: '/#architecture', label: 'Architecture' },
  { href: '/#stack', label: 'Tech Stack' },
];

function dashboardLinkForRole(role: 'student' | 'teacher' | 'admin' | null) {
  if (role === 'teacher') return '/teacher/dashboard';
  if (role === 'student') return '/student/dashboard';
  if (role === 'admin') return '/admin/dashboard';
  return '/auth/login';
}

export default function Navigation() {
  const { pathname, push } = useRouter();
  const [authenticated, setAuthenticated] = useState(false);
  const [role, setRole] = useState<'student' | 'teacher' | 'admin' | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setAuthenticated(isAuthenticated());
    setRole(getRole());
    setLoading(false);
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await apiFetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // ignore failures, clear local session anyway
    }
    clearSession();
    push('/');
  };

  if (loading) {
    return null;
  }

  const isActive = (href: string) => pathname === href || (pathname === '/' && href.startsWith('/#'));

  return (
    <nav style={{ position: 'sticky', top: 0, zIndex: 100, padding: '18px 0', background: 'rgba(0,0,0,0.18)', backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: '1440px', margin: '0 auto', padding: '0 28px', gap: '24px' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '14px', textDecoration: 'none' }}>
          <div style={{ minWidth: '44px', minHeight: '44px', borderRadius: '18px', border: '1px solid rgba(255,255,255,0.18)', background: 'rgba(255,255,255,0.06)', display: 'grid', placeItems: 'center' }}>
            <span style={{ color: 'white', fontSize: '18px', fontWeight: 800 }}>+</span>
          </div>
          <div>
            <div style={{ fontSize: '10px', letterSpacing: '0.35em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)', marginBottom: '2px' }}>Assignment</div>
            <div style={{ fontSize: '18px', fontWeight: 800, letterSpacing: '0.16em', color: 'white' }}>PLUS PLUS</div>
          </div>
        </Link>

        <div style={{ display: 'flex', gap: '24px', alignItems: 'center', flex: '1', justifyContent: 'center' }}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                color: isActive(link.href) ? 'white' : 'rgba(255,255,255,0.68)',
                textDecoration: 'none',
                fontSize: '13px',
                fontWeight: 600,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                transition: 'color 0.2s ease',
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {authenticated ? (
            <>
              <Link
                href={dashboardLinkForRole(role)}
                style={{ color: 'white', textDecoration: 'none', fontWeight: 600, fontSize: '14px', letterSpacing: '0.06em' }}
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                style={{ padding: '12px 20px', fontSize: '14px', fontWeight: 600, color: 'white', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.16)', borderRadius: '9999px', cursor: 'pointer' }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth/signup"
                style={{ color: 'white', textDecoration: 'none', fontWeight: 600, fontSize: '14px', letterSpacing: '0.06em' }}
              >
                Sign Up
              </Link>
              <Link
                href="/auth/login"
                className="glass-pill"
                style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '12px 20px', fontSize: '14px', fontWeight: 600, color: 'white', textDecoration: 'none' }}
              >
                Login
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
