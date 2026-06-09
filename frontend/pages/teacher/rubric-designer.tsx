import { useState } from 'react';
import Layout from '../../components/Layout';
import { apiFetch } from '../../lib/api';

type Criterion = { criterion: string; points: number; notes?: string };

export default function RubricDesigner() {
  const [criteria, setCriteria] = useState<Criterion[]>([
    { criterion: 'Correctness', points: 40, notes: 'Solution produces correct output' },
    { criterion: 'Code Quality', points: 30, notes: 'Clean, readable, well-structured code' },
    { criterion: 'Documentation', points: 30, notes: 'Clear comments and explanation' },
  ]);
  const [rubricName, setRubricName] = useState('Default Rubric');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');
  const [saving, setSaving] = useState(false);

  const totalPoints = criteria.reduce((sum, c) => sum + (c.points || 0), 0);

  const addCriterion = () => {
    setCriteria([...criteria, { criterion: '', points: 10, notes: '' }]);
  };

  const removeCriterion = (index: number) => {
    setCriteria(criteria.filter((_, i) => i !== index));
  };

  const updateCriterion = (index: number, field: keyof Criterion, value: any) => {
    const updated = [...criteria];
    updated[index] = { ...updated[index], [field]: field === 'points' ? parseInt(value) || 0 : value };
    setCriteria(updated);
  };

  const saveRubric = async () => {
    if (!rubricName.trim()) {
      setMessage('❌ Name your rubric first');
      setMessageType('error');
      return;
    }
    setSaving(true);
    try {
      await apiFetch('/api/rubrics', {
        method: 'POST',
        body: JSON.stringify({
          title: rubricName,
          criteria: criteria.map(c => ({
            criterion: c.criterion || 'Unnamed',
            points: c.points,
            notes: c.notes || '',
          })),
        }),
      });
      setMessage('✓ Rubric template saved!');
      setMessageType('success');
    } catch {
      setMessage('❌ Failed to save rubric');
      setMessageType('error');
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-4xl font-bold text-white mb-8">🎯 Rubric Designer</h1>
        <p className="text-white/60 mb-8">
          Create reusable rubric templates for consistent grading across assignments.
        </p>

        {message && (
          <div className={`mb-6 p-4 rounded-lg font-semibold border-l-2 ${
            messageType === 'success'
              ? 'bg-green-500/10 border-green-500 text-green-300'
              : 'bg-red-500/10 border-red-500 text-red-300'
          }`}>
            {message}
          </div>
        )}

        <div className="bg-white/5 rounded-2xl border border-white/10 p-8 backdrop-blur-sm space-y-6">
          <div>
            <label className="block text-lg font-bold text-white mb-3">📝 Rubric Name</label>
            <input
              type="text"
              value={rubricName}
              onChange={(e) => setRubricName(e.target.value)}
              placeholder="e.g., Python Assignment Rubric"
              className="w-full px-4 py-3 bg-white/8 border border-white/15 rounded-lg text-white placeholder:text-white/30 focus:border-white/30 outline-none"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-white">📋 Criteria</h3>
              <span className="text-sm text-white/50">Total: <strong className="text-white">{totalPoints}</strong> points</span>
            </div>

            <div className="space-y-3">
              {criteria.map((c, idx) => (
                <div key={idx} className="bg-white/5 rounded-xl border border-white/10 p-4 flex gap-4 items-start">
                  <div className="flex-1 space-y-3">
                    <input
                      type="text"
                      value={c.criterion}
                      onChange={(e) => updateCriterion(idx, 'criterion', e.target.value)}
                      placeholder="Criterion name"
                      className="w-full px-3 py-2 bg-white/8 border border-white/15 rounded-lg text-white placeholder:text-white/30 focus:border-white/30 outline-none text-sm"
                    />
                    <input
                      type="text"
                      value={c.notes || ''}
                      onChange={(e) => updateCriterion(idx, 'notes', e.target.value)}
                      placeholder="Notes (optional)"
                      className="w-full px-3 py-2 bg-white/8 border border-white/15 rounded-lg text-white placeholder:text-white/30 focus:border-white/30 outline-none text-sm"
                    />
                  </div>
                  <div className="w-20">
                    <input
                      type="number"
                      value={c.points}
                      onChange={(e) => updateCriterion(idx, 'points', e.target.value)}
                      min={0}
                      max={100}
                      className="w-full px-3 py-2 bg-white/8 border border-white/15 rounded-lg text-white placeholder:text-white/30 focus:border-white/30 outline-none text-sm text-center"
                    />
                    <p className="text-xs text-white/40 text-center mt-1">pts</p>
                  </div>
                  <button
                    onClick={() => removeCriterion(idx)}
                    className="text-red-400 hover:text-red-300 text-lg font-bold transition mt-1 shrink-0"
                    title="Remove criterion"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={addCriterion}
              className="mt-4 w-full border-2 border-dashed border-white/20 text-white/60 py-3 rounded-lg font-semibold hover:border-white/40 hover:text-white/80 transition text-sm"
            >
              ➕ Add Criterion
            </button>
          </div>

          <button
            onClick={saveRubric}
            disabled={saving}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white py-4 rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50 text-lg"
          >
            {saving ? '⏳ Saving...' : '💾 Save Rubric Template'}
          </button>
        </div>
      </div>
    </Layout>
  );
}
