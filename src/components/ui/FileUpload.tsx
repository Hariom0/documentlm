'use client'
import React, { useEffect, useRef, useState } from 'react';
import { Upload } from 'lucide-react';

interface FileUploadProps {
    onFilesSelected?: (files: File[]) => void;
    maxSize?: number;
    maxFiles?: number;
    acceptedFormats?: string[];
}

export const FileUpload: React.FC<FileUploadProps> = ({
    onFilesSelected,
    maxSize = 10 * 1024 * 1024,
    maxFiles = 3,
    acceptedFormats = ['pdf', 'txt'],
}) => {
    const [isDragging, setIsDragging] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDragEnter = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const fileValidation = (files: FileList | null): File[] => {
        if (!files) return [];

        //consider only the files that are valid by file format and size for further processing
        const validFiles: File[] = [];

        Array.from(files).forEach((file) => {
            const fileName = file.name
            console.log(fileName)
            const fileExtension = fileName.split('.').pop()?.toLowerCase();
            //to check file format
            const isValidFormat = acceptedFormats.includes(fileExtension || '');
            //to check file size
            const isValidSize = file.size <= maxSize;

            if (!isValidFormat) {
                alert(`File "${file.name}" has an invalid format. Only ${acceptedFormats.join(', ')} files are allowed.`);
                return;
            }

            if (!isValidSize) {
                alert(`File "${file.name}" exceeds the maximum size of ${maxSize / (1024 * 1024)}MB.`);
                return;
            }
            const fileLimit = maxFiles - uploadedFiles.length;
            //if number of files exceed the max file limit, display an alert
            if (files.length > fileLimit) {
                alert(`You can only upload ${maxFiles} files at a time.`);
                return validFiles;
            }

            validFiles.push(file);
        });


        return validFiles;
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const files = fileValidation(e.dataTransfer.files);
        const newFiles = [...uploadedFiles, ...files];
        setUploadedFiles(newFiles);
        onFilesSelected?.(newFiles);
    };

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = fileValidation(e.target.files);
        const newFiles = [...uploadedFiles, ...files];
        setUploadedFiles(newFiles);
        onFilesSelected?.(newFiles);
    };

    const handleBrowseClick = () => {
        fileInputRef.current?.click();
    };

    const handleRemoveFile = (index: number) => {
        const newFiles = uploadedFiles.filter((_, i) => i !== index);
        setUploadedFiles(newFiles);
        onFilesSelected?.(newFiles);
    };

    useEffect(()=>{
        uploadedFiles.forEach((file,index)=>{
            console.log('File',index,":",file.name)
        });
    }, [uploadedFiles]);

    return (
            <div className="w-full max-w-3xl mx-auto bg-gradient-to-b from-blue-100/60 to-blue-200 border border-blue-200/50 p-6 rounded-xl h-fit shadow-lg">
            <div className="w-full max-w-3xl mx-auto bg-gradient-to-b from-blue-100/60 to-blue-200 border border-blue-200/50 p-6 rounded-xl h-fit shadow-lg">
                <div className="mb-4 ">
                    <div className="flex items-center gap-2 mb-2 ">
                    <div className="flex items-center gap-2 mb-2 ">
                        <svg className="w-5 h-5 text-indigo-700" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1m3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        <h2 className="text-lg font-semibold text-gray-800">Upload Files</h2>
                    </div>
                    <p className="text-sm text-gray-600">Upload PDF or TXT files (max 10MB each)</p>
                </div>

                <div
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                        isDragging ? 'border-indigo-500 bg-indigo-50/50' : 'border-gray-300 hover:border-indigo-400'
                    }`}
                >
                    <Upload className="w-12 h-12 text-gray-500/80 mx-auto mb-4 " />
                    <Upload className="w-12 h-12 text-gray-500/80 mx-auto mb-4 " />
                    <p className="text-gray-700 font-medium mb-2">Drop your files here or click to browse</p>
                    <p className="text-sm text-gray-500 mb-6">Supports PDF, TXT files up to 10MB</p>
                    <button
                        onClick={handleBrowseClick}
                        className="bg-indigo-800 hover:bg-indigo-900 text-white font-medium py-2 px-6 rounded-lg transition-colors cursor-pointer"
                    >
                        Choose Files
                    </button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept=".pdf,.txt"
                        onChange={handleFileInputChange}
                        className="hidden"
                    />
                </div>

                {/* To display and remove Uploaded files */}
                {uploadedFiles.length > 0 && (
                    <div className="mt-6">
                        <h3 className="text-sm font-semibold text-gray-800 mb-3">Uploaded Files ({uploadedFiles.length})</h3>
                        <div className="space-y-2">
                            {uploadedFiles.map((file, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200"
                                >
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                        <div className="bg-blue-100 p-2 rounded">
                                            <svg className="w-4 h-4 text-blue-700" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M8 16.5a1 1 0 01-1-1V9a1 1 0 112 0v6.5a1 1 0 01-1 1zm3-1a1 1 0 100 2h5a2 2 0 002-2V9.414A1.999 1.999 0 0016.414 8H12a1 1 0 00-1 1v6.5a1 1 0 11-2 0V9a3 3 0 013-3h4.414A3 3 0 0119 9v5.586A3 3 0 0116.586 18H11zm-5.707-1.293a1 1 0 010-1.414L5.586 12 5.293 11.707a1 1 0 00-1.414 1.414l1 1a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L5.586 10.586 5.293 10.293z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium text-gray-800 truncate">{file.name}</p>
                                            <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleRemoveFile(index)}
                                        className="ml-2 text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                                    >
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}


            </div>
        
    );
};

export default FileUpload;
