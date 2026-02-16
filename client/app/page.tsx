"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  ChevronLeft,
  ChevronRight,
  RotateCw,
  FileText,
  X,
  Sparkles,
  HelpCircle,
} from "lucide-react";
import Papa from "papaparse";

// --- Types ---
type Flashcard = {
  id: string;
  front: string;
  back: string;
};

// --- Components ---

// 1. File Upload Component
const FileUpload = ({
  onDataLoaded,
}: {
  onDataLoaded: (data: Flashcard[]) => void;
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    Papa.parse(file, {
      header: false,
      skipEmptyLines: true,
      complete: (results) => {
        const parsedData: Flashcard[] = results.data.map(
          (row: unknown, index: number) => {
            const values = Object.values(row as Record<string, unknown>);
            return {
              id: `card-${index}`,
              front: String(values[0] || "Question Missing"),
              back: String(values[1] || "Answer Missing"),
            };
          }
        );

        // Remove header row if it looks like "Question, Answer" or "Term, Definition"
        if (parsedData.length > 0) {
          const firstFront = parsedData[0].front.toLowerCase();
          if (
            firstFront.includes("question") ||
            firstFront.includes("term")
          ) {
            parsedData.shift();
          }
        }

        if (parsedData.length > 0) onDataLoaded(parsedData);
      },
    });
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => setIsDragging(false);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-slate-950 text-white">
      <div className="text-center space-y-4 mb-12">
        <div className="inline-flex items-center justify-center p-3 bg-indigo-500/10 rounded-2xl mb-4 ring-1 ring-indigo-500/30">
          <Sparkles className="w-6 h-6 text-indigo-400" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-200 via-white to-indigo-200 bg-clip-text text-transparent">
          Flashcard Reform
        </h1>
        <p className="text-slate-400 max-w-md mx-auto">
          Upload your CSV study data and transform it into an interactive
          mastery tool.
        </p>
      </div>

      <div
        className={`
          relative group cursor-pointer w-full max-w-xl h-64 rounded-3xl border-2 border-dashed transition-all duration-300 ease-out
          flex flex-col items-center justify-center gap-4
          ${
            isDragging
              ? "border-indigo-400 bg-indigo-900/20 scale-[1.02]"
              : "border-slate-700 bg-slate-900/50 hover:border-indigo-500/50 hover:bg-slate-800/80"
          }
        `}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          accept=".csv"
          ref={fileInputRef}
          className="hidden"
          onChange={(e) => e.target.files && handleFile(e.target.files[0])}
        />

        <div className="p-4 rounded-full bg-slate-800 group-hover:bg-indigo-600 transition-colors duration-300">
          <Upload className="w-8 h-8 text-indigo-300 group-hover:text-white" />
        </div>
        <div className="text-center">
          <p className="text-lg font-medium text-slate-200">
            Click to upload or drag & drop
          </p>
          <p className="text-sm text-slate-500 mt-1">
            Accepts .CSV files (Question, Answer)
          </p>
        </div>
      </div>

      {/* Sample Data Preview */}
      <div className="mt-12 w-full max-w-xl">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
          <FileText className="w-4 h-4" />
          Expected CSV Format
        </div>
        <div className="bg-slate-900/80 rounded-xl p-4 border border-slate-800 font-mono text-sm text-slate-400 overflow-hidden">
          <div className="flex border-b border-slate-800 pb-2 mb-2 text-indigo-400">
            <span className="w-1/2">Term / Question</span>
            <span className="w-1/2">Definition / Answer</span>
          </div>
          <div className="flex opacity-50">
            <span className="w-1/2">What is FDI?</span>
            <span className="w-1/2">Foreign Direct Investment</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// 2. Main Flashcard Component
const FlashcardGame = ({
  deck,
  onReset,
}: {
  deck: Flashcard[];
  onReset: () => void;
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [direction, setDirection] = useState(0);

  const currentCard = deck[currentIndex];

  const handleNext = useCallback(() => {
    if (currentIndex < deck.length - 1) {
      setIsFlipped(false);
      setDirection(1);
      setCurrentIndex((prev) => prev + 1);
    }
  }, [currentIndex, deck.length]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setDirection(-1);
      setCurrentIndex((prev) => prev - 1);
    }
  }, [currentIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNext, handlePrev]);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-slate-950 overflow-hidden text-slate-100">
      {/* Background Ambience */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-10">
        <div className="flex flex-col">
          <h2 className="text-xl font-semibold text-white">
            Flashcards
          </h2>
        </div>
        <button
          onClick={onReset}
          className="p-2 hover:bg-white/10 rounded-full transition-colors"
          title="Upload new file"
        >
          <X className="w-5 h-5 text-slate-400" />
        </button>
      </div>

      {/* Main Card Area */}
      <div className="relative w-full max-w-md aspect-[3/4] md:aspect-[4/5] max-h-[600px] px-6">
        {/* Navigation Arrows */}
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 md:-translate-x-12 z-20 p-4 rounded-full bg-slate-900/50 backdrop-blur-md border border-slate-700 transition-all ${
            currentIndex === 0
              ? "opacity-0 pointer-events-none"
              : "hover:bg-indigo-600 hover:border-indigo-500 hover:scale-110"
          }`}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={handleNext}
          disabled={currentIndex === deck.length - 1}
          className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 md:translate-x-12 z-20 p-4 rounded-full bg-slate-900/50 backdrop-blur-md border border-slate-700 transition-all ${
            currentIndex === deck.length - 1
              ? "opacity-0 pointer-events-none"
              : "hover:bg-indigo-600 hover:border-indigo-500 hover:scale-110"
          }`}
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* The Card */}
        <div className="w-full h-full perspective-1000 relative">
          <AnimatePresence mode="wait" initial={false} custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              initial={{ opacity: 0, x: direction * 50, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: direction * -50, scale: 0.95 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="w-full h-full"
            >
              <div
                className="relative w-full h-full cursor-pointer transition-transform duration-500 preserve-3d"
                style={{
                  transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                }}
                onClick={() => setIsFlipped(!isFlipped)}
              >
                {/* FRONT */}
                <div
                  className="absolute inset-0 backface-hidden rounded-3xl p-8 md:p-12 flex flex-col justify-center items-center text-center shadow-2xl bg-slate-900 border border-slate-800/60"
                >
                  {/* Gradient Glow Effect on Card */}
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-3xl" />

                  <div className="relative z-10 flex-grow flex items-center justify-center">
                    <h3 className="text-2xl md:text-3xl font-medium leading-relaxed text-slate-100">
                      {currentCard.front}
                    </h3>
                  </div>

                  <div className="relative z-10 mt-auto pt-8">
                    <span className="text-sm font-medium text-slate-500 flex items-center gap-2">
                      <HelpCircle className="w-4 h-4" /> Tap to see answer
                    </span>
                  </div>
                </div>

                {/* BACK */}
                <div
                  className="absolute inset-0 backface-hidden rounded-3xl p-8 md:p-12 flex flex-col justify-center items-center text-center shadow-2xl bg-slate-800 border border-slate-700"
                  style={{ transform: "rotateY(180deg)" }}
                >
                  <div className="absolute inset-0 bg-gradient-to-tl from-emerald-500/10 to-transparent rounded-3xl" />

                  <div className="relative z-10 flex-grow flex items-center justify-center overflow-y-auto custom-scrollbar">
                    <p className="text-xl md:text-2xl font-medium leading-relaxed text-emerald-100">
                      {currentCard.back}
                    </p>
                  </div>

                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Progress Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-8 flex flex-col items-center gap-4 z-10 bg-gradient-to-t from-slate-950 to-transparent">
        <div className="w-full max-w-md flex items-center gap-4 text-xs font-medium text-slate-500">
          <RotateCw
            className="w-4 h-4 cursor-pointer hover:text-white transition-colors"
            onClick={() => {
              setCurrentIndex(0);
              setIsFlipped(false);
            }}
          />

          {/* Progress Bar */}
          <div className="flex-grow h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-indigo-500"
              initial={{ width: 0 }}
              animate={{
                width: `${((currentIndex + 1) / deck.length) * 100}%`,
              }}
              transition={{ duration: 0.3 }}
            />
          </div>

          <span>
            {currentIndex + 1} / {deck.length} cards
          </span>
        </div>
      </div>
    </div>
  );
};

// 3. Root Page
export default function Home() {
  const [data, setData] = useState<Flashcard[] | null>(null);

  if (!data) {
    return <FileUpload onDataLoaded={setData} />;
  }

  return <FlashcardGame deck={data} onReset={() => setData(null)} />;
}
