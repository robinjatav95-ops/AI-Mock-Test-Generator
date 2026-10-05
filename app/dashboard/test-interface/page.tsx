"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Question {
  id: number;
  question?: string;
  text?: string;
  options: string[];
  correct?: string;
  explanation?: string;
}

export default function TestInterfacePage() {
  const router = useRouter();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number }>({});
  const [timeLeft, setTimeLeft] = useState(600);
  const [loading, setLoading] = useState(true);

  // Load questions from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('extracted_questions');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setQuestions(parsed);
          // 90 seconds per question, minimum 5 minutes (300s)
          setTimeLeft(Math.max(300, parsed.length * 90));
        }
      }
    } catch (e) {
      console.error('Failed to load questions:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  // Timer countdown
  useEffect(() => {
    if (loading || questions.length === 0) return;

    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, loading, questions.length]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(Math.max(0, seconds) / 60);
    const secs = Math.max(0, seconds) % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (optIdx: number) => {
    const qId = questions[currentIdx]?.id ?? currentIdx + 1;
    setSelectedAnswers({
      ...selectedAnswers,
      [qId]: optIdx,
    });
  };

  const handleSubmit = () => {
    // Calculate results
    let correctCount = 0;
    let wrongCount = 0;
    let unansweredCount = 0;

    const detailedExplanations = questions.map((q, idx) => {
      const qId = q.id ?? idx + 1;
      const selectedOptIdx = selectedAnswers[qId];
      const hasAnswered = selectedOptIdx !== undefined;

      const questionText = q.question || q.text || `Question ${idx + 1}`;
      const correctOption = q.correct || q.options[0] || '';
      const userOption = hasAnswered ? q.options[selectedOptIdx] : null;

      let isCorrect = false;
      if (hasAnswered && userOption) {
        if (
          userOption.trim().toLowerCase() === correctOption.trim().toLowerCase() ||
          userOption.includes(correctOption) ||
          correctOption.includes(userOption)
        ) {
          isCorrect = true;
          correctCount++;
        } else {
          wrongCount++;
        }
      } else {
        unansweredCount++;
      }

      return {
        id: qId,
        text: questionText,
        userAnswer: userOption ? `${userOption} (Option ${String.fromCharCode(65 + selectedOptIdx)})` : 'Not Answered',
        correctAnswer: correctOption,
        isCorrect,
        explanation: q.explanation || `The correct answer is "${correctOption}".`,
      };
    });

    const totalQuestions = questions.length;
    const attempted = correctCount + wrongCount;
    const accuracy = attempted > 0 ? `${Math.round((correctCount / attempted) * 100)}%` : '0%';
    const scoreVal = correctCount * 2 - wrongCount * 0.5;
    const scoreObtained = `${scoreVal >= 0 ? '+' : ''}${scoreVal} / ${totalQuestions * 2}`;

    const scoreCard = {
      totalQuestions,
      correct: correctCount,
      wrong: wrongCount,
      unanswered: unansweredCount,
      scoreObtained,
      accuracy,
    };

    const testResults = {
      scoreCard,
      detailedExplanations,
      date: new Date().toISOString(),
    };

    localStorage.setItem('test_results', JSON.stringify(testResults));
    router.push('/dashboard/result');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm font-semibold text-gray-700">Loading your mock test...</p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
          <span className="text-5xl block mb-3">📝</span>
          <h2 className="text-xl font-bold text-gray-900">No Mock Test Active</h2>
          <p className="text-sm text-gray-500 mt-2">
            Please upload question photos or paste text first to generate your mock test.
          </p>
          <Link
            href="/dashboard/upload"
            className="mt-6 inline-block w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all text-sm"
          >
            Upload Questions →
          </Link>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIdx];
  const currentQId = currentQuestion?.id ?? currentIdx + 1;
  const currentText = currentQuestion?.question || currentQuestion?.text || `Question ${currentIdx + 1}`;
  const currentOptions = currentQuestion?.options || [];

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex flex-col">
      {/* Top Header with Active Timer */}
      <header className="bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center shadow-sm sticky top-0 z-20">
        <div>
          <h1 className="text-base font-bold text-gray-800">Mock Practice Test</h1>
          <p className="text-xs text-gray-400">Total Questions: {questions.length}</p>
        </div>
        <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 px-4 py-2 rounded-xl font-mono text-sm font-bold">
          ⏱️ {formatTime(timeLeft)}
        </div>
      </header>

      {/* Main Content Layout */}
      <div className="flex-1 max-w-5xl w-full mx-auto p-4 grid grid-cols-1 md:grid-cols-4 gap-6 mt-4">
        
        {/* Left Side: Active Question Workspace */}
        <div className="md:col-span-3 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between min-h-[420px]">
          <div>
            <div className="border-b border-gray-100 pb-3 mb-4 flex justify-between items-center">
              <span className="text-xs font-bold text-indigo-600 tracking-wider">
                QUESTION {currentIdx + 1} OF {questions.length}
              </span>
              <span className="text-xs text-gray-400">
                {selectedAnswers[currentQId] !== undefined ? '✓ Answered' : 'Not answered'}
              </span>
            </div>

            <p className="text-base sm:text-lg font-semibold text-gray-800 mb-6 leading-relaxed">
              {currentText}
            </p>

            {/* Options Interactive List */}
            <div className="space-y-3">
              {currentOptions.map((option, idx) => {
                const isSelected = selectedAnswers[currentQId] === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full text-left px-5 py-3.5 text-sm font-medium rounded-xl border transition-all flex items-center gap-3.5 ${
                      isSelected
                        ? 'bg-indigo-50 border-indigo-500 text-indigo-900 shadow-sm'
                        : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100/80'
                    }`}
                  >
                    <span
                      className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center border transition-all ${
                        isSelected
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-white border-gray-300 text-gray-500'
                      }`}
                    >
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="flex-1 leading-snug">{option}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom Navigation Buttons */}
          <div className="flex justify-between items-center border-t border-gray-100 pt-5 mt-8">
            <button
              type="button"
              onClick={() => setCurrentIdx((prev) => Math.max(0, prev - 1))}
              disabled={currentIdx === 0}
              className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              ← Previous
            </button>

            <div className="flex items-center gap-2">
              {currentIdx < questions.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentIdx((prev) => prev + 1)}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-medium shadow-sm transition-all"
                >
                  Next Question →
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-semibold shadow-md transition-all"
                >
                  Submit Mock Test 🎉
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Status Navigation Palette */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm h-fit space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Questions
            </h3>
            <span className="text-xs font-semibold text-gray-600">
              {Object.keys(selectedAnswers).length}/{questions.length} done
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2 max-h-60 overflow-y-auto pr-1">
            {questions.map((q, idx) => {
              const qId = q.id ?? idx + 1;
              const isAnswered = selectedAnswers[qId] !== undefined;
              const isActive = currentIdx === idx;
              return (
                <button
                  key={qId}
                  type="button"
                  onClick={() => setCurrentIdx(idx)}
                  className={`h-10 text-xs font-bold rounded-xl border transition-all ${
                    isActive ? 'ring-2 ring-indigo-600 ring-offset-2' : ''
                  } ${
                    isAnswered
                      ? 'bg-green-50 border-green-500 text-green-700'
                      : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          <div className="border-t border-gray-100 pt-3 text-xs text-gray-400 space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-green-50 border border-green-500 rounded"></span> Answered
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-gray-50 border border-gray-200 rounded"></span> Not Visited / Unanswered
            </div>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            className="w-full py-2.5 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl text-xs transition-colors shadow-sm mt-2"
          >
            Finish & Submit Early
          </button>
        </div>

      </div>
    </div>
  );
}
