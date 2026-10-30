import React, { useRef, useEffect, useState } from 'react';
import { ToolDef } from './ToolDetailView';
import { ToolsModal } from './ToolsModal';

interface ToolsMainPageProps {
  videoUrl?: string;
  userName?: string;
  onOpenMenu?: () => void;
  isQuranAudioPlaying?: boolean;
  onOpenQuran?: () => void;
  onOpenSub4Unlock?: () => void;

  onOpenIpLookup?: () => void;
  onOpenMusic?: () => void;
  onOpenAiChat?: () => void;
}

const DEFAULT_TOOLS_VIDEO_URL =
  'https://videotourl.com/videos/1793016418186-9a6fc4f3-e859-4eea-9629-cb2ac0f1dc8b.mp4';

export interface CustomIconToolDef extends ToolDef {
  iconSvg: React.ReactNode;
  shortName: string;
  cardTitle?: string;
  cardDesc?: string;
  badge?: string;
  category: 'downloader' | 'canvas' | 'stalker' | 'maker';
}

export interface ToolCategory {
  id: 'downloader' | 'canvas' | 'stalker' | 'maker';
  name: string;
  shortDesc: string;
  badge: string;
  iconSvg: React.ReactNode;
}

export const TOOL_CATEGORIES: ToolCategory[] = [
  {
    id: 'downloader',
    name: 'DOWNLOADER',
    shortDesc: 'Instagram, TikTok, YouTube, X, Spotify',
    badge: 'MEDIA',
    iconSvg: (
      <svg className="w-8 h-8 text-current" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
    ),
  },
  {
    id: 'canvas',
    name: 'CANVAS',
    shortDesc: 'Struk DANA, GoPay, OVO, E-KTP, WA',
    badge: 'IMAGE',
    iconSvg: (
      <svg className="w-8 h-8 text-current" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <rect x="3" y="3" width="18" height="18" rx="3" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
    ),
  },
  {
    id: 'stalker',
    name: 'STALKER',
    shortDesc: 'IP Tracker, IQC Chat, Fake Call, NGL',
    badge: 'LOOKUP',
    iconSvg: (
      <svg className="w-8 h-8 text-current" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
  {
    id: 'maker',
    name: 'MAKER',
    shortDesc: 'BRAT, Sertifikat, Meme, Quotes, QR',
    badge: 'CREATE',
    iconSvg: (
      <svg className="w-8 h-8 text-current" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    ),
  },
];

export const TOOLS_CONFIG: CustomIconToolDef[] = [
  // CATEGORY: DOWNLOADER
  {
    id: 'instagram',
    category: 'downloader',
    name: 'Instagram Downloader',
    shortName: 'Instagram',
    cardTitle: 'Instagram',
    cardDesc: 'Download video & foto',
    badge: 'HD',
    emoji: '',
    type: 'downloader',
    endpoint: 'https://api.synoxcloud.xyz/download/instagram',
    defaultParams: { url: 'https://www.instagram.com/reel/C8xxx/' },
    paramLabels: { url: 'URL Video / Reel Instagram' },
    description: 'Download video reels, foto, atau postingan Instagram tanpa watermark kualitas tinggi.',
    iconSvg: (
      <svg className="w-8 h-8 text-cyan-300" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    ),
  },
  {
    id: 'tiktok',
    category: 'downloader',
    name: 'TikTok Downloader',
    shortName: 'TikTok',
    cardTitle: 'TikTok',
    cardDesc: 'No watermark',
    badge: 'MP4',
    emoji: '',
    type: 'downloader',
    endpoint: 'https://api.synoxcloud.xyz/download/tiktok',
    defaultParams: { url: 'https://www.tiktok.com/@tiktok/video/7106594312292453675' },
    paramLabels: { url: 'URL Video TikTok' },
    description: 'Download video TikTok tanpa watermark dan audio jernih HD.',
    iconSvg: (
      <svg className="w-8 h-8 text-cyan-300" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
      </svg>
    ),
  },
  {
    id: 'youtube',
    category: 'downloader',
    name: 'YouTube Downloader',
    shortName: 'YouTube',
    cardTitle: 'YouTube',
    cardDesc: 'Video & audio',
    badge: 'MP4/MP3',
    emoji: '',
    type: 'downloader',
    endpoint: 'https://api.synoxcloud.xyz/download/youtube',
    defaultParams: { url: 'https://youtu.be/OHwxdBC5Cxs' },
    paramLabels: { url: 'URL Video YouTube' },
    description: 'Unduh video YouTube resolusi 360p, 720p, hingga 1080p MP4.',
    iconSvg: (
      <svg className="w-8 h-8 text-cyan-300" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <polygon points="5 3 19 12 5 21 5 3" />
      </svg>
    ),
  },
  {
    id: 'twitter',
    category: 'downloader',
    name: 'Twitter / X Downloader',
    shortName: 'Twitter/X',
    cardTitle: 'Twitter / X',
    cardDesc: 'Download tweet & media',
    badge: 'HD',
    emoji: '',
    type: 'downloader',
    endpoint: 'https://api.synoxcloud.xyz/download/twitter',
    defaultParams: { url: 'https://x.com/elonmusk/status/1234567890123456789' },
    paramLabels: { url: 'URL Tweet / X' },
    description: 'Unduh video dan media dari cuitan Twitter/X dengan cepat.',
    iconSvg: (
      <svg className="w-8 h-8 text-cyan-300" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
        <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
      </svg>
    ),
  },
  {
    id: 'spotify',
    category: 'downloader',
    name: 'Spotify Downloader',
    shortName: 'Spotify',
    cardTitle: 'Spotify MP3',
    cardDesc: 'Unduh audio jernih',
    badge: 'MP3',
    emoji: '',
    type: 'downloader',
    endpoint: 'https://api.synoxcloud.xyz/download/spotify',
    defaultParams: { url: 'https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT' },
    paramLabels: { url: 'URL Lagu Spotify' },
    description: 'Ambil link unduhan lagu Spotify dengan kualitas audio jernih.',
    iconSvg: (
      <svg className="w-8 h-8 text-cyan-300" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
        <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
      </svg>
    ),
  },

  // CATEGORY: CANVAS
  {
    id: 'fake-dana',
    category: 'canvas',
    name: 'Fake DANA',
    shortName: 'Fake DANA',
    cardTitle: 'Fake DANA',
    cardDesc: 'Struk transaksi DANA',
    badge: 'CANVAS',
    emoji: '',
    type: 'canvas',
    endpoint: 'https://api.synoxcloud.xyz/canvas/fake-dana',
    defaultParams: { nominal: '150000' },
    paramLabels: { nominal: 'Nominal Saldo (Rp)' },
    description: 'Generate struk bukti transaksi aplikasi DANA otomatis.',
    iconSvg: (
      <svg className="w-8 h-8 text-cyan-300" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
        <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
        <path d="M18 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
      </svg>
    ),
  },
  {
    id: 'fake-gopay',
    category: 'canvas',
    name: 'Fake GoPay',
    shortName: 'Fake GoPay',
    cardTitle: 'Fake GoPay',
    cardDesc: 'Struk saldo GoPay',
    badge: 'CANVAS',
    emoji: '',
    type: 'canvas',
    endpoint: 'https://api.synoxcloud.xyz/canvas/fake-gopay',
    defaultParams: { saldo: '890', koin: '159', terpakai: '0', bulan: 'Mei' },
    paramLabels: { saldo: 'Saldo', koin: 'Koin', terpakai: 'Terpakai', bulan: 'Bulan' },
    description: 'Generate struk saldo dan koin GoPay kustom.',
    iconSvg: (
      <svg className="w-8 h-8 text-cyan-300" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4" />
        <path d="M4 6v12a2 2 0 0 0 2 2h14v-4" />
        <circle cx="18" cy="12" r="1" />
      </svg>
    ),
  },
  {
    id: 'fake-ovo',
    category: 'canvas',
    name: 'Fake OVO',
    shortName: 'Fake OVO',
    cardTitle: 'Fake OVO',
    cardDesc: 'Saldo OVO instan',
    badge: 'CANVAS',
    emoji: '',
    type: 'canvas',
    endpoint: 'https://api.synoxcloud.xyz/canvas/fake-ovo',
    defaultParams: { amount: '500000' },
    paramLabels: { amount: 'Jumlah Saldo OVO' },
    description: 'Generate saldo OVO kustom instan.',
    iconSvg: (
      <svg className="w-8 h-8 text-cyan-300" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 8v8M8 12h8" />
      </svg>
    ),
  },
  {
    id: 'bangjago',
    category: 'canvas',
    name: 'Bangjago',
    shortName: 'Bangjago',
    cardTitle: 'Bangjago',
    cardDesc: 'Mockup Bank Jago',
    badge: 'MATH',
    emoji: '',
    type: 'canvas',
    endpoint: 'https://api.synoxcloud.xyz/canvas/bangjago',
    defaultParams: { nama: 'Kalkulator Saldo', saldo: '800000' },
    paramLabels: { nama: 'Nama Hitungan', saldo: 'Jumlah Angka (Rp)' },
    description: 'Kalkulator hitung saldo dan nominal kustom.',
    iconSvg: (
      <svg className="w-8 h-8 text-cyan-300" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <rect x="4" y="2" width="16" height="20" rx="2" />
        <line x1="8" y1="6" x2="16" y2="6" />
        <line x1="16" y1="14" x2="16" y2="18" />
        <path d="M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M8 18h.01M12 18h.01" />
      </svg>
    ),
  },
  {
    id: 'e-ktp',
    category: 'canvas',
    name: 'Fake E-KTP',
    shortName: 'Fake E-KTP',
    cardTitle: 'Fake E-KTP',
    cardDesc: 'Kartu E-KTP palsu',
    badge: 'CANVAS',
    emoji: '',
    type: 'canvas',
    endpoint: 'https://api.synoxcloud.xyz/canvas/e-ktp',
    defaultParams: {
      provinsi: 'Prefektur Tokyo',
      kota: 'Nerima',
      nik: '2112090309120001',
      nama: 'Doraemon',
      ttl: 'Matsushiba, 03-09-2112',
      jenis_kelamin: 'Laki-laki',
      golongan_darah: 'Dorayaki',
      alamat: 'Rumah Keluarga Nobi No. 7',
      kel_desa: 'Nerima',
      kecamatan: 'Tsukimidai',
      pekerjaan: 'Robot Pembantu',
      pas_photo: 'https://k.top4top.io/p_3816oexr91.jpg'
    },
    paramLabels: {
      provinsi: 'Provinsi',
      kota: 'Kota',
      nik: 'Nomor NIK',
      nama: 'Nama Lengkap',
      ttl: 'Tempat, Tanggal Lahir',
      jenis_kelamin: 'Jenis Kelamin',
      golongan_darah: 'Gol Darah',
      alamat: 'Alamat',
      kel_desa: 'Kelurahan/Desa',
      kecamatan: 'Kecamatan',
      pekerjaan: 'Pekerjaan',
      pas_photo: 'URL Foto Pas'
    },
    description: 'Buat kartu tanda penduduk elektronik (E-KTP) palsu unik.',
    iconSvg: (
      <svg className="w-8 h-8 text-cyan-300" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <rect x="2" y="3" width="20" height="18" rx="2" />
        <circle cx="8" cy="10" r="3" />
        <path d="M14 9h4M14 13h4M6 17h12" />
      </svg>
    ),
  },
  {
    id: 'fakewa',
    category: 'canvas',
    name: 'Fake WhatsApp',
    shortName: 'Fake WA',
    cardTitle: 'Fake WA',
    cardDesc: 'Profil WA palsu',
    badge: 'FUN',
    emoji: '',
    type: 'canvas',
    endpoint: 'https://api.synoxcloud.xyz/canvas/fakewa',
    defaultParams: { foto: 'https://c.top4top.io/p_3815w0ycy1.jpg', nama: 'Lordsaurus', bio: 'Jangan berpatah hati', nomor: '+62 812 3456 7890' },
    paramLabels: { foto: 'URL Foto', nama: 'Nama WhatsApp', bio: 'Bio / Status', nomor: 'Nomor HP' },
    description: 'Buat profil akun WhatsApp palsu realistis.',
    iconSvg: (
      <svg className="w-8 h-8 text-cyan-300" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    id: 'fakeml',
    category: 'canvas',
    name: 'Fake ML',
    shortName: 'Fake ML',
    cardTitle: 'Fake ML',
    cardDesc: 'Profil rank MLBB',
    badge: 'GAME',
    emoji: '',
    type: 'canvas',
    endpoint: 'https://api.synoxcloud.xyz/canvas/fakeml',
    defaultParams: { avatar: 'https://d.top4top.io/p_38200eohz1.jpg', username: 'Saurus', rank: 'imo', border: '16' },
    paramLabels: { avatar: 'URL Avatar', username: 'Username Mobile Legends', rank: 'Rank (imo/glory/mythic)', border: 'ID Border' },
    description: 'Mockup loading screen profil Mobile Legends rank tinggi.',
    iconSvg: (
      <svg className="w-8 h-8 text-cyan-300" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
        <polyline points="14 2 14 8 20 8" />
      </svg>
    ),
  },
  {
    id: 'fakeff',
    category: 'canvas',
    name: 'Fake FF',
    shortName: 'Fake FF',
    cardTitle: 'Fake FF',
    cardDesc: 'Lobi Free Fire',
    badge: 'GAME',
    emoji: '',
    type: 'canvas',
    endpoint: 'https://api.synoxcloud.xyz/canvas/fakeff',
    defaultParams: { username: 'Saurus', lobby: '30' },
    paramLabels: { username: 'Nama Karakter Free Fire', lobby: 'Level Lobby' },
    description: 'Mockup profil lobi Free Fire.',
    iconSvg: (
      <svg className="w-8 h-8 text-cyan-300" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" />
      </svg>
    ),
  },

  // CATEGORY: STALKER
  {
    id: 'fakedev-3',
    category: 'stalker',
    name: 'Password Gen',
    shortName: 'Password Gen',
    cardTitle: 'Password Gen',
    cardDesc: 'Password aman',
    badge: 'SECURE',
    emoji: '',
    type: 'canvas',
    endpoint: 'https://api.synoxcloud.xyz/canvas/fakedev-3',
    defaultParams: { image: 'https://b.top4top.io/p_38247f1hr1.jpg', text1: 'PASSWORD SECURE', text2: 'P1234!@#' },
    paramLabels: { image: 'URL Foto', text1: 'Label Password', text2: 'Kunci Rahasia' },
    description: 'Generator password aman & profil terenkripsi.',
    iconSvg: (
      <svg className="w-8 h-8 text-cyan-300" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
  },
  {
    id: 'iqc',
    category: 'stalker',
    name: 'IQC Generator',
    shortName: 'IQC Generator',
    cardTitle: 'IQC Generator',
    cardDesc: 'Buat gambar IQC',
    badge: 'CUSTOM',
    emoji: '',
    type: 'canvas',
    endpoint: 'https://api.synoxcloud.xyz/canvas/iqc',
    defaultParams: { text: 'Halo! Namaku saurus', time: '09:41', baterai: '80' },
    paramLabels: { text: 'Teks Gelembung Pesan', time: 'Jam Status Bar', baterai: 'Persentase Baterai' },
    description: 'Generator tangkapan layar chat iPhone realistis.',
    iconSvg: (
      <svg className="w-8 h-8 text-cyan-300" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
      </svg>
    ),
  },
  {
    id: 'fakecall',
    category: 'stalker',
    name: 'Fake Call',
    shortName: 'Fake Call',
    cardTitle: 'Fake Call',
    cardDesc: 'Panggilan WA palsu',
    badge: 'FUN',
    emoji: '',
    type: 'canvas',
    endpoint: 'https://api.synoxcloud.xyz/canvas/fakecall',
    defaultParams: { name: 'Ayank', time: '00:00', pp: 'https://c.top4top.io/p_3815w0ycy1.jpg' },
    paramLabels: { name: 'Nama Kontak', time: 'Durasi Telepon', pp: 'URL Foto Profil (PP)' },
    description: 'Buat tangkapan layar panggilan telepon palsu WhatsApp.',
    iconSvg: (
      <svg className="w-8 h-8 text-cyan-300" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
  },
  {
    id: 'fake-ngl',
    category: 'stalker',
    name: 'Fake NGL',
    shortName: 'Fake NGL',
    cardTitle: 'Fake NGL',
    cardDesc: 'Kartu pesan anonim',
    badge: 'FUN',
    emoji: '',
    type: 'canvas',
    endpoint: 'https://api.synoxcloud.xyz/canvas/fake-ngl',
    defaultParams: { text: 'Gw tuh sebenarnya ultramen' },
    paramLabels: { text: 'Pesan Anonim NGL' },
    description: 'Buat mockup kartu pesan anonim NGL link.',
    iconSvg: (
      <svg className="w-8 h-8 text-cyan-300" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
  },

  // CATEGORY: MAKER
  {
    id: 'brat',
    category: 'maker',
    name: 'BRAT Generator',
    shortName: 'BRAT Generator',
    cardTitle: 'BRAT Generator',
    cardDesc: 'Buat teks gaya BRAT',
    badge: 'NEW!',
    emoji: '',
    type: 'canvas',
    endpoint: 'https://api.synoxcloud.xyz/canvas/brat',
    defaultParams: { text: 'Halo semuanya' },
    paramLabels: { text: 'Teks BRAT' },
    description: 'Buat poster teks bergaya album BRAT hijau ikonik.',
    iconSvg: (
      <svg className="w-8 h-8 text-cyan-300" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <polyline points="4 7 4 4 20 4 20 7" />
        <line x1="12" y1="4" x2="12" y2="20" />
      </svg>
    ),
  },
  {
    id: 'maju-lo-meme',
    category: 'maker',
    name: 'Sertifikat Tolol',
    shortName: 'Sertifikat Tolol',
    cardTitle: 'Sertifikat Tolol',
    cardDesc: 'Buat sertifikat lucu',
    badge: 'NEW!',
    emoji: '',
    type: 'canvas',
    endpoint: 'https://api.synoxcloud.xyz/canvas/maju-lo-meme',
    defaultParams: { atas: 'SERTIFIKAT RESMI', bawah: 'Diberikan kepada Orang Paling Tolol' },
    paramLabels: { atas: 'Judul Atas Sertifikat', bawah: 'Penerima & Keterangan' },
    description: 'Buat sertifikat piagam lucu kocak kustom.',
    iconSvg: (
      <svg className="w-8 h-8 text-cyan-300" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M12 15l-2 5l3-2l3 2l-2-5" />
        <circle cx="12" cy="9" r="6" />
      </svg>
    ),
  },
  {
    id: 'pakustadz',
    category: 'maker',
    name: 'Tanya Ustadz',
    shortName: 'Tanya Ustadz',
    cardTitle: 'Tanya Ustadz',
    cardDesc: 'Meme generator',
    badge: 'LUCU',
    emoji: '',
    type: 'canvas',
    endpoint: 'https://api.synoxcloud.xyz/canvas/pakustadz',
    defaultParams: { teks: 'Pak ustad, apa hukumnya menyukai anime' },
    paramLabels: { teks: 'Pertanyaan untuk Pak Ustadz' },
    description: 'Meme tanya jawab fatwa lucu kepada Pak Ustadz.',
    iconSvg: (
      <svg className="w-8 h-8 text-cyan-300" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
        <path d="M6 6h8M6 10h8" />
      </svg>
    ),
  },
  {
    id: 'jarvis-meme',
    category: 'maker',
    name: 'Windows Quotes',
    shortName: 'Windows Quotes',
    cardTitle: 'Windows Quotes',
    cardDesc: 'Quote ala Windows',
    badge: 'MEME',
    emoji: '',
    type: 'canvas',
    endpoint: 'https://api.synoxcloud.xyz/canvas/jarvis-meme',
    defaultParams: { text: 'jarvis tolong itu anunya di anu anukan' },
    paramLabels: { text: 'Perintah ke Jarvis / Quote' },
    description: 'Generator meme tampilan jendela Windows / AI Jarvis.',
    iconSvg: (
      <svg className="w-8 h-8 text-cyan-300" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18M9 21V9" />
      </svg>
    ),
  },
  {
    id: 'fakestory',
    category: 'maker',
    name: 'Fake IG',
    shortName: 'Fake IG',
    cardTitle: 'Fake IG',
    cardDesc: 'Generator fake Instagram',
    badge: 'NEW!',
    emoji: '',
    type: 'canvas',
    endpoint: 'https://api.synoxcloud.xyz/canvas/fakestory',
    defaultParams: { nickname: 'Saurus', text: 'Haii haloo', pp: 'https://c.top4top.io/p_3815w0ycy1.jpg' },
    paramLabels: { nickname: 'Username', text: 'Teks Story', pp: 'URL Foto Profil' },
    description: 'Buat postingan Instagram Story / Feed palsu.',
    iconSvg: (
      <svg className="w-8 h-8 text-cyan-300" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" />
        <polygon points="10 8 16 12 10 16 10 8" />
      </svg>
    ),
  },
  {
    id: 'iqc-sticker',
    category: 'maker',
    name: 'QR Generator',
    shortName: 'QR Generator',
    cardTitle: 'QR Generator',
    cardDesc: 'Buat QR code',
    badge: 'INSTANT',
    emoji: '',
    type: 'canvas',
    endpoint: 'https://api.synoxcloud.xyz/canvas/iqc-sticker',
    defaultParams: { nama: 'Synox Cloud.', waktu: '00.00', photo: 'https://api.synoxcloud.xyz/assets/icon.jpg' },
    paramLabels: { nama: 'Nama QR / Stiker', waktu: 'Waktu', photo: 'URL Gambar' },
    description: 'Generator stiker & QR visual instan.',
    iconSvg: (
      <svg className="w-8 h-8 text-cyan-300" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    id: 'bratvid',
    category: 'maker',
    name: 'Brat Video',
    shortName: 'Brat Vid',
    cardTitle: 'Brat Video',
    cardDesc: 'Video animasi BRAT',
    badge: 'ANIM',
    emoji: '',
    type: 'canvas',
    endpoint: 'https://api.synoxcloud.xyz/canvas/bratvid',
    defaultParams: { text: 'Bang kapan nikah' },
    paramLabels: { text: 'Teks Animasi Brat' },
    description: 'Buat video animasi teks bergaya Brat hijau.',
    iconSvg: (
      <svg className="w-8 h-8 text-cyan-300" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <polygon points="23 7 16 12 23 17 23 7" />
        <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
      </svg>
    ),
  },
  {
    id: 'distracted-boy-meme',
    category: 'maker',
    name: 'Distracted Boy',
    shortName: 'Distracted',
    cardTitle: 'Distracted Boy',
    cardDesc: 'Meme pacar melirik',
    badge: 'MEME',
    emoji: '',
    type: 'canvas',
    endpoint: 'https://api.synoxcloud.xyz/canvas/distracted-boy-meme',
    defaultParams: { text1: 'Ah tu cewe cakep juga ya', text2: 'Hei kamu ngeliatin kemana', text3: 'tu cowo ngeliatin gw naksir kah' },
    paramLabels: { text1: 'Teks Cewek Baru', text2: 'Teks Pacar Marah', text3: 'Teks Cowok Melirik' },
    description: 'Generator meme Distracted Boyfriend klasik.',
    iconSvg: (
      <svg className="w-8 h-8 text-cyan-300" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
  {
    id: 'dogecheems',
    category: 'maker',
    name: 'Doge Cheems',
    shortName: 'Doge Cheems',
    cardTitle: 'Doge Cheems',
    cardDesc: 'Meme Doge vs Cheems',
    badge: 'MEME',
    emoji: '',
    type: 'canvas',
    endpoint: 'https://api.synoxcloud.xyz/canvas/dogecheems',
    defaultParams: { kiri: 'aku sukses', kanan: 'aku malah rebahan' },
    paramLabels: { kiri: 'Teks Doge Berotot (Kiri)', kanan: 'Teks Cheems Cengeng (Kanan)' },
    description: 'Meme komparasi Buff Doge vs Crying Cheems.',
    iconSvg: (
      <svg className="w-8 h-8 text-cyan-300" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" />
        <path d="M8 14s1.5 2 4 2 4-2 4-2" />
        <line x1="9" y1="9" x2="9.01" y2="9" />
        <line x1="15" y1="9" x2="15.01" y2="9" />
      </svg>
    ),
  },
  {
    id: 'dragonball',
    category: 'maker',
    name: 'Dragon Ball',
    shortName: 'Dragon Ball',
    cardTitle: 'Dragon Ball',
    cardDesc: 'Teks logo anime',
    badge: 'TEXT',
    emoji: '',
    type: 'canvas',
    endpoint: 'https://api.synoxcloud.xyz/canvas/dragonball',
    defaultParams: { text: 'DRAGONBALL' },
    paramLabels: { text: 'Teks Logo' },
    description: 'Generator teks logo bergaya anime Dragon Ball.',
    iconSvg: (
      <svg className="w-8 h-8 text-cyan-300" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.5 4 6.5 2 2 3 3 3 5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
      </svg>
    ),
  },
  {
    id: 'drakehotline',
    category: 'maker',
    name: 'Drake Hotline',
    shortName: 'Drake',
    cardTitle: 'Drake Hotline',
    cardDesc: 'Meme reaksi Drake',
    badge: 'MEME',
    emoji: '',
    type: 'canvas',
    endpoint: 'https://api.synoxcloud.xyz/canvas/drakehotline',
    defaultParams: { teks1: 'uang bukan segalanya', teks2: 'tapi segalanya butuh uang' },
    paramLabels: { teks1: 'Teks Drake Menolak (Atas)', teks2: 'Teks Drake Menyetujui (Bawah)' },
    description: 'Generator meme reaksi Drake Hotline Bling.',
    iconSvg: (
      <svg className="w-8 h-8 text-cyan-300" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
      </svg>
    ),
  },
  {
    id: 'fakewafat',
    category: 'maker',
    name: 'Fake Wafat',
    shortName: 'Fake Wafat',
    cardTitle: 'Fake Wafat',
    cardDesc: 'Meme nisan duka',
    badge: 'MEME',
    emoji: '',
    type: 'canvas',
    endpoint: 'https://api.synoxcloud.xyz/canvas/fakewafat',
    defaultParams: { fotourl: 'https://b.top4top.io/p_38235zels1.jpg', nama: 'Bwa bwa pekerja', lahir: '2013', wafat: '2022' },
    paramLabels: { fotourl: 'URL Foto Nisan', nama: 'Nama Almarhum', lahir: 'Tahun Lahir', wafat: 'Tahun Wafat' },
    description: 'Buat gambar nisan peringatan wafat kustom.',
    iconSvg: (
      <svg className="w-8 h-8 text-cyan-300" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
  },
];

export const ToolsMainPage: React.FC<ToolsMainPageProps> = ({
  videoUrl = DEFAULT_TOOLS_VIDEO_URL,
  userName = 'User',
  onOpenMenu,
}) => {
  const [selectedToolId, setSelectedToolId] = useState<string | null>(() => {
    if (typeof window !== 'undefined' && window.location.hash.startsWith('#tool-')) {
      return window.location.hash.replace('#tool-', '');
    }
    return null;
  });

  const [selectedCategoryId, setSelectedCategoryId] = useState<'downloader' | 'canvas' | 'stalker' | 'maker' | null>(null);
  const [activeModal, setActiveModal] = useState<ToolCategory | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const categoryScrollRef = useRef<HTMLDivElement | null>(null);
  const toolScrollRef = useRef<HTMLDivElement | null>(null);
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const [activeToolIndex, setActiveToolIndex] = useState(0);
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [isCharging, setIsCharging] = useState<boolean>(false);

  useEffect(() => {
    let batteryObj: any = null;

    const updateBatteryInfo = (b: any) => {
      if (b && typeof b.level === 'number') {
        setBatteryLevel(Math.round(b.level * 100));
        setIsCharging(Boolean(b.charging));
      }
    };

    if (typeof navigator !== 'undefined' && 'getBattery' in navigator) {
      (navigator as any)
        .getBattery()
        .then((b: any) => {
          batteryObj = b;
          updateBatteryInfo(b);
          b.addEventListener('levelchange', () => updateBatteryInfo(b));
          b.addEventListener('chargingchange', () => updateBatteryInfo(b));
        })
        .catch(() => {
          setBatteryLevel(88);
        });
    } else {
      setBatteryLevel(88);
    }

    return () => {
      if (batteryObj) {
        try {
          batteryObj.removeEventListener('levelchange', () => updateBatteryInfo(batteryObj));
          batteryObj.removeEventListener('chargingchange', () => updateBatteryInfo(batteryObj));
        } catch {
          // ignore cleanup errors
        }
      }
    };
  }, []);

  const handleCategoryScroll = () => {
    if (!categoryScrollRef.current) return;
    const container = categoryScrollRef.current;
    const itemWidth = container.firstElementChild?.clientWidth || 280;
    const index = Math.round(container.scrollLeft / (itemWidth + 16));
    setActiveCategoryIndex(Math.min(Math.max(index, 0), TOOL_CATEGORIES.length - 1));
  };

  const handleToolScroll = () => {
    if (!toolScrollRef.current) return;
    const container = toolScrollRef.current;
    const itemWidth = container.firstElementChild?.clientWidth || 280;
    const index = Math.round(container.scrollLeft / (itemWidth + 16));
    setActiveToolIndex(index);
  };

  useEffect(() => {
    const onHashChange = () => {
      if (window.location.hash.startsWith('#tool-')) {
        setSelectedToolId(window.location.hash.replace('#tool-', ''));
        setSelectedCategoryId(null);
      } else if (window.location.hash.startsWith('#category-')) {
        const cat = window.location.hash.replace('#category-', '');
        if (cat === 'downloader' || cat === 'canvas' || cat === 'stalker' || cat === 'maker') {
          setSelectedCategoryId(cat as any);
          setSelectedToolId(null);
        }
      } else {
        setSelectedToolId(null);
        setSelectedCategoryId(null);
      }
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    video.play().catch(() => {});
  }, [videoUrl, selectedToolId, selectedCategoryId]);

  const activeCategory = selectedCategoryId ? TOOL_CATEGORIES.find((c) => c.id === selectedCategoryId) : null;
  const activeTool = selectedToolId ? TOOLS_CONFIG.find((t) => t.id === selectedToolId) || null : null;

  return (
    <div className="w-full min-h-screen flex flex-col pb-32 select-none text-slate-100 overflow-x-hidden relative bg-black">
      {/* Clean Solid Black Background */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-black" />

      {/* HEADER BAR - CYBERPUNK TERMINAL */}
      <div className="w-full px-6 py-4 flex items-center justify-between bg-black/50 backdrop-blur-md border-b border-[#38BDF8]/20 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-black border border-[#38BDF8]/30 flex items-center justify-center shrink-0">
             <svg className="w-6 h-6 text-[#38BDF8]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
             </svg>
          </div>
          <h1 className="text-xl font-bold tracking-widest uppercase font-['Share_Tech_Mono'] text-[#38BDF8]">
            DAPP TOOLS
          </h1>
        </div>
      </div>

      {/* BANNER VIDEO TOOLS - BLUE CLAYMORPHISM & FRUTIGER AERO */}
      <div className="px-6 pt-6 max-w-2xl mx-auto w-full">
        <section
          aria-label="Banner Video Tools"
          className="w-full h-[200px] overflow-hidden bg-white/90 backdrop-blur-2xl border-[3px] border-blue-200/90 rounded-[36px] relative group shadow-[inset_0_2px_6px_rgba(255,255,255,0.9),0_12px_30px_rgba(37,99,235,0.2)]"
        >
          <div className="w-full h-full relative flex items-center justify-center">
            <video
              ref={videoRef}
              src={videoUrl || DEFAULT_TOOLS_VIDEO_URL}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-blue-900/60 via-blue-900/20 to-transparent pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-black/10 pointer-events-none" />

            <div className="absolute bottom-6 left-6 z-10 flex flex-col items-start gap-1.5 pointer-events-none">
              <h2
                className="text-3xl font-black tracking-tight uppercase leading-none text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]"
                style={{
                  fontFamily: "'MADE Evolve Sans EVO', sans-serif",
                }}
              >
                DAPP PROJECT <br/> <span className="text-sky-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">TOOLS</span>
              </h2>
            </div>
          </div>
        </section>
      </div>

      {/* HEADER STATS CARD - CYBERPUNK DARK */}
      <div className="px-6 pt-4 max-w-2xl mx-auto w-full">
        <div className="bg-[#1E1E22] border border-[#38BDF8]/20 rounded-[20px] p-4 sm:p-5 shadow-2xl relative overflow-hidden">
          
          <div className="grid grid-cols-3 gap-3 relative z-10">
            {/* 1. TOTAL TOOLS */}
            <div className="bg-[#1A1A1E] border border-[#38BDF8]/10 rounded-[20px] py-4 px-2 flex flex-col items-center justify-center text-center">
              <div className="w-10 h-10 rounded-lg bg-[#26262A] border border-[#38BDF8]/20 flex items-center justify-center text-[#38BDF8] mb-1.5">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <span className="font-bold text-[#E5E7EB] text-2xl leading-none font-['Share_Tech_Mono']">
                {TOOLS_CONFIG.length}
              </span>
              <span className="text-[10px] text-[#8B949E] font-bold uppercase tracking-widest mt-1">
                Tools
              </span>
            </div>

            {/* 2. BATERAI */}
            <div className="bg-[#1A1A1E] border border-[#38BDF8]/10 rounded-[20px] py-4 px-2 flex flex-col items-center justify-center text-center">
              <div className="w-10 h-10 rounded-lg bg-[#26262A] border border-[#38BDF8]/20 flex items-center justify-center text-[#38BDF8] mb-1.5">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
              </div>
              <span className="font-bold text-[#E5E7EB] text-2xl leading-none font-['Share_Tech_Mono'] flex items-center gap-0.5">
                {isCharging && <span className="text-[#38BDF8] text-xs animate-pulse">⚡</span>}
                {batteryLevel !== null ? `${batteryLevel}%` : '88%'}
              </span>
              <span className="text-[10px] text-[#8B949E] font-bold uppercase tracking-widest mt-1">
                Baterai
              </span>
            </div>

            {/* 3. STATUS (WAKTU) */}
            <div className="bg-[#1A1A1E] border border-[#38BDF8]/10 rounded-[20px] py-4 px-2 flex flex-col items-center justify-center text-center">
              <div className="w-10 h-10 rounded-lg bg-[#26262A] border border-[#38BDF8]/20 flex items-center justify-center text-[#38BDF8] mb-1.5">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
              </div>
              <span className="font-bold text-[#E5E7EB] text-2xl leading-none font-['Share_Tech_Mono']">
                {new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
              </span>
              <span className="text-[10px] text-[#8B949E] font-bold uppercase tracking-widest mt-1">
                Waktu
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* VIEW 1: KATEGORI UTAMA (BLUE CLAYMORPHISM / FRUTIGER AERO) */}
      {!selectedCategoryId && (
        <div className="px-6 pt-8 max-w-2xl mx-auto w-full">
          <div className="bg-[#0A0A0A] rounded-[28px] border border-white/10 p-5 relative overflow-hidden">
            <div className="flex items-center justify-between mb-6 px-2">
              <h3 className="text-xl font-black text-white tracking-tight uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
                EXPLORE CATEGORIES
              </h3>
            </div>
            
            <div 
              ref={categoryScrollRef}
              onScroll={handleCategoryScroll}
              className="flex items-center gap-6 overflow-x-auto pb-6 no-scrollbar snap-x snap-mandatory scroll-smooth"
            >
              {TOOL_CATEGORIES.map((cat, idx) => {
                const count = TOOLS_CONFIG.filter((t) => t.category === cat.id).length;
                return (
                  <div
                    key={cat.id}
                    onClick={() => {
                      setActiveModal(cat);
                    }}
                    className={`w-[280px] shrink-0 snap-center bg-[#1A1A1E] rounded-[20px] border border-cyan-500/20 p-6 flex flex-col items-start gap-4 cursor-pointer hover:bg-[#26262A] transition-all group relative overflow-hidden ${
                      activeCategoryIndex === idx ? 'scale-100 opacity-100 ring-1 ring-cyan-500' : 'scale-95 opacity-85'
                    }`}
                  >
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      <div className="scale-[2.5] text-blue-600">
                        {cat.iconSvg}
                      </div>
                    </div>
                    
                    <div className="w-14 h-14 rounded-lg bg-[#1A1A1E] border border-[#38BDF8]/30 text-[#38BDF8] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform [&>svg]:w-7 [&>svg]:h-7 [&>svg]:stroke-[2]">
                      {cat.iconSvg}
                    </div>

                    <div className="flex flex-col gap-1">
                      <h4 className="text-xl font-bold font-['Share_Tech_Mono'] text-[#38BDF8] leading-tight uppercase">
                        {cat.name}
                      </h4>
                      <p className="text-sm text-[#8B949E] font-bold font-['Share_Tech_Mono'] leading-tight line-clamp-2">
                        {cat.shortDesc}
                      </p>
                    </div>

                    <div className="mt-auto w-full flex items-center justify-between pt-4 border-t border-[#38BDF8]/10">
                      <span className="text-[11px] font-bold font-['Share_Tech_Mono'] text-[#38BDF8] bg-[#1A1A1E] px-3.5 py-1 rounded border border-[#38BDF8]/20">
                        {count} MODULES
                      </span>
                      <div className="w-9 h-9 rounded-full bg-gradient-to-b from-blue-600 to-blue-800 text-white flex items-center justify-center shadow-[0_4px_10px_rgba(37,99,235,0.4)] group-hover:scale-105 transition-transform">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Dots Indicator Below Categories */}
            <div className="flex items-center justify-center gap-2 pt-2 pb-2">
              {TOOL_CATEGORIES.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    if (categoryScrollRef.current) {
                      const itemWidth = categoryScrollRef.current.firstElementChild?.clientWidth || 280;
                      categoryScrollRef.current.scrollTo({ left: idx * (itemWidth + 24), behavior: 'smooth' });
                    }
                  }}
                  className={`transition-all duration-300 cursor-pointer ${
                    activeCategoryIndex === idx
                      ? 'w-8 h-2.5 bg-white rounded-full shadow-[0_2px_6px_rgba(0,0,0,0.2)]'
                      : 'w-2.5 h-2.5 bg-white/40 rounded-full hover:bg-white/70'
                  }`}
                  aria-label={`Category ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      )}


      
      {/* MODAL OVERLAY */}
      <ToolsModal
        category={activeModal}
        selectedTool={activeTool}
        onClose={() => {
          setActiveModal(null);
          setSelectedToolId(null);
        }}
        onSelectTool={(toolId) => setSelectedToolId(toolId)}
        onBackToCategory={() => setSelectedToolId(null)}
      />

    </div>
  );
};

