import React, { useState } from 'react';
import { Sparkles, Award, ArrowRight, Heart, CheckCircle, HelpCircle } from 'lucide-react';
import { QuizQuestion } from '../types';
import { romanticAudio } from '../utils/audio';

interface ScreenQuizProps {
  quizTitle?: string;
  questions: QuizQuestion[];
  recipientName: string;
  quizResultTitle?: string;
  quizResultDescription?: string;
  quizResultVerdict?: string;
  quizContinueButtonText?: string;
  onFinishQuiz: () => void;
}

export const ScreenQuiz: React.FC<ScreenQuizProps> = ({
  quizTitle = 'Kenangan Manis 1 Tahun Kita',
  questions,
  recipientName,
  quizResultTitle = '1 Tahun Bersama, Cinta Kita Selalu Juara! 💕',
  quizResultDescription = '365 hari penuh tawa, cinta, dan ribuan momen manis berdua. Ga ada ujian yang bisa ngalahin dalamnya rasa sayang kita berdua, Claire! 🥰',
  quizResultVerdict = 'Certified 100% Soulmate, Seumur Hidup Bersama ✨',
  quizContinueButtonText = 'Buka Surat Cinta Anniversary 💌',
  onFinishQuiz,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isSolved, setIsSolved] = useState<boolean>(false);
  const [teasedIndices, setTeasedIndices] = useState<number[]>([]);
  const [lastTeasedText, setLastTeasedText] = useState<string | null>(null);
  const [shakingIdx, setShakingIdx] = useState<number | null>(null);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const currentQ = questions[currentIndex];
  const targetCorrectIndex = currentQ.correctIndex ?? 0;

  const handleSelectOption = (idx: number) => {
    // IF-ELSE logic: 1 true romantic milestone, others are playful teasing banter
    if (idx === targetCorrectIndex) {
      // IF BENAR: Celebrate the genuine romantic milestone
      setIsSolved(true);
      setLastTeasedText(null);
      romanticAudio.playQuizCorrectSound();
      romanticAudio.playConfettiPop();
    } else {
      // ELSE: Playful teasing "pengganggu" reaction
      setShakingIdx(idx);
      setTimeout(() => setShakingIdx(null), 450);

      if (!teasedIndices.includes(idx)) {
        setTeasedIndices((prev) => [...prev, idx]);
      }

      const teaseMessage =
        currentQ.wrongExplanation ||
        'Masa kamu lupa sih sayang? 😭 Masa kenangan manis kita kamu ga inget, coba tebak lagi dong 🥺';

      setLastTeasedText(teaseMessage);
      romanticAudio.playDodgeSqueak();
    }
  };

  const handleNext = () => {
    romanticAudio.playButtonClick();
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setIsSolved(false);
      setTeasedIndices([]);
      setLastTeasedText(null);
      setShakingIdx(null);
    } else {
      setIsCompleted(true);
      romanticAudio.playYesCelebration();
    }
  };

  return (
    <div className="relative min-h-[90vh] flex flex-col items-center justify-center px-4 py-10">
      <div className={`w-full mx-auto transition-all duration-300 ${!isCompleted ? 'max-w-2xl' : 'max-w-3xl sm:max-w-4xl lg:max-w-5xl'}`}>
        {!isCompleted ? (
          <div className="card-glass rounded-3xl p-6 sm:p-10 shadow-xl border border-rose-100/90 text-center">
            {/* Top pill & progress indicator */}
            <div className="flex items-center justify-between mb-6">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rose-100/80 text-rose-700 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                {quizTitle}
              </span>
              <span className="text-xs font-bold text-stone-500">
                Kenangan {currentIndex + 1} dari {questions.length}
              </span>
            </div>

            {/* Progress dots */}
            <div className="flex justify-center gap-1.5 mb-6">
              {questions.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === currentIndex
                      ? 'w-8 bg-rose-500'
                      : i < currentIndex
                      ? 'w-4 bg-rose-300'
                      : 'w-2 bg-stone-200'
                  }`}
                />
              ))}
            </div>

            {/* Question Card */}
            <div className="mb-8">
              <span className="text-4xl mb-2 inline-block animate-float-slow">{currentQ.emoji}</span>
              <h3 className="font-serif-display text-2xl sm:text-3xl font-bold text-stone-800 leading-snug tracking-tight">
                {currentQ.question}
              </h3>
            </div>

            {/* Interactive Options: 1 Real Milestone + Playful Teasers */}
            <div className="space-y-3 mb-6">
              {currentQ.options.map((option, idx) => {
                const isCorrect = idx === targetCorrectIndex;
                const isTeased = teasedIndices.includes(idx);
                const isShaking = shakingIdx === idx;

                let buttonStyle =
                  'bg-white/85 text-stone-700 border-rose-100/90 hover:border-rose-300 hover:bg-rose-50/70 hover:scale-[1.01]';

                if (isSolved) {
                  if (isCorrect) {
                    buttonStyle =
                      'bg-gradient-to-r from-rose-500 to-pink-500 text-white border-rose-400 shadow-lg shadow-rose-200 scale-[1.02]';
                  } else {
                    buttonStyle = 'bg-stone-50/50 text-stone-400 border-stone-200/60 opacity-50';
                  }
                } else if (isTeased) {
                  buttonStyle =
                    'bg-amber-50/70 text-amber-800 border-amber-200 hover:bg-amber-50';
                }

                return (
                  <button
                    key={idx}
                    disabled={isSolved}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full text-left p-4 rounded-2xl border text-sm sm:text-base font-semibold transition-all duration-200 flex items-center justify-between group cursor-pointer disabled:cursor-default ${buttonStyle} ${
                      isShaking ? 'animate-wiggle' : ''
                    }`}
                  >
                    <span>{option}</span>
                    {isSolved ? (
                      isCorrect ? (
                        <CheckCircle className="w-5 h-5 text-white shrink-0 animate-bounce" />
                      ) : (
                        <div className="w-5 h-5" />
                      )
                    ) : isTeased ? (
                      <HelpCircle className="w-4 h-4 text-amber-500 shrink-0" />
                    ) : (
                      <Heart className="w-4 h-4 text-rose-300 group-hover:text-rose-400 group-hover:scale-110 transition-transform shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Playful IF-ELSE Feedback Area */}
            {isSolved ? (
              /* IF BENAR: Sweet Romantic Confirmation */
              <div className="p-4 rounded-2xl bg-rose-50/95 border border-rose-200 text-rose-800 mb-6 text-sm sm:text-base font-medium animate-in fade-in slide-in-from-bottom-2 duration-300 shadow-xs">
                <div className="flex items-center justify-center gap-2 mb-1.5 font-bold text-rose-700">
                  <Heart className="w-4 h-4 text-rose-500 fill-rose-500 animate-pulse" />
                  <span>Tuh Kan Bener! 🥰</span>
                </div>
                <p className="text-stone-700">
                  {currentQ.correctExplanation || currentQ.reaction}
                </p>
              </div>
            ) : lastTeasedText ? (
              /* ELSE: Romantic Teasing Banter */
              <div className="p-4 rounded-2xl bg-rose-50/90 border border-rose-200 text-rose-900 mb-6 text-sm sm:text-base font-medium animate-in fade-in slide-in-from-bottom-2 duration-200 shadow-xs">
                <div className="flex items-center justify-center gap-2 mb-1.5 font-bold text-rose-700">
                  <Sparkles className="w-4 h-4 text-rose-500 fill-rose-400" />
                  <span>Masa Kamu Lupa Sih? 😭</span>
                </div>
                <p>{lastTeasedText}</p>
              </div>
            ) : null}

            {/* Next Button only once solved */}
            {isSolved && (
              <button
                id="quiz-next-button"
                onClick={handleNext}
                className="group inline-flex items-center gap-2 px-8 py-3 rounded-full font-bold text-base text-white bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 shadow-md shadow-rose-200 hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer animate-in zoom-in-95 duration-200"
              >
                <span>
                  {currentIndex < questions.length - 1
                    ? 'Lanjut ke Kenangan Berikutnya 💖'
                    : 'Lihat Hasil Cinta Kita 💕'}
                </span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            )}
          </div>
        ) : (
          /* Result Screen celebrating their 1-Year Journey with Flying Colors */
          <div className="card-glass rounded-3xl p-8 sm:p-12 lg:p-14 shadow-2xl border border-rose-100 text-center animate-in zoom-in-95 duration-400">
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-amber-400 to-rose-400 flex items-center justify-center text-white mb-6 shadow-lg shadow-rose-200 animate-bounce">
              <Award className="w-10 h-10" />
            </div>

            <span className="inline-block px-4 py-1.5 rounded-full bg-rose-100 text-rose-700 text-xs sm:text-sm font-bold tracking-wide mb-3">
              1 Tahun Penuh Cinta
            </span>

            {/* Title: 1 straight line in wide card */}
            <h3 className="font-serif-display text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold text-stone-800 tracking-tight mb-4 px-2">
              {quizResultTitle}
            </h3>

            <p className="text-stone-600 text-sm sm:text-base md:text-lg leading-relaxed mb-6 font-medium max-w-2xl mx-auto">
              {quizResultDescription}
            </p>

            {/* Official verdict: wide spacious card, fits in 1 clean line naturally without scrolling */}
            <div className="inline-flex items-center justify-center gap-2 px-6 sm:px-10 py-3.5 sm:py-4 rounded-2xl bg-rose-50/90 border border-rose-200 mb-8 max-w-full text-xs sm:text-sm md:text-base text-stone-700 font-semibold shadow-xs">
              <span className="text-stone-600">Official Verdict,</span>
              <span className="text-rose-600 font-bold">{quizResultVerdict}</span>
            </div>

            <div>
              <button
                id="quiz-to-letter-button"
                onClick={() => {
                  romanticAudio.playButtonClick();
                  onFinishQuiz();
                }}
                className="group inline-flex items-center gap-3 px-9 py-3.5 sm:px-11 sm:py-4 rounded-full font-bold text-base sm:text-lg text-white bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 shadow-xl shadow-rose-300 hover:shadow-rose-400 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
              >
                <span>{quizContinueButtonText}</span>
                <Sparkles className="w-5 h-5 text-amber-300 fill-amber-200" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

