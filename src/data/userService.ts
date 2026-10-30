// Local & API User Name Registry Service for DAPP TOOLS with Unique Name Protection & Auto-Release

const INITIAL_REGISTERED_NAMES = [
  'admin',
  'kiyomi',
  'dapptools',
  'viper',
  'ghost',
  'satoru',
];

const STORAGE_KEY = 'dapp_registered_names';
const CURRENT_USER_KEY = 'dapp_current_user';
const LAST_USER_KEY = 'dapp_last_user';

export const getRegisteredNames = (): string[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_REGISTERED_NAMES));
      return INITIAL_REGISTERED_NAMES;
    }
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : INITIAL_REGISTERED_NAMES;
  } catch {
    return INITIAL_REGISTERED_NAMES;
  }
};

export const getCurrentUser = (): string | null => {
  try {
    return localStorage.getItem(CURRENT_USER_KEY);
  } catch {
    return null;
  }
};

export const getLastUser = (): string | null => {
  try {
    return localStorage.getItem(LAST_USER_KEY) || localStorage.getItem(CURRENT_USER_KEY);
  } catch {
    return null;
  }
};

export const setCurrentUser = (name: string): void => {
  try {
    const trimmed = name.trim();
    localStorage.setItem(CURRENT_USER_KEY, trimmed);
    localStorage.setItem(LAST_USER_KEY, trimmed);
  } catch (err) {
    console.error('Failed to save current user', err);
  }
};

export const clearCurrentUser = (): void => {
  try {
    const current = getCurrentUser();
    if (current) {
      releaseName(current);
    }
    localStorage.removeItem(CURRENT_USER_KEY);
  } catch (err) {
    console.error('Failed to clear current user', err);
  }
};

/**
 * Releases a name from active registered list so another user can immediately take it.
 */
export const releaseName = (nameToRelease: string): void => {
  if (!nameToRelease || !nameToRelease.trim()) return;
  try {
    const target = nameToRelease.trim().toLowerCase();
    const currentList = getRegisteredNames();
    const updated = currentList.filter((n) => n.toLowerCase() !== target);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to release name:', err);
  }
};

export interface NameCheckResult {
  valid: boolean;
  available: boolean;
  message: string;
}

/**
 * Checks if a name is valid and currently available (not taken by another user).
 * If the current user already owns this name, it returns available: true.
 */
export const checkNameAvailability = (rawName: string, currentUser?: string | null): NameCheckResult => {
  const name = rawName.trim();

  if (!name) {
    return {
      valid: false,
      available: false,
      message: '',
    };
  }

  if (rawName.length > 12) {
    return {
      valid: false,
      available: false,
      message: 'Maksimal 12 huruf!',
    };
  }

  if (name.length < 4) {
    return {
      valid: false,
      available: false,
      message: 'Minimal 4 huruf',
    };
  }

  const normalized = name.toLowerCase();
  const currentActive = (currentUser || getCurrentUser() || getLastUser())?.trim().toLowerCase();

  // If the user already owns this name currently, it's valid & available for them
  if (currentActive && normalized === currentActive) {
    return {
      valid: true,
      available: true,
      message: 'Nama ini milik Anda (terverifikasi)',
    };
  }

  // Check if taken by ANY other user
  const registered = getRegisteredNames().map((n) => n.toLowerCase());
  if (registered.includes(normalized)) {
    return {
      valid: false,
      available: false,
      message: 'NAMA SUDAH DIPAKAI PENGGUNA LAIN! GUNAKAN NAMA LAIN',
    };
  }

  return {
    valid: true,
    available: true,
    message: 'NAMA TERSEDIA & SIAP DIGUNAKAN!',
  };
};

/**
 * Registers a new name. Automatically releases any previous name held by the user.
 */
export const registerName = (rawName: string, previousName?: string): { success: boolean; message: string } => {
  const name = rawName.trim();
  if (name.length < 4) {
    return { success: false, message: 'Minimal 4 huruf!' };
  }
  if (rawName.length > 12) {
    return { success: false, message: 'Maksimal 12 huruf!' };
  }

  const activeCheck = checkNameAvailability(name, previousName);
  if (!activeCheck.available) {
    return { success: false, message: activeCheck.message || 'Nama tidak tersedia!' };
  }

  const normalized = name.toLowerCase();
  const oldUser = (previousName || getCurrentUser() || getLastUser())?.trim();

  // If changing from an old name to a new name, release the old name immediately!
  if (oldUser && oldUser.toLowerCase() !== normalized) {
    releaseName(oldUser);
  }

  // Register the new active name
  const registered = getRegisteredNames();
  if (!registered.some((n) => n.toLowerCase() === normalized)) {
    registered.push(name);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(registered));
    } catch (err) {
      console.error('Failed to save registered names', err);
    }
  }

  setCurrentUser(name);
  return { success: true, message: 'Nama terverifikasi & berhasil masuk!' };
};

