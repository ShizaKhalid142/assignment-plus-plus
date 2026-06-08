import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Check, Play } from 'lucide-react'
import BackgroundVideo from '../components/BackgroundVideo'
import { apiFetch } from '../lib/api'
import { saveSession } from '../lib/auth'

const teacherWorkflow = [
  'Dashboard → Quick stats for pending reviews, submissions, and course health.',
  'Courses → Create and manage classes, enroll students, and share materials.',
  'Assignment Builder → Define rubrics, due dates, allowed resources, and hint policy.',
  'Submissions → Track student uploads, draft history, and review requests.',
  'Grading Queue → Review AI suggestions, accept drafts, and override final grades.',
  'Analytics → Identify student gaps, class trends, and performance patterns.',
  'Settings → Adjust grading, feedback, and security policy controls.',
]

const studentWorkflow = [
  'Dashboard → See active assignments, deadlines, and quick action cards.',
  'Courses → Review enrolled classes and course information.',
  'Assignment Detail → View full briefs, rubric criteria, and allowed resources.',
  'Submit → Upload drafts, request feedback, and finalize work.',
  'Feedback → Review rubric-based comments, grades, and integrity notes.',
  'History → Reflect on past assignments and improvement areas.',
]

const techStack = [
  { title: 'React + Next.js', description: 'A modern, responsive frontend for teachers and students.' },
  { title: 'Tailwind CSS', description: 'Polished dark glass UI with clean workflow pages.' },
  { title: 'FastAPI', description: 'Fast backend API routes for auth, assignments, and analytics.' },
  { title: 'JWT Auth', description: 'Secure role-based sessions for teachers and students.' },
  { title: 'HLS Video', description: 'Immersive hero media for the landing experience.' },
  { title: 'AI & Plagiarism', description: 'Support for grading drafts and integrity-aware checks.' },
]

