// Centralized Music Streaming Audio Service for DAPP MUSIC

export interface TrackInfo {
  title?: string;
  url?: string;
  duration?: string;
  thumbnail?: string;
  mp3?: string;
}

export type RepeatMode = 'off' | 'one' | 'all';
export type EqPreset = 'normal' | 'bass' | 'vocal' | 'treble';

export interface MusicState {
  currentTrack: TrackInfo | null;
  isPlaying: boolean;
  currentTime: number;
  durationSec: number;
  repeatMode: RepeatMode;
  isShuffle: boolean;
  playbackRate: number;
  eqPreset: EqPreset;
}

type MusicListener = (state: MusicState) => void;

class GlobalMusicManager {
  private audio: HTMLAudioElement | null = null;
  private playlist: TrackInfo[] = [];
  private currentIndex: number = 0;
  private state: MusicState = {
    currentTrack: null,
    isPlaying: false,
    currentTime: 0,
    durationSec: 0,
    repeatMode: 'all',
    isShuffle: false,
    playbackRate: 1.0,
    eqPreset: 'normal',
  };
  private listeners = new Set<MusicListener>();

  constructor() {
    if (typeof window !== 'undefined') {
      this.audio = new Audio();
      this.audio.preload = 'auto';

      // Restore playlist, index, and playback preferences from localStorage
      try {
        const storedPlaylist = localStorage.getItem('dapp_music_playlist');
        if (storedPlaylist) {
          this.playlist = JSON.parse(storedPlaylist);
        }
        const storedIndex = localStorage.getItem('dapp_music_current_index');
        if (storedIndex !== null) {
          this.currentIndex = parseInt(storedIndex, 10);
        }
        const storedRepeat = localStorage.getItem('dapp_music_repeat') as RepeatMode;
        if (storedRepeat) {
          this.state.repeatMode = storedRepeat;
        }
        const storedShuffle = localStorage.getItem('dapp_music_shuffle');
        if (storedShuffle !== null) {
          this.state.isShuffle = storedShuffle === 'true';
        }
      } catch (err) {
        console.error('Failed to restore music state', err);
      }

      this.audio.addEventListener('timeupdate', () => {
        if (!this.audio) return;
        this.state.currentTime = this.audio.currentTime;
        this.emit();
      });

      this.audio.addEventListener('loadedmetadata', () => {
        if (!this.audio) return;
        this.state.durationSec = this.audio.duration;
        this.emit();
      });

      this.audio.addEventListener('ended', () => {
        this.handleTrackEnd();
      });

      this.audio.addEventListener('pause', () => {
        this.state.isPlaying = false;
        this.emit();
      });

      this.audio.addEventListener('play', () => {
        this.state.isPlaying = true;
        this.emit();
      });

      this.audio.addEventListener('error', () => {
        this.state.isPlaying = false;
        this.emit();
      });
    }
  }

  public subscribe(listener: MusicListener): () => void {
    this.listeners.add(listener);
    listener(this.state);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private emit() {
    this.listeners.forEach((fn) => fn({ ...this.state }));
  }

  private handleTrackEnd() {
    if (this.state.repeatMode === 'one' && this.audio) {
      this.audio.currentTime = 0;
      this.audio.play().catch(() => {});
      return;
    }

    if (this.state.isShuffle && this.playlist.length > 1) {
      let randomIndex = Math.floor(Math.random() * this.playlist.length);
      while (randomIndex === this.currentIndex && this.playlist.length > 1) {
        randomIndex = Math.floor(Math.random() * this.playlist.length);
      }
      this.playTrack(randomIndex);
      return;
    }

    // Default next track
    this.next();
  }

  public setPlaylist(list: TrackInfo[]) {
    this.playlist = list;
    try {
      localStorage.setItem('dapp_music_playlist', JSON.stringify(list));
    } catch {
      // Storage error fallback
    }
  }

  public playTrack(index: number) {
    if (!this.audio || index < 0 || index >= this.playlist.length) return;
    
    this.currentIndex = index;
    const track = this.playlist[index];
    this.state.currentTrack = track;
    this.state.currentTime = 0;
    
    try {
      localStorage.setItem('dapp_music_current_index', index.toString());
    } catch {}

    if (track.mp3) {
      this.audio.src = track.mp3;
      this.audio.playbackRate = this.state.playbackRate;
      this.audio
        .play()
        .then(() => {
          this.state.isPlaying = true;
          this.emit();
        })
        .catch((err) => {
          console.error('Audio play failed', err);
          this.state.isPlaying = false;
          this.emit();
        });
    }
    this.emit();
  }

  public next() {
    if (this.playlist.length === 0) return;
    if (this.state.isShuffle && this.playlist.length > 1) {
      const randomIndex = Math.floor(Math.random() * this.playlist.length);
      this.playTrack(randomIndex);
      return;
    }
    let nextIndex = this.currentIndex + 1;
    if (nextIndex >= this.playlist.length) nextIndex = 0;
    this.playTrack(nextIndex);
  }

  public prev() {
    if (this.playlist.length === 0) return;
    let prevIndex = this.currentIndex - 1;
    if (prevIndex < 0) prevIndex = this.playlist.length - 1;
    this.playTrack(prevIndex);
  }

  public setTrack(track: TrackInfo, autoPlay = true) {
    if (!this.audio) return;
    
    const index = this.playlist.findIndex((t) => t.title === track.title);
    if (index !== -1) {
      this.currentIndex = index;
      try {
        localStorage.setItem('dapp_music_current_index', index.toString());
      } catch {}
    }

    this.state.currentTrack = track;
    this.state.currentTime = 0;

    if (track.mp3) {
      this.audio.src = track.mp3;
      this.audio.playbackRate = this.state.playbackRate;
      if (autoPlay) {
        this.audio
          .play()
          .then(() => {
            this.state.isPlaying = true;
            this.emit();
          })
          .catch(() => {
            this.state.isPlaying = false;
            this.emit();
          });
      }
    }
    this.emit();
  }

  public togglePlay() {
    if (!this.audio || !this.state.currentTrack) return;
    if (this.state.isPlaying) {
      this.audio.pause();
    } else {
      this.audio.play().catch(() => {});
    }
  }

  public seek(time: number) {
    if (!this.audio) return;
    this.audio.currentTime = time;
    this.state.currentTime = time;
    this.emit();
  }

  public setVolume(vol: number) {
    if (!this.audio) return;
    this.audio.volume = Math.max(0, Math.min(1, vol));
  }

  public toggleRepeatMode() {
    const modes: RepeatMode[] = ['all', 'one', 'off'];
    const nextIndex = (modes.indexOf(this.state.repeatMode) + 1) % modes.length;
    this.state.repeatMode = modes[nextIndex];
    try {
      localStorage.setItem('dapp_music_repeat', this.state.repeatMode);
    } catch {}
    this.emit();
  }

  public toggleShuffle() {
    this.state.isShuffle = !this.state.isShuffle;
    try {
      localStorage.setItem('dapp_music_shuffle', String(this.state.isShuffle));
    } catch {}
    this.emit();
  }

  public setPlaybackRate(rate: number) {
    this.state.playbackRate = rate;
    if (this.audio) {
      this.audio.playbackRate = rate;
    }
    this.emit();
  }

  public setEqPreset(preset: EqPreset) {
    this.state.eqPreset = preset;
    this.emit();
  }

  public getState(): MusicState {
    return { ...this.state };
  }

  public getCurrentIndex(): number {
    return this.currentIndex;
  }
}

export const musicManager = new GlobalMusicManager();
