"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRouter } from "next/navigation";
import { algorithms, categories } from "@/data/algorithms";
import { AlgorithmCard } from "@/components/AlgorithmCard";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useTheme } from "@/components/ClientThemeProvider";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

export default function LandingPage() {
  const router = useRouter();
  const [scrollY, setScrollY] = useState(0);
  const { scrollYProgress } = useScroll();
  const { theme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle hash navigation to algorithms section
  useEffect(() => {
    if (window.location.hash === '#algorithms-section') {
      const algorithmsSection = document.getElementById('algorithms-section');
      if (algorithmsSection) {
        setTimeout(() => {
          algorithmsSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
        }, 100);
      }
    }
  }, []);

  // Transform values for smooth animations
  const titleScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.6]);
  const titleY = useTransform(scrollYProgress, [0, 0.3], [0, -100]);
  const titleX = useTransform(scrollYProgress, [0, 0.3], [0, -200]);
  const subtitleOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const algorithmsOpacity = useTransform(scrollYProgress, [0.1, 0.4], [0, 1]);
  const algorithmsY = useTransform(scrollYProgress, [0.1, 0.4], [100, 0]);

  // Animation values for the title transformation
  const heroTitleScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.3]);
  const heroTitleY = useTransform(scrollYProgress, [0, 0.15], [0, -200]);
  const heroTitleX = useTransform(scrollYProgress, [0, 0.15], [0, -300]);
  const heroTitleOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  
  const navbarTitleScale = useTransform(scrollYProgress, [0.1, 0.25], [0, 1]);
  const navbarTitleOpacity = useTransform(scrollYProgress, [0.1, 0.25], [0, 1]);
  const navbarTitleY = useTransform(scrollYProgress, [0.1, 0.25], [20, 0]);

  const handleAlgorithmClick = (algorithmId: string) => {
    router.push(`/visualizer?algorithm=${algorithmId}`);
  };

  const scrollToAlgorithms = () => {
    const algorithmsSection = document.getElementById('algorithms-section');
    if (algorithmsSection) {
      algorithmsSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300 ease-in-out">
      {/* Header */}
      <header className="fixed w-full top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ease-in-out">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center h-16">
            <motion.div 
              className="text-xl font-bold text-gray-900 dark:text-white transition-colors duration-300 ease-in-out"
              style={{
                scale: navbarTitleScale,
                opacity: navbarTitleOpacity,
                y: navbarTitleY,
                transformOrigin: "left center"
              }}
            >
              Algtrax
            </motion.div>
            <nav className="flex items-center gap-8">

              <button 
                onClick={scrollToAlgorithms}
                className="transition-colors duration-300 ease-in-out text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white no-underline"
              >
                Algorithms
              </button>

              <a href="#" className="transition-colors duration-300 ease-in-out text-gray-700 dark:text-gray-300 no-underline"
              >Q&A</a>

              <SignedOut>
                <SignInButton mode="modal">
                  <button className="transition-colors duration-300 ease-in-out text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white no-underline">
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors">
                    Sign Up
                  </button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>

              <ThemeToggle />
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="h-screen flex items-center justify-center pt-16">
        <div className="text-center">
          <div className="mb-8">
            <div className="text-3xl leading-9 font-medium text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out">
              welcome to
            </div>
            <motion.div 
              className="text-6xl font-extrabold text-gray-900 dark:text-white transition-colors duration-300 ease-in-out"
              style={{
                scale: heroTitleScale,
                y: heroTitleY,
                x: heroTitleX,
                opacity: heroTitleOpacity,
                transformOrigin: "center center"
              }}
            >
              Algtrax
            </motion.div>
          </div>

          <div className="mb-8">
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-6 transition-colors duration-300 ease-in-out">
              Learn, code, and visualise algorithms.
            </p>
          </div>
        </div>
      </section>

      {/* Algorithms Section */}
      <section id="algorithms-section" className="min-h-screen bg-gray-50 dark:bg-gray-800 py-20 pt-32 transition-colors duration-300 ease-in-out">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-300 ease-in-out">
              Explore Algorithms
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out">
              Choose an algorithm to visualize and learn
            </p>
          </div>

          {categories.map((category) => (
            <div key={category} className="mb-16">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 transition-colors duration-300 ease-in-out">
                {category}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {algorithms
                  .filter((algo) => algo.category === category)
                  .map((algorithm) => (
                    <div key={algorithm.id} className="bg-white dark:bg-gray-700 rounded-lg shadow-lg dark:shadow-gray-900/30 overflow-hidden cursor-pointer transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl"
                    onClick={() => handleAlgorithmClick(algorithm.id)}
                    >
                      <div className="aspect-square bg-gray-100 dark:bg-gray-600 flex items-center justify-center transition-colors duration-300 ease-in-out">
                        <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white text-lg font-semibold">
                          {algorithm.name.charAt(0)}
                        </div>
                      </div>
                      <div className="p-6">
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 transition-colors duration-300 ease-in-out">
                          {algorithm.name}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 transition-colors duration-300 ease-in-out">
                          {algorithm.description}
                        </p>
                        <div className="flex justify-between items-center">
                          <div className="flex gap-4">
                            <label className="flex items-center">
                              <input type="checkbox" checked={algorithm.hasCode} readOnly className="mr-2" />
                              <span className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out">Code</span>
                            </label>
                            <label className="flex items-center">
                              <input type="checkbox" checked={algorithm.hasQuiz} readOnly className="mr-2" />
                              <span className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out">Quiz</span>
                            </label>
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out">
                            {algorithm.complexity.time}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
