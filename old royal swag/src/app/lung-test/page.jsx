"use client";

import React, { useState } from "react";
import styled from "styled-components";
import { useRouter } from "next/navigation";
import { trackEvent } from "@/lib/events";
import { ANALYTICS_EVENTS, setAdvancedMatching, track } from "@/lib/analytics";
import {
  SYMPTOM_QUESTIONS,
  computeSymptomPoints,
  getLungScore,
} from "@/lib/lungScore";
import { LUNG_TEST_STORAGE_KEY } from "@/lib/lung-test-constants";
import BreathHoldTest from "@/components/lung-test/BreathHoldTest";

const PageWrapper = styled.div`
  background: #f4edd6;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px 100px;
  color: #324023;
`;

const ProgressBarContainer = styled.div`
  width: 100%;
  max-width: 600px;
  height: 8px;
  background: rgba(50, 64, 35, 0.15);
  border-radius: 4px;
  margin-bottom: 32px;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: #324023;
  width: ${(props) => props.$progress}%;
  transition: width 0.3s ease;
`;

const Card = styled.div`
  background: white;
  border-radius: 20px;
  padding: clamp(28px, 5vw, 40px);
  width: 100%;
  max-width: 600px;
  box-shadow: 0 12px 40px rgba(50, 64, 35, 0.08);
  text-align: center;
  animation: slideIn 0.4s ease;

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(16px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const Title = styled.h2`
  font-family: var(--font-playfair, Georgia, serif);
  font-size: clamp(22px, 4vw, 28px);
  font-weight: 700;
  margin-bottom: 12px;
  color: #324023;
`;

const Sub = styled.p`
  font-size: 15px;
  line-height: 1.55;
  color: rgba(50, 64, 35, 0.75);
  margin-bottom: 24px;
