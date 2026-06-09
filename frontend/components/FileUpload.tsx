import { useState } from 'react';

export default function FileUpload({
  onFileSelect,
  assignmentId,
  onUploadComplete,
}: {
  onFileSelect: (name: string, file?: File) => void;
  assignmentId?: number;
  onUploadComplete?: (result: any) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    onFileSelect(file.name, file);
  };

  const handleUpload = async () => {
    if (!assignmentId) return;
    const input = document.querySelector<HTMLInputElement>('input[type="file"]');
    const file = input?.files?.[0];
    if (!file) {
      setMessage('❌ Select a file first');
      return;
    }

    setUploading(true);
    setMessage('');
    try {
      const formData = new FormData();
      formData.append('file', file);

      const token = localStorage.getItem('assignmentpp_token');
      const port = process.env.NEXT_PUBLIC_API_PORT || '8000';
      const host = window.location.hostname;

      const res = await fetch(`http://${host}:${port}/api/files/upload/${assignmentId}`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || 'Upload failed');
      }

      const data = await res.json();
      setMessage('✓ File uploaded successfully!');
      onUploadComplete?.(data);
    } catch (err: any) {
      setMessage(`❌ ${err.message || 'Upload failed'}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="rounded-xl border border-dashed border-white/20 p-4 bg-white/5">
      <p className="text-sm text-white/80 mb-2">Upload your assignment file</p>
      <input
        type="file"
        className="w-full text-white/60 text-sm file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-white/10 file:text-white file:font-semibold hover:file:bg-white/20 file:transition file:cursor-pointer"
        onChange={handleFileChange}
      />
      <p className="text-xs text-white/40 mt-2">Allowed: PDF, DOCX, TXT, ZIP, code files, notebooks</p>

      {assignmentId && (
        <button
          onClick={handleUpload}
          disabled={uploading}
          className="mt-3 w-full bg-gradient-to-r from-green-600 to-green-800 text-white py-2 rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50 text-sm"
        >
          {uploading ? '⏳ Uploading...' : '📤 Upload File'}
        </button>
      )}

      {message && (
        <p className={`mt-2 text-sm font-semibold ${message.startsWith('✓') ? 'text-green-300' : 'text-red-300'}`}>
          {message}
        </p>
      )}
    </div>
  );
}
