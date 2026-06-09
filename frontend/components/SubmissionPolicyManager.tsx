import { useState, useEffect } from 'react';
import { policiesApi } from '../lib/api';

type SubmissionPolicy = {
  id: number;
  assignment_id: number;
  allowed_resources: string;
  hint_only_mode: boolean;
  citation_required: boolean;
};

type GradingPolicy = {
  id: number;
  name: string;
  feedback_template: string;
  late_penalty_percent: number;
};

export default function SubmissionPolicyManager() {
  const [assignmentId, setAssignmentId] = useState('');
  const [allowedResources, setAllowedResources] = useState('Course notes');
  const [hintOnlyMode, setHintOnlyMode] = useState(true);
  const [citationRequired, setCitationRequired] = useState(true);
  const [gradingPolicies, setGradingPolicies] = useState<GradingPolicy[]>([]);
  const [templateName, setTemplateName] = useState('');
  const [templateText, setTemplateText] = useState('');
  const [latePenalty, setLatePenalty] = useState(0);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadGradingPolicies();
  }, []);

  const loadGradingPolicies = async () => {
    try {
      const data = await policiesApi.listGradingPolicies();
      setGradingPolicies(data || []);
    } catch {
      setGradingPolicies([]);
    }
  };

  const showMessage = (msg: string, type: string) => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(''), 3000);
  };

  // ── Submission Policy ──

  const saveSubmissionPolicy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignmentId) {
      showMessage('❌ Enter an assignment ID', 'error');
      return;
    }
    setLoading(true);
    try {
      await policiesApi.createSubmissionPolicy({
        assignment_id: parseInt(assignmentId),
        allowed_resources: allowedResources,
        hint_only_mode: hintOnlyMode,
        citation_required: citationRequired,
      });
      showMessage('✓ Submission policy saved!', 'success');
    } catch (err: any) {
      try {
        await policiesApi.updateSubmissionPolicy(parseInt(assignmentId), {
          allowed_resources: allowedResources,
          hint_only_mode: hintOnlyMode,
          citation_required: citationRequired,
        });
        showMessage('✓ Submission policy updated!', 'success');
      } catch {
        showMessage(`❌ ${err.message || 'Failed to save policy'}`, 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  // ── Grading Policy / Feedback Template ──

  const saveGradingPolicy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!templateName || !templateText) {
      showMessage('❌ Fill in template name and text', 'error');
      return;
    }
    setLoading(true);
    try {
      await policiesApi.createGradingPolicy({
        name: templateName,
        feedback_template: templateText,
        late_penalty_percent: latePenalty,
      });
      showMessage('✓ Feedback template saved!', 'success');
      setTemplateName('');
      setTemplateText('');
      setLatePenalty(0);
      loadGradingPolicies();
    } catch (err: any) {
      showMessage(`❌ ${err.message || 'Failed to save template'}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const deleteGradingPolicy = async (id: number) => {
    try {
      await policiesApi.deleteGradingPolicy(id);
      showMessage('✓ Template deleted', 'success');
      loadGradingPolicies();
    } catch {
      showMessage('❌ Failed to delete template', 'error');
    }
  };

  return (
    <div className="space-y-8">
      {message && (
        <div className={`p-4 rounded-lg font-semibold border-l-2 ${
          messageType === 'success'
            ? 'bg-green-500/10 border-green-500 text-green-300'
            : 'bg-red-500/10 border-red-500 text-red-300'
        }`}>
          {message}
        </div>
      )}

      {/* Submission Policy Form */}
      <div className="bg-white/5 rounded-2xl border border-white/10 p-8 backdrop-blur-sm">
        <h3 className="text-xl font-bold text-white mb-6">🔒 Assignment Submission Policy</h3>
        <p className="text-sm text-white/50 mb-6">Set rules that govern how students interact with assignments — allowed resources, AI hint restrictions, and citation requirements.</p>
        
        <form onSubmit={saveSubmissionPolicy} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-white mb-2">Assignment ID</label>
            <input
              type="number"
              value={assignmentId}
              onChange={(e) => setAssignmentId(e.target.value)}
              placeholder="e.g., 1"
              className="w-full px-4 py-3 bg-white/8 border border-white/15 rounded-lg text-white placeholder:text-white/30 focus:border-white/30 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-white mb-2">📚 Allowed Resources</label>
            <textarea
              value={allowedResources}
              onChange={(e) => setAllowedResources(e.target.value)}
              placeholder="e.g., Course notes, official documentation, Stack Overflow (no direct copy)"
              className="w-full px-4 py-3 bg-white/8 border border-white/15 rounded-lg text-white placeholder:text-white/30 focus:border-white/30 outline-none h-24"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <label className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10 cursor-pointer hover:border-white/20 transition">
              <input
                type="checkbox"
                checked={hintOnlyMode}
                onChange={(e) => setHintOnlyMode(e.target.checked)}
                className="w-5 h-5 accent-blue-500"
              />
              <div>
                <p className="font-semibold text-white">🤖 Hint-Only Mode</p>
                <p className="text-xs text-white/50 mt-1">AI assistant gives hints, not full solutions</p>
              </div>
            </label>

            <label className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10 cursor-pointer hover:border-white/20 transition">
              <input
                type="checkbox"
                checked={citationRequired}
                onChange={(e) => setCitationRequired(e.target.checked)}
                className="w-5 h-5 accent-blue-500"
              />
              <div>
                <p className="font-semibold text-white">📎 Citation Required</p>
                <p className="text-xs text-white/50 mt-1">Students must cite external sources</p>
              </div>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50"
          >
            {loading ? '⏳ Saving...' : '💾 Save Policy'}
          </button>
        </form>
      </div>

      {/* Feedback Templates */}
      <div className="bg-white/5 rounded-2xl border border-white/10 p-8 backdrop-blur-sm">
        <h3 className="text-xl font-bold text-white mb-6">📝 Reusable Feedback Templates</h3>
        <p className="text-sm text-white/50 mb-6">Create comment snippets you can apply to submissions with one click. Write once, use many times.</p>

        <form onSubmit={saveGradingPolicy} className="space-y-4 mb-8">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-white mb-2">Template Name</label>
              <input
                type="text"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                placeholder="e.g., Excellent Work Template"
                className="w-full px-4 py-3 bg-white/8 border border-white/15 rounded-lg text-white placeholder:text-white/30 focus:border-white/30 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-white mb-2">Late Penalty (%)</label>
              <input
                type="number"
                value={latePenalty}
                onChange={(e) => setLatePenalty(parseInt(e.target.value) || 0)}
                min={0}
                max={100}
                className="w-full px-4 py-3 bg-white/8 border border-white/15 rounded-lg text-white placeholder:text-white/30 focus:border-white/30 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-white mb-2">Feedback Text</label>
            <textarea
              value={templateText}
              onChange={(e) => setTemplateText(e.target.value)}
              placeholder="Good effort on this assignment! Consider the following improvements:&#10;1. Structure your arguments more clearly&#10;2. Add citations for external sources&#10;3. Test edge cases in your code"
              className="w-full px-4 py-3 bg-white/8 border border-white/15 rounded-lg text-white placeholder:text-white/30 focus:border-white/30 outline-none h-32"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-green-600 to-green-800 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50"
          >
            {loading ? '⏳ Saving...' : '➕ Create Template'}
          </button>
        </form>

        {/* Existing Templates */}
        {gradingPolicies.length > 0 && (
          <div>
            <h4 className="text-lg font-bold text-white mb-4">Your Templates ({gradingPolicies.length})</h4>
            <div className="space-y-3">
              {gradingPolicies.map((policy) => (
                <div key={policy.id} className="bg-white/5 rounded-xl border border-white/10 p-4 flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <p className="font-semibold text-white">{policy.name}</p>
                      {policy.late_penalty_percent > 0 && (
                        <span className="text-xs bg-orange-500/20 text-orange-300 px-2 py-1 rounded-full">
                          -{policy.late_penalty_percent}% late
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-white/60 line-clamp-2">{policy.feedback_template}</p>
                  </div>
                  <button
                    onClick={() => deleteGradingPolicy(policy.id)}
                    className="text-red-400 hover:text-red-300 text-sm font-semibold transition shrink-0"
                  >
                    🗑️ Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
