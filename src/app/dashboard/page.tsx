"use client";
import React, { useState, useEffect } from "react";
import FileUpload from "@/components/ui/FileUpload";
import Textarea from "@/components/ui/Textarea";
import { useRouter, useSearchParams } from "next/navigation";
import { FileText, CheckCircle2, ExternalLink, XCircle, ChevronDown, ChevronUp, Upload, Type } from "lucide-react";

type InputMode = "files" | "text";

const Dashboard = () => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [files, setFiles] = useState<File[]>([]);
	const [textInput, setTextInput] = useState("");
	const [inputMode, setInputMode] = useState<InputMode>("files");
	const [isInputSectionExpanded, setIsInputSectionExpanded] = useState(false);
	const [loading, setLoading] = useState(false);
	const [exportLoading, setExportLoading] = useState(false);
	const [result, setResult] = useState<any>(null);
	const [error, setError] = useState<string | null>(null);
	const [formSuccess, setFormSuccess] = useState<{ formId: string; formUrl: string } | null>(null);

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
			return;
		}

		// Validate text input length
		if (textInput.trim() && textInput.trim().length < 10) {
			setError("Please provide at least 10 characters of text for processing.");
			return;
		}

		// Validate file count
		if (files.length > 5) {
			setError("You can upload a maximum of 5 files at once.");
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
		setResult(null);
		setFormSuccess(null); // Clear previous form success
		setIsInputSectionExpanded(false); // Auto-collapse input section after submission

		const formData = new FormData();

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
		} catch (err: any) {
			setError(err.message || "An unexpected error occurred. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	const handleFormExport = async () => {
		if (!result) {
			setError("No result to export. Please generate summary and MCQs first.");
			return;
		}

		// Validate result structure
		if (!result.mcqs || !Array.isArray(result.mcqs) || result.mcqs.length === 0) {
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
				const errorData = await res.json().catch(() => ({ error: "Failed to initiate form export" }));
				throw new Error(errorData.error || "Failed to initiate form export");
			}

			const data = await res.json();

			if (!data.url) {
				throw new Error("Invalid response from server. Missing authorization URL.");
			}

			// Redirect to Google OAuth
			window.location.href = data.url;
		} catch (err: any) {
			setError(err.message || "An error occurred while exporting to Google Forms. Please try again.");
			setExportLoading(false);
		}
	};

	return (
		<div className="container min-h-screen w-full bg-gray-50">
			<div className="flex flex-col lg:flex-row mt-10 m-4 p-6 gap-6">
				{/* Main Content */}
				<div className="flex flex-col m-2 p-10 gap-10 mx-auto w-full max-w-4xl">
					{/* Header Section */}
					<div className="flex flex-col gap-4 ">
						<div className="flex gap-3 h-fit">
							<FileText className="w-9 h-9 text-blue-800 ml-3" />
							<h1 className="font-bold text-3xl text-gray-800">Study Notes Summarizer</h1>
						</div>

						<p className="text-gray-600 text-sm px-4">Upload your documents or paste text to generate summaries and MCQs</p>
					</div>

					{/* Navigation Tabs - Above Section */}
					<div className="flex items-center gap-2 mb-4 bg-white rounded-xl p-1.5 shadow-sm border border-gray-200 w-fit">
						<button
							type="button"
							onClick={() => {
								handleInputModeToggle("files");
								setIsInputSectionExpanded(true);
							}}
							disabled={loading}
							className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
								inputMode === "files" ? "bg-indigo-600 text-white shadow-md" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
							} disabled:opacity-50 disabled:cursor-not-allowed`}
						>
							<Upload className="w-4 h-4" />
							Upload Files
						</button>
						<button
							type="button"
							onClick={() => {
								handleInputModeToggle("text");
								setIsInputSectionExpanded(true);
							}}
							disabled={loading}
							className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
								inputMode === "text" ? "bg-indigo-600 text-white shadow-md" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
							} disabled:opacity-50 disabled:cursor-not-allowed`}
						>
							<Type className="w-4 h-4" />
							Paste Text
						</button>
					</div>

					{/* Collapsible Input Section */}
					<div className="bg-white shadow-lg rounded-2xl border border-gray-200 overflow-hidden transition-all duration-300">
						{/* Section Header - Always Visible */}
						<button
							onClick={() => setIsInputSectionExpanded(!isInputSectionExpanded)}
							className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
							disabled={loading}
						>
							<div className="flex items-center gap-3">
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

					{/* Submit Button */}
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
								<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
									<path
										fillRule="evenodd"
										d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z"
										clipRule="evenodd"
									/>
								</svg>
							</>
						)}
					</button>

					{/* Success Message for Form Export */}
					{formSuccess && (
						<div className=" rounded-lg p-4 border border-green-200 bg-green-50 animate-in slide-in-from-top-5">
							<div className="flex gap-3">
								<CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />

								<div className="flex-1">
									<h3 className="font-semibold text-green-800">Form Created</h3>
									<p className="text-sm text-green-700 mb-3">Your Google Form is ready.</p>

									<div className="flex flex-col sm:flex-row gap-2">
										<a
											href={formSuccess.formUrl}
											target="_blank"
											rel="noopener noreferrer"
											className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm py-2 px-3 rounded-md"
										>
											<ExternalLink className="w-4 h-4" />
											Open Form
										</a>

										<button onClick={() => setFormSuccess(null)} className="inline-flex items-center gap-2 text-green-700 border border-green-300 hover:bg-green-100 text-sm py-2 px-3 rounded-md">
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

					{/* Results Section */}
					{result && (
						<div className="bg-white shadow-lg rounded-2xl p-8 w-full border border-gray-200">
							{/* Summary Section */}
							<div className="mb-8">
								<div className="flex items-center gap-2 mb-4">
									<div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
										<svg className="w-6 h-6 text-blue-700" fill="currentColor" viewBox="0 0 20 20">
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
									<p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{result.summary}</p>
								</div>
							</div>

							{/* MCQs Section */}
							<div>
								<div className="flex items-center gap-2 mb-4">
									<div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
										<svg className="w-6 h-6 text-green-700" fill="currentColor" viewBox="0 0 20 20">
											<path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
										</svg>
									</div>
									<h3 className="text-2xl font-bold text-gray-800">Generated MCQs</h3>
								</div>

								<div className="space-y-4">
									{result.mcqs && result.mcqs.length > 0 ? (
										result.mcqs.map((mcq: any, idx: number) => (
											<div key={idx} className="border border-gray-200 p-6 rounded-xl bg-gradient-to-br from-white to-gray-50 hover:shadow-md transition-shadow">
												<p className="font-semibold text-gray-800 mb-4 text-lg">
													<span className="inline-block w-8 h-8 bg-indigo-600 text-white rounded-full text-center leading-8 mr-3">{idx + 1}</span>
													{mcq.question}
												</p>
												<ul className="ml-11 space-y-2 mb-4">
													{mcq.options.map((opt: string, i: number) => (
														<li key={i} className="flex items-start gap-2 text-gray-700">
															<span className="font-medium text-indigo-600 min-w-[24px]">{String.fromCharCode(65 + i)}.</span>
															<span>{opt}</span>
														</li>
													))}
												</ul>
												<div className="ml-11 pt-3 border-t border-gray-200">
													<p className="text-green-700 font-semibold flex items-center gap-2">
														<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
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
															<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
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
											<svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
												<path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
											</svg>
											<p className="text-lg">No MCQs generated.</p>
										</div>
									)}
								</div>
							</div>
							<div className="mt-8 pt-6 border-t border-gray-200">
								<div className="flex flex-col items-center gap-4">
									<div className="text-center">
										<h3 className="text-lg font-semibold text-gray-800 mb-2">Export to Google Forms</h3>
										<p className="text-sm text-gray-600 mb-4">Create a Google Form with your generated MCQs and summary</p>
									</div>
									<button
										onClick={handleFormExport}
										disabled={exportLoading}
										className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-md hover:shadow-lg"
									>
										{exportLoading ? (
											<>
												<svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
													<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
													<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
												</svg>
												Authorizing with Google...
											</>
										) : (
											<>
												<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
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
										You will be redirected to Google to authorize the application. After authorization, your form will be created automatically.
									</p>
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
