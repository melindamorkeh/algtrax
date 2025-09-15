"use client";

import { CodeEditor } from "../../components/codeEditor/codeEditor";
import { Visualiser } from "../../components/visualiser/visualiser";
import { Controls } from "../../components/controls/controls";
import { GifExporter } from "../../components/gifExporter/gifExporter";
import { useStore } from "../../store";
import { useSearchParams, useRouter } from "next/navigation";
import { getAlgorithmById } from "@/data/algorithms";
import { motion } from "framer-motion";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useEffect, useRef, useState, Suspense } from "react";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

/**
 * Visualizer Page Content Component
 * 
 * This is the main algorithm visualization page where users can:
 * - View algorithm information and complexity
 * - Write and test code in the code editor
 * - Watch real-time algorithm visualizations
 * - Export visualizations as GIFs
 * - Switch between code editor and full-screen visualization modes
 */
function VisualizerContent() {
  const { code, states, runAlgorithm, setCode, generateStates } = useStore();
  const searchParams = useSearchParams();
  const router = useRouter();
  const algorithmId = searchParams.get("algorithm");
  const algorithm = algorithmId ? getAlgorithmById(algorithmId) : null;
  const prevAlgorithmId = useRef<string | null>(null);
  const [activeTab, setActiveTab] = useState<'code' | 'visualization'>('code');

  // Reset code and generate visualization states when algorithm changes
  // This ensures users get a fresh start when switching between algorithms
  useEffect(() => {
    if (algorithmId && algorithmId !== prevAlgorithmId.current) {
      // Clear the code when switching to a new algorithm
      setCode("");
      // Generate visualization states for the new algorithm
      generateStates(algorithmId);
      prevAlgorithmId.current = algorithmId;
    }
  }, [algorithmId, setCode, generateStates]);

  // Navigate back to the algorithms section on the landing page
  const navigateToAlgorithms = () => {
    router.push('/#algorithms-section');
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
      {/* Header Navigation */}
      {/* Contains the logo, current algorithm name, and navigation controls */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Algorithm Breadcrumb */}
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-xl font-bold text-gray-900 dark:text-white">
                Algtrax
              </Link>
              {algorithm && (
                <div className="flex items-center space-x-2">
                  <span className="text-gray-400 dark:text-gray-500">/</span>
                  <span className="text-gray-700 dark:text-gray-300">{algorithm.name}</span>
                </div>
              )}
            </div>
            
            {/* Navigation Menu */}
            <nav className="flex items-center space-x-2 sm:space-x-4 lg:space-x-8">
              {/* User Authentication */}
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="btn-base btn-secondary text-sm sm:text-base">
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="btn-base btn-primary text-sm sm:text-base">
                    Sign Up
                  </button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
              
              {/* Navigation Links */}
              <button 
                onClick={navigateToAlgorithms}
                className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors text-sm sm:text-base hidden sm:block"
              >
                Algorithms
              </button>
              <a href="#" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors text-sm sm:text-base hidden lg:block">Q&A</a>
              
              {/* Theme Toggle */}
              <ThemeToggle />
            </nav>
          </div>
        </div>
      </header>

      {/* Algorithm Information Panel */}
      {/* Displays algorithm details, complexity, and mode toggle buttons */}
      {algorithm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 transition-colors"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              {/* Algorithm Details */}
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {algorithm.name}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-2xl text-sm sm:text-base">
                  {algorithm.description}
                </p>
                {/* Complexity Information */}
                <div className="flex flex-col sm:flex-row sm:space-x-6 space-y-2 sm:space-y-0 text-sm text-gray-500 dark:text-gray-400">
                  <div>
                    <span className="font-medium">Time Complexity:</span> {algorithm.complexity.time}
                  </div>
                  <div>
                    <span className="font-medium">Space Complexity:</span> {algorithm.complexity.space}
                  </div>
                </div>
              </div>
              
              {/* Mode Toggle Buttons */}
              {/* Allow users to switch between code editor mode and full-screen visualization */}
              <div className="flex space-x-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <button 
                  onClick={() => setActiveTab('code')}
                  className={`btn-base px-3 sm:px-4 py-2 relative text-sm sm:text-base ${
                    activeTab === 'code' 
                      ? 'btn-primary shadow-sm' 
                      : 'btn-secondary border-none hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                  <span className="hidden sm:inline">Code Editor</span>
                  <span className="sm:hidden">Code</span>
                </button>
                <button 
                  onClick={() => setActiveTab('visualization')}
                  className={`btn-base px-3 sm:px-4 py-2 relative text-sm sm:text-base ${
                    activeTab === 'visualization' 
                      ? 'btn-primary shadow-sm' 
                      : 'btn-secondary border-none hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <span className="hidden sm:inline">Visualization</span>
                  <span className="sm:hidden">Viz</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Main Content Area */}
      {/* Contains either split view (code + visualization) or full-screen visualization */}
      <div className="flex flex-col lg:flex-row h-[calc(100vh-200px)]">
        {activeTab === 'code' ? (
          // Split View Mode - Code Editor and Visualization Side by Side
          <>
            {/* Left Panel - Code Editor */}
            <div className="w-full lg:w-1/2 p-3 lg:p-6">
              {/* Code Editor Container */}
              <div className="editor-container p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm h-full transition-colors">
                <CodeEditor code={code} onChange={(c) => setCode(c)} algorithmId={algorithmId || undefined} />
              </div>
              
              {/* Control Panel - Run Button and GIF Export */}
              <div className="controls-container mt-4 flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Controls onRun={() => runAlgorithm(code)} />
                </div>
                <div className="flex-shrink-0">
                  <GifExporter frames={states} />
                </div>
              </div>
            </div>
            
            {/* Right Panel - Visualization */}
            <div className="w-full lg:w-1/2 p-3 lg:p-6">
              <div className="visualiser-container bg-white dark:bg-gray-800 rounded-lg shadow-sm h-full p-4 transition-colors">
                <Visualiser states={states} algorithmId={algorithmId || undefined} />
              </div>
            </div>
          </>
        ) : (
          // Full-Screen Visualization Mode
          <div className="w-full p-3 lg:p-6">
            <div className="visualiser-container bg-white dark:bg-gray-800 rounded-lg shadow-sm h-full p-4 transition-colors">
              <Visualiser states={states} algorithmId={algorithmId || undefined} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Visualizer Page Wrapper
 * 
 * Wraps the main content in a Suspense boundary for better loading experience
 * when the page is first loaded or when switching between algorithms
 */
export default function VisualizerPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VisualizerContent />
    </Suspense>
  );
} 