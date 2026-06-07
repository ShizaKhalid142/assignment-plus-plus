import Link from "next/link";
import Layout from "../components/Layout";

export default function HomePage() {
  return (
    <Layout title="Assignment++ Dashboard">
      <p className="mb-4">Choose a portal to continue.</p>
      <div className="flex gap-3">
        <Link href="/teacher/dashboard" className="rounded bg-indigo-600 px-4 py-2 text-white">Teacher Portal</Link>
        <Link href="/student/dashboard" className="rounded bg-emerald-600 px-4 py-2 text-white">Student Portal</Link>
      </div>
    </Layout>
  );
}
