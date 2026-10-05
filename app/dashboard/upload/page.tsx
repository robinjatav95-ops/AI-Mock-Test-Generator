"use client";

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function DashboardUploadPage() {
  const [activeTab, setActiveTab] = useState<'file' | 'text'>('file');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [textInput, setTextInput] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage(null);
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setSelectedFile(file);
      if (file.type.startsWith('image/')) {
        setPreviewUrl(URL.createObjectURL(file));
      } else {
        setPreviewUrl(null);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      setSelectedFile(file);
      if (file.type.startsWith('image/')) {
        setPreviewUrl(URL.createObjectURL(file));
      } else {
        setPreviewUrl(null);
      }
    }
  };

  const onBoxClick = (e: React.MouseEvent) => {
    if (e.target === fileInputRef.current) return;
    fileInputRef.current?.click();
  };

  const handleRemoveFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleGenerateMock = async () => {
    setErrorMessage(null);

    if (activeTab === 'file' && !selectedFile) {
      setErrorMessage('Please select or drop an image or PDF containing questions.');
      return;
    }

    if (activeTab === 'text' && !textInput.trim()) {
      setErrorMessage('Please enter or paste questions text first.');
      return;
    }

    setLoading(true);
    setStatusMessage('Uploading and analyzing questions with Gemini AI...');

    try {
      const formData = new FormData();
      if (activeTab === 'file' && selectedFile) {
        formData.append('file', selectedFile);
      } else if (activeTab === 'text' && textInput.trim()) {
        formData.append('text', textInput.trim());
      }

      setStatusMessage('Extracting questions and generating multiple choice options...');

      const response = await fetch('/api/extract-questions', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to extract questions.');
      }

      if (!data.questions || data.questions.length === 0) {
        throw new Error('No questions could be extracted. Please make sure the questions are clearly readable.');
      }

      setStatusMessage('Questions ready! Redirecting to review...');

      // Save to localStorage for review and test interface
      localStorage.setItem('extracted_questions', JSON.stringify(data.questions));
      // Reset any previous test results
      localStorage.removeItem('test_results');
      localStorage.removeItem('selected_answers');

      router.push('/dashboard/review');
    } catch (error: any) {
      console.error('Extraction error:', error);
      setErrorMessage(error.message || 'Something went wrong while processing your questions.');
    } finally {
      setLoading(false);
      setStatusMessage('');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex flex-col">
      {/* Top Navbar */}
      <nav className="bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center shadow-sm sticky top-0 z-20">
        <Link href="/dashboard" className="text-xl font-bold text-gray-900 tracking-tight">
          Mock<span className="text-indigo-600">AI</span>
        </Link>
        <Link 
          href="/dashboard" 
          className="text-sm font-medium text-gray-500 hover:text-gray-900 px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          ✕ Cancel
        </Link>
      </nav>

      {/* Main Container */}
      <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-8 flex flex-col justify-center">
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Upload Your Questions</h1>
          <p className="text-sm text-gray-500 mt-1">
            Upload question photos, notes, or paste text. Our AI will turn them into an interactive mock test.
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex bg-white p-1 rounded-xl border border-gray-200 shadow-sm mb-6">
          <button
            type="button"
            onClick={() => { setActiveTab('file'); setErrorMessage(null); }}
            className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${
              activeTab === 'file'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            📸 Upload Photo / File
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('text'); setErrorMessage(null); }}
            className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${
              activeTab === 'text'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            ✍️ Paste Question Text
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-start gap-3">
            <span className="text-lg">⚠️</span>
            <div className="flex-1">
              <p className="font-semibold">Unable to generate mock test</p>
              <p className="text-xs text-red-600 mt-0.5">{errorMessage}</p>
            </div>
            <button 
              onClick={() => setErrorMessage(null)} 
              className="text-red-400 hover:text-red-700 text-xs font-bold"
            >
              ✕
            </button>
          </div>
        )}

        {/* Content Box */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 sm:p-8 shadow-sm">
          {activeTab === 'file' ? (
            <div>
              <div
                onClick={onBoxClick}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className="border-2 border-dashed border-indigo-200 bg-indigo-50/20 hover:bg-indigo-50/50 p-8 rounded-2xl cursor-pointer transition-all flex flex-col items-center justify-center min-h-[220px] relative text-center"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*,application/pdf"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  disabled={loading}
                />

                {previewUrl ? (
                  <div className="w-full flex flex-col items-center z-20">
                    <img
                      src={previewUrl}
                      alt="Question Preview"
                      className="max-h-48 object-contain rounded-xl shadow-sm border border-gray-100"
                    />
                    <div className="mt-3 flex items-center gap-2">
                      <span className="text-xs text-green-700 font-semibold bg-green-50 px-3 py-1 rounded-full border border-green-200">
                        ✓ {selectedFile?.name}
                      </span>
                      <button
                        type="button"
                        onClick={handleRemoveFile}
                        className="text-xs text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-2.5 py-1 rounded-full border border-red-200"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : selectedFile ? (
                  <div className="text-center z-20">
                    <span className="text-5xl block mb-2">📄</span>
                    <p className="text-sm font-semibold text-gray-800">{selectedFile.name}</p>
                    <p className="text-xs text-gray-400 mt-1">Ready for analysis</p>
                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      className="mt-3 text-xs text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-full border border-red-200"
                    >
                      Remove file
                    </button>
                  </div>
                ) : (
                  <div className="z-0">
                    <span className="text-4xl mb-3 block">📸</span>
                    <p className="text-base font-semibold text-gray-800">
                      Click or drag question photo here
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Supports JPG, PNG, WEBP, and PDF
                    </p>
                    <span className="mt-4 inline-block px-4 py-1.5 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-lg border border-indigo-100">
                      Browse Files
                    </span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Paste your question text below:
              </label>
              <textarea
                rows={8}
                value={textInput}
                onChange={(e) => {
                  setTextInput(e.target.value);
                  setErrorMessage(null);
                }}
                disabled={loading}
                placeholder="Example:&#10;1. What is the process of photosynthesis?&#10;2. Define Newton's First Law of Motion.&#10;3. Which organ in the human body produces insulin?"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-gray-900 text-sm transition-all resize-none"
              />
            </div>
          )}

          {/* Action Button & Progress */}
          <div className="mt-6">
            {loading ? (
              <div className="p-4 bg-indigo-50/60 border border-indigo-100 rounded-xl flex items-center justify-center gap-3">
                <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm font-semibold text-indigo-900 animate-pulse">
                  {statusMessage || 'AI Extracting questions...'}
                </span>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleGenerateMock}
                disabled={activeTab === 'file' ? !selectedFile : !textInput.trim()}
                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-md shadow-indigo-500/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm flex items-center justify-center gap-2"
              >
                <span>Generate Mock Test</span>
                <span>🚀</span>
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
