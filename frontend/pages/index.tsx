import Link from 'next/link';
import { useState } from 'react';

const features = [
  { icon: '🏗️', title: 'Assignment Builder', desc: 'Create assignments with custom rubrics and submission policies' },
  { icon: '🤖', title: 'AI Grading', desc: 'Get AI-drafted grades reviewed and overridden by teachers' },
  { icon: '✍️', title: 'Draft Feedback', desc: 'Students submit drafts and get AI feedback before final submission' },
  { icon: '📊', title: 'Analytics', desc: 'Track class performance, trends, and identify struggling students' },
  { icon: '🔍', title: 'Plagiarism Detection', desc: 'Intelligent plagiarism checking with confidence scores' },
  { icon: '📋', title: 'Transparent Grading', desc: 'Rubric-based scoring students can understand clearly' }
];

const benefits = [
  { icon: '⏱️', title: 'Save Time', desc: 'Teachers spend 70% less time on manual grading' },
  { icon: '📈', title: 'Improve Learning', desc: 'Students get real-time feedback and guidance' },
  { icon: '⚖️', title: 'Fair Grading', desc: 'Consistent rubric usage across all submissions' },
  { icon: '🔒', title: 'Academic Integrity', desc: 'Policy-aware tools that support honest work' },
  { icon: '📱', title: 'Access Anywhere', desc: 'Work on any device with a web browser' },
  { icon: '🎓', title: 'Better Outcomes', desc: 'Improved student performance and engagement' }
];

const studentWorkflow = [
  { step: 1, title: 'Dashboard', desc: 'View active assignments and upcoming deadlines' },
  { step: 2, title: 'Browse Courses', desc: 'Enroll in courses and manage your coursework' },
  { step: 3, title: 'Assignment Details', desc: 'Read full brief, rubric, and allowed resources' },
  { step: 4, title: 'Submit Work', desc: 'Upload files and submit final assignments' },
  { step: 5, title: 'Get Feedback', desc: 'Review grades, comments, and plagiarism reports' },
  { step: 6, title: 'Track Progress', desc: 'View history and learn from past submissions' }
];

const teacherWorkflow = [
  { step: 1, title: 'Dashboard', desc: 'Quick stats on pending reviews and submissions' },
  { step: 2, title: 'Manage Courses', desc: 'Create courses and register students' },
  { step: 3, title: 'Build Assignments', desc: 'Create assignments with rubric and policies' },
  { step: 4, title: 'Review Submissions', desc: 'Filter and search through all submissions' },
  { step: 5, title: 'Grade with AI', desc: 'Review AI drafts and override if needed' },
  { step: 6, title: 'Analytics', desc: 'Analyze class performance and student trends' }
];

const creators = [
  'Shiza Khalid',
  'Misbah Riaz',
  'Muhammad Sulaim',
  'Muhammad Shehroz',
  'Abdul Mannan'
];

