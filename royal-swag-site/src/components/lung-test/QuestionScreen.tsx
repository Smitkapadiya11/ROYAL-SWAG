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
    <div className="question-enter flex h-full min-h-[420px] flex-col md:min-h-[360px]">
      <div className="mb-6 md:mb-8">
        <div className="mb-2 flex items-center justify-between">
          <span className="font-sans text-xs text-[#45483f] md:text-sm">
            Question {current} of {total}
          </span>
          <span className="font-sans text-xs font-semibold text-[#9A6F1A] md:text-sm">
            {Math.round((current / total) * 100)}% done
          </span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#dee5d1] md:h-2">
          <div
            className="h-full rounded-full bg-[#9A6F1A] transition-all duration-500"
            style={{ width: `${(current / total) * 100}%` }}
          />
        </div>
      </div>

      <div className="glass-card flex flex-1 flex-col items-center justify-center gap-6 rounded-3xl p-6 text-center md:gap-8 md:p-10">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#e9f1dc] text-4xl shadow-[0_0_30px_rgba(73,87,56,0.15)] md:h-28 md:w-28 md:text-5xl">
          {question.emoji}
        </div>

        <div className="max-w-xl">
          <h2 className="mb-2 font-display text-[26px] font-bold leading-tight text-[#324023] md:text-[32px]">
            {question.question}
          </h2>
          <p className="font-sans text-sm text-[#45483f] md:text-base">
            {question.subtitle}
          </p>
        </div>

        <div className="mt-2 flex w-full max-w-lg gap-4 md:mt-4">
          <button
            type="button"
            onClick={() => onAnswer(true)}
            className="flex flex-1 flex-col items-center gap-2 rounded-2xl border-2 border-[#324023] bg-[#324023] py-4 font-sans text-base font-bold text-white transition-all duration-200 hover:scale-[1.02] hover:shadow-[0_8px_24px_rgba(50,64,35,0.3)] active:scale-95 md:py-6 md:text-lg"
          >
            <span className="text-2xl md:text-3xl">✓</span>
            YES
          </button>

          <button
            type="button"
            onClick={() => onAnswer(false)}
            className="flex flex-1 flex-col items-center gap-2 rounded-2xl border-2 border-[#c5c8bc] bg-white/50 py-4 font-sans text-base font-bold text-[#45483f] transition-all duration-200 hover:scale-[1.02] hover:border-[#9A6F1A] hover:text-[#9A6F1A] active:scale-95 md:py-6 md:text-lg"
          >
            <span className="text-2xl md:text-3xl">✕</span>
            NO
          </button>
        </div>
      </div>

      <p className="mt-4 text-center font-sans text-[11px] text-[#75786e] md:text-xs">
        Your answers are private and used only to personalise your result.
      </p>
    </div>
  );
}
