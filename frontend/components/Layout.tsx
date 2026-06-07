import { ReactNode } from "react";
import Navigation from "./Navigation";

export default function Layout({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="min-h-screen p-6">
      <Navigation />
      <main className="mx-auto max-w-5xl rounded bg-white p-6 shadow">
        <h1 className="mb-4 text-2xl font-bold">{title}</h1>
        {children}
      </main>
    </div>
  );
}
