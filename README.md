<div align="center">

# 💕 ForeverCard, Interactive 1-Year Anniversary Card

**A romantic, five-step interactive anniversary celebration experience, built for the browser.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-forevercard--anniversary-ec4899?style=for-the-badge)](https://forevercard-anniversary.vercel.app/)
[![Vibe Coded](https://img.shields.io/badge/Vibe%20Coded-Google%20AI%20Studio%20%2B%20Gemini-4285F4?style=for-the-badge)](https://ai.studio)

**[Features](#features)** · **[Tech Stack](#tech-stack)** · **[Getting Started](#getting-started)** · **[Project Structure](#project-structure)** · **[How It Works](#how-it-works)** · **[Personalization](#personalization)** · **[Known Gaps](#known-gaps)**

</div>

---

## Overview

**ForeverCard** turns a plain "happy anniversary" message into a short, guided celebration. The recipient opens a link and moves through five connected scenes, a playful yes-or-no question, a photo memory gallery styled as a relationship timeline, a live selfie moment, a light "how well do you know me" quiz, and a closing letter, all wrapped in warm animation, ambient romantic music, and confetti.

The project was **vibe-coded end-to-end in [Google AI Studio](https://ai.studio) using Gemini**, starting from a written Product Requirements Document that defined the screen flow, acceptance criteria, and constraints. It is part of a broader personal portfolio series demonstrating applied "vibe coding" ability, building complete, polished, front-end-heavy interactive products with AI-assisted development tools, outside of my primary technical focus areas (Data Science, NLP, and GenAI/LLM agent engineering). This project sits alongside a sibling project, **[WishBox](https://github.com/viochris/wishbox-birthday-card)**, a more general-purpose birthday card built from the same underlying concept before it branched into this dedicated anniversary version.

**Live demo, [forevercard-anniversary.vercel.app](https://forevercard-anniversary.vercel.app/)**

---

## Features

### The Five-Screen Celebration Flow
1. **Cover**, a warm animated landing screen introducing the anniversary, with a single call-to-action to begin.
2. **The Question**, a playful "Do you like me?" prompt. The "No" button actively dodges the cursor or finger on approach and cycles through a series of teasing messages ("Are you sure?", "Too slow!", "Just press Yes!"), so only "Yes" can ever actually be pressed.
3. **Memory Gallery**, a polaroid-style photo grid paired with a relationship timeline of milestones (each with its own title, date, and description), plus a live camera feature for capturing a new selfie on the spot.
4. **Love Quiz**, a short set of multiple-choice questions about the relationship, each with its own reaction and explanation, ending in a warm result message regardless of score.
5. **The Letter**, a closing message revealed gradually, with a downloadable keepsake version, a signature, and a confetti and balloon burst.

A discreet progress bar of dots at the top of the screen shows which of the five steps the recipient is currently on.

### Beyond the Core Flow
- **Live selfie capture with filters**, the Memory Gallery screen can open the device camera directly in the browser and capture a new photo on the spot, then apply one of five stylized filters (Natural, Vintage Warm, Romantic Rose, Classic B&W, Golden Sepia) before adding it to the gallery.
- **Downloadable photo collage**, a "Download Collage" button on the Memory Gallery screen combines all of the gallery's photos, captions, and the day count into a single shareable image, generated on a canvas and downloaded directly to the device.
- **Downloadable keepsake letter**, the closing letter can be exported as an image, with a choice of paper styles (Parchment, Floral, Minimal, Midnight) and handwriting-style fonts (Dancing Script, Shadows Into Light, Caveat, Playfair, Garamond, Great Vibes), rendered with `html-to-image` and a `html2canvas` fallback if the first method fails.
- **Synthesized romantic background music**, rather than a pre-recorded track or an external AI music-generation API, `utils/audio.ts` defines a hand-written Web Audio API engine that plays a looping romantic chord progression (Cmaj9, Am9, Fmaj7, Gsus4, Em7, Fadd9) through chained oscillators, alongside separate short sound effects for button clicks, transitions, and a celebratory "yes" chime.
- **Cursor sparkle trail and ambient particles**, a `CursorSparkles` component leaves a subtle trail of sparkles as the visitor moves their mouse, layered over a slow-drifting `BackgroundParticles` field, both active throughout the whole experience.
- **Hidden heart easter egg**, an `EasterEggHearts` element in the corner of the screen triggers a burst of floating hearts when interacted with, as a small hidden delight.
- **Editable captions**, individual photo captions in the gallery can be edited directly in place, not just viewed.
- **Persistent audio control**, a floating toggle lets the visitor turn the background music on or off at any point without interrupting the current screen.

---

## Tech Stack

| Category | Technology |
|---|---|
| **Framework** | [React 19](https://react.dev/) |
| **Language** | TypeScript |
| **Build Tool** | [Vite 6](https://vitejs.dev/) |
| **Styling** | [Tailwind CSS 4](https://tailwindcss.com/) (via `@tailwindcss/vite`) |
| **Animation** | [Motion](https://motion.dev/) (`motion/react`) for screen and UI transitions |
| **Confetti** | [`canvas-confetti`](https://www.npmjs.com/package/canvas-confetti) |
| **Icons** | [`lucide-react`](https://lucide.dev/) |
| **Audio Synthesis** | Native **Web Audio API** (hand-written chord-progression synth and sound effects) |
| **Camera Access** | Native **`getUserMedia`** for live in-browser selfie capture |
| **Image Export** | [`html-to-image`](https://www.npmjs.com/package/html-to-image) with an [`html2canvas`](https://html2canvas.hertzen.com/) fallback, used for both the letter export and the photo collage |
| **Server (dev/local only)** | Express, used by the Vite dev tooling, the deployed app is a static, client-side bundle |
| **Hosting** | [Vercel](https://vercel.com/) |
| **Development Environment** | [Google AI Studio](https://ai.studio) (Build mode, powered by Gemini) |

**ForeverCard requires no backend and no database.** Every feature, including the selfie capture, the letter and collage export, and the audio engine, runs entirely client-side in the browser.

---

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or later recommended)
- npm (or an equivalent package manager, the project also ships a `bun.lock`, so [Bun](https://bun.sh/) works too)

### Installation and Local Development

```bash
# 1. Clone the repository
git clone https://github.com/viochris/forevercard-anniversary.git
cd forevercard-anniversary

# 2. Install dependencies
npm install

# 3. Run the app locally
npm run dev
```

The app will be available at `http://localhost:3000` by default.

### Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Starts the Vite development server with hot module reloading |
| `npm run build` | Builds an optimized static production bundle into `dist/` |
| `npm run preview` | Serves the production build locally for a final check before deploying |
| `npm run lint` | Runs a TypeScript type-check (`tsc --noEmit`) without emitting output |
| `npm run clean` | Removes the `dist/` build output |

### Deployment
The live demo is deployed on **Vercel** as a static site, and since the app has no backend or database dependency, it can be deployed to any static hosting provider by simply running `npm run build` and serving the resulting `dist/` folder.

---

## Project Structure

```
forevercard-anniversary/
├── src/
│   ├── components/
│   │   ├── ScreenCover.tsx             # Screen 1, Cover / opening screen
│   │   ├── ScreenQuestion.tsx          # Screen 2, cursor-dodging "no" button question
│   │   ├── ScreenGallery.tsx           # Screen 3, photo gallery, timeline, selfie, collage download
│   │   ├── ScreenQuiz.tsx              # Screen 4, Love Quiz
│   │   ├── ScreenLetter.tsx            # Screen 5, closing letter, download, floating balloons
│   │   ├── AnniversarySelfieModal.tsx  # Live camera capture with photo filters
│   │   ├── DownloadLetterModal.tsx     # Letter export (paper style + font choice)
│   │   ├── BackgroundParticles.tsx     # Ambient drifting background particles
│   │   ├── CursorSparkles.tsx          # Sparkle trail following the cursor
│   │   ├── EasterEggHearts.tsx         # Hidden heart-burst easter egg
│   │   ├── FloatingBalloons.tsx        # Balloon animation on the Letter screen
│   │   ├── AudioToggle.tsx             # Background music on/off control
│   │   ├── AnniversaryCounter.tsx      # Days-together counter component (currently unused, see Known Gaps)
│   │   └── CountdownTimer.tsx          # Countdown component (currently unused, see Known Gaps)
│   ├── data/
│   │   └── cardData.ts                 # All default copy, photos, milestones, quiz questions, and letter content
│   ├── utils/
│   │   ├── audio.ts                    # Web Audio API romantic chord-progression engine and sound effects
│   │   └── collageGenerator.ts         # Canvas-based photo collage generator and downloader
│   ├── types.ts                        # Shared TypeScript types (ScreenStep, CardData, PhotoItem, QuizQuestion, etc.)
│   ├── App.tsx                         # Root component, manages the 5-screen step sequence and progress bar
│   ├── main.tsx                        # React app entry point
│   └── index.css                       # Global styles / Tailwind entry
├── index.html                          # HTML entry point
├── vite.config.ts                      # Vite build configuration
├── tsconfig.json                       # TypeScript configuration
├── package.json                        # Dependencies and scripts
└── metadata.json                       # AI Studio app metadata
```

---

## How It Works

### Screen Flow
`App.tsx` holds a single piece of state, `currentStep`, driving which of the five screens is rendered (`cover → question → gallery → quiz → letter`), transitioned with `motion`'s `AnimatePresence`. A small dot-based progress indicator at the top reflects the current position in that sequence. Gallery edits (adding a new selfie, editing a caption) are lifted into a shared `cardData` state in `App.tsx`, so changes made in the Gallery screen are available to any other screen that reads from the same data.

### The Dodging "No" Button
`ScreenQuestion.tsx` tracks cursor and touch proximity to the "No" button and repositions it to a new coordinate, with a smooth transition, whenever the pointer gets close, while also cycling through a list of teasing subtitle messages each time. The "Yes" button remains static and is the only way to proceed.

### Live Selfie Capture
`AnniversarySelfieModal.tsx` requests camera access via `navigator.mediaDevices.getUserMedia`, streams the live feed into a `<video>` element, and captures a frame onto a `<canvas>` when the user takes the photo. One of five CSS filter presets can then be applied before the photo is added to the shared gallery state.

### Collage and Letter Export
Both `utils/collageGenerator.ts` (for the photo collage) and `DownloadLetterModal.tsx` (for the letter) render their target content onto an off-screen element, convert it to an image with `html-to-image`, and fall back to `html2canvas` if that conversion fails, before triggering a direct file download in the browser. No server round trip is involved in either export.

### Ambient Music Without an External API
`utils/audio.ts` defines a small hand-written synthesizer, a six-chord romantic progression is played back on a loop through chained `OscillatorNode` and `GainNode` graphs, alongside separate short sound effects (button clicks, transition whooshes, a "yes" celebration chime), all controllable through a single mute toggle.

---

## Personalization

All of the app's content, including names, the anniversary date, gallery photos and milestones, quiz questions, and the letter text, is defined in a single file, `src/data/cardData.ts`. To personalize your own copy, edit the fields in `INITIAL_CARD_DATA` directly in that file (recipient name, sender name and signature, cover text, gallery photos and captions, milestone timeline entries, quiz questions and answers, and the letter paragraphs), then rebuild and redeploy.

Unlike the sibling [WishBox](https://github.com/viochris/wishbox-birthday-card) project, this version does not currently support personalization through URL query parameters or environment variables, editing `cardData.ts` directly and redeploying is the only supported way to customize the content for a specific recipient.

---

## Known Gaps

In the interest of accurate documentation, a couple of things exist in the codebase but are not currently wired into the live app.

- **The days-together counter was planned, built, and then left unused.** The original concept for this card (and its PRD) called for a visible "1 Year, 365 Days" style counter, similar in spirit to what's described in the sibling WishBox project's planning. A component for this, `AnniversaryCounter.tsx`, does exist in the codebase, and it is more built out than a first guess would suggest, it actually supports three different display variants through a `variant` prop, a full `'cover'` layout with a golden ribbon badge and a four-card stat breakdown (Days, Months, Weeks, Hours), and a compact `'badge'`/`'timeline'` pill meant to sit inline near the gallery's relationship timeline. `CountdownTimer.tsx` is not a second, separate feature, it simply re-exports the same `AnniversaryCounter` component under an alternate name, so in practice there is only one counter component, offered in two visual shapes.
  Despite this, it is never actually imported or rendered anywhere in `App.tsx` or in `ScreenCover.tsx`/`ScreenGallery.tsx`. The matching `daysTogether` and `anniversaryBadgeText` fields in `cardData.ts` are likewise defined but never read by anything that renders to the screen. In other words, the counter was clearly intended to appear on the Cover screen (its default variant) or as a small badge near the Gallery's timeline, but it did not end up fitting into the final layout that was actually kept for those screens, and was left disconnected rather than removed outright. The result is that the "1 Year, 365 Days" framing described in the project's original planning is not currently visible anywhere in the live app.
- **The letter and collage were originally meant to be downloadable as a PDF, with an option to print directly through the browser's printer dialog**, which is why `jspdf` is listed as a dependency. That approach produced awkward, broken-looking output, so the export was rebuilt around `html-to-image` with an `html2canvas` fallback instead, generating a clean image download rather than a PDF or a print dialog. The `jspdf` dependency was simply never removed after that switch, and `@google/genai` is a similar leftover, it is also not imported or used anywhere in the current source.

These are documented here rather than silently glossed over, and reconnecting the counter component (or removing it and its unused data fields entirely) would be a reasonable next step if the project is revisited.

---

## Design Philosophy

The visual language leans into a soft, romantic palette, warm whites, rose and blush tones, and gold accents, favoring gentle, weighted motion over snappy or mechanical animation. Ambient details (the cursor sparkle trail, drifting background particles, the hidden heart easter egg) are kept subtle throughout the experience rather than concentrated in one screen, so the sense of warmth builds gradually across all five steps rather than arriving all at once at the end.

---

## Project Background and Vibe Coding Process

This project began as an offshoot of the [WishBox](https://github.com/viochris/wishbox-birthday-card) birthday card project. An earlier draft of that concept was, by AI improvisation, generated with anniversary-style framing (a relationship timeline, "years together" language) rather than a general birthday tone. Rather than discarding that direction, it was deliberately split into its own dedicated project, a written PRD was drafted specifically for a 1-year anniversary celebration card, distinct from WishBox's simplified, relationship-agnostic birthday flow, and this PRD was then handed to Gemini in Google AI Studio's Build mode as the basis for implementation.

From there, the process followed the same pattern used across this portfolio series, prompting and building in AI Studio, testing the live result, writing follow-up prompts for specific fixes and feature additions (including the selfie capture, the collage download feature, and UI polish), deploying to Vercel, and finally reviewing the actual exported source code before writing this documentation, which is what surfaced the corrections and gaps noted above (the music engine, the absence of TTS, and the unused counter components).

---

## License

This project is available for personal reference and learning purposes. Feel free to fork it and adapt it for your own anniversary celebrations.

---

<div align="center">

**Made with 💕 and vibe coding**

[Live Demo](https://forevercard-anniversary.vercel.app/) · [Report an Issue](https://github.com/viochris/forevercard-anniversary/issues)

</div>