export default function Home() {
  const router = useRouter()
  const [showEmailForm, setShowEmailForm] = useState(false)
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [placeholder, setPlaceholder] = useState('')
  const [index, setIndex] = useState(0)
  const [guestLoading, setGuestLoading] = useState(false)

  const messageText = useMemo(
    () => (submitted ? 'You Will Receive Notifications By Email' : 'Enter Your Email Here For Early Access'),
    [submitted]
  )

  useEffect(() => {
    if (!showEmailForm) {
      setPlaceholder('')
      setIndex(0)
      return
    }

    if (index >= messageText.length) return

    const timer = window.setTimeout(() => {
      setPlaceholder(messageText.slice(0, index + 1))
      setIndex((current) => current + 1)
    }, 55)

    return () => window.clearTimeout(timer)
  }, [messageText, showEmailForm, index])

  useEffect(() => {
    if (!submitted) return

    const timer = window.setTimeout(() => {
      setShowEmailForm(false)
      setSubmitted(false)
      setEmail('')
      setPlaceholder('')
      setIndex(0)
    }, 4000)

    return () => window.clearTimeout(timer)
  }, [submitted])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitted(true)
    setPlaceholder('You Will Receive Notifications By Email')
    setIndex(0)
  }

  const handleGuestAccess = async () => {
    setGuestLoading(true)
    try {
      const data = await apiFetch<{ access_token: string; role: 'student' | 'teacher' | 'admin'; user_id?: number }>('/api/auth/guest', {
        method: 'POST',
      })
      saveSession(data.access_token, data.role, data.user_id)
      router.push(data.role === 'teacher' ? '/teacher/dashboard' : '/student/dashboard')
    } catch (err) {
      console.error('Guest access failed', err)
    } finally {
      setGuestLoading(false)
    }
  }

  return (
    <main className="relative min-h-screen w-screen overflow-hidden bg-black text-white selection:bg-white selection:text-black">
      <BackgroundVideo />
      <div className="absolute inset-0 bg-black/85" />
      <div className="relative z-10 flex min-h-screen flex-col">
        <section className="flex-1 px-6 py-8 lg:px-10 lg:py-12">
          <div className="mx-auto flex h-full max-w-6xl flex-col justify-between gap-10 py-12">
            <div className="space-y-6 text-center">
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.6 }}
                className="text-[11px] font-medium uppercase tracking-[0.3em] text-white/70"
              >
                ASSIGNMENT++ | TEACHER & STUDENT WORKFLOW PLATFORM
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                style={{ fontFamily: "'Instrument Serif', serif" }}
                className="mx-auto max-w-4xl text-4xl font-medium leading-[1.05] tracking-[-0.02em] text-white md:text-[64px]"
              >
                Build assignments, grade smarter, and give students feedback that matters.
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.6 }}
                className="mx-auto max-w-2xl text-sm leading-7 text-white/75 md:text-base"
              >
                Assignment++ unifies course management, rubric-based grading, AI-assisted review, plagiarism detection, and student progress in one polished app.
              </motion.p>
            </div>

            <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-4">
              <AnimatePresence mode="wait">
                {showEmailForm ? (
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                    className="glass-pill flex w-full max-w-[420px] items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2.5 shadow-[0_0_60px_rgba(255,255,255,0.05)]"
                  >
                    <input
                      className="flex-1 bg-transparent text-white placeholder-white/40 outline-none"
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder={placeholder || 'Enter your email to get started'}
                      required
                    />
                    <button
                      type="submit"
                      className="glass-pill inline-flex items-center rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/15"
                    >
                      {submitted ? <Check size={18} /> : <ArrowRight size={18} />}
                    </button>
                  </motion.form>
                ) : (
                  <motion.button
                    key="button"
                    onClick={() => setShowEmailForm(true)}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                    className="glass-pill inline-flex items-center rounded-full border border-white/15 bg-white/5 px-10 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
                  >
                    Get early access
                  </motion.button>
                )}
              </AnimatePresence>

              <motion.a
                href="#teacher-flow"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.4 }}
                className="inline-flex items-center gap-2 text-sm font-medium text-white/80 transition hover:text-white"
              >
                <Play size={16} />
                Explore teacher workflow
              </motion.a>
            </div>
          </div>
        </section>
      </div>

      <section id="features" className="relative z-10 px-6 py-20 lg:px-10">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-white/50">Features</p>
            <h2 className="mt-4 text-3xl font-semibold text-white md:text-4xl">Core teacher and student capabilities</h2>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-[32px] border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
              <h3 className="text-2xl font-semibold text-white">Teacher capabilities</h3>
              <ul className="mt-6 space-y-4 text-sm text-white/70">
                <li>• Create assignments with rubrics, grading standards, and allowed resources.</li>
                <li>• Review AI grading drafts and retain full teacher override control.</li>
                <li>• Detect plagiarism with confidence-based reporting.</li>
                <li>• Manage courses, registration, and feedback from one portal.</li>
              </ul>
            </div>
            <div className="rounded-[32px] border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
              <h3 className="text-2xl font-semibold text-white">Student experience</h3>
              <ul className="mt-6 space-y-4 text-sm text-white/70">
                <li>• Access assignment briefs, rubric criteria, and allowed resource guidance.</li>
                <li>• Request draft feedback before final submission.</li>
                <li>• Review rubric-based comments, grades, and plagiarism notes.</li>
                <li>• Track progress and performance over time.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="teacher-flow" className="relative z-10 px-6 py-20 lg:px-10 bg-slate-950/80">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-white/50">Teacher Flow</p>
            <h2 className="mt-4 text-3xl font-semibold text-white md:text-4xl">Teacher workflow pages and experience</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {teacherWorkflow.map((item) => (
              <div key={item} className="rounded-[32px] border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
                <p className="text-sm text-white/70">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="student-flow" className="relative z-10 px-6 py-20 lg:px-10">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-white/50">Student Flow</p>
            <h2 className="mt-4 text-3xl font-semibold text-white md:text-4xl">Student workflow pages and experience</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {studentWorkflow.map((item) => (
              <div key={item} className="rounded-[32px] border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
                <p className="text-sm text-white/70">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="architecture" className="relative z-10 px-6 py-20 lg:px-10 bg-slate-950/80">
        <div className="mx-auto max-w-6xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-white/50">Architecture</p>
          <h2 className="mt-4 text-3xl font-semibold text-white md:text-4xl">The platform architecture</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <div className="rounded-[32px] border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
              <h3 className="text-xl font-semibold text-white">Frontend</h3>
              <p className="mt-4 text-sm text-white/70">Next.js provides the landing pages, auth flow, and role-specific dashboards.</p>
            </div>
            <div className="rounded-[32px] border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
              <h3 className="text-xl font-semibold text-white">Backend</h3>
              <p className="mt-4 text-sm text-white/70">FastAPI handles authentication, assignments, grading, and analytics.</p>
            </div>
            <div className="rounded-[32px] border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
              <h3 className="text-xl font-semibold text-white">Storage</h3>
              <p className="mt-4 text-sm text-white/70">SQL-backed persistence and file support for submissions and history.</p>
            </div>
            <div className="rounded-[32px] border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
              <h3 className="text-xl font-semibold text-white">AI & Integrity</h3>
              <p className="mt-4 text-sm text-white/70">AI grading and hints are paired with teacher oversight and plagiarism checks.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="stack" className="relative z-10 px-6 py-20 lg:px-10">
        <div className="mx-auto max-w-6xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-white/50">Tech Stack</p>
          <h2 className="mt-4 text-3xl font-semibold text-white md:text-4xl">Modern stack for a complete classroom workflow</h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {techStack.map((item) => (
              <div key={item.title} className="rounded-[32px] border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
                <p className="text-lg font-semibold text-white">{item.title}</p>
                <p className="mt-4 text-sm text-white/70">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="cta" className="relative z-10 px-6 py-20 lg:px-10">
        <div className="mx-auto max-w-6xl rounded-[36px] border border-white/10 bg-white/5 p-10 backdrop-blur-xl">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-white/50">Ready to launch</p>
              <h2 className="mt-4 text-3xl font-semibold text-white md:text-4xl">The frontend workflow now aligns with the proposal</h2>
              <p className="mt-4 max-w-xl text-sm leading-7 text-white/70">Teacher and student flows are presented clearly alongside auth and role-specific workspace pages.</p>
            </div>
            <div className="flex flex-col gap-4">
              <Link href="/auth/signup" className="glass-pill inline-flex items-center justify-center rounded-full px-8 py-3 text-sm font-semibold text-white transition hover:bg-white/15">Create account</Link>
              <Link href="/auth/login" className="inline-flex items-center justify-center rounded-full border border-white/15 px-8 py-3 text-sm font-semibold text-white transition hover:bg-white/15">Log in</Link>
              <button
                type="button"
                onClick={handleGuestAccess}
                disabled={guestLoading}
                className="inline-flex items-center justify-center rounded-full border border-white/15 px-8 py-3 text-sm font-semibold text-white transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {guestLoading ? 'Starting guest session…' : 'Continue as guest'}
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
