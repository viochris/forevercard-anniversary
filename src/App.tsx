import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ScreenStep, CardData, PhotoItem } from './types';
import { INITIAL_CARD_DATA } from './data/cardData';
import { BackgroundParticles } from './components/BackgroundParticles';
import { CursorSparkles } from './components/CursorSparkles';
import { AudioToggle } from './components/AudioToggle';
import { EasterEggHearts } from './components/EasterEggHearts';
import { ScreenCover } from './components/ScreenCover';
import { ScreenQuestion } from './components/ScreenQuestion';
import { ScreenGallery } from './components/ScreenGallery';
import { ScreenQuiz } from './components/ScreenQuiz';
import { ScreenLetter } from './components/ScreenLetter';
import { romanticAudio } from './utils/audio';

export default function App() {
  const [currentStep, setCurrentStep] = useState<ScreenStep>('cover');
  const [cardData, setCardData] = useState<CardData>(INITIAL_CARD_DATA);

  const stepsList: { key: ScreenStep; label: string }[] = [
    { key: 'cover', label: 'Cover' },
    { key: 'question', label: 'Question' },
    { key: 'gallery', label: 'Moments' },
    { key: 'quiz', label: 'Love Quiz' },
    { key: 'letter', label: 'The Letter' },
  ];

  const currentStepIndex = stepsList.findIndex((s) => s.key === currentStep);

  const handleOpenCover = () => {
    // Start music on first interaction if user hasn't already started
    romanticAudio.playButtonClick();
    romanticAudio.startMusic();
    romanticAudio.playTransitionWhoosh();
    setCurrentStep('question');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAnswerYes = () => {
    romanticAudio.playYesCelebration();
    romanticAudio.playTransitionWhoosh();
    setCurrentStep('gallery');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleContinueToQuiz = () => {
    romanticAudio.playButtonClick();
    romanticAudio.playTransitionWhoosh();
    setCurrentStep('quiz');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddPhoto = (newPhoto: PhotoItem) => {
    setCardData((prev) => ({
      ...prev,
      photos: [...prev.photos, newPhoto],
    }));
  };

  const handleFinishQuiz = () => {
    romanticAudio.playButtonClick();
    romanticAudio.playTransitionWhoosh();
    setCurrentStep('letter');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReplay = () => {
    romanticAudio.playButtonClick();
    romanticAudio.playTransitionWhoosh();
    setCurrentStep('cover');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen bg-[#fffafa] selection:bg-rose-200 selection:text-rose-900 overflow-x-hidden flex flex-col justify-between">
      {/* Ambient background particles & sparkles */}
      <BackgroundParticles />
      <CursorSparkles />

      {/* Top Left Easter Egg Heart */}
      <EasterEggHearts />

      {/* Top Right Music Toggle */}
      <AudioToggle />

      {/* Top Step Progress Bar (Discreet & Romantic) */}
      <header className="relative z-30 pt-4 pb-2 px-4 flex justify-center items-center">
        <div className="flex items-center gap-2 bg-white/70 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-rose-100 shadow-xs">
          {stepsList.map((step, idx) => {
            const isPassed = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;
            return (
              <div key={step.key} className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    isCurrent
                      ? 'w-6 bg-rose-500 shadow-xs'
                      : isPassed
                      ? 'bg-rose-300'
                      : 'bg-stone-200'
                  }`}
                  title={step.label}
                />
              </div>
            );
          })}
        </div>
      </header>

      {/* Main Content Stage with Smooth Page Transitions */}
      <main className="relative z-10 flex-1 flex flex-col justify-center max-w-7xl w-full mx-auto">
        <AnimatePresence mode="wait">
          {currentStep === 'cover' && (
            <motion.div
              key="cover"
              initial={{ opacity: 0, y: 15, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.98 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
            >
              <ScreenCover cardData={cardData} onOpen={handleOpenCover} />
            </motion.div>
          )}

          {currentStep === 'question' && (
            <motion.div
              key="question"
              initial={{ opacity: 0, y: 15, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.98 }}
              transition={{ duration: 0.45, ease: 'easeInOut' }}
            >
              <ScreenQuestion
                recipientName={cardData.recipientName}
                questionTitle={cardData.questionTitle}
                questionSubtitleInitial={cardData.questionSubtitleInitial}
                questionSubtitleDodge={cardData.questionSubtitleDodge}
                questionYesText={cardData.questionYesText}
                questionNoTexts={cardData.questionNoTexts}
                onAnswerYes={handleAnswerYes}
              />
            </motion.div>
          )}

          {currentStep === 'gallery' && (
            <motion.div
              key="gallery"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
            >
              <ScreenGallery
                galleryTitle={cardData.galleryTitle}
                gallerySubtitle={cardData.gallerySubtitle}
                galleryContinueButtonText={cardData.galleryContinueButtonText}
                daysTogether={cardData.daysTogether}
                photos={cardData.photos}
                milestones={cardData.milestones}
                onContinue={handleContinueToQuiz}
                onAddPhoto={handleAddPhoto}
              />
            </motion.div>
          )}

          {currentStep === 'quiz' && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, y: 15, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.98 }}
              transition={{ duration: 0.45, ease: 'easeInOut' }}
            >
              <ScreenQuiz
                quizTitle={cardData.quizTitle}
                questions={cardData.quizQuestions}
                recipientName={cardData.recipientName}
                quizResultTitle={cardData.quizResultTitle}
                quizResultDescription={cardData.quizResultDescription}
                quizResultVerdict={cardData.quizResultVerdict}
                quizContinueButtonText={cardData.quizContinueButtonText}
                onFinishQuiz={handleFinishQuiz}
              />
            </motion.div>
          )}

          {currentStep === 'letter' && (
            <motion.div
              key="letter"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
            >
              <ScreenLetter
                recipientName={cardData.recipientName}
                senderSignature={cardData.senderSignature}
                letterTitle={cardData.letterTitle}
                letterGreeting={cardData.letterGreeting}
                paragraphs={cardData.letterParagraphs}
                letterAnniversaryBlessingTitle={cardData.letterAnniversaryBlessingTitle}
                letterAnniversaryBlessingSubtitle={cardData.letterAnniversaryBlessingSubtitle}
                letterSignOffLabel={cardData.letterSignOffLabel}
                onReplay={handleReplay}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer Branding */}
      <footer className="relative z-20 py-4 text-center text-xs text-stone-400 font-medium select-none">
        <p>ForeverCard &bull; Made with all the love in the universe &bull; Forever &amp; Always</p>
      </footer>
    </div>
  );
}
