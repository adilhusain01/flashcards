"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  ChevronLeft,
  ChevronRight,
  RotateCw,
  X,
} from "lucide-react";
import Papa from "papaparse";

// --- Types ---
type Flashcard = {
  id: string;
  front: string;
  back: string;
};

// --- Ambient Background ---
const AmbientBackground = () => (
  <>
    <div className="ambient-orb ambient-orb-1" />
    <div className="ambient-orb ambient-orb-2" />
    <div className="ambient-orb ambient-orb-3" />
  </>
);

// --- File Upload ---
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
    if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
  };

  return (
    <div className="grain-overlay relative flex flex-col items-center justify-center min-h-screen p-6 overflow-hidden">
      <AmbientBackground />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 flex flex-col items-center"
      >
        {/* Title */}
        <div className="text-center mb-16">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="font-[family-name:var(--font-serif)] text-5xl md:text-7xl text-[#e8e0d4] mb-4 tracking-tight"
          >
            Flashcards
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.7 }}
            className="text-[#7a7267] text-base max-w-sm mx-auto leading-relaxed"
          >
            Drop your CSV to begin studying
          </motion.p>
        </div>

        {/* Upload Zone */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className={`upload-zone ${isDragging ? "dragging" : ""} relative group cursor-pointer w-full max-w-lg h-56 rounded-2xl flex flex-col items-center justify-center gap-5`}
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

          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="p-3.5 rounded-xl bg-[rgba(217,164,76,0.06)] border border-[rgba(217,164,76,0.1)] group-hover:border-[rgba(217,164,76,0.25)] transition-colors duration-500">
              <Upload className="w-6 h-6 text-[#d9a44c] opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          </motion.div>

          <div className="text-center">
            <p className="text-[#c4b8a8] text-sm font-medium">
              Click to upload or drag & drop
            </p>
            <p className="text-[#5a5248] text-xs mt-1.5 tracking-wide">
              .CSV &mdash; two columns, question & answer
            </p>
          </div>
        </motion.div>

        {/* Format hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-10 w-full max-w-lg"
        >
          <div className="rounded-xl overflow-hidden border border-[rgba(255,255,255,0.03)] bg-[rgba(14,13,11,0.5)]">
            <div className="px-4 py-2.5 border-b border-[rgba(255,255,255,0.03)] flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-2 h-2 rounded-full bg-[rgba(217,164,76,0.2)]" />
                <div className="w-2 h-2 rounded-full bg-[rgba(255,255,255,0.05)]" />
                <div className="w-2 h-2 rounded-full bg-[rgba(255,255,255,0.05)]" />
              </div>
              <span className="text-[10px] text-[#4a4440] uppercase tracking-[0.15em] ml-2">
                expected format
              </span>
            </div>
            <div className="px-4 py-3 font-mono text-xs space-y-1.5">
              <div className="flex text-[#d9a44c]/40">
                <span className="w-1/2">Question</span>
                <span className="w-1/2">Answer</span>
              </div>
              <div className="flex text-[#6a6158]">
                <span className="w-1/2">What is FDI?</span>
                <span className="w-1/2">Foreign Direct Investment</span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

// --- Flashcard Game ---
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
    <div className="grain-overlay relative flex flex-col items-center justify-center min-h-screen overflow-hidden">
      <AmbientBackground />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-10"
      >
        <h2 className="font-[family-name:var(--font-serif)] text-xl text-[#c4b8a8]">
          Flashcards
        </h2>
        <button
          onClick={onReset}
          className="p-2.5 rounded-xl hover:bg-[rgba(255,255,255,0.04)] transition-all duration-300 group"
          title="Upload new file"
        >
          <X className="w-4 h-4 text-[#5a5248] group-hover:text-[#c4b8a8] transition-colors" />
        </button>
      </motion.div>

      {/* Card Area */}
      <div className="relative w-full max-w-md aspect-[3/4] md:aspect-[4/5] max-h-[550px] px-6 z-10">
        {/* Nav: Previous */}
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className={`nav-btn absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 md:-translate-x-14 z-20 p-3.5 rounded-xl ${
            currentIndex === 0 ? "opacity-0 pointer-events-none" : ""
          }`}
        >
          <ChevronLeft className="w-5 h-5 text-[#7a7267]" />
        </button>

        {/* Nav: Next */}
        <button
          onClick={handleNext}
          disabled={currentIndex === deck.length - 1}
          className={`nav-btn absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 md:translate-x-14 z-20 p-3.5 rounded-xl ${
            currentIndex === deck.length - 1
              ? "opacity-0 pointer-events-none"
              : ""
          }`}
        >
          <ChevronRight className="w-5 h-5 text-[#7a7267]" />
        </button>

        {/* Card */}
        <div className="w-full h-full perspective-1200 relative">
          <AnimatePresence mode="wait" initial={false} custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              initial={{ opacity: 0, x: direction * 40, scale: 0.96, rotateY: direction * 5 }}
              animate={{ opacity: 1, x: 0, scale: 1, rotateY: 0 }}
              exit={{ opacity: 0, x: direction * -40, scale: 0.96, rotateY: direction * -5 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="w-full h-full"
            >
              <div
                className="relative w-full h-full cursor-pointer preserve-3d"
                style={{
                  transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
                  transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                }}
                onClick={() => setIsFlipped(!isFlipped)}
              >
                {/* FRONT */}
                <div className="card-front absolute inset-0 backface-hidden rounded-2xl p-8 md:p-12 flex flex-col justify-center items-center text-center">
                  <div className="flex-grow flex items-center justify-center">
                    <h3 className="font-[family-name:var(--font-serif)] text-2xl md:text-3xl leading-snug text-[#e8e0d4]">
                      {currentCard.front}
                    </h3>
                  </div>

                  <div className="mt-auto pt-6">
                    <span className="text-xs text-[#4a4440] tracking-widest uppercase">
                      tap to reveal
                    </span>
                  </div>
                </div>

                {/* BACK */}
                <div
                  className="card-back absolute inset-0 backface-hidden rounded-2xl p-8 md:p-12 flex flex-col justify-center items-center text-center"
                  style={{ transform: "rotateY(180deg)" }}
                >
                  <div className="flex-grow flex items-center justify-center overflow-y-auto custom-scrollbar">
                    <p className="font-[family-name:var(--font-serif)] text-xl md:text-2xl leading-relaxed text-[#b8d4c0]">
                      {currentCard.back}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="absolute bottom-0 left-0 right-0 p-8 flex flex-col items-center gap-4 z-10"
      >
        <div className="w-full max-w-sm flex items-center gap-4">
          <button
            onClick={() => {
              setCurrentIndex(0);
              setIsFlipped(false);
            }}
            className="p-2 rounded-lg hover:bg-[rgba(255,255,255,0.04)] transition-colors group"
          >
            <RotateCw className="w-3.5 h-3.5 text-[#4a4440] group-hover:text-[#d9a44c] transition-colors" />
          </button>

          {/* Progress */}
          <div className="progress-track flex-grow h-1 rounded-full overflow-hidden">
            <motion.div
              className="progress-fill h-full rounded-full"
              initial={{ width: 0 }}
              animate={{
                width: `${((currentIndex + 1) / deck.length) * 100}%`,
              }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>

          <span className="text-[11px] text-[#4a4440] tabular-nums tracking-wide font-medium">
            {currentIndex + 1} / {deck.length}
          </span>
        </div>
      </motion.div>
    </div>
  );
};

// --- Root ---
export default function Home() {
  const [data, setData] = useState<Flashcard[] | null>(null);

  if (!data) {
    return <FileUpload onDataLoaded={setData} />;
  }

  return <FlashcardGame deck={data} onReset={() => setData(null)} />;
}
