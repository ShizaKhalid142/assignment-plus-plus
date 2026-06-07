import { FormEvent, useState } from "react";

export default function SubmissionForm() {
  const [content, setContent] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <textarea
        className="h-40 w-full rounded border p-3"
        placeholder="Paste your assignment answer here"
        value={content}
        onChange={(event) => setContent(event.target.value)}
      />
      <button type="submit" className="rounded bg-emerald-600 px-4 py-2 text-white">Submit</button>
      {submitted ? <p className="text-sm text-emerald-700">Submission saved (demo mode).</p> : null}
    </form>
  );
}