export default function Home() {
  const [activeTab, setActiveTab] = useState<'student' | 'teacher'>('student');

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="card bg-gradient-to-br from-navy-900 via-navy-800 to-navy-700 text-white border-none shadow-2xl">
        <div className="space-y-6">
          <div>
            <p className="text-sm uppercase tracking-widest text-navy-100 font-semibold">🎓 Assignment++</p>
            <h1 className="text-5xl md:text-6xl font-bold mt-3 leading-tight">
              The Only Companion Teachers and Students Need
            </h1>
            <p className="mt-4 text-lg text-navy-100 max-w-3xl leading-relaxed">
              AI-assisted assignment management platform that unifies course workflows, grading, feedback, and analytics. 
              Designed for both teachers and students to make education more efficient and fair.
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <Link 
              className="rounded-xl bg-white text-navy-900 px-6 py-3 font-semibold hover:bg-navy-100 transition shadow-lg" 
              href="/auth/login"
            >
              Log In
            </Link>
            <Link 
              className="rounded-xl border-2 border-white text-white px-6 py-3 font-semibold hover:bg-white/10 transition" 
              href="/auth/signup"
            >
              Sign Up
            </Link>
            <Link 
              className="rounded-xl border-2 border-navy-200 text-navy-100 px-6 py-3 font-semibold hover:bg-white/5 transition" 
              href="/student/dashboard"
            >
              👁️ Preview as Guest
            </Link>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="grid md:grid-cols-2 gap-6">
        <div className="card border-2 border-red-200 bg-red-50">
          <div className="text-3xl mb-3">😓 The Problem</div>
          <h3 className="text-xl font-semibold text-navy-900 mb-4">Teachers Spend Too Much Time on Routine Tasks</h3>
          <ul className="space-y-3 text-sm text-slate-700">
            <li>⏱️ 40–50% of time on manual grading</li>
            <li>📝 Creating assignments from scratch each semester</li>
            <li>🔍 Manually checking for plagiarism</li>
            <li>😕 Inconsistent rubric application across submissions</li>
            <li>📊 No clear visibility into class performance</li>
          </ul>
        </div>

        <div className="card border-2 border-orange-200 bg-orange-50">
          <div className="text-3xl mb-3">😰 The Student Struggle</div>
          <h3 className="text-xl font-semibold text-navy-900 mb-4">Students Need Better Guidance</h3>
          <ul className="space-y-3 text-sm text-slate-700">
            <li>❓ Unclear grading criteria until submission closes</li>
            <li>⏳ Long wait for feedback after submission</li>
            <li>😨 Fear of plagiarism accusations</li>
            <li>📚 No real-time learning support</li>
            <li>🤷 Passive waiting between submission and grading</li>
          </ul>
        </div>
      </section>

      {/* Solution Section */}
      <section className="card bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200">
        <div className="text-3xl mb-3">✨ The Solution</div>
        <h2 className="text-2xl font-semibold text-navy-900 mb-6">Assignment++ Handles It All</h2>
        
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 border-l-4 border-emerald-500">
            <p className="font-semibold text-navy-900 mb-2">🏫 For Teachers</p>
            <p className="text-sm text-slate-600">Define, grade, and analyze assignments in one platform</p>
          </div>
          <div className="bg-white rounded-lg p-4 border-l-4 border-blue-500">
            <p className="font-semibold text-navy-900 mb-2">🎓 For Students</p>
            <p className="text-sm text-slate-600">Get guidance, submit work, and learn from feedback</p>
          </div>
          <div className="bg-white rounded-lg p-4 border-l-4 border-purple-500">
            <p className="font-semibold text-navy-900 mb-2">🤖 For Both</p>
            <p className="text-sm text-slate-600">AI assistance that respects academic integrity</p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section>
        <h2 className="text-3xl font-bold text-navy-900 mb-8">📋 Core Features</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div key={feature.title} className="card hover:shadow-xl transition border-t-4 border-navy-600">
              <div className="text-4xl mb-3">{feature.icon}</div>
              <h3 className="font-semibold text-navy-900 mb-2">{feature.title}</h3>
              <p className="text-sm text-slate-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits Grid */}
      <section>
        <h2 className="text-3xl font-bold text-navy-900 mb-8">🎯 Benefits</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {benefits.map((benefit) => (
            <div key={benefit.title} className="card bg-gradient-to-br from-navy-50 to-blue-50 hover:shadow-lg transition">
              <div className="text-3xl mb-3">{benefit.icon}</div>
              <h3 className="font-semibold text-navy-900 mb-2">{benefit.title}</h3>
              <p className="text-sm text-slate-600">{benefit.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Workflows */}
      <section className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-navy-900 mb-6">📖 How It Works</h2>
          
          {/* Workflow Tabs */}
          <div className="flex gap-4 mb-8 border-b border-slate-200">
            <button
              onClick={() => setActiveTab('student')}
              className={`pb-4 px-4 font-semibold transition border-b-2 ${
                activeTab === 'student'
                  ? 'text-navy-900 border-navy-900'
                  : 'text-slate-500 border-transparent hover:text-slate-700'
              }`}
            >
              🎓 Student Portal
            </button>
            <button
              onClick={() => setActiveTab('teacher')}
              className={`pb-4 px-4 font-semibold transition border-b-2 ${
                activeTab === 'teacher'
                  ? 'text-navy-900 border-navy-900'
                  : 'text-slate-500 border-transparent hover:text-slate-700'
              }`}
            >
              🏫 Teacher Portal
            </button>
          </div>

          {/* Student Workflow */}
          {activeTab === 'student' && (
            <div className="grid md:grid-cols-3 gap-4">
              {studentWorkflow.map((item) => (
                <div key={item.step} className="card border-l-4 border-blue-500 hover:shadow-lg transition">
                  <div className="inline-block bg-blue-100 text-blue-900 rounded-full w-10 h-10 flex items-center justify-center font-bold mb-3">
                    {item.step}
                  </div>
                  <h3 className="font-semibold text-navy-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-600">{item.desc}</p>
                </div>
              ))}
            </div>
          )}

          {/* Teacher Workflow */}
          {activeTab === 'teacher' && (
            <div className="grid md:grid-cols-3 gap-4">
              {teacherWorkflow.map((item) => (
                <div key={item.step} className="card border-l-4 border-emerald-500 hover:shadow-lg transition">
                  <div className="inline-block bg-emerald-100 text-emerald-900 rounded-full w-10 h-10 flex items-center justify-center font-bold mb-3">
                    {item.step}
                  </div>
                  <h3 className="font-semibold text-navy-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-600">{item.desc}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Tech Stack */}
      <section className="card bg-slate-50">
        <h2 className="text-2xl font-semibold text-navy-900 mb-6">⚙️ Technology Stack</h2>
        <div className="grid md:grid-cols-4 gap-6">
          <div>
            <p className="font-semibold text-navy-900 mb-2">Frontend</p>
            <ul className="text-sm space-y-1 text-slate-600">
              <li>✓ React 18 + TypeScript</li>
              <li>✓ Next.js</li>
              <li>✓ Tailwind CSS</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-navy-900 mb-2">Backend</p>
            <ul className="text-sm space-y-1 text-slate-600">
              <li>✓ Python 3.11</li>
              <li>✓ FastAPI</li>
              <li>✓ SQLAlchemy ORM</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-navy-900 mb-2">Database</p>
            <ul className="text-sm space-y-1 text-slate-600">
              <li>✓ SQLite (dev)</li>
              <li>✓ PostgreSQL (prod)</li>
              <li>✓ ACID compliant</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-navy-900 mb-2">AI & Security</p>
            <ul className="text-sm space-y-1 text-slate-600">
              <li>✓ OpenAI GPT-4</li>
              <li>✓ JWT Auth</li>
              <li>✓ Bcrypt hashing</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Creator Credits */}
      <section className="card border-2 border-navy-200 bg-navy-50">
        <h3 className="text-2xl font-semibold text-navy-900 mb-4">👥 Created By</h3>
        <div className="grid md:grid-cols-5 gap-4">
          {creators.map((creator) => (
            <div key={creator} className="bg-white rounded-lg p-4 text-center border border-navy-200 hover:shadow-md transition">
              <p className="font-semibold text-navy-900">{creator}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="card bg-gradient-to-r from-navy-900 to-navy-800 text-white border-none shadow-xl">
        <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Assignment Workflow?</h2>
        <p className="text-lg text-navy-100 mb-6">Join thousands of educators using Assignment++ today.</p>
        <div className="flex flex-wrap gap-4">
          <Link 
            className="rounded-xl bg-white text-navy-900 px-6 py-3 font-semibold hover:bg-navy-100 transition" 
            href="/auth/signup"
          >
            Get Started
          </Link>
          <Link 
            className="rounded-xl border-2 border-white text-white px-6 py-3 font-semibold hover:bg-white/10 transition" 
            href="/auth/login"
          >
            Sign In
          </Link>
        </div>
      </section>
    </div>
  );
}
