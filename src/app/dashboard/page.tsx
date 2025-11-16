"use client";

import React, { useState } from "react";
import FileUpload from "@/components/ui/FileUpload";
import Textarea from "@/components/ui/Textarea";
import { FileText } from "lucide-react";
import Header from "@/components/layout/Header";
import Result from "@/components/ui/Result";

const Dashboard: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [textInput, setTextInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleFilesSelected = (selectedFiles: File[]) => {
    setFiles(selectedFiles);
    setError(null);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextInput(e.target.value);
  };

  const handleSubmit = async () => {
    if (files.length === 0 && !textInput.trim()) {
      setError("Please upload files or paste text to process.");
      return;
    }

    setError(null);
    setLoading(true);
    setResult(null);

    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));
    if (textInput.trim()) formData.append("textInput", textInput);

    try {
      const res = await fetch("/api/getDetails", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      setResult(data.outputJson);
      //opens the result section
      setShowResult(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseResult = () => {
    setShowResult(false);
  };

  return (
    <div className="h-full w-full bg-gray-50/80">
      <Header title="DocumentLM Dashboard" showBackButton />

      <div className="flex flex-col lg:flex-row mx-4 my-2 p-6 gap-6">
        <div className="flex flex-col m-2 p-10 gap-10 mx-auto w-full max-w-4xl">
          <div className="flex flex-col gap-4">
            <div className="flex gap-3 h-fit">
              <FileText className="w-9 h-9 text-blue-800 ml-3" />
              <h1 className="font-bold text-3xl text-gray-800">Study Notes Summarizer</h1>
            </div>
            <p className="text-gray-600 text-sm px-4">Upload your documents or paste text to generate summaries and MCQs</p>
          </div>

          <FileUpload onFilesSelected={handleFilesSelected} maxSize={10 * 1024 * 1024} maxFiles={3} acceptedFormats={["pdf", "txt"]} />

          <Textarea value={textInput} onChange={handleTextChange} characterCount={textInput.length} maxCharacters={10000} disabled={loading} />

          <button
            onClick={handleSubmit}
            disabled={loading || (files.length === 0 && !textInput.trim())}
            className="bg-indigo-800 hover:bg-indigo-900 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors w-full max-w-md mx-auto flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              <>
                Generate Summary & MCQs
                <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                </svg>
              </>
            )}
          </button>

          {/* Display error div when unable to generate Results */}
          {error && (
            <div className="bg-red-100/50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <svg className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div>
                <h3 className="font-semibold text-red-800">Error</h3>
                <p className="text-sm text-red-600">{error}</p>
              </div>
            </div>
          )}

          {/* Preview of result section on the dashboard */}
          {result && !showResult && (
            <div className="bg-gradient-to-br from-blue-50/90 to-indigo-100/70 shadow-lg rounded-2xl p-6 w-full border border-gray-200">
              <h4 className="font-semibold mb-2 text-xl">Processed above documents, here's the result-</h4>
              <div className="mt-4 flex gap-2">
                <button className="text-indigo-800 px-4 py-2 bg-white/80 hover:bg-gray-50 hover:cursor-pointer hover:text-indigo-950 border border-stone-300 font-semibold text-sm rounded-md" onClick={() => setShowResult(true)}>
                  Open full result
                </button>
                <button className="text-sm font-semibold text-teal-800 hover:text-red-700 hover:cursor-pointer" onClick={() => setResult(null)}>
                  Clear
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Result overlay rendered inside SPA */}
      {showResult && result && <Result result={result} onClose={handleCloseResult} />}
    </div>
  );
};

export default Dashboard;