`;

const Input = styled.input`
  width: 100%;
  padding: 14px 16px;
  border: 2px solid rgba(50, 64, 35, 0.15);
  border-radius: 12px;
  margin-bottom: 14px;
  font-size: 16px;
  color: #2a3020;

  &:focus {
    border-color: #324023;
    outline: none;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 16px;
  background: #324023;
  color: #f4edd6;
  border: none;
  border-radius: 12px;
  font-size: 17px;
  font-weight: 700;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.92;
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const OptionButton = styled.button`
  width: 100%;
  padding: 18px;
  font-size: 17px;
  font-weight: 700;
  border-radius: 12px;
  margin-bottom: 12px;
  cursor: pointer;
  transition: all 0.2s ease;

  ${(props) =>
    props.$isYes
      ? `
    background: #324023;
    color: #f4edd6;
    border: none;
    &:hover { background: #26331c; }
  `
      : `
    background: white;
    color: #324023;
    border: 2px solid #324023;
    &:hover { background: #f4edd6; }
  `}
`;

const StepLabel = styled.span`
  display: inline-block;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #9a6f1a;
  margin-bottom: 8px;
`;

export default function LungTestPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [lead, setLead] = useState({ name: "", email: "", phone: "" });
  const [answers, setAnswers] = useState({
    city: false,
    smoke: false,
    cough: false,
    breathless: false,
    dust: false,
  });
  const [submitting, setSubmitting] = useState(false);

  const totalSteps = 1 + SYMPTOM_QUESTIONS.length + 1;
  const progressPct = step === 0 ? 0 : Math.min(100, (step / (totalSteps - 1)) * 100);

  const handleLeadSubmit = (e) => {
    e.preventDefault();
    const phoneOk = /^[6-9]\d{9}$/.test(lead.phone.replace(/\D/g, "").slice(-10));
    if (lead.name.trim() && lead.email.trim() && phoneOk) {
      setStep(1);
      void setAdvancedMatching({ email: lead.email.trim(), phone: lead.phone });
      track(ANALYTICS_EVENTS.LEAD, {
        lead_type: "lung_test",
        content_name: "Lung Test",
        page: "/lung-test",
      });
      trackEvent("lung_test_start", { page: "/lung-test" });
    }
  };

  const handleSymptomAnswer = (isYes) => {
    const qIndex = step - 1;
    const q = SYMPTOM_QUESTIONS[qIndex];
    if (!q) return;

    setAnswers((prev) => ({ ...prev, [q.key]: isYes }));

    trackEvent('lung_test_question', {
      q_number: step,
      answer: isYes ? 'yes' : 'no',
      question: q.key,
      page: '/lung-test',
    });

    if (step < SYMPTOM_QUESTIONS.length) {
      setStep(step + 1);
    } else {
      trackEvent("lung_test_questions_complete", { page: "/lung-test" });
      setStep(SYMPTOM_QUESTIONS.length + 1);
    }
  };

  const finishTest = async (breathHoldSeconds) => {
    if (submitting) return;
    setSubmitting(true);

    const points = computeSymptomPoints(answers);
    const lungScore = getLungScore(points);

    const payload = {
      name: lead.name.trim(),
      email: lead.email.trim(),
      phone: lead.phone.replace(/\D/g, "").slice(-10),
      ...answers,
      breathHoldSeconds,
      score: points,
      level: lungScore.level,
      color: lungScore.color,
      recommendation: lungScore.recommendation,
      timestamp: Date.now(),
    };

    try {
      sessionStorage.setItem(LUNG_TEST_STORAGE_KEY, JSON.stringify(payload));
      localStorage.setItem(LUNG_TEST_STORAGE_KEY, JSON.stringify(payload));
    } catch {
      /* ignore */
    }

    trackEvent("lung_test_complete", {
      score: points,
      level: lungScore.level,
      breath_seconds: breathHoldSeconds,
      page: '/lung-test',
    });
    try {
      await fetch("/api/lung-test/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: payload.name,
          email: payload.email,
          phone: payload.phone,
          city: payload.city,
          smoke: payload.smoke,
          cough: payload.cough,
          breathless: payload.breathless,
          dust: payload.dust,
          breathHoldSeconds,
          score: points,
          level: lungScore.level,
        }),
      });
    } catch (err) {
      console.error("lung test submit failed", err);
    }

    router.push("/lung-test/result");
  };

  const currentQuestion = step >= 1 && step <= SYMPTOM_QUESTIONS.length ? SYMPTOM_QUESTIONS[step - 1] : null;

  return (
    <PageWrapper>
      {step > 0 && (
        <ProgressBarContainer>
          <ProgressFill $progress={progressPct} />
        </ProgressBarContainer>
      )}

      {step === 0 && (
        <Card>
          <Title>Free Lung Health Check</Title>
          <Sub>60 seconds · Symptom quiz + breath-hold test · Personalised herb report</Sub>
          <form onSubmit={handleLeadSubmit}>
            <Input
              type="text"
              placeholder="Full name"
              value={lead.name}
              onChange={(e) => setLead({ ...lead, name: e.target.value })}
              required
            />
            <Input
              type="email"
              placeholder="Email address"
              value={lead.email}
              onChange={(e) => setLead({ ...lead, email: e.target.value })}
              required
            />
            <Input
              type="tel"
              placeholder="10-digit mobile"
              value={lead.phone}
              onChange={(e) => setLead({ ...lead, phone: e.target.value })}
              maxLength={10}
              required
            />
            <Button type="submit" data-track-button="lung-test-start" data-track-label="Start Free Test">
              Start Free Test →
            </Button>
          </form>
        </Card>
      )}

      {currentQuestion && (
        <Card key={currentQuestion.key}>
          <StepLabel>
            Question {step} of {SYMPTOM_QUESTIONS.length}
          </StepLabel>
          <Title>{currentQuestion.text}</Title>
          <OptionButton $isYes type="button" onClick={() => handleSymptomAnswer(true)}>
            Yes
          </OptionButton>
          <OptionButton $isYes={false} type="button" onClick={() => handleSymptomAnswer(false)}>
            No
          </OptionButton>
        </Card>
      )}

      {step === SYMPTOM_QUESTIONS.length + 1 && (
        <Card>
          <StepLabel>Final step</StepLabel>
          <Title>Breath-hold lung check</Title>
          <BreathHoldTest onComplete={finishTest} disabled={submitting} />
        </Card>
      )}
    </PageWrapper>
  );
}
