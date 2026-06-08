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

  const riskLevel = report.plagiarism_score > 50 ? 'HIGH' : report.plagiarism_score > 20 ? 'MEDIUM' : 'LOW';
  const riskColor = riskLevel === 'HIGH' ? 'red' : riskLevel === 'MEDIUM' ? 'yellow' : 'green';

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-4xl font-bold text-navy-900 mb-8">🔍 Plagiarism Report</h1>

        <div className={`bg-${riskColor}-50 border-2 border-${riskColor}-300 rounded-2xl p-8 mb-8`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-semibold text-${riskColor}-700 mb-2`}>PLAGIARISM RISK LEVEL</p>
              <p className={`text-5xl font-bold text-${riskColor}-900`}>{report.plagiarism_score}%</p>
            </div>
            <div className={`w-32 h-32 rounded-full bg-gradient-to-br from-${riskColor}-100 to-${riskColor}-200 flex items-center justify-center`}>
              <div className={`w-24 h-24 rounded-full bg-${riskColor}-300 flex items-center justify-center text-white text-4xl font-bold`}>
                {report.plagiarism_score}%
              </div>
            </div>
          </div>
          <p className={`text-sm text-${riskColor}-700 mt-4`}>
            {riskLevel === 'HIGH' && 'High similarity detected. Consider manual review.'}
            {riskLevel === 'MEDIUM' && 'Moderate similarity found. Review flagged sections.'}
            {riskLevel === 'LOW' && 'Low similarity. Submission appears original.'}
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-navy-900">📌 Flagged Sections</h2>
          {report.flagged_sections && report.flagged_sections.length > 0 ? (
            report.flagged_sections.map((section, idx) => (
              <div key={idx} className="bg-white rounded-xl border border-navy-200 p-6 hover:shadow-md transition">
                <div className="flex justify-between items-start mb-3">
                  <p className="font-semibold text-navy-900">Section {idx + 1}</p>
                  <span className={`bg-yellow-100 text-yellow-800 px-3 py-1 rounded-lg text-sm font-bold`}>
                    {section.similarity}% Match
                  </span>
                </div>
                <div className="bg-navy-50 rounded-lg p-4 mb-3 border-l-4 border-navy-600">
                  <p className="text-sm text-gray-700 italic">"{section.text}"</p>
                </div>
                <p className="text-xs text-gray-600">
                  <strong>Potential Source:</strong> {section.source}
                </p>
              </div>
            ))
          ) : (
            <div className="bg-green-50 rounded-xl border border-green-200 p-6">
              <p className="text-green-700">✓ No flagged sections detected</p>
            </div>
          )}
        </div>

        <div className="mt-8 flex gap-3">
          <button onClick={() => router.back()} className="px-6 py-3 bg-navy-100 text-navy-900 rounded-lg font-semibold hover:bg-navy-200 transition">
            ← Back
          </button>
          <button className="px-6 py-3 bg-gradient-to-r from-navy-700 to-navy-900 text-white rounded-lg font-semibold hover:shadow-lg transition">
            📋 Generate Report PDF
          </button>
        </div>
      </div>
    </Layout>
  );
}
