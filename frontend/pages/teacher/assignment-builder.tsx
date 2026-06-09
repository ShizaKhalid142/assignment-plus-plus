import { useState } from 'react';
import Layout from '../../components/Layout';
import { apiFetch } from '../../lib/api';

export default function AssignmentBuilder() {
  const [courseId, setCourseId] = useState('1');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [rubricCriteria, setRubricCriteria] = useState([
    { criterion: 'Correctness', points: 40 },
    { criterion: 'Code Quality', points: 30 },
    { criterion: 'Documentation', points: 30 },
  ]);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddCriterion = () => {
    setRubricCriteria([...rubricCriteria, { criterion: '', points: 10 }]);
  };

  const handleRemoveCriterion = (index: number) => {
    setRubricCriteria(rubricCriteria.filter((_, i) => i !== index));
  };

  const handleUpdateCriterion = (index: number, field: string, value: any) => {
    const updated = [...rubricCriteria];
    updated[index] = { ...updated[index], [field]: value };
    setRubricCriteria(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) {
      setMessage('❌ Please fill in title and description');
      setMessageType('error');
      return;
    }
    
    setLoading(true);
    try {
      await apiFetch('/assignments', {
        method: 'POST',
        body: JSON.stringify({
          course_id: parseInt(courseId),
          title,
          description,
          due_date: dueDate || null,
          rubric: rubricCriteria,
        }),
      });
      setMessage('✓ Assignment created successfully!');
      setMessageType('success');
      setTitle('');
      setDescription('');
      setDueDate('');
      setTimeout(() => setMessage(''), 3000);
    } catch (err: any) {
      setMessage(err.message || '❌ Failed to create assignment');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const totalPoints = rubricCriteria.reduce((sum, c) => sum + (c.points || 0), 0);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-4xl font-bold text-white mb-8">✏️ Create Assignment</h1>

        {message && (
          <div className={`mb-6 p-4 rounded-lg font-semibold border-l-2 ${messageType === 'success' ? 'bg-green-500/10 border-green-500 text-green-300' : 'bg-red-500/10 border-red-500 text-red-300'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white/5 rounded-2xl border border-white/10 p-8 backdrop-blur-sm">
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-semibold text-white mb-2">📚 Select Course</label>
              <select value={courseId} onChange={(e) => setCourseId(e.target.value)} className="w-full px-4 py-3 bg-white/8 border border-white/15 rounded-lg text-white focus:border-white/30 outline-none">
                <option value="1">Course 1: Python Basics</option>
                <option value="2">Course 2: Web Development</option>
                <option value="3">Course 3: Data Science</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-white mb-2">📅 Due Date</label>
              <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full px-4 py-3 bg-white/8 border border-white/15 rounded-lg text-white focus:border-white/30 outline-none" />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-white mb-2">📝 Assignment Title</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Build a REST API" className="w-full px-4 py-3 bg-white/8 border border-white/15 rounded-lg text-white placeholder:text-white/30 focus:border-white/30 outline-none" required />
          </div>

          <div className="mb-8">
            <label className="block text-sm font-semibold text-white mb-2">📖 Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Detailed assignment instructions..." className="w-full px-4 py-3 bg-white/8 border border-white/15 rounded-lg text-white placeholder:text-white/30 focus:border-white/30 outline-none h-40" required />
          </div>

          {/* Rubric Section */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">🎯 Grading Rubric</h2>
              <span className="text-sm font-semibold text-blue-300 bg-blue-500/20 px-3 py-1 rounded-full">Total: {totalPoints} pts</span>
            </div>

            <div className="space-y-3">
              {rubricCriteria.map((crit, idx) => (
                <div key={idx} className="flex gap-3 items-end">
                  <div className="flex-1">
                    <input type="text" value={crit.criterion} onChange={(e) => handleUpdateCriterion(idx, 'criterion', e.target.value)} placeholder="Criterion name" className="w-full px-4 py-2 bg-white/8 border border-white/15 rounded-lg text-white placeholder:text-white/30 focus:border-white/30 outline-none text-sm" />
                  </div>
                  <div className="w-24">
                    <input type="number" value={crit.points} onChange={(e) => handleUpdateCriterion(idx, 'points', parseInt(e.target.value))} min="0" max="100" className="w-full px-4 py-2 bg-white/8 border border-white/15 rounded-lg text-white placeholder:text-white/30 focus:border-white/30 outline-none text-sm" />
                  </div>
                  <button type="button" onClick={() => handleRemoveCriterion(idx)} className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition">
                    ✕
                  </button>
                </div>
              ))}
            </div>

            <button type="button" onClick={handleAddCriterion} className="mt-4 bg-white/10 text-white px-4 py-2 rounded-lg font-semibold hover:bg-white/15 transition">
              + Add Criterion
            </button>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50">
            {loading ? '⏳ Creating...' : '✓ Create Assignment'}
          </button>
        </form>
      </div>
    </Layout>
  );
}
