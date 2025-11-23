import { ArrowLeft, CheckCircle2, ExternalLink, XCircle } from "lucide-react";
import router from "next/router";
import React, { useEffect, useState } from "react";

export interface MCQ {
  question: string;
  options: string[];
  correctAnswer: string;
  reference?: string;
}

interface ResultPayload {
  summary?: string;
  mcqs?: MCQ[];
}

interface ResultProps {
  result: ResultPayload | null;
  onClose: () => void;
}

const Result: React.FC<ResultProps> = ({ result, onClose }) => {
  const [exportLoading, setExportLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<{
    formId: string;
    formUrl: string;
  } | null>(null);

    
  const handleFormExport = async () => {
    if (!result) {
      setError("No result to export. Please generate summary and MCQs first.");
      return;
    }

    // Validate result structure
    if (
      !result.mcqs ||
      !Array.isArray(result.mcqs) ||
      result.mcqs.length === 0
    ) {
      setError("No MCQs available to export. Please generate MCQs first.");
      return;
    }

    setExportLoading(true);
    setError(null);
    setFormSuccess(null);

    try {
      const res = await fetch("/api/form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result),
      });

      if (!res.ok) {
        const errorData = await res
          .json()
          .catch(() => ({ error: "Failed to initiate form export" }));
        throw new Error(errorData.error || "Failed to initiate form export");
      }

      const data = await res.json();

      if (!data.url) {
        throw new Error(
          "Invalid response from server. Missing authorization URL."
        );
      }

      // Redirect to Google OAuth
      window.location.href = data.url;
    } catch (err: any) {
      setError(
        err.message ||
          "An error occurred while exporting to Google Forms. Please try again."
      );
      setExportLoading(false);
    }
  };

  return (
    <section className="fixed inset-0 z-50 bg-white/95 backdrop-blur-sm overflow-auto ">
      <div className="max-w-4xl mx-auto py-8 px-6 p-2 mx-2 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-5">
            <button
              onClick={onClose}
              aria-label="Close results"
              className="p-2 rounded-md bg-gray-100 hover:bg-gray-200 mt-1 hover:cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5 " />
            </button>
            <h1 className="text-3xl font-bold text-gray-800">
              Brief Summary and MCQs
            </h1>
          </div>
        </div>

        {/* Short Summary section */}
        {result?.summary && (
          <>
            <div className="flex items-center gap-3 mb-3 border-t border-stone-300 pt-6">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-2">
                <svg
                  className="w-6 h-6 text-blue-700"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  <path
                    fillRule="evenodd"
                    d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">Summary</h3>
            </div>
            <div className="bg-gradient-to-br from-gray-50/50 to-blue-100/80 shadow rounded-2xl p-6 border border-gray-200 mb-8 ">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap p-2">
                {result.summary}
              </p>
            </div>
          </>
        )}

        {/* MCQs generated along with their correct answer*/}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-blue-700"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 ">
                Generated MCQs
              </h3>
            </div>
          </div>

          <div className="space-y-6">
            {result?.mcqs && result.mcqs.length > 0 ? (
              result.mcqs.map((mcq, idx) => (
                <div
                  key={idx}
                  className="border border-gray-200 px-8 pt-6 rounded-xl bg-gradient-to-br from-gray-50/50 to-blue-100/80 shadow-sm"
                >
                  <div className="flex items-start gap-3">
                    <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-indigo-800 text-white font-semibold">
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800 mb-3">
                        {mcq.question}
                      </p>
                      <ul className="ml-6 space-y-2 mb-3">
                        {mcq.options.map((opt, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-gray-700"
                          >
                            <span className="font-medium text-indigo-600 min-w-[24px]">
                              {String.fromCharCode(65 + i)}.
                            </span>
                            <span>{opt}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="border border-gray-300 bg-white/90 rounded-md px-6 py-2 my-6 w-[95%]">
                        <p className="text-green-800 font-semibold">
                          Correct Answer: {mcq.correctAnswer}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-gray-500">
                <p className="text-lg">No MCQs generated.</p>
              </div>
            )}
          </div>
        </div>

            {/* Export MCQS to Google Forms  */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex flex-col items-center gap-4">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Export to Google Forms
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Create a Google Form with your generated MCQs and summary
              </p>
            </div>
            <button
              onClick={handleFormExport}
              disabled={exportLoading}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-800/90 to-blue-600/80 hover:bg-blue-800 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-md hover:shadow-lg"
            >
              {exportLoading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Authorizing with Google...
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Export to Google Forms
                </>
              )}
            </button>
            <p className="text-xs text-gray-500 text-center max-w-md">
              You will be redirected to Google to authorize the application.
              After authorization, your form will be created automatically.
            </p>
          </div>
        </div>

        
      </div>
    </section>
  );
};

export default Result;
