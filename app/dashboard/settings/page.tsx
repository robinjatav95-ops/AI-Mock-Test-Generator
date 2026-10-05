"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '../../../components/supabaseClient';

export default function SettingsPage() {
  const router = useRouter();
  
  useEffect(() => {
    // Security Session Check
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) router.push('/login');
    };
    checkAuth();
  }, [router]);

  const [testName, setTestName] = useState('My Custom Practice Mock');
  const [duration, setDuration] = useState('10');
  const [markingSystem, setMarkingSystem] = useState('standard');

  const handleGenerateMock = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Generating test "${testName}" with a ${duration}-minute timer!`);
    router.push('/dashboard/test-interface');
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center shadow-sm">
        <Link href="/dashboard" className="text-xl font-bold text-gray-900 tracking-tight">
          Mock<span className="text-indigo-600">AI</span>
        </Link>
        <Link href="/dashboard/review" className="text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors">
          ← Back to Review
        </Link>
      </nav>

      {/* Main Form Area */}
      <main className="max-w-xl mx-auto px-4 py-10">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Configure Mock Test</h1>
          <p className="text-sm text-gray-500 mt-1">Set up your practice session parameters before starting.</p>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <form onSubmit={handleGenerateMock} className="space-y-6">
            
            {/* Test Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mock Test Name</label>
              <input
                type="text"
                required
                value={testName}
                onChange={(e) => setTestName(e.target.value)}
                placeholder="e.g. SSC CGL English Mini Mock"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-gray-900 text-sm transition-all"
              />
            </div>

            {/* Duration Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Time Limit (Minutes)</label>
              <div className="grid grid-cols-3 gap-3">
                {['5', '10', '20'].map((time) => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => setDuration(time)}
                    className={`py-2.5 text-sm font-medium rounded-xl border transition-all ${duration === time ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm' : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'}`}
                  >
                    {time} Mins
                  </button>
                ))}
              </div>
            </div>

            {/* Marking Rules */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Marking Rules</label>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-100/50 transition-colors">
                  <input
                    type="radio"
                    name="marking"
                    checked={markingSystem === 'standard'}
                    onChange={() => setMarkingSystem('standard')}
                    className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                  />
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Standard Pattern</p>
                    <p className="text-xs text-gray-400">+2 Marks for Correct, -0.5 for Wrong</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-100/50 transition-colors">
                  <input
                    type="radio"
                    name="marking"
                    checked={markingSystem === 'free'}
                    onChange={() => setMarkingSystem('free')}
                    className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                  />
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Relaxed Mode</p>
                    <p className="text-xs text-gray-400">+1 Mark for Correct, No Negative Marking</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Action Trigger */}
            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-colors shadow-sm text-sm font-semibold mt-4"
            >
              🚀 Launch Mock Test
            </button>

          </form>
        </div>
      </main>
    </div>
  );
}
