import { ReactNode, useMemo } from 'react';
import { useRouter } from 'next/router';

import Navigation from './Navigation';
import NotificationBar from './NotificationBar';
import Sidebar from './Sidebar';

export default function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useRouter();

  const role = useMemo(() => {
    if (pathname.startsWith('/teacher')) return 'teacher';
    if (pathname.startsWith('/student')) return 'student';
    return null;
  }, [pathname]);

  if (role) {
    return (
      <div className="min-h-screen bg-navy-100">
        <NotificationBar />
        <div className="mx-auto max-w-7xl p-4 md:p-6 flex flex-col md:flex-row gap-4">
          <Sidebar role={role} />
          <main className="flex-1">{children}</main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="mx-auto max-w-7xl p-6">{children}</main>
    </div>
  );
}
