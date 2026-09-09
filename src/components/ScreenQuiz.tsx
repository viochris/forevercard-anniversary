import React, { useState } from 'react';
import { Sparkles, Award, ArrowRight, Heart } from 'lucide-react';
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
  quizTitle = 'Our 1-Year Trivia',
  questions,
  recipientName,
  quizResultTitle = '1 Year Completed With A Perfect Score! 💕',
  quizResultDescription,
  quizResultVerdict = '1 Year Down, A Lifetime To Go ✨',
  quizContinueButtonText = 'Read Your Anniversary Letter 💌',
  onFinishQuiz,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const currentQ = questions[currentIndex];

  const handleSelectOption = (idx: number) => {
    setSelectedOption(idx);
    romanticAudio.playQuizOptionSound();
  };

  const handleNext = () => {
    romanticAudio.playButtonClick();
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
    } else {
      setIsCompleted(true);
      romanticAudio.playYesCelebration();
    }
  };

  return (
    <div className="relative min-h-[90vh] flex flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl mx-auto">
        {!isCompleted ? (
          <div className="card-glass rounded-3xl p-6 sm:p-10 shadow-xl border border-rose-100/90 text-center">
            {/* Top pill & progress */}
            <div className="flex items-center justify-between mb-6">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rose-100/80 text-rose-700 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                {quizTitle}
              </span>
              <span className="text-xs font-bold text-stone-500">
                Question {currentIndex + 1} of {questions.length}
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

            {/* Multiple Choice Options */}
            <div className="space-y-3 mb-6">
              {currentQ.options.map((option, idx) => {
                const isSelected = selectedOption === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full text-left p-4 rounded-2xl border text-sm sm:text-base font-semibold transition-all duration-200 flex items-center justify-between group cursor-pointer ${
                      isSelected
                        ? 'bg-rose-500 text-white border-rose-500 shadow-md shadow-rose-200 scale-[1.01]'
                        : 'bg-white/80 text-stone-700 border-rose-100 hover:border-rose-300 hover:bg-rose-50/70 hover:scale-[1.01]'
                    }`}
                  >
                    <span>{option}</span>
                    <Heart
                      className={`w-4 h-4 transition-transform ${
                        isSelected
                          ? 'fill-white text-white scale-110'
                          : 'text-rose-300 group-hover:text-rose-400'
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            {/* Playful Reaction Box */}
            {selectedOption !== null && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200/80 mb-6 text-sm sm:text-base text-rose-800 font-medium animate-in fade-in slide-in-from-bottom-2 duration-300">
                {currentQ.reaction}
              </div>
            )}

            {/* Next Button */}
            {selectedOption !== null && (
              <button
                id="quiz-next-button"
                onClick={handleNext}
                className="group inline-flex items-center gap-2 px-8 py-3 rounded-full font-bold text-base text-white bg-gradient-to-r from-rose-500 to-pink-500 shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
              >
                <span>{currentIndex < questions.length - 1 ? 'Next Question' : 'See Results'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            )}
          </div>
        ) : (
          /* Result Screen: You passed with flying colors! */
          <div className="card-glass rounded-3xl p-8 sm:p-10 shadow-2xl border border-rose-100 text-center animate-in zoom-in-95 duration-400">
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-amber-400 to-rose-400 flex items-center justify-center text-white mb-6 shadow-lg shadow-rose-200 animate-bounce">
              <Award className="w-10 h-10" />
            </div>

            <span className="inline-block px-4 py-1 rounded-full bg-rose-100 text-rose-700 text-xs sm:text-sm font-bold tracking-wide uppercase mb-3">
              Score: 100% Perfect Match
            </span>

            <h3 className="font-serif-display text-xl sm:text-3xl md:text-4xl font-bold text-stone-800 mb-3 tracking-tight whitespace-nowrap">
              {quizResultTitle}
            </h3>

            <p className="text-stone-600 text-sm sm:text-base leading-relaxed mb-6 font-medium max-w-md mx-auto">
              {quizResultDescription || `No matter which options you picked, every choice proved the exact same thing: you and I are certified soulmates, ${recipientName}. There was never any doubt! 🥰`}
            </p>

            <div className="p-4 rounded-2xl bg-rose-50/90 border border-rose-200 mb-8 max-w-sm mx-auto text-xs sm:text-sm text-stone-700 font-semibold flex items-center justify-center gap-2">
              <span>Official Verdict:</span>
              <span className="text-rose-600">{quizResultVerdict}</span>
            </div>

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
        )}
      </div>
    </div>
  );
};
