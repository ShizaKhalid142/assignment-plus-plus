import { ReactNode } from 'react';
import Navigation from './Navigation';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="mx-auto max-w-6xl p-6">{children}</main>
    </div>
  );
}
