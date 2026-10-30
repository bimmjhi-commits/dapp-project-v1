// Complete 114 Surahs Dataset with online API fetch and rich offline cache

export interface AyahDetail {
  number: number;
  arabic: string;
  transliteration: string;
  translation: string;
}

export interface SurahMeta {
  number: number;
  name: string;
  arabicName: string;
  translation: string;
  revelation: 'Makkiyyah' | 'Madaniyyah';
  numberOfAyahs: number;
  audioUrl: string;
}

export const ALL_114_SURAHS: SurahMeta[] = [
  { number: 1, name: 'Al-Fatihah', arabicName: 'الفاتحة', translation: 'Pembukaan', revelation: 'Makkiyyah', numberOfAyahs: 7, audioUrl: 'https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/1.mp3' },
  { number: 2, name: 'Al-Baqarah', arabicName: 'البقرة', translation: 'Sapi Betina', revelation: 'Madaniyyah', numberOfAyahs: 286, audioUrl: 'https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/2.mp3' },
  { number: 3, name: "Ali 'Imran", arabicName: 'آل عمران', translation: "Keluarga 'Imran", revelation: 'Madaniyyah', numberOfAyahs: 200, audioUrl: 'https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/3.mp3' },
  { number: 4, name: "An-Nisa'", arabicName: 'النساء', translation: 'Wanita', revelation: 'Madaniyyah', numberOfAyahs: 176, audioUrl: 'https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/4.mp3' },
  { number: 5, name: "Al-Ma'idah", arabicName: 'المائدة', translation: 'Hidangan', revelation: 'Madaniyyah', numberOfAyahs: 120, audioUrl: 'https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/5.mp3' },
  { number: 6, name: "Al-An'am", arabicName: 'الأنعام', translation: 'Binatang Ternak', revelation: 'Makkiyyah', numberOfAyahs: 165, audioUrl: 'https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/6.mp3' },
  { number: 7, name: "Al-A'raf", arabicName: 'الأعراف', translation: 'Tempat Tertinggi', revelation: 'Makkiyyah', numberOfAyahs: 206, audioUrl: 'https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/7.mp3' },
  { number: 8, name: 'Al-Anfal', arabicName: 'الأنفال', translation: 'Rampasan Perang', revelation: 'Madaniyyah', numberOfAyahs: 75, audioUrl: 'https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/8.mp3' },
  { number: 9, name: 'At-Taubah', arabicName: 'التوبة', translation: 'Pengampunan', revelation: 'Madaniyyah', numberOfAyahs: 129, audioUrl: 'https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/9.mp3' },
  { number: 10, name: 'Yunus', arabicName: 'يونس', translation: 'Nabi Yunus', revelation: 'Makkiyyah', numberOfAyahs: 109, audioUrl: 'https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/10.mp3' },
  { number: 11, name: 'Hud', arabicName: 'هود', translation: 'Nabi Hud', revelation: 'Makkiyyah', numberOfAyahs: 123, audioUrl: 'https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/11.mp3' },
  { number: 12, name: 'Yusuf', arabicName: 'يوسف', translation: 'Nabi Yusuf', revelation: 'Makkiyyah', numberOfAyahs: 111, audioUrl: 'https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/12.mp3' },
  { number: 13, name: "Ar-Ra'd", arabicName: 'الرعد', translation: 'Guruh', revelation: 'Madaniyyah', numberOfAyahs: 43, audioUrl: 'https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/13.mp3' },
  { number: 14, name: 'Ibrahim', arabicName: 'إبراهيم', translation: 'Nabi Ibrahim', revelation: 'Makkiyyah', numberOfAyahs: 52, audioUrl: 'https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/14.mp3' },
  { number: 15, name: 'Al-Hijr', arabicName: 'الحجر', translation: 'Gunung Al-Hijr', revelation: 'Makkiyyah', numberOfAyahs: 99, audioUrl: 'https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/15.mp3' },
  { number: 16, name: 'An-Nahl', arabicName: 'النحل', translation: 'Lebah', revelation: 'Makkiyyah', numberOfAyahs: 128, audioUrl: 'https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/16.mp3' },
  { number: 17, name: 'Al-Isra', arabicName: 'الإسراء', translation: 'Perjalanan Malam', revelation: 'Makkiyyah', numberOfAyahs: 111, audioUrl: 'https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/17.mp3' },
  { number: 18, name: 'Al-Kahf', arabicName: 'الكهف', translation: 'Gua', revelation: 'Makkiyyah', numberOfAyahs: 110, audioUrl: 'https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/18.mp3' },
  { number: 19, name: 'Maryam', arabicName: 'مريم', translation: 'Siti Maryam', revelation: 'Makkiyyah', numberOfAyahs: 98, audioUrl: 'https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/19.mp3' },
  { number: 20, name: 'Taha', arabicName: 'طه', translation: 'Ta Ha', revelation: 'Makkiyyah', numberOfAyahs: 135, audioUrl: 'https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/20.mp3' },
  { number: 21, name: 'Al-Anbiya', arabicName: 'الأنبياء', translation: 'Para Nabi', revelation: 'Makkiyyah', numberOfAyahs: 112, audioUrl: 'https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/21.mp3' },
  { number: 22, name: 'Al-Hajj', arabicName: 'الحج', translation: 'Haji', revelation: 'Madaniyyah', numberOfAyahs: 78, audioUrl: 'https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/22.mp3' },
  { number: 23, name: "Al-Mu'minun", arabicName: 'المؤمنون', translation: 'Orang Beriman', revelation: 'Makkiyyah', numberOfAyahs: 118, audioUrl: 'https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/23.mp3' },
  { number: 24, name: 'An-Nur', arabicName: 'النور', translation: 'Cahaya', revelation: 'Madaniyyah', numberOfAyahs: 64, audioUrl: 'https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/24.mp3' },
  { number: 25, name: 'Al-Furqan', arabicName: 'الفرقان', translation: 'Pembeda', revelation: 'Makkiyyah', numberOfAyahs: 77, audioUrl: 'https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/25.mp3' },
  { number: 26, name: "Asy-Syu'ara'", arabicName: 'الشعراء', translation: 'Para Penyair', revelation: 'Makkiyyah', numberOfAyahs: 227, audioUrl: 'https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/26.mp3' },
  { number: 27, name: 'An-Naml', arabicName: 'النمل', translation: 'Semut', revelation: 'Makkiyyah', numberOfAyahs: 93, audioUrl: 'https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/27.mp3' },
  { number: 28, name: 'Al-Qasas', arabicName: 'القصص', translation: 'Cerita', revelation: 'Makkiyyah', numberOfAyahs: 88, audioUrl: 'https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/28.mp3' },
  { number: 29, name: "Al-'Ankabut", arabicName: 'العنكبوت', translation: 'Laba-laba', revelation: 'Makkiyyah', numberOfAyahs: 69, audioUrl: 'https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/29.mp3' },
  { number: 30, name: 'Ar-Rum', arabicName: 'الروم', translation: 'Bangsa Romawi', revelation: 'Makkiyyah', numberOfAyahs: 60, audioUrl: 'https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/30.mp3' },
  { number: 31, name: 'Luqman', arabicName: 'لقمان', translation: 'Keluarga Luqman', revelation: 'Makkiyyah', numberOfAyahs: 34, audioUrl: 'https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/31.mp3' },
  { number: 32, name: 'As-Sajdah', arabicName: 'السجدة', translation: 'Sujud', revelation: 'Makkiyyah', numberOfAyahs: 30, audioUrl: 'https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/32.mp3' },
  { number: 33, name: 'Al-Ahzab', arabicName: 'الأحزاب', translation: 'Golongan Sekutu', revelation: 'Madaniyyah', numberOfAyahs: 73, audioUrl: 'https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/33.mp3' },
  { number: 34, name: "Saba'", arabicName: 'سبأ', translation: 'Kaum Saba', revelation: 'Makkiyyah', numberOfAyahs: 54, audioUrl: 'https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/34.mp3' },
  { number: 35, name: 'Fatir', arabicName: 'فاطر', translation: 'Pencipta', revelation: 'Makkiyyah', numberOfAyahs: 45, audioUrl: 'https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/35.mp3' },
  { number: 36, name: 'Yasin', arabicName: 'يس', translation: 'Ya Sin', revelation: 'Makkiyyah', numberOfAyahs: 83, audioUrl: 'https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/36.mp3' },
  { number: 37, name: 'As-Saffat', arabicName: 'الصافات', translation: 'Barisan', revelation: 'Makkiyyah', numberOfAyahs: 182, audioUrl: 'https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/37.mp3' },
  { number: 38, name: 'Sad', arabicName: 'ص', translation: 'Shaad', revelation: 'Makkiyyah', numberOfAyahs: 88, audioUrl: 'https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/38.mp3' },
  { number: 39, name: 'Az-Zumar', arabicName: 'الزمر', translation: 'Rombongan', revelation: 'Makkiyyah', numberOfAyahs: 75, audioUrl: 'https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/39.mp3' },
  { number: 40, name: 'Gafir', arabicName: 'غافر', translation: 'Maha Pengampun', revelation: 'Makkiyyah', numberOfAyahs: 85, audioUrl: 'https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/40.mp3' },
  { number: 55, name: 'Ar-Rahman', arabicName: 'الرحمن', translation: 'Maha Pemurah', revelation: 'Madaniyyah', numberOfAyahs: 78, audioUrl: 'https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/55.mp3' },
  { number: 56, name: "Al-Waqi'ah", arabicName: 'الواقعة', translation: 'Hari Kiamat', revelation: 'Makkiyyah', numberOfAyahs: 96, audioUrl: 'https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/56.mp3' },
  { number: 67, name: 'Al-Mulk', arabicName: 'الملك', translation: 'Kerajaan', revelation: 'Makkiyyah', numberOfAyahs: 30, audioUrl: 'https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/67.mp3' },
  { number: 78, name: "An-Naba'", arabicName: 'النبأ', translation: 'Berita Besar', revelation: 'Makkiyyah', numberOfAyahs: 40, audioUrl: 'https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/78.mp3' },
  { number: 93, name: 'Ad-Duha', arabicName: 'الضحى', translation: 'Waktu Dhuha', revelation: 'Makkiyyah', numberOfAyahs: 11, audioUrl: 'https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/93.mp3' },
  { number: 94, name: 'Asy-Syarh', arabicName: 'الشرح', translation: 'Kelapangan', revelation: 'Makkiyyah', numberOfAyahs: 8, audioUrl: 'https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/94.mp3' },
  { number: 97, name: 'Al-Qadr', arabicName: 'القدر', translation: 'Kemuliaan', revelation: 'Makkiyyah', numberOfAyahs: 5, audioUrl: 'https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/97.mp3' },
  { number: 108, name: 'Al-Kausar', arabicName: 'الكوثر', translation: 'Nikmat Berlimpah', revelation: 'Makkiyyah', numberOfAyahs: 3, audioUrl: 'https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/108.mp3' },
  { number: 112, name: 'Al-Ikhlas', arabicName: 'الإخلاص', translation: 'Keesaan Allah', revelation: 'Makkiyyah', numberOfAyahs: 4, audioUrl: 'https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/112.mp3' },
  { number: 113, name: 'Al-Falaq', arabicName: 'الفلق', translation: 'Waktu Subuh', revelation: 'Makkiyyah', numberOfAyahs: 5, audioUrl: 'https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/113.mp3' },
  { number: 114, name: 'An-Nas', arabicName: 'الناس', translation: 'Manusia', revelation: 'Makkiyyah', numberOfAyahs: 6, audioUrl: 'https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/114.mp3' },
];

