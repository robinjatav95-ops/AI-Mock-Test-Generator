"use client";

import React from 'react';
import Link from 'next/link';
import Hero from '@/components/Hero';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#FAF9F6] text-gray-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Header / Navbar */}
      <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex justify-between items-center z-50">
        <Link href="/" className="text-2xl font-bold text-gray-900 tracking-tight">
          Mock<span className="text-indigo-600">AI</span>
        </Link>
        
        <div className="flex items-center gap-3">
          <Link 
            href="/dashboard/upload" 
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-3.5 py-2 rounded-xl transition-all"
          >
            Upload Questions
          </Link>
          <Link 
            href="/login" 
            className="text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors px-3 py-2"
          >
            Log in
          </Link>
          <Link 
            href="/signup" 
            className="text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl transition-all shadow-sm shadow-indigo-500/10 hover:shadow-indigo-500/20"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero Section with Live Photo Upload Dropzone */}
      <main>
        <Hero />
      </main>
    </div>
  );
}
