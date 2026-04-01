\# Project Brief: Herbal Lung Detox Tea Brand Website



\## Overview

A premium herbal wellness e-commerce website for a 

lung detox tea brand. Clean, natural, health-focused 

design targeting urban Indians affected by pollution, 

smoking recovery, and respiratory issues.



\## Target Users

Urban Indians aged 22-50 dealing with:

\- Air pollution effects

\- Post-smoking recovery

\- Seasonal respiratory issues

\- General lung health \& immunity



\## Core User Flows

1\. User lands on homepage → reads benefits → clicks "Shop Now"

2\. User takes a "Lung Health Quiz" → gets personalized tea recommendation

3\. User views product detail page → adds to cart → checkout

4\. User reads blog (pollution tips, breathing exercises, ingredients)

5\. User logs in via OTP to track orders



\## Must-Have Pages \& Sections

\- \[ ] Hero — "Breathe Clean. Live Free." with CTA

\- \[ ] Benefits section (6 key benefits of lung detox tea)

\- \[ ] Ingredients showcase (tulsi, mulethi, vasaka, pippali etc.)

\- \[ ] How it Works (3-step process)

\- \[ ] Lung Health Quiz

\- \[ ] Product listing + Product detail page

\- \[ ] Testimonials / Social proof

\- \[ ] Blog section

\- \[ ] FAQ accordion

\- \[ ] OTP login (Supabase)



\## Tech Stack

\- Next.js 16 (App Router)

\- Tailwind CSS v4

\- shadcn/ui (Maia preset, Radix)

\- Framer Motion (scroll animations)

\- Supabase (auth + orders database)

\- Razorpay (Indian payments)



\## Design Language

\- Primary color: Deep forest green (#1a4731)

\- Accent: Warm amber (#d4860b) 

\- Background: Soft ivory (#faf7f2)

\- Font: Geist (clean, modern wellness)

\- Style: Fully rounded cards, soft shadows,

&nbsp; botanical illustrations, earthy warm tones

\- Mood: Pure, natural, trustworthy, premium Ayurvedic

## Lung Health Quiz Flow (Priority Feature)



\### Entry Point

\- Hero section has ONE button: "Take the Lung Test →"

\- Clicking opens /lung-test page (full-screen experience)



\### Quiz Page (/lung-test)

\- Full screen, clean white/ivory background

\- Animated progress bar at top (Step 1 of 7)

\- ONE question shown at a time (no scrolling)

\- Smooth slide-in animation between questions (Framer Motion)

\- Back button to go to previous question

\- Mobile fully responsive



\### Questions (7 Total)

1\. How often do you feel short of breath? 

&nbsp;  (Never / Sometimes / Often / Always)

2\. Do you smoke or live with a smoker?

&nbsp;  (Non-smoker / Quit smoking / Current smoker / Passive smoker)

3\. What is your city's air quality like?

&nbsp;  (Clean area / Moderate pollution / High pollution / Very high)

4\. Do you experience morning cough or chest tightness?

&nbsp;  (Never / Occasionally / Frequently / Every day)

5\. How is your energy level throughout the day?

&nbsp;  (Very high / Good / Low / Very fatigued)

6\. Do you have any of these? (multi-select)

&nbsp;  (Dust allergy / Asthma / Frequent cold / None)

7\. Your age group?

&nbsp;  (Under 25 / 25-35 / 35-50 / 50+)



\### Score Calculation Logic

\- Each answer has a score (0-3)

\- Total score out of 21 determines lung health level:

&nbsp; - 0-5   → Green  — "Healthy Lungs 🟢"

&nbsp; - 6-10  → Yellow — "Mild Risk 🟡"

&nbsp; - 11-15 → Orange — "Moderate Risk 🟠"

&nbsp; - 16-21 → Red    — "High Risk 🔴"



\### Report Page (/lung-test/report)

\- Animated score reveal (circular gauge filling up)

\- Lung health level badge with color

\- 3 personalized recommendations based on score

\- Ingredient highlights (what herbs help their condition)

\- CTA: "Shop Your Detox Plan →" (links to product page)

\- Secondary CTA: "Share Your Results" (Web Share API)

\- Save result to Supabase if user is logged in