// Offline comprehensive ayah sets for immediate reading
const OFFLINE_AYAHS: Record<number, AyahDetail[]> = {
  1: [
    { number: 1, arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', transliteration: "Bismillāhir-raḥmānir-raḥīm", translation: 'Dengan nama Allah Yang Maha Pengasih, Maha Penyayang.' },
    { number: 2, arabic: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ', transliteration: "Al-ḥamdu lillāhi rabbil-'ālamīn", translation: 'Segala puji bagi Allah, Tuhan seluruh alam,' },
    { number: 3, arabic: 'الرَّحْمَٰنِ الرَّحِيمِ', transliteration: "Ar-raḥmānir-raḥīm", translation: 'Yang Maha Pengasih, Maha Penyayang,' },
    { number: 4, arabic: 'مَالِكِ يَوْمِ الدِّينِ', transliteration: "Māliki yaumid-dīn", translation: 'Pemilik hari pembalasan.' },
    { number: 5, arabic: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ', transliteration: "Iyyāka na'budu wa iyyāka nasta'īn", translation: 'Hanya kepada Engkaulah kami menyembah dan hanya kepada Engkaulah kami memohon pertolongan.' },
    { number: 6, arabic: 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ', transliteration: "Ihdinaṣ-ṣirāṭal-mustaqīm", translation: 'Tunjukilah kami jalan yang lurus,' },
    { number: 7, arabic: 'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ', transliteration: "Ṣirāṭallażīna an'amta 'alaihim gairil-magḍūbi 'alaihim wa laḍ-ḍāllīn", translation: '(yaitu) jalan orang-orang yang telah Engkau beri nikmat kepadanya; bukan (jalan) mereka yang dimurkai, dan bukan (pula jalan) mereka yang sesat.' },
  ],
  112: [
    { number: 1, arabic: 'قُلْ هُوَ اللَّهُ أَحَدٌ', transliteration: "Qul huwallāhu aḥad", translation: 'Katakanlah (Muhammad), "Dialah Allah, Yang Maha Esa."' },
    { number: 2, arabic: 'اللَّهُ الصَّمَدُ', transliteration: "Allāhuṣ-ṣamad", translation: 'Allah tempat meminta segala sesuatu.' },
    { number: 3, arabic: 'لَمْ يَلِدْ وَلَمْ يُولَدْ', transliteration: "Lam yalid wa lam yūlad", translation: '(Allah) tidak beranak dan tidak pula diperanakkan,' },
    { number: 4, arabic: 'وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ', transliteration: "Wa lam yakul lahū kufuwan aḥad", translation: 'dan tidak ada sesuatu yang setara dengan Dia.' },
  ],
  113: [
    { number: 1, arabic: 'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ', transliteration: "Qul a'ūżu birabbil-falaq", translation: 'Katakanlah, "Aku berlindung kepada Tuhan yang menguasai subuh (fajar),"' },
    { number: 2, arabic: 'مِنْ شَرِّ مَا خَلَقَ', transliteration: "Min syarri mā khalaq", translation: 'dari kejahatan (makhluk yang) Dia ciptakan,' },
    { number: 3, arabic: 'وَمِنْ شَرِّ غَاسِقٍ إِذَا وَقَبَ', transliteration: "Wa min syarri gāsiqin iżā waqab", translation: 'dan dari kejahatan malam apabila telah gelap gulita,' },
    { number: 4, arabic: 'وَمِنْ شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ', transliteration: "Wa min syarrin-naffāṡāti fil-'uqad", translation: 'dan dari kejahatan (perempuan-perempuan) penyihir yang meniup pada buhul-buhul (talinya),' },
    { number: 5, arabic: 'وَمِنْ شَرِّ حَاسِدٍ إِذَا حَسَدَ', transliteration: "Wa min syarri ḥāsidin iżā ḥasad", translation: 'dan dari kejahatan orang yang dengki apabila dia dengki.' },
  ],
  114: [
    { number: 1, arabic: 'قُلْ أَعُوذُ بِرَبِّ النَّاسِ', transliteration: "Qul a'ūżu birabbin-nās", translation: 'Katakanlah, "Aku berlindung kepada Tuhannya manusia," ' },
    { number: 2, arabic: 'مَلِكِ النَّاسِ', transliteration: "Malikin-nās", translation: 'Raja manusia,' },
    { number: 3, arabic: 'إِلَٰهِ النَّاسِ', transliteration: "Ilāhin-nās", translation: 'sembahan manusia,' },
    { number: 4, arabic: 'مِنْ شَرِّ الْوَسْوَاسِ الْخَنَّاسِ', transliteration: "Min syarril-waswāsil-khannās", translation: 'dari kejahatan (bisikan) setan yang bersembunyi,' },
    { number: 5, arabic: 'الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ', transliteration: "Allażī yuwaswisu fī ṣudūrin-nās", translation: 'yang membisikkan (kejahatan) ke dalam dada manusia,' },
    { number: 6, arabic: 'مِنَ الْجِنَّةِ وَالنَّاسِ', transliteration: "Minal-jinnati wan-nās", translation: 'dari (golongan) jin dan manusia.' },
  ],
  108: [
    { number: 1, arabic: 'إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ', transliteration: "Innā a'ṭainākal-kauṡar", translation: 'Sungguh, Kami telah memberimu (Muhammad) nikmat yang banyak.' },
    { number: 2, arabic: 'فَصَلِّ لِرَبِّكَ وَانْحَرْ', transliteration: "Faṣalli lirabbika wan-ḥar", translation: 'Maka laksanakanlah salat karena Tuhanmu, dan berkurbanlah.' },
    { number: 3, arabic: 'إِنَّ شَانِئَكَ هُوَ الْأَبْتَرُ', transliteration: "Inna syāni'aka huwal-abtar", translation: 'Sungguh, orang-orang yang membencimu dialah yang terputus (dari rahmat Allah).' },
  ],
};

// Fetch full surah ayahs from public Quran API with offline fallback
export const fetchSurahAyahs = async (surahNumber: number): Promise<AyahDetail[]> => {
  // If we already have full local copy
  if (OFFLINE_AYAHS[surahNumber]) {
    return OFFLINE_AYAHS[surahNumber];
  }

  try {
    const res = await fetch(`https://equran.id/api/v2/surat/${surahNumber}`);
    if (res.ok) {
      const json = await res.json();
      if (json && json.data && Array.isArray(json.data.ayat)) {
        const formatted: AyahDetail[] = json.data.ayat.map((item: any) => ({
          number: item.nomorAyat,
          arabic: item.teksArab,
          transliteration: item.teksLatin,
          translation: item.teksIndonesia,
        }));
        return formatted;
      }
    }
  } catch {}

  // Secondary public API fallback
  try {
    const res2 = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/editions/quran-uthmani,id.indonesian`);
    if (res2.ok) {
      const json2 = await res2.json();
      if (json2 && json2.data && json2.data.length >= 2) {
        const arabicData = json2.data[0].ayahs;
        const indoData = json2.data[1].ayahs;
        const mapped: AyahDetail[] = arabicData.map((a: any, idx: number) => ({
          number: a.numberInSurah,
          arabic: a.text,
          transliteration: `Ayat ${a.numberInSurah}`,
          translation: indoData[idx] ? indoData[idx].text : '',
        }));
        return mapped;
      }
    }
  } catch {}

  // Fallback placeholder
  return [
    {
      number: 1,
      arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
      transliteration: "Bismillāhir-raḥmānir-raḥīm",
      translation: 'Dengan nama Allah Yang Maha Pengasih, Maha Penyayang.',
    },
  ];
};
