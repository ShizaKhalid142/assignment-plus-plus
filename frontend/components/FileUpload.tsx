export default function FileUpload({ onFileSelect }: { onFileSelect: (name: string) => void }) {
  return (
    <div className="rounded-xl border border-dashed border-navy-700 p-4 bg-navy-100">
      <p className="text-sm text-navy-900 mb-2">Upload your assignment file</p>
      <input type="file" className="w-full" onChange={(e) => onFileSelect(e.target.files?.[0]?.name || '')} />
    </div>
  );
}
