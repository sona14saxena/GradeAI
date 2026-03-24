"use client";


import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, BrainCircuit, ScanSearch, LineChart } from 'lucide-react';

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("facultyAuth")) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <main className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-6 bg-gradient-to-b from-background to-secondary/20 overflow-hidden relative">

      {/* Decorative background glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px] -z-10 animate-pulse transition-all duration-1000"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[128px] -z-10 animate-pulse delay-700 transition-all duration-1000"></div>

      <div className="max-w-5xl text-center space-y-8 z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
          <BrainCircuit size={16} />
          <span>v2.0 Evaluation Network Online</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
          The future of <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-cyan-400">Intelligent Grading.</span>
        </h1>

        <p className="text-xl md:text-2xl font-light mb-10 text-muted-foreground max-w-2xl mx-auto">
          Automate handwritten answer sheet evaluations with our state-of-the-art OCR and Contextual NLP pipeline.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center py-6">
          {isAuthenticated ? (
            <>
              <Link href="/upload" className="group px-8 py-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl shadow-[0_0_30px_rgba(37,99,235,0.3)] font-semibold transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-2">
                Initialize Evaluation <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/dashboard" className="px-8 py-4 bg-secondary text-secondary-foreground border border-border hover:border-primary/50 hover:bg-secondary/80 rounded-xl shadow-sm font-semibold transition-all duration-300 transform hover:-translate-y-1">
                Access Dashboard
              </Link>
            </>
          ) : (
            <Link href="/login" className="group px-8 py-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl shadow-[0_0_30px_rgba(37,99,235,0.3)] font-semibold transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-2">
              Faculty Login <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          )}
        </div>

        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">

          <div className="glass p-8 rounded-2xl hover:border-primary/50 transition-colors duration-300 group">
            <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
              <ScanSearch size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-foreground">1. Ingest Data</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">Securely upload scanned PDF notebooks and the master model answer key into our secure vector processing buffer.</p>
          </div>

          <div className="glass p-8 rounded-2xl hover:border-primary/50 transition-colors duration-300 group">
            <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
              <BrainCircuit size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-foreground">2. Deep Evaluation</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">Watch our specialized Transformer pipeline decode handwriting variants and structurally evaluate semantic relationships.</p>
          </div>

          <div className="glass p-8 rounded-2xl hover:border-primary/50 transition-colors duration-300 group">
            <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
              <LineChart size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-foreground">3. Actionable Analytics</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">Generate rich analytics, calculate true question difficulty matrices, and export actionable student feedback instantly.</p>
          </div>

        </div>
      </div>
    </main>
  );
}
