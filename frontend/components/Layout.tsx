import { ReactNode, createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';

import { getRole } from '../lib/auth';
import Navigation from './Navigation';
import NotificationBar from './NotificationBar';
import Sidebar from './Sidebar';

const LayoutContext = createContext(false);

export default function Layout({ children }: { children: ReactNode }) {
  const nestedLayout = useContext(LayoutContext);
  const { pathname } = useRouter();
  const [sessionRole, setSessionRole] = useState<'student' | 'teacher' | 'admin' | null>(null);

  if (nestedLayout) {
    return <>{children}</>;
  }

  const role = useMemo(() => {
    if (pathname.startsWith('/admin')) return 'admin';
    if (pathname.startsWith('/teacher')) return 'teacher';
    if (pathname.startsWith('/student')) return 'student';
    return null;
  }, [pathname]);

  useEffect(() => {
    setSessionRole(getRole());
  }, [pathname]);

  const isBrandPage = pathname === '/' || pathname.startsWith('/auth');

  if (role && (!sessionRole || sessionRole === role)) {
    return (
      <LayoutContext.Provider value={true}>
        <div className="portal-dark" style={{ minHeight: '100vh', backgroundColor: '#000000', color: '#ffffff' }}>
          <NotificationBar />
          <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '24px', display: 'flex', gap: '16px', flexDirection: 'row' }}>
            <Sidebar role={role} />
            <main style={{ flex: 1 }}>{children}</main>
          </div>
        </div>
      </LayoutContext.Provider>
    );
  }

  return (
    <LayoutContext.Provider value={true}>
      <div style={{ minHeight: '100vh', backgroundColor: isBrandPage ? '#000000' : '#ffffff' }}>
        <Navigation />
        <main style={{ maxWidth: '1440px', margin: '0 auto', padding: isBrandPage ? '0' : '40px' }}>{children}</main>
      </div>
    </LayoutContext.Provider>
  );
}
