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
    'Oops, No was not found 💫',
    'Can’t touch this! 🎶',
    'Just press Yes! 🥰',
  ],

  // ----------------------------------------------------------------------------
  // 4. MEMORY TIMELINE & GALLERY (EMOTIONAL CENTERPIECE)
  // ----------------------------------------------------------------------------
  galleryTitle: 'Our Journey This Past Year 📸',
  gallerySubtitle: 'From that first shy hello to 365 days by your side, every chapter has been pure magic.',
  galleryContinueButtonText: 'Continue to Our 1 Year Quiz 💖',
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
      description: 'Nervous butterflies, endless smiles across the table, and walking together holding hands under the glow of streetlights.',
      photoId: 2,
    },
    {
      id: 3,
      title: 'Made it official',
      date: 'Spring 2026',
      description: 'Under a quiet sky full of stars, we made the easiest promise in the world, that it’s you and me, always.',
      photoId: 3,
    },
    {
      id: 4,
      title: 'Our first trip',
      date: 'Summer 2026',
      description: 'Windows rolled down, singing our favorite song on repeat, completely lost in the mountain air.',
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
      title: 'Today, 1 Year',
      date: 'Late September • 365 Days',
      description: '365 days of loving you, the best year of my life, and only the opening chapter of our forever.',
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
      caption: 'Our first weekend getaway, funny wrong turns, great snacks, and endless road trip singing.',
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
      caption: 'Today, exactly 1 year, 365 days, and my heart belongs to you more than ever.',
      date: 'Today • 1 Year Anniversary',
      location: 'Right Here With You',
      milestoneId: 6,
      rotation: 1.5,
    },
  ],

  // ----------------------------------------------------------------------------
  // 5. 1-YEAR ANNIVERSARY MINI QUIZ
  // ----------------------------------------------------------------------------
  // 5. PLAYFUL 1-YEAR ANNIVERSARY TRIVIA (ROMANTIC BANTER)
  // ----------------------------------------------------------------------------
  quizTitle: 'Kenangan Manis 1 Tahun Kita',
  quizQuestions: [
    {
      id: 1,
      question: 'Di mana tempat first date kita yang paling bikin deg degan jalan berdua?',
      options: [
        'Sunset Cove Beach, jalan di tepi pantai sambil kedinginan bareng 🌊',
        'Kafe sudut kota tempat kita ngobrol berjam jam ☕',
        'Bioskop waktu kita nonton film tapi malah ga fokus 🍿',
        'Taman kota jalan sore sambil minum es boba 🧋',
      ],
      correctIndex: 0,
      correctExplanation: 'Tuh kan bener! Sunset Cove Beach, jalan di tepi pantai dingin tapi tangan kita hangat banget 💕',
      wrongExplanation: 'Masa kamu lupa sih sayang? 😭 Masa kenangan manis first date kita kamu ga inget, coba tebak lagi dong 🥺',
      emoji: '🌊',
    },
    {
      id: 2,
      question: 'Di mana tempat paling berkesan waktu kita resmi jadian di bawah taburan bintang?',
      options: [
        'Restoran atap gedung sambil lihat pemandangan kota 🌃',
        'Pine Ridge Overlook waktu kita main kembang api berdua ✨',
        'Dermaga danau waktu kita duduk berdua malam hari 🌙',
        'Di dalam mobil sambil dengerin lagu favorit berdua 🎵',
      ],
      correctIndex: 1,
      correctExplanation: 'Tepat banget sayang! Momen kembang api di Pine Ridge Overlook itu keputusan terbaik dalam hidupku 💖',
      wrongExplanation: 'Yakin pilih yang itu? 😏 Masa momen resmi jadian kita kamu lupa sih sayang, ayo tebak lagi yang beneran 🥺',
      emoji: '✨',
    },
    {
      id: 3,
      question: 'Hal seru dan lucu apa yang paling berkesan pas kita road trip pertama ke Highland Pass?',
      options: [
        'Ban mobil kempes di tengah jalan waktu mau sunset 🛞',
        'Semua bekal camilan tumpah berantakan di jok belakang 🍪',
        'Salah jalan dan nyasar bareng, tapi malah seru nyanyi lagu cinta di mobil 🚗',
        'Ketinggalan kamera sampai harus putar balik jauh 📸',
      ],
      correctIndex: 2,
      correctExplanation: 'Iya bener banget! Walau nyasar, lagu favorit dan tawa kita berdua bikin perjalanannya ga terlupakan 🚗💕',
      wrongExplanation: 'Ih masa petualangan pertama kita kamu lupa? 😭 Jangan godain aku dong sayang, coba pilih kenangan yang beneran 🙈',
      emoji: '🚗',
    },
    {
      id: 4,
      question: 'Kejutan manis apa yang tiba tiba datang di hari Selasa santai tanpa alasan khusus?',
      options: [
        'Buket bunga segar yang tiba tiba sampai cuma buat lihat senyum kamu 🌸',
        'Kotak cokelat manis favorit yang diantar ke rumah kamu 🍫',
        'Pesan antar kopi susu kesukaan kamu pas lagi capek kerja ☕',
        'Kartu ucapan manis yang terselip diam diam di dalam tas kamu 💌',
      ],
      correctIndex: 0,
      correctExplanation: 'Tuh kan bener! Karena bikin kamu tersenyum itu ga butuh alasan atau tanggal khusus di kalender 🌸🥰',
      wrongExplanation: 'Aduh masa bunga kejutan dari aku kamu lupa sih? 😭 Coba diingat ingat lagi pakai hati sayang 🥺',
      emoji: '🌸',
    },
  ],
  quizResultTitle: '1 Tahun Bersama, Cinta Kita Selalu Juara! 💕',
  quizResultDescription: '365 hari penuh tawa, cinta, dan ribuan momen manis berdua. Ga ada ujian yang bisa ngalahin dalamnya rasa sayang kita berdua, Claire! 🥰',
  quizResultVerdict: 'Certified 100% Soulmate, Seumur Hidup Bersama ✨',
  quizContinueButtonText: 'Buka Surat Cinta Anniversary 💌',

  // ----------------------------------------------------------------------------
  // 6. FINAL 1-YEAR ANNIVERSARY LETTER
  // ----------------------------------------------------------------------------
  letterTitle: 'To My Person, One Year In ✨',
  letterGreeting: 'Dearest Claire,',
  letterParagraphs: [
    "It feels like just yesterday we shared our very first nervous smile, yet somehow, living life with you feels as natural and essential as breathing. Exactly 365 days ago, our paths aligned into something extraordinary.",
    "Looking back over this past year, my favorite memories are not just the big milestones, they are the quiet, golden moments. The late night drives with the music humming, the inside jokes that only we understand, and the effortless comfort of simply sitting beside you in silence.",
    "You have taught me what it means to feel truly seen, cherished, and safe. Through every high and low, your patience, warmth, and gentle humor have been my steady sanctuary.",
    "They say time flies when you're happy, but with you, every single day has felt deeply meaningful. Out of all the people in this world, choosing you, and being chosen by you, remains the greatest privilege of my life.",
    "Thank you for 365 days of unconditional love, infectious laughter, and endless warmth. Year one was only our opening chapter, and I can't wait to write the rest of our lifetime together.",
  ],
  letterAnniversaryBlessingTitle: 'Happy 1st Anniversary, Claire! 🥂✨',
  letterAnniversaryBlessingSubtitle: "Here's to 365 days of loving you, and all the years yet to come.",
  letterSignOffLabel: 'Forever and always yours,',
};
