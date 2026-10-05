"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '../../components/supabaseClient';
export default function DashboardPage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>("");

  useEffect(() => {
    // Current authenticated user fetch karne ke liye
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
      } else {
        setUserEmail(user.email ?? "Student");
      }
    };
    checkUser();
  }, [router]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      alert("Logout Error: " + error.message);
    } else {
      alert("Successfully logged out!");
      router.push('/login');
    }
  };

  const handleStartUpload = () => {
    router.push('/dashboard/upload');
  };

  const recentTests = [
    { id: '1', name: 'SSC CGL English Practice', date: '2026-03-15', questions: 20, score: '16/20', status: 'Completed' },
    { id: '2', name: 'Maths Geometry Quiz', date: '2026-03-12', questions: 15, score: '12/15', status: 'Completed' },
  ];

  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      {/* Dashboard Top Navbar */}
      <nav className="bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
        <Link href="/dashboard" className="text-xl font-bold text-gray-900 tracking-tight">
          Mock<span className="text-indigo-600">AI</span> <span className="text-xs font-normal text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full border border-gray-100 ml-1">Dashboard</span>
        </Link>
        <button 
          onClick={handleLogout}
          className="text-sm font-medium text-gray-600 hover:text-red-600 border border-gray-200 px-4 py-2 rounded-xl hover:bg-red-50/50 transition-colors"
        >
          Logout
        </button>
      </nav>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-4 py-10">
        
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, {userEmail}!</h1>
          <p className="text-sm text-gray-500 mt-1">Ready to test your knowledge today?</p>
        </div>

        {/* Primary Action Card: Create Mock */}
        <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm text-center mb-10 flex flex-col items-center justify-center group hover:border-indigo-100 transition-all">
          <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-4 font-bold text-2xl group-hover:scale-105 transition-transform">
            ＋
          </div>
          <h2 className="text-lg font-semibold text-gray-800">Create a New Mock Test</h2>
          <p className="text-sm text-gray-500 mt-1 max-w-sm">
            Upload your question photos, PDFs, screenshots, or paste raw text to instantly build a real-time practice test.
          </p>
          <button
            onClick={handleStartUpload}
            className="mt-6 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-colors shadow-sm text-sm"
          >
            Upload Questions & Start
          </button>
        </div>

        {/* Recent Activity Section */}
        <div>
          <h3 className="text-base font-semibold text-gray-800 mb-4">Your Recent Mock Tests</h3>
          <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
            <div className="divide-y divide-gray-100">
              {recentTests.map((test) => (
                <div key={test.id} className="p-5 flex justify-between items-center hover:bg-gray-50/50 transition-colors">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-800">{test.name}</h4>
                    <div className="flex gap-4 text-xs text-gray-400 mt-1">
                      <span>Date: {test.date}</span>
                      <span>•</span>
                      <span>Questions: {test.questions}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="text-sm font-bold text-green-600 bg-green-50 px-2.5 py-1 rounded-lg border border-green-100">
                        Score: {test.score}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
