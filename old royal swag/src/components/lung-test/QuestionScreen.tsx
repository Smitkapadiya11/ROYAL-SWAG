"use client";

import type { LungTestQuestion } from "@/lib/lung-test-questions";

type QuestionScreenProps = {
  question: LungTestQuestion;
  current: number;
  total: number;
  onAnswer: (yes: boolean) => void;
};

export function QuestionScreen({
  question,
  current,
  total,
  onAnswer,
}: QuestionScreenProps) {
  return (
    <div className="question-enter flex h-full min-h-[500px] flex-col">
      <div className="mb-8">
        <div className="mb-2 flex items-center justify-between">
          <span className="font-sans text-xs text-[#45483f]">
            Question {current} of {total}
          </span>
          <span className="font-sans text-xs font-semibold text-[#9A6F1A]">
            {Math.round((current / total) * 100)}% done
          </span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#dee5d1]">
          <div
            className="h-full rounded-full bg-[#9A6F1A] transition-all duration-500"
            style={{ width: `${(current / total) * 100}%` }}
          />
        </div>
      </div>

      <div className="glass-card flex flex-1 flex-col items-center justify-center gap-6 rounded-3xl p-8 text-center">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#e9f1dc] text-5xl shadow-[0_0_30px_rgba(73,87,56,0.15)]">
          {question.emoji}
        </div>

        <div>
          <h2 className="mb-2 font-display text-[28px] font-bold leading-tight text-[#324023]">
            {question.question}
          </h2>
          <p className="font-sans text-sm text-[#45483f]">{question.subtitle}</p>
        </div>

        <div className="mt-4 flex w-full gap-4">
          <button
            type="button"
            onClick={() => onAnswer(true)}
            className="flex flex-1 flex-col items-center gap-2 rounded-2xl border-2 border-[#324023] bg-[#324023] py-5 font-sans text-lg font-bold text-white transition-all duration-200 hover:scale-105 hover:shadow-[0_8px_24px_rgba(50,64,35,0.3)] active:scale-95"
          >
            <span className="text-2xl">✓</span>
            YES
          </button>

          <button
            type="button"
            onClick={() => onAnswer(false)}
            className="flex flex-1 flex-col items-center gap-2 rounded-2xl border-2 border-[#c5c8bc] bg-white/50 py-5 font-sans text-lg font-bold text-[#45483f] transition-all duration-200 hover:scale-105 hover:border-[#9A6F1A] hover:text-[#9A6F1A] active:scale-95"
          >
            <span className="text-2xl">✕</span>
            NO
          </button>
        </div>
      </div>

      <p className="mt-4 text-center font-sans text-[11px] text-[#75786e]">
        Your answers are private and used only to personalise your result.
      </p>
    </div>
  );
}
