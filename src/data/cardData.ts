import { CardData } from '../types';

/**
 * ==============================================================================
 * 🥂 FOREVERCARD — MASTER CONFIGURATION FILE (1-YEAR ANNIVERSARY EDITION)
 * ==============================================================================
 * All text, names, dates, photos, quiz questions, and romantic letter paragraphs
 * are configured in this SINGLE file.
 *
 * Customize your anniversary card:
 * 1. Change recipientName and senderName
 * 2. Set daysTogether and anniversaryDate
 * 3. Update timeline photos and milestone labels
 * 4. Adjust relationship anniversary quiz questions
 * 5. Personalize the final 1-year anniversary letter paragraphs
 *
 * Everything in the app updates automatically from here!
 * ==============================================================================
 */

export const INITIAL_CARD_DATA: CardData = {
  // ----------------------------------------------------------------------------
  // 1. PERSONAL NAMES & ANNIVERSARY COUNTER
  // ----------------------------------------------------------------------------
  recipientName: 'Claire',
  senderName: 'Leo',
  senderSignature: 'With all my love, Leo 💕',
  anniversaryDate: 'September 28', // Late September 1-year anniversary (365 days)
  daysTogether: 365,
  anniversaryBadgeText: '1 Year • 365 Days Together 💕',

  // ----------------------------------------------------------------------------
  // 2. COVER SCREEN
  // ----------------------------------------------------------------------------
  coverTitle: 'One Year With You ❤️',
  coverSubtitle: "365 days of laughter, late-night talks, and falling deeper in love every single day. Let's relive our journey together...",

  // ----------------------------------------------------------------------------
  // 3. PLAYFUL QUESTION SCREEN
  // ----------------------------------------------------------------------------
  questionTitle: 'Would you choose me all over again? ❤️',
  questionSubtitleInitial: "After 365 days together, Claire... There are only two choices! 😉",
  questionSubtitleDodge: "You know in your heart there's only one right answer! 💕",
  questionYesText: 'YES, A THOUSAND TIMES! 🥰',
  questionNoTexts: [
    'No 🙈',
    'After 365 days?! 🥺',
    'Think again! 😜',
    'Too slow! 🏃‍♂️',
    'Nice try! ✨',
    'Error 404: No not found 💫',
    'Can’t touch this! 🎶',
    'Just press Yes! 🥰',
  ],

  // ----------------------------------------------------------------------------
  // 4. MEMORY TIMELINE & GALLERY (EMOTIONAL CENTERPIECE)
  // ----------------------------------------------------------------------------
  galleryTitle: 'Our Journey This Past Year 📸',
  gallerySubtitle: 'From that first shy hello to 365 days by your side—every chapter has been pure magic.',
  galleryContinueButtonText: 'Next: Our 1-Year Quiz 💖',
  milestones: [
    {
      id: 1,
      title: 'First met',
      date: 'Autumn 2025',
      description: 'The rainy afternoon at the cafe where coffee turned into 4 hours of nonstop laughter and instant sparks.',
      photoId: 1,
    },
    {
      id: 2,
      title: 'First date',
      date: 'Winter 2025',
      description: 'Nervous butterflies, endless smiles across the table, and walking hand-in-hand under the glow of streetlights.',
      photoId: 2,
    },
    {
      id: 3,
      title: 'Made it official',
      date: 'Spring 2026',
      description: 'Under a quiet sky full of stars, we made the easiest promise in the world: it’s you and me, always.',
      photoId: 3,
    },
    {
      id: 4,
      title: 'Our first trip',
      date: 'Summer 2026',
      description: 'Windows rolled down, singing off-key to our favorite song on repeat, completely lost in the mountain air.',
      photoId: 4,
    },
    {
      id: 5,
      title: 'Quiet ordinary days',
      date: 'Throughout our year',
      description: 'Surprise flowers on random Tuesdays, cooking dinner together in our socks, and sweet effortless peace.',
      photoId: 5,
    },
    {
      id: 6,
      title: 'Today: 1 Year',
      date: 'Late September • 365 Days',
      description: '365 days of loving you. The best year of my life—and only the opening chapter of our forever.',
      photoId: 6,
    },
  ],
  photos: [
    {
      id: 1,
      imageUrl: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=800&auto=format&fit=crop&q=80',
      caption: 'The rainy cafe where coffee turned into 4 hours of talking like we had known each other forever.',
      date: 'October 14, 2025',
      location: 'Little Corner Cafe',
      milestoneId: 1,
      rotation: -2.5,
    },
    {
      id: 2,
      imageUrl: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=800&auto=format&fit=crop&q=80',
      caption: 'Walking along the beach, cold breeze in our faces, holding hands and never wanting the night to end.',
      date: 'January 20, 2026',
      location: 'Sunset Cove Beach',
      milestoneId: 2,
      rotation: 3.2,
    },
    {
      id: 3,
      imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80',
      caption: 'Sparklers, soft whispers, and the exact moment we made it official. Best decision of my life.',
      date: 'March 18, 2026',
      location: 'Pine Ridge Overlook',
      milestoneId: 3,
      rotation: -1.8,
    },
    {
      id: 4,
      imageUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&auto=format&fit=crop&q=80',
      caption: 'Our first weekend getaway—bad navigation, great snacks, and endless road trip singing.',
      date: 'June 05, 2026',
      location: 'Highland Pass',
      milestoneId: 4,
      rotation: 2.1,
    },
    {
      id: 5,
      imageUrl: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=800&auto=format&fit=crop&q=80',
      caption: 'Fresh blooms on a random Tuesday just to see your radiant smile light up the whole room.',
      date: 'August 12, 2026',
      location: 'Our Cozy Sanctuary',
      milestoneId: 5,
      rotation: -3.0,
    },
    {
      id: 6,
      imageUrl: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&auto=format&fit=crop&q=80',
      caption: 'Today: Exactly 1 year, 365 days, and my heart belongs to you more than ever.',
      date: 'Today • 1 Year Anniversary',
      location: 'Right Here With You',
      milestoneId: 6,
      rotation: 1.5,
    },
  ],

  // ----------------------------------------------------------------------------
  // 5. 1-YEAR ANNIVERSARY MINI QUIZ
  // ----------------------------------------------------------------------------
  quizTitle: 'Our 1-Year Trivia',
  quizQuestions: [
    {
      id: 1,
      question: 'Where did we have our very first official date together?',
      options: [
        'At that cozy cafe corner table ☕',
        'Stargazing by the quiet beach water 🌊',
        'Dinner where we completely lost track of time 🍝',
        'Wherever it was, I was just completely captivated by you 🥰',
      ],
      reaction: 'Spot on! My heart was racing the entire time, and I fell in love right then. 💖',
      emoji: '☕',
    },
    {
      id: 2,
      question: 'What has been our undisputed official anthem / song this past year?',
      options: [
        'The acoustic track we played during our late-night drive 🚗',
        'The song we sang together at the top of our lungs 🎶',
        'That sweet melody that makes both of us smile every time 💫',
        'Every romantic love song ever written reminds me of you 💕',
      ],
      reaction: 'Whenever that song comes on, my thoughts immediately fly straight to you! 🎵',
      emoji: '🎵',
    },
    {
      id: 3,
      question: 'What was the sweetest surprise from our first year together?',
      options: [
        'When you gave me that warm hug when I needed it most 🫂',
        'The spontaneous little notes and texts that made my day 💌',
        'Cooking together in our socks and making a giant mess 🍳',
        'Honestly, just having you in my life every single day ✨',
      ],
      reaction: 'Looking back at this past year, every single moment with you is my treasure. 🌹',
      emoji: '🎁',
    },
    {
      id: 4,
      question: 'Looking back at 365 days together, what is the best part of our story?',
      options: [
        'How we can laugh until our stomachs hurt over the silliest things 😂',
        'The absolute comfort and peaceful warmth of your embrace 🏡',
        'How we grew stronger and closer through every single season 🌿',
        'Knowing that year one is just the prologue to our forever 🥂',
      ],
      reaction: 'Every single option is 1000% true. Year one has been the happiest year of my life. 🥂',
      emoji: '✨',
    },
  ],
  quizResultTitle: '1 Year Completed With Flying Colors! 💕',
  quizResultDescription: '365 days, thousands of shared laughs, and countless unforgettable moments. We aced our first year together, Claire—and I would choose you all over again in a heartbeat! 🥰',
  quizResultVerdict: '1 Year Down, A Lifetime To Go ✨',
  quizContinueButtonText: 'Open Your Anniversary Letter 💌',

  // ----------------------------------------------------------------------------
  // 6. FINAL 1-YEAR ANNIVERSARY LETTER
  // ----------------------------------------------------------------------------
  letterTitle: 'To My Person, One Year In ✨',
  letterGreeting: 'Dearest Claire,',
  letterParagraphs: [
    "It feels like just yesterday we shared our very first nervous smile, yet somehow, living life with you feels as natural and essential as breathing. Exactly 365 days ago, our paths aligned into something extraordinary.",
    "Looking back over this past year, my favorite memories aren't just the big milestones—they're the quiet, golden moments. The late-night drives with the music humming, the inside jokes that only we understand, and the effortless comfort of simply sitting beside you in silence.",
    "You have taught me what it means to feel truly seen, cherished, and safe. Through every high and low, your patience, warmth, and gentle humor have been my steady sanctuary.",
    "They say time flies when you're happy, but with you, every single day has felt deeply meaningful. Out of all the people in this world, choosing you—and being chosen by you—remains the greatest privilege of my life.",
    "Thank you for 365 days of unconditional love, infectious laughter, and endless warmth. Year one was only our opening chapter; I can't wait to write the rest of our lifetime together.",
  ],
  letterAnniversaryBlessingTitle: 'Happy 1st Anniversary, Claire! 🥂✨',
  letterAnniversaryBlessingSubtitle: "Here's to 365 days of loving you, and all the years yet to come.",
  letterSignOffLabel: 'Forever and always yours,',
};
