"use client";
import React, { useState } from "react";

export default function HomePage() {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (files.length === 0) {
      setError("Please select at least one file.");
      return;
    }

    setError(null);
    setLoading(true);
    setResult(null);

    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    try {
      const res = await fetch("/api/getDetails", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");

      setResult(data.outputJson);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  console.log(result)
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">📘 Study Notes Summarizer</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-2xl p-6 w-full max-w-md flex flex-col items-center gap-4"
      >
        <input
          type="file"
          multiple
          onChange={handleFileChange}
          className="border border-gray-300 p-2 rounded w-full"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          {loading ? "Processing..." : "Upload & Generate Summary"}
        </button>

        {error && <p className="text-red-500 text-sm">{error}</p>}
      </form>

      {result && (
        <div className="mt-10 bg-white shadow-md rounded-2xl p-6 w-full max-w-3xl">
          <h2 className="text-2xl font-semibold mb-3">🧾 Summary</h2>
          <p className="text-gray-700 mb-6 whitespace-pre-wrap">{result.summary}</p>

          <h3 className="text-xl font-semibold mb-3">🧠 Generated MCQs</h3>
          <div className="space-y-4">
            {result.mcqs.length > 0 ? (
              result.mcqs.map((mcq: any, idx: number) => (
                <div
                  key={idx}
                  className="border border-gray-200 p-4 rounded-lg bg-gray-50"
                >
                  <p className="font-medium mb-2">
                    {idx + 1}. {mcq.question}
                  </p>
                  <ul className="ml-5 list-disc">
                    {mcq.options.map((opt: string, i: number) => (
                      <li key={i}>{opt}</li>
                    ))}
                  </ul>
                  <p className="mt-2 text-green-700 font-semibold">
                    ✅ Correct: {mcq.correctAnswer}
                  </p>
                  {mcq.reference && (
                    <p className="text-sm text-gray-500">
                      📚 Reference: {mcq.reference}
                    </p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-500">No MCQs generated.</p>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
