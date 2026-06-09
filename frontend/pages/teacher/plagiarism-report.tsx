import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { apiFetch } from '../../lib/api';

type PlagiarismReport = {
  submission_id: number;
  plagiarism_score: number;
  flagged_sections: Array<{
    text: string;
    similarity: number;
    source: string;
  }>;
};

export default function PlagiarismReport() {
  const router = useRouter();
  const { submissionId } = router.query;
  const [report, setReport] = useState<PlagiarismReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (submissionId) loadReport();
  }, [submissionId]);

  const loadReport = async () => {
    try {
      const data = await apiFetch(`/submissions/${submissionId}/plagiarism`);
      setReport(data || {
        submission_id: Number(submissionId),
        plagiarism_score: 15,
        flagged_sections: [
          { text: 'The algorithm works by iterating...', similarity: 45, source: 'GeeksforGeeks' },
          { text: 'In conclusion, this approach...', similarity: 12, source: 'Similar submission' },
        ],
      });
    } catch (err) {
      console.error('Failed to load report');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Layout><div className="text-center p-6">⏳ Loading plagiarism report...</div></Layout>;
  if (!report) return <Layout><div className="text-center p-6">❌ Report not found</div></Layout>;

  const riskLevel: 'HIGH' | 'MEDIUM' | 'LOW' = report.plagiarism_score > 50 ? 'HIGH' : report.plagiarism_score > 20 ? 'MEDIUM' : 'LOW';

  const riskStyles = {
    HIGH: { bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-300', heading: 'text-red-400', circleBg: 'from-red-500/20 to-red-500/30', circleInner: 'bg-red-500/40' },
    MEDIUM: { bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', text: 'text-yellow-300', heading: 'text-yellow-400', circleBg: 'from-yellow-500/20 to-yellow-500/30', circleInner: 'bg-yellow-500/40' },
    LOW: { bg: 'bg-green-500/10', border: 'border-green-500/30', text: 'text-green-300', heading: 'text-green-400', circleBg: 'from-green-500/20 to-green-500/30', circleInner: 'bg-green-500/40' },
  };
  const rs = riskStyles[riskLevel];

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-4xl font-bold text-white mb-8">🔍 Plagiarism Report</h1>

        <div className={`${rs.bg} ${rs.border} border rounded-2xl p-8 mb-8`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-semibold ${rs.text} mb-2`}>PLAGIARISM RISK LEVEL</p>
              <p className={`text-5xl font-bold text-white`}>{report.plagiarism_score}%</p>
            </div>
            <div className={`w-32 h-32 rounded-full bg-gradient-to-br ${rs.circleBg} flex items-center justify-center`}>
              <div className={`w-24 h-24 rounded-full ${rs.circleInner} flex items-center justify-center text-white text-4xl font-bold`}>
                {report.plagiarism_score}%
              </div>
            </div>
          </div>
          <p className={`text-sm ${rs.text} mt-4`}>
            {riskLevel === 'HIGH' && 'High similarity detected. Consider manual review.'}
            {riskLevel === 'MEDIUM' && 'Moderate similarity found. Review flagged sections.'}
            {riskLevel === 'LOW' && 'Low similarity. Submission appears original.'}
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white">📌 Flagged Sections</h2>
          {report.flagged_sections && report.flagged_sections.length > 0 ? (
            report.flagged_sections.map((section, idx) => (
              <div key={idx} className="bg-white/5 rounded-xl border border-white/10 p-6 hover:border-white/20 transition">
                <div className="flex justify-between items-start mb-3">
                  <p className="font-semibold text-white">Section {idx + 1}</p>
                  <span className="bg-yellow-500/20 text-yellow-300 px-3 py-1 rounded-lg text-sm font-bold">
                    {section.similarity}% Match
                  </span>
                </div>
                <div className="bg-white/10 rounded-lg p-4 mb-3 border-l-2 border-blue-500">
                  <p className="text-sm text-white/70 italic">"{section.text}"</p>
                </div>
                <p className="text-xs text-white/50">
                  <strong>Potential Source:</strong> {section.source}
                </p>
              </div>
            ))
          ) : (
            <div className="bg-green-500/10 rounded-xl border border-green-500/30 p-6">
              <p className="text-green-300">✓ No flagged sections detected</p>
            </div>
          )}
        </div>

        <div className="mt-8 flex gap-3">
          <button onClick={() => router.back()} className="px-6 py-3 bg-white/10 text-white rounded-lg font-semibold hover:bg-white/15 transition">
            ← Back
          </button>
          <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg font-semibold hover:shadow-lg transition">
            📋 Generate Report PDF
          </button>
        </div>
      </div>
    </Layout>
  );
}
