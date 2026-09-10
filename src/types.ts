export type ScreenStep = 'cover' | 'question' | 'gallery' | 'quiz' | 'letter';

export type PaperStyleId = 'parchment' | 'floral' | 'minimal' | 'midnight';
export type FontStyleId =
  | 'dancing-script'
  | 'shadows-into-light'
  | 'caveat'
  | 'playfair'
  | 'garamond'
  | 'great-vibes';

export interface PhotoItem {
  id: number;
  imageUrl: string;
  caption: string;
  date?: string;
  location?: string;
  milestoneId?: number;
  rotation?: number; // deg for polaroid tilt (-4 to +4)
  filter?: 'none' | 'vintage' | 'rose' | 'bw' | 'sepia';
}

export interface MilestoneItem {
  id: number;
  title: string;
  date: string;
  description: string;
  iconName?: string;
  photoId?: number;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex?: number;
  reaction?: string;
  correctExplanation?: string;
  wrongExplanation?: string;
  emoji: string;
}

export interface CardData {
  // 1. Personal Names & Key Dates
  recipientName: string;
  senderName: string;
  senderSignature: string;
  anniversaryDate?: string; // Late September
  daysTogether?: number; // 365 days
  anniversaryBadgeText?: string; // e.g. "1 Year • 365 Days Together 💕"

  // 2. Cover Screen
  coverTitle: string;
  coverSubtitle: string;

  // 3. Question Screen
  questionTitle: string;
  questionSubtitleInitial: string;
  questionSubtitleDodge: string;
  questionYesText: string;
  questionNoTexts: string[];

  // 4. Memory Gallery & Milestones
  galleryTitle?: string;
  gallerySubtitle?: string;
  galleryContinueButtonText?: string;
  photos: PhotoItem[];
  milestones: MilestoneItem[];

  // 5. Love Quiz
  quizTitle?: string;
  quizQuestions: QuizQuestion[];
  quizResultTitle?: string;
  quizResultDescription?: string;
  quizResultVerdict?: string;
  quizContinueButtonText?: string;

  // 6. Final Letter Content
  letterTitle: string;
  letterGreeting: string;
  letterParagraphs: string[];
  letterAnniversaryBlessingTitle?: string;
  letterAnniversaryBlessingSubtitle?: string;
  letterSignOffLabel: string;
}

