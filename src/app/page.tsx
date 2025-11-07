"use client";

import { useState } from "react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);
    if (!file) {
      setError("Please select a file");
      return;
    }
    const fd = new FormData();
    fd.append("file", file);
    setLoading(true);
    try {
      const res = await fetch("/api/getDetails", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Upload failed");
      setResult(data);
    } catch (err: any) {
      setError(err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="p-6 max-w-2xl mx-auto space-y-4">
      <h1 className="text-xl font-semibold">DocumentLm</h1>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="block"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-3 py-2 rounded bg-black text-white disabled:opacity-50"
        >
          {loading ? "Processing..." : "Upload & Summarize"}
        </button>
      </form>

      {error && <p className="text-red-600">{error}</p>}

      {result && (
        <section className="space-y-2">
          <h2 className="text-lg font-medium">Result</h2>
          <pre className="whitespace-pre-wrap text-sm bg-gray-100 p-3 rounded">
{JSON.stringify({ summary: result.summary, mcqs: result.mcqs }, null, 2)}
          </pre>
        </section>
      )}
    </main>
  );
}
