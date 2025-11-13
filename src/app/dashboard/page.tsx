"use client";
import React, { useState } from "react";
import FileUpload from "@/components/ui/FileUpload";
import Textarea from "@/components/ui/Textarea";
import { useRouter } from "next/navigation";
import { FileText } from "lucide-react";
import Header from "@/components/layout/Header";

const Dashboard = () => {
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  const [textInput, setTextInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Handle file selection from FileUpload component
  const handleFilesSelected = (selectedFiles: File[]) => {
    setFiles(selectedFiles);
    setError(null); // Clear any previous errors
  };

  // Handle text input changes
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextInput(e.target.value);
  };

  // Main submit handler
  const handleSubmit = async () => {
    // Validation: Either files or text must be provided
    if (files.length === 0 && !textInput.trim()) {
      setError("Please upload files or paste text to process.");
      return;
    }

    setError(null);
    setLoading(true);
    setResult(null);

    const formData = new FormData();

    // Append files if any
    files.forEach((file) => formData.append("files", file));

    // Append text input if provided
    if (textInput.trim()) {
      formData.append("textInput", textInput);
    }

    try {
      const res = await fetch("/api/getDetails", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      setResult(data.outputJson);
    } 
      catch (err: any) {
        setError(err.message);
      } 
      finally {
        setLoading(false);
      }
    };

  return (
    <div className="container min-h-screen w-full bg-gray-50">
      <Header title="DocumentLM Dashboard" showBackButton />
      <div className="flex flex-col lg:flex-row mx-4 my-2 p-6 gap-6">
        {/* Main Content */}
        <div className="flex flex-col m-2 p-10 gap-10 mx-auto w-full max-w-4xl">
          {/* Header Section */}
          <div className="flex flex-col gap-4 ">
            <div className="flex gap-3 h-fit">
               <FileText className="w-9 h-9 text-blue-800 ml-3" />
              <h1 className="font-bold text-3xl text-gray-800">
                Study Notes Summarizer
              </h1>
            </div>
           
          <p className="text-gray-600 text-sm px-4">
            Upload your documents or paste text to generate summaries and MCQs
          </p>
          </div> 

          {/* File Upload Section */}
          <FileUpload
            onFilesSelected={handleFilesSelected}
            maxSize={10 * 1024 * 1024} // 10MB
            maxFiles={3}
            acceptedFormats={["pdf", "txt"]}
          />

          {/* Text Input Section */}
          <Textarea
            value={textInput}
            onChange={handleTextChange}
            characterCount={textInput.length}
            maxCharacters={10000}
            disabled={loading}
          />

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={loading || (files.length === 0 && !textInput.trim())}
            className="bg-indigo-800 hover:bg-indigo-900 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors w-full max-w-md mx-auto flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg"
                  fill="none" viewBox="0 0 24 24" >
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
                Processing...
              </>
            ) : (
              <>
                Generate Summary & MCQs
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z"
                    clipRule="evenodd" />
                </svg>
              </>
            )}
          </button>

          {/* Error Display */}
          {error && (
            <div className="bg-red-100/50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <svg
                className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <h3 className="font-semibold text-red-800">Error</h3>
                <p className="text-sm text-red-600">{error}</p>
              </div>
            </div>
          )}
          
          {/* Results Section */}
          {result && (
            <div className="bg-white shadow-lg rounded-2xl p-8 w-full border border-gray-200">
              {/* Summary Section */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
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
                  <h2 className="text-2xl font-bold text-gray-800">Summary</h2>
                </div>
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {result.summary}
                  </p>
                </div>
              </div>

              {/* MCQs Section */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-green-700"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">
                    Generated MCQs
                  </h3>
                </div>

                <div className="space-y-4">
                  {result.mcqs && result.mcqs.length > 0 ? (
                    result.mcqs.map((mcq: any, idx: number) => (
                      <div
                        key={idx}
                        className="border border-gray-200 p-6 rounded-xl bg-gradient-to-br from-white to-gray-50 hover:shadow-md transition-shadow"
                      >
                        <p className="font-semibold text-gray-800 mb-4 text-lg">
                          <span className="inline-block w-8 h-8 bg-indigo-600 text-white rounded-full text-center leading-8 mr-3">
                            {idx + 1}
                          </span>
                          {mcq.question}
                        </p>
                        <ul className="ml-11 space-y-2 mb-4">
                          {mcq.options.map((opt: string, i: number) => (
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
                        <div className="ml-11 pt-3 border-t border-gray-200">
                          <p className="text-green-700 font-semibold flex items-center gap-2">
                            <svg
                              className="w-5 h-5"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                            Correct Answer: {mcq.correctAnswer}
                          </p>
                          {mcq.reference && (
                            <p className="text-sm text-gray-500 mt-2 flex items-center gap-2">
                              <svg
                                className="w-4 h-4"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                              </svg>
                              Reference: {mcq.reference}
                            </p>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <svg
                        className="w-16 h-16 mx-auto mb-4 text-gray-300"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <p className="text-lg">No MCQs generated.</p>
                    </div>
                  )}
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
