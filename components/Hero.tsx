"use client";

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function Hero() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
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

  const handleGenerateMock = async () => {
    if (!selectedFile) return;
    setLoading(true);
    setErrorMessage(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await fetch('/api/extract-questions', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'AI Extraction failed');
      }

      if (!data.questions || data.questions.length === 0) {
        throw new Error('No questions could be extracted from this photo.');
      }

      // Save questions in localStorage for review and practice test
      localStorage.setItem('extracted_questions', JSON.stringify(data.questions));
      localStorage.removeItem('test_results');
      localStorage.removeItem('selected_answers');

      router.push('/dashboard/review');
    } catch (error: any) {
      console.error('Extraction error:', error);
      setErrorMessage(error.message || 'Failed to extract questions. Please check the image and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="pt-32 pb-20 px-6 max-w-5xl mx-auto text-center flex flex-col items-center justify-center min-h-[85vh]">
      <h1 className="text-4xl sm:text-6xl font-extrabold text-gray-900 max-w-3xl leading-[1.15]">
        Turn Your Questions Into a <span className="text-indigo-600">Mock Test</span>
      </h1>
      <p className="mt-6 text-base sm:text-lg text-gray-500 max-w-xl">
        Upload photos, PDFs, or screenshots. Our AI will turn them into a real-time practice test in seconds.
      </p>

      {/* Error Notice */}
      {errorMessage && (
        <div className="mt-6 max-w-md w-full p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-start gap-3 text-left">
          <span className="text-lg">⚠️</span>
          <div className="flex-1">
            <p className="font-semibold">Extraction Failed</p>
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

      {/* Box clicking layout */}
      <div 
        onClick={onBoxClick}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="mt-8 max-w-md w-full border-2 border-dashed border-indigo-300 bg-indigo-50/30 hover:bg-indigo-50/60 p-8 rounded-2xl cursor-pointer transition-all flex flex-col items-center justify-center min-h-[200px] relative"
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
            <img src={previewUrl} alt="Preview" className="max-h-40 object-contain rounded-lg shadow-sm" />
            <p className="mt-3 text-xs text-green-600 font-semibold bg-green-50 px-3 py-1 rounded-full border border-green-100">
              ✓ Loaded: {selectedFile?.name}
            </p>
          </div>
        ) : selectedFile ? (
          <div className="text-center z-20">
            <span className="text-4xl">📄</span>
            <p className="mt-2 text-sm text-gray-700 font-medium">{selectedFile.name}</p>
          </div>
        ) : (
          <div className="text-center z-0">
            <span className="text-4xl mb-2 block">📸</span>
            <p className="text-sm font-semibold text-gray-700">Drop your questions here</p>
            <p className="text-xs text-gray-400 mt-1">Click or drag images or PDFs here</p>
          </div>
        )}
      </div>

      {selectedFile && (
        <button
          onClick={handleGenerateMock}
          disabled={loading}
          className="mt-6 px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-md disabled:opacity-50 transition-all z-30 flex items-center gap-2"
        >
          {loading && (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          )}
          <span>{loading ? 'AI Extracting Questions...' : 'Generate Mock Test 🚀'}</span>
        </button>
      )}
    </section>
  );
}
