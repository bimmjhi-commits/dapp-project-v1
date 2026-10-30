export interface SurahItem {
  number: number;
  name: string;
  arabicName: string;
  translation: string;
  revelation: 'Makkiyyah' | 'Madaniyyah';
  numberOfAyahs: number;
  audioUrl: string;
  sampleAyahs: Array<{
    number: number;
    arabic: string;
    transliteration: string;
    translation: string;
  }>;
}

export const QURAN_SURAHS: SurahItem[] = [
  {
    number: 1,
    name: 'Al-Fatihah',
    arabicName: 'الفاتحة',
    translation: 'Pembukaan',
    revelation: 'Makkiyyah',
    numberOfAyahs: 7,
    audioUrl: 'https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/1.mp3',
    sampleAyahs: [
      {
        number: 1,
        arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
        transliteration: "Bismillāhir-raḥmānir-raḥīm",
        translation: 'Dengan nama Allah Yang Maha Pengasih, Maha Penyayang.',
      },
      {
        number: 2,
        arabic: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
        transliteration: "Al-ḥamdu lillāhi rabbil-'ālamīn",
        translation: 'Segala puji bagi Allah, Tuhan semesta alam.',
      },
      {
        number: 3,
        arabic: 'الرَّحْمَٰنِ الرَّحِيمِ',
        transliteration: "Ar-raḥmānir-raḥīm",
        translation: 'Yang Maha Pengasih, Maha Penyayang.',
      },
      {
        number: 4,
        arabic: 'مَالِكِ يَوْمِ الدِّينِ',
        transliteration: "Māliki yaumid-dīn",
        translation: 'Pemilik hari pembalasan.',
      },
      {
        number: 5,
        arabic: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ',
        transliteration: "Iyyāka na'budu wa iyyāka nasta'īn",
        translation: 'Hanya kepada Engkaulah kami menyembah dan hanya kepada Engkaulah kami memohon pertolongan.',
      },
      {
        number: 6,
        arabic: 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ',
        transliteration: "Ihdinaṣ-ṣirāṭal-mustaqīm",
        translation: 'Tunjukilah kami jalan yang lurus,',
      },
      {
        number: 7,
        arabic: 'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ',
        transliteration: "Ṣirāṭallażīna an'amta 'alaihim gairil-magḍūbi 'alaihim wa laḍ-ḍāllīn",
        translation: '(yaitu) jalan orang-orang yang telah Engkau beri nikmat kepadanya; bukan (jalan) mereka yang dimurkai, dan bukan (pula jalan) mereka yang sesat.',
      },
    ],
  },
  {
    number: 36,
    name: 'Yasin',
    arabicName: 'يس',
    translation: 'Ya Sin',
    revelation: 'Makkiyyah',
    numberOfAyahs: 83,
    audioUrl: 'https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/36.mp3',
    sampleAyahs: [
      {
        number: 1,
        arabic: 'يسٓ',
        transliteration: "Yā Sīn",
        translation: 'Ya Sin.',
      },
      {
        number: 2,
        arabic: 'وَالْقُرْآنِ الْحَكِيمِ',
        transliteration: "Wal-qur'ānil-ḥakīm",
        translation: 'Demi Al-Qur\'an yang penuh hikmah,',
      },
      {
        number: 3,
        arabic: 'إِنَّكَ لَمِنَ الْمُرْسَلِينَ',
        transliteration: "Innaka laminal-mursalīn",
        translation: 'sungguh, engkau (Muhammad) adalah salah seorang dari rasul-rasul,',
      },
    ],
  },
  {
    number: 67,
    name: 'Al-Mulk',
    arabicName: 'الملك',
    translation: 'Kerajaan',
    revelation: 'Makkiyyah',
    numberOfAyahs: 30,
    audioUrl: 'https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/67.mp3',
    sampleAyahs: [
      {
        number: 1,
        arabic: 'تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ',
        transliteration: "Tabārakallażī biyadihil-mulku wa huwa 'alā kulli syai'in qadīr",
        translation: 'Mahasuci Allah yang di tangan-Nya-lah kerajaan, dan Dia Mahakuasa atas segala sesuatu,',
      },
      {
        number: 2,
        arabic: 'الَّذِي خَلَقَ الْمَوْتَ وَالْحَيَاةَ لِيَبْلُوَكُمْ أَيُّكُمْ أَحْسَنُ عَمَلًا',
        transliteration: "Allażī khalaqal-mauta wal-ḥayāta liyabluwakum ayyukum aḥsanu 'amalā",
        translation: 'Yang menciptakan mati dan hidup, untuk menguji kamu, siapa di antara kamu yang lebih baik amalnya.',
      },
    ],
  },
  {
    number: 18,
    name: 'Al-Kahf',
    arabicName: 'الكهف',
    translation: 'Gua',
    revelation: 'Makkiyyah',
    numberOfAyahs: 110,
    audioUrl: 'https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/18.mp3',
    sampleAyahs: [
      {
        number: 1,
        arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَنْزَلَ عَلَىٰ عَبْدِهِ الْكِتَابَ وَلَمْ يَجْعَلْ لَهُ عِوَجًا',
        transliteration: "Al-ḥamdu lillāhillażī anzala 'alā 'abdihil-kitāba wa lam yaj'al lahū 'iwajā",
        translation: 'Segala puji bagi Allah yang telah menurunkan Kitab (Al-Qur\'an) kepada hamba-Nya dan Dia tidak menjadikannya bengkok,',
      },
    ],
  },
  {
    number: 55,
    name: 'Ar-Rahman',
    arabicName: 'الرحمن',
    translation: 'Maha Pemurah',
    revelation: 'Madaniyyah',
    numberOfAyahs: 78,
    audioUrl: 'https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/55.mp3',
    sampleAyahs: [
      {
        number: 1,
        arabic: 'الرَّحْمَٰنُ',
        transliteration: "Ar-Raḥmān",
        translation: '(Allah) Yang Maha Pengasih,',
      },
      {
        number: 2,
        arabic: 'عَلَّمَ الْقُرْآنَ',
        transliteration: "'Allamal-qur'ān",
        translation: 'Yang telah mengajarkan Al-Qur\'an.',
      },
      {
        number: 3,
        arabic: 'خَلَقَ الْإِنْسَانَ',
        transliteration: "Khalaqal-insān",
        translation: 'Dia menciptakan manusia,',
      },
    ],
  },
  {
    number: 112,
    name: 'Al-Ikhlas',
    arabicName: 'الإخلاص',
    translation: 'Ikhlas / Keesaan Allah',
    revelation: 'Makkiyyah',
    numberOfAyahs: 4,
    audioUrl: 'https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/112.mp3',
    sampleAyahs: [
      {
        number: 1,
        arabic: 'قُلْ هُوَ اللَّهُ أَحَدٌ',
        transliteration: "Qul huwallāhu aḥad",
        translation: 'Katakanlah (Muhammad), "Dialah Allah, Yang Maha Esa."',
      },
      {
        number: 2,
        arabic: 'اللَّهُ الصَّمَدُ',
        transliteration: "Allāhuṣ-ṣamad",
        translation: 'Allah tempat meminta segala sesuatu.',
      },
      {
        number: 3,
        arabic: 'لَمْ يَلِدْ وَلَمْ يُولَدْ',
        transliteration: "Lam yalid wa lam yūlad",
        translation: '(Allah) tidak beranak dan tidak pula diperanakkan,',
      },
      {
        number: 4,
        arabic: 'وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ',
        transliteration: "Wa lam yakul lahū kufuwan aḥad",
        translation: 'dan tidak ada sesuatu yang setara dengan Dia.',
      },
    ],
  },
  {
    number: 113,
    name: 'Al-Falaq',
    arabicName: 'الفلق',
    translation: 'Waktu Subuh',
    revelation: 'Makkiyyah',
    numberOfAyahs: 5,
    audioUrl: 'https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/113.mp3',
    sampleAyahs: [
      {
        number: 1,
        arabic: 'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ',
        transliteration: "Qul a'ūżu birabbil-falaq",
        translation: 'Katakanlah, "Aku berlindung kepada Tuhan yang menguasai subuh (fajar),',
      },
    ],
  },
  {
    number: 114,
    name: 'An-Nas',
    arabicName: 'الناس',
    translation: 'Manusia',
    revelation: 'Makkiyyah',
    numberOfAyahs: 6,
    audioUrl: 'https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/114.mp3',
    sampleAyahs: [
      {
        number: 1,
        arabic: 'قُلْ أَعُوذُ بِرَبِّ النَّاسِ',
        transliteration: "Qul a'ūżu birabbin-nās",
        translation: 'Katakanlah, "Aku berlindung kepada Tuhannya manusia,',
      },
    ],
  },
];
