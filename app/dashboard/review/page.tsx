"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface QuestionItem {
  id: number;
  question?: string;
  text?: string;
  options: string[];
  correct: string;
  explanation?: string;
}

export default function ReviewPage() {
  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    try {
      const data = localStorage.getItem('extracted_questions');
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) {
          setQuestions(parsed);
        }
      }
    } catch (e) {
      console.error('Failed to load extracted questions:', e);
    } finally {
      setLoaded(true);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex flex-col">
      {/* Top Navbar */}
      <nav className="bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center shadow-sm sticky top-0 z-20">
        <Link href="/dashboard" className="text-xl font-bold text-gray-900 tracking-tight">
          Mock<span className="text-indigo-600">AI</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/upload"
            className="text-xs sm:text-sm font-medium text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            ← Upload Again
          </Link>
          <Link
            href="/dashboard"
            className="text-xs sm:text-sm font-medium text-gray-500 hover:text-gray-800"
          >
            Dashboard
          </Link>
        </div>
      </nav>

      {/* Main Body */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-8">
        <div className="bg-white border border-gray-100 p-6 sm:p-8 rounded-2xl shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-gray-100 gap-2">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                AI Generated Mock Test
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Review the extracted questions and verified answers before taking the test.
              </p>
            </div>
            {questions.length > 0 && (
              <span className="self-start sm:self-auto bg-indigo-50 text-indigo-700 text-xs font-bold px-3 py-1.5 rounded-full border border-indigo-100">
                {questions.length} Questions Ready
              </span>
            )}
          </div>

          <div className="mt-6 space-y-6">
            {!loaded ? (
              <div className="py-12 text-center text-gray-400">Loading questions...</div>
            ) : questions.length === 0 ? (
              <div className="text-center py-12">
                <span className="text-5xl block mb-3">📋</span>
                <h3 className="text-lg font-semibold text-gray-800">No questions found</h3>
                <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">
                  Upload photos or text of your questions first so our AI can generate a practice test for you.
                </p>
                <Link
                  href="/dashboard/upload"
                  className="mt-6 inline-block px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl shadow-md transition-all"
                >
                  Upload Questions Now →
                </Link>
              </div>
            ) : (
              questions.map((q, index) => {
                const questionText = q.question || q.text || `Question ${index + 1}`;
                return (
                  <div
                    key={q.id || index}
                    className="p-5 border border-indigo-100 bg-indigo-50/20 rounded-xl"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <p className="font-semibold text-gray-800 text-base">
                        <span className="text-indigo-600 font-bold mr-2">Q{index + 1}.</span>
                        {questionText}
                      </p>
                    </div>

                    <div className="mt-3.5 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {q.options?.map((opt: string, optIdx: number) => {
                        const isCorrect = opt === q.correct;
                        return (
                          <div
                            key={optIdx}
                            className={`px-4 py-2.5 rounded-xl border text-sm font-medium flex items-center justify-between gap-2 transition-all ${
                              isCorrect
                                ? 'bg-green-50 border-green-300 text-green-800 shadow-sm'
                                : 'bg-white border-gray-200 text-gray-700'
                            }`}
                          >
                            <span>
                              <span className="text-xs font-bold text-gray-400 mr-2">
                                {String.fromCharCode(65 + optIdx)}.
                              </span>
                              {opt}
                            </span>
                            {isCorrect && (
                              <span className="text-xs font-bold bg-green-200/80 text-green-900 px-2 py-0.5 rounded-full">
                                Correct ✓
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {q.explanation && (
                      <div className="mt-3 p-3 bg-white/80 border border-indigo-100 rounded-lg text-xs text-gray-600">
                        <span className="font-bold text-indigo-700">💡 Explanation: </span>
                        {q.explanation}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {questions.length > 0 && (
            <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row gap-3">
              <Link
                href="/dashboard/upload"
                className="py-3.5 px-6 border border-gray-200 text-gray-700 font-semibold rounded-xl text-center hover:bg-gray-50 transition-colors text-sm"
              >
                Upload Different File
              </Link>
              <button
                type="button"
                onClick={() => router.push('/dashboard/test-interface')}
                className="flex-1 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md shadow-indigo-500/10 transition-all text-sm flex items-center justify-center gap-2"
              >
                <span>Start Practice Test</span>
                <span>⏱️</span>
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
