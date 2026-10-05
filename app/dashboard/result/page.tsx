"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface ScoreCard {
  totalQuestions: number;
  correct: number;
  wrong: number;
  unanswered: number;
  scoreObtained: string;
  accuracy: string;
}

interface ExplanationItem {
  id: number;
  text: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  explanation: string;
}

interface TestResults {
  scoreCard: ScoreCard;
  detailedExplanations: ExplanationItem[];
  date?: string;
}

export default function ResultPage() {
  const [results, setResults] = useState<TestResults | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('test_results');
      if (stored) {
        setResults(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to parse test results:', e);
    } finally {
      setLoaded(true);
    }
  }, []);

  if (!loaded) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
          <span className="text-5xl block mb-3">📊</span>
          <h2 className="text-xl font-bold text-gray-900">No Test Results Found</h2>
          <p className="text-sm text-gray-500 mt-2">
            You haven't completed any mock tests yet. Upload questions to take a practice test.
          </p>
          <div className="mt-6 flex flex-col gap-2">
            <Link
              href="/dashboard/upload"
              className="py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm transition-all"
            >
              Upload Questions & Start Test →
            </Link>
            <Link
              href="/dashboard"
              className="py-2.5 px-4 text-gray-600 hover:text-gray-900 text-sm font-medium"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { scoreCard, detailedExplanations } = results;

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex flex-col">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center shadow-sm sticky top-0 z-20">
        <Link href="/dashboard" className="text-xl font-bold text-gray-900 tracking-tight">
          Mock<span className="text-indigo-600">AI</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/upload"
            className="text-xs sm:text-sm font-medium bg-indigo-50 text-indigo-700 px-3.5 py-1.5 rounded-xl hover:bg-indigo-100 transition-all"
          >
            + New Test
          </Link>
          <Link
            href="/dashboard"
            className="text-xs sm:text-sm font-medium text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-xl border border-gray-200 hover:bg-gray-50 transition-all"
          >
            Dashboard
          </Link>
        </div>
      </nav>

      {/* Main Framework */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <span className="inline-block px-3 py-1 bg-green-50 text-green-700 font-semibold text-xs rounded-full border border-green-200 mb-2">
            ✓ Test Completed
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Performance Report</h1>
          <p className="text-sm text-gray-500 mt-1">
            Detailed score breakdown and AI question analysis based on your test.
          </p>
        </div>

        {/* Score Metrics Panel */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mb-8">
          <div className="bg-white border border-gray-100 p-5 rounded-2xl text-center shadow-sm">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Score Obtained</p>
            <p className="text-2xl font-extrabold text-indigo-600 mt-1.5">{scoreCard.scoreObtained}</p>
          </div>
          <div className="bg-white border border-gray-100 p-5 rounded-2xl text-center shadow-sm">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Accuracy</p>
            <p className="text-2xl font-extrabold text-amber-600 mt-1.5">{scoreCard.accuracy}</p>
          </div>
          <div className="bg-white border border-gray-100 p-5 rounded-2xl text-center shadow-sm">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Correct</p>
            <p className="text-2xl font-extrabold text-green-600 mt-1.5">
              {scoreCard.correct} <span className="text-xs font-normal text-gray-400">/ {scoreCard.totalQuestions}</span>
            </p>
          </div>
          <div className="bg-white border border-gray-100 p-5 rounded-2xl text-center shadow-sm">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Wrong</p>
            <p className="text-2xl font-extrabold text-red-600 mt-1.5">{scoreCard.wrong}</p>
          </div>
        </div>

        {/* Answer Explanations List Section */}
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-800">Question Analysis & Solutions</h2>
            <span className="text-xs font-medium text-gray-500">
              {detailedExplanations.length} Questions
            </span>
          </div>

          {detailedExplanations.map((item, index) => {
            const isUnanswered = item.userAnswer === 'Not Answered';
            return (
              <div
                key={item.id || index}
                className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-3.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                    Question {index + 1}
                  </span>
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full border ${
                      item.isCorrect
                        ? 'bg-green-50 text-green-700 border-green-200'
                        : isUnanswered
                        ? 'bg-gray-100 text-gray-600 border-gray-200'
                        : 'bg-red-50 text-red-700 border-red-200'
                    }`}
                  >
                    {item.isCorrect
                      ? '✓ Correct'
                      : isUnanswered
                      ? '⊘ Not Answered'
                      : '✕ Incorrect'}
                  </span>
                </div>

                <p className="text-sm sm:text-base font-semibold text-gray-800 leading-snug">
                  {item.text}
                </p>

                <div className="text-xs sm:text-sm space-y-1.5 bg-gray-50/80 p-3.5 rounded-xl border border-gray-100">
                  <p>
                    <span className="font-semibold text-gray-500">Your Answer: </span>
                    <span
                      className={
                        item.isCorrect
                          ? 'text-green-700 font-semibold'
                          : isUnanswered
                          ? 'text-gray-500 italic'
                          : 'text-red-700 font-semibold'
                      }
                    >
                      {item.userAnswer}
                    </span>
                  </p>
                  <p>
                    <span className="font-semibold text-gray-500">Correct Answer: </span>
                    <span className="text-green-700 font-semibold">{item.correctAnswer}</span>
                  </p>
                </div>

                {item.explanation && (
                  <div className="bg-indigo-50/40 border border-indigo-100/70 p-4 rounded-xl">
                    <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-wide">
                      💡 AI Explanation:
                    </h4>
                    <p className="text-xs text-indigo-950 mt-1 leading-relaxed">
                      {item.explanation}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Action Footer */}
        <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row gap-3">
          <Link
            href="/dashboard/test-interface"
            className="flex-1 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-center shadow-md transition-all text-sm"
          >
            Retake This Test 🔁
          </Link>
          <Link
            href="/dashboard/upload"
            className="flex-1 py-3.5 border border-indigo-200 text-indigo-700 hover:bg-indigo-50/50 font-bold rounded-xl text-center transition-all text-sm"
          >
            Upload New Questions 📸
          </Link>
        </div>
      </main>
    </div>
  );
}
