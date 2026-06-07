import Link from 'next/link';
import { useRouter } from 'next/router';

const links = [
  { href: '/', label: 'Home' },
  { href: '/auth/login', label: 'Login' },
  { href: '/auth/signup', label: 'Sign Up' }
];

export default function Navigation() {
  const { pathname } = useRouter();
  return (
    <nav className="bg-white border-b border-navy-100">
      <div className="mx-auto max-w-7xl p-4 flex gap-3 items-center justify-between">
        <Link href="/" className="text-xl font-semibold text-navy-900">Assignment++</Link>
        <div className="flex gap-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-xl px-3 py-1.5 text-sm ${pathname === link.href ? 'bg-navy-900 text-white' : 'text-navy-900 hover:bg-navy-100'}`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
