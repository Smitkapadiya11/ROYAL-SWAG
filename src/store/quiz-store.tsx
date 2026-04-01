"use client";

import { createContext, useContext, useReducer, useEffect, type ReactNode } from "react";

// ━━━ State ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export type QuizState = {
  currentStep: number;          // -1 = Lead Capture, 0-indexed for questions
  answers: (number | number[])[]; // one entry per question
  score: number | null;         // null until quiz completed
  leadId: string | null;        // Supabase leads row id
};

const initialState: QuizState = {
  currentStep: -1,
  answers: [],
  score: null,
  leadId: null,
};

// ━━━ Actions ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
type Action =
  | { type: "START_QUIZ"; leadId: string }
  | { type: "ANSWER"; payload: number | number[] }
  | { type: "BACK" }
  | { type: "COMPLETE"; score: number }
  | { type: "RESET" };

function quizReducer(state: QuizState, action: Action): QuizState {
  switch (action.type) {
    case "START_QUIZ": {
      return { ...state, currentStep: 0, leadId: action.leadId };
    }
    case "ANSWER": {
      const newAnswers = [...state.answers];
      newAnswers[state.currentStep] = action.payload;
      return {
        ...state,
        answers: newAnswers,
        currentStep: state.currentStep + 1,
      };
    }
    case "BACK": {
      if (state.currentStep === 0) return state;
      return { ...state, currentStep: state.currentStep - 1 };
    }
    case "COMPLETE": {
      return { ...state, score: action.score };
    }
    case "RESET": {
      return initialState;
    }
    default:
      return state;
  }
}

// ━━━ Context ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
type QuizContextValue = {
  state: QuizState;
  startQuiz: (leadId: string) => void;
  answer: (value: number | number[]) => void;
  goBack: () => void;
  complete: (score: number) => void;
  reset: () => void;
};

const QuizContext = createContext<QuizContextValue | null>(null);

const SESSION_KEY = "royal_swag_quiz_state";

export function QuizProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(quizReducer, initialState, () => {
    // Rehydrate from sessionStorage (for report page)
    if (typeof window !== "undefined") {
      try {
        const saved = sessionStorage.getItem(SESSION_KEY);
        if (saved) return JSON.parse(saved) as QuizState;
      } catch {
        /* ignore */
      }
    }
    return initialState;
  });

  // Persist to sessionStorage on every change
  useEffect(() => {
    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }, [state]);

  const startQuiz = (leadId: string) => dispatch({ type: "START_QUIZ", leadId });
  const answer = (value: number | number[]) =>
    dispatch({ type: "ANSWER", payload: value });
  const goBack = () => dispatch({ type: "BACK" });
  const complete = (score: number) => dispatch({ type: "COMPLETE", score });
  const reset = () => dispatch({ type: "RESET" });

  return (
    <QuizContext.Provider value={{ state, startQuiz, answer, goBack, complete, reset }}>
      {children}
    </QuizContext.Provider>
  );
}

export function useQuiz() {
  const ctx = useContext(QuizContext);
  if (!ctx) throw new Error("useQuiz must be used inside <QuizProvider>");
  return ctx;
}
