import Link from "next/link";

const links = [
  { href: "/", label: "Home" },
  { href: "/teacher/dashboard", label: "Teacher Dashboard" },
  { href: "/student/dashboard", label: "Student Dashboard" },
];

export default function Navigation() {
  return (
    <nav className="mx-auto mb-6 flex max-w-5xl gap-4">
      {links.map((link) => (
        <Link key={link.href} href={link.href} className="rounded bg-slate-900 px-3 py-2 text-sm text-white">
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
