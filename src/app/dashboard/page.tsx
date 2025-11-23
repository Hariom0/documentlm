"use client";
import React, { useState, useEffect } from "react";
import { FileUpload } from "@/components/ui/FileUpload";
import Textarea from "@/components/ui/Textarea";
import { useRouter, useSearchParams } from "next/navigation";
import Result from "@/components/ui/Result";
import ProcessingStages from "@/components/ui/ProcessingStages";
import { FileText, CheckCircle2, ExternalLink, XCircle, ChevronDown, ChevronUp, Upload, Type } from "lucide-react";
import Header from "@/components/layout/Header";

type InputMode = "files" | "text";

const Dashboard = () => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [files, setFiles] = useState<File[]>([]);
	const [textInput, setTextInput] = useState("");
	const [inputMode, setInputMode] = useState<InputMode>("files");
	const [isInputSectionExpanded, setIsInputSectionExpanded] = useState(false);
	const [loading, setLoading] = useState(false);
	const [processedInfo, setProcessedInfo] = useState(false);
	const [result, setResult] = useState<any>(null);
	const [showResult, setShowResult] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [formSuccess, setFormSuccess] = useState<{
		formId: string;
		formUrl: string;
	  } | null>(null);
	
	// Check for OAuth callback success or error on mount
    useEffect(() => {
      const formId = searchParams.get("formId");
      const formUrl = searchParams.get("formUrl");
      const success = searchParams.get("success");
      const errorParam = searchParams.get("error");
  
      if (errorParam) {
        setError(decodeURIComponent(errorParam));
        // Clean up URL params
        router.replace("/dashboard", { scroll: false });
        return;
      }
  
      if (success === "true" && formId && formUrl) {
        setFormSuccess({ formId, formUrl: decodeURIComponent(formUrl) });
        // Clean up URL params
        router.replace("/dashboard", { scroll: false });
      }
    }, [searchParams, router]);
  
	// Handle file selection from FileUpload component
	const handleFilesSelected = (selectedFiles: File[]) => {
		setFiles(selectedFiles);
		setError(null); // Clear any previous errors
	};

	// Handle text input changes
	const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setTextInput(e.target.value);
		setError(null); // Clear any previous errors
	};

	// Handle input mode toggle
	const handleInputModeToggle = (mode: InputMode) => {
		setInputMode(mode);
		// Clear the other input when switching
		if (mode === "files") {
			setTextInput("");
		} else {
			setFiles([]);
		}
		setError(null);
	};

	// Main submit handler
	const handleSubmit = async () => {
		// Enhanced validation
		if (files.length === 0 && !textInput.trim()) {
			setError("Please upload at least one file or paste some text to process.");
			setShowResult(false);
			return;
		}

		// Validate text input length
		if (textInput.trim() && textInput.trim().length < 10) {
			setError("Please provide at least 10 characters of text for processing.");
			setShowResult(false);
			return;
		}

		// Validate file count
		if (files.length > 5) {
			setError("You can upload a maximum of 5 files at once.");
			setShowResult(false);
			return;
		}

		// Validate each file size (10MB limit)
		const invalidFiles = files.filter((file) => file.size > 10 * 1024 * 1024);
		if (invalidFiles.length > 0) {
			setError(`File "${invalidFiles[0].name}" exceeds the 10MB size limit.`);
			return;
		}

		setError(null);
		setLoading(true);
		setProcessedInfo(false); // Reset processing state
		setResult(null);
		setShowResult(true);
		setFormSuccess(null); // Clear previous form success
		setIsInputSectionExpanded(false); // Auto-collapse input section after submission
		
		const formData = new FormData();
		formData.append("text", textInput);

		// Append files if any
		files.forEach((file) => formData.append("files", file));

		// Append text input if provided
		if (textInput.trim()) {
			formData.append("textInput", textInput.trim());
		}

		try {
			const res = await fetch("/api/getDetails", {
				method: "POST",
				body: formData,
			});

			if (!res.ok) {
				const errorData = await res.json().catch(() => ({ error: "Failed to process request" }));
				throw new Error(errorData.error || `Server error: ${res.status}`);
			}

			const data = await res.json();

			// Validate response structure
			if (!data.outputJson || !data.outputJson.mcqs || !Array.isArray(data.outputJson.mcqs)) {
				throw new Error("Invalid response format from server.");
			}

			setResult(data.outputJson);
			setProcessedInfo(true); // Mark processing as complete
		} catch (err: any) {
			setError(err.message || "An unexpected error occurred. Please try again.");
			setLoading(false);
			setProcessedInfo(false);
		}
	};

	const handleCloseResult = () => {
		setShowResult(false);
	};

	return (
		<div className="container min-h-screen w-full bg-gray-50/80">
			<Header title="DocumentLM" showBackButton />
			<div className="flex flex-col lg:flex-row mt-10 m-4 p-6 gap-6">
				{/* Main Content */}
				<div className="flex flex-col m-2 p-10 gap-10 mx-auto w-full max-w-4xl">
					{/* Header Section */}
					<div className="flex flex-col gap-4 ">
						<div className="flex gap-3 h-fit mx-auto">
							<FileText className="w-9 h-9 text-blue-800 ml-3" />
							<h1 className="font-bold text-3xl text-gray-800">Study Notes Summarizer</h1>
						</div>

						<p className="text-gray-600 text-sm px-4 mx-auto pl-10">Upload your documents or paste text to generate summaries and MCQs</p>
					</div>

					{/* Navigation Tabs - Above Section */}
					<div className="flex items-center gap-2 mb-4 bg-white mx-auto w-full rounded-xl p-1.5 shadow-sm border border-gray-200 w-fit">
					<div className="w-[50%] items-center justify-center flex">
						<button
							type="button"
							onClick={() => {
								handleInputModeToggle("files");
								setIsInputSectionExpanded(true);
							}}
							disabled={loading}
							className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 w-[98%] hover:cursor-pointer ${
								inputMode === "files" ? "bg-gradient-to-r from-blue-800/90 to-blue-700/80 text-white shadow-md" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100 "
							} disabled:opacity-50 disabled:cursor-not-allowed`}
						>
							<Upload className="w-4 h-4" />
							Upload Files
						</button>
					</div>
					<div className="w-[50%] items-center justify-center flex">
						<button
							type="button"
							onClick={() => {
								handleInputModeToggle("text");
								setIsInputSectionExpanded(true);
							}}
							disabled={loading}
							className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 w-[98%] hover:cursor-pointer ${
								inputMode === "text" ? "bg-gradient-to-r from-blue-800/90 to-blue-700/80 text-white shadow-md" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
							} disabled:opacity-50 disabled:cursor-not-allowed`}
						>
							<Type className="w-4 h-4" />
							Paste Text
						</button>
					</div>
						
					</div>

					{/* Collapsible Input Section */}
					<div className="bg-white shadow-lg rounded-2xl border border-gray-200 overflow-hidden transition-all duration-300">
						{/* Section Header - Always Visible */}
						<button
							onClick={() => setIsInputSectionExpanded(!isInputSectionExpanded)}
							className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
							disabled={loading}
						>
							<div className="flex items-center gap-3 py-1">
								<div className={`w-10 h-10 rounded-lg flex items-center justify-center ${inputMode === "files" ? "bg-indigo-100" : "bg-blue-100"}`}>
									{inputMode === "files" ? <Upload className="w-5 h-5 text-indigo-700" /> : <Type className="w-5 h-5 text-blue-700" />}
								</div>
								<div className="text-left">
									<h2 className="font-semibold text-lg text-gray-800">Input Source</h2>
									<p className="text-sm text-gray-500">{inputMode === "files" ? "Upload files (PDF, TXT)" : "Paste text directly"}</p>
								</div>
							</div>
							{isInputSectionExpanded ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
						</button>

						{/* Collapsible Content */}
						<div className={`transition-all duration-300 ease-in-out overflow-hidden ${isInputSectionExpanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"}`}>
							<div className="p-6 pt-4">
								{inputMode === "files" ? (
									<FileUpload
										onFilesSelected={handleFilesSelected}
										maxSize={10 * 1024 * 1024} // 10MB
										maxFiles={5}
										acceptedFormats={["pdf", "txt"]}
									/>
								) : (
									<Textarea value={textInput} onChange={handleTextChange} characterCount={textInput.length} maxCharacters={10000} disabled={loading} />
								)}
							</div>
						</div>
					</div>

					{/* Submit Button / Processing Stages */}
					{!loading ? (
						<button
							onClick={handleSubmit}
							disabled={files.length === 0 && !textInput.trim()}
							className="bg-indigo-800 hover:bg-indigo-900 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors w-full max-w-md mx-auto flex items-center justify-center gap-2"
						>
							Generate Summary & MCQs
							<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
								<path
									fillRule="evenodd"
									d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z"
									clipRule="evenodd"
								/>
							</svg>
						</button>
					) : (
						<ProcessingStages 
							isComplete={processedInfo}
							onCollapse={() => {
								setLoading(false);
								setProcessedInfo(false);
							}} 
						/>
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

		  	{/* Result overlay rendered inside SPA */}
      		{showResult && result && <Result result={result} onClose={handleCloseResult} />}

			{/* Success Message for Form Export */}
			{formSuccess && (
						<div className=" rounded-lg p-4 border border-blue-200 bg-blue-50 animate-in slide-in-from-top-5">
							<div className="flex gap-3">
								<CheckCircle2 className="w-6 h-6 text-teal-700 flex-shrink-0" />

								<div className="flex-1">
									<h3 className="font-semibold text-blue-800">Form Created</h3>
									<p className="text-sm text-blue-700 mb-3">Your Google Form is ready.</p>

									<div className="flex flex-col sm:flex-row gap-2">
										<a
											href={formSuccess.formUrl}
											target="_blank"
											rel="noopener noreferrer"
											className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 px-3 rounded-md"
										>
											<ExternalLink className="w-4 h-4" />
											Open Form
										</a>

										<button onClick={() => setFormSuccess(null)} className="inline-flex items-center gap-2 text-blue-700 border border-blue-300 hover:bg-blue-100 text-sm py-2 px-3 rounded-md">
											<XCircle className="w-4 h-4" />
											Dismiss
										</button>
									</div>
								</div>
							</div>
						</div>
				)}

			{/* Error Display */}
			{error && (
				<div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 flex items-start gap-3 animate-in slide-in-from-top-5">
				<XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
					<div className="flex-1">
						<h3 className="font-semibold text-red-800 mb-1">Error</h3>
						<p className="text-sm text-red-600">{error}</p>
						<button onClick={() => setError(null)} className="mt-2 text-xs text-red-700 hover:text-red-900 underline">
									Dismiss
						</button>
					</div>
				</div>
				)}
        
		</div>
      </div> 
	</div>
			
	);
};

export default Dashboard;