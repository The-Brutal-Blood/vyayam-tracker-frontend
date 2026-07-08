import * as Keychain from 'react-native-keychain';

/**
 * TokenService: a synchronous in-memory copy (read by the axios interceptors
 * on every request) backed by the device Keychain/Keystore so sessions
 * survive app restarts. Keychain failures degrade gracefully to
 * in-memory-only — a request must never fail because persistence did.
 *
 * Tokens live only here; they are never held in component state.
 */

const KEYCHAIN_SERVICE = 'com.vyayamtracker.auth';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

let inMemory: { accessToken: string | null; refreshToken: string | null } = {
  accessToken: null,
  refreshToken: null,
};

export function getAccessToken(): string | null {
  return inMemory.accessToken;
}

export function getRefreshToken(): string | null {
  return inMemory.refreshToken;
}

export async function saveTokens(tokens: AuthTokens): Promise<void> {
  inMemory = { ...tokens };
  try {
    await Keychain.setGenericPassword('auth', JSON.stringify(tokens), {
      service: KEYCHAIN_SERVICE,
    });
  } catch {
    // Persistence failed; the session still works for this app run.
  }
}

export async function clearTokens(): Promise<void> {
  inMemory = { accessToken: null, refreshToken: null };
  try {
    await Keychain.resetGenericPassword({ service: KEYCHAIN_SERVICE });
  } catch {
    // Nothing sensitive remains in memory; ignore.
  }
}

/** Loads persisted tokens into memory at app start. Resolves true if a session exists. */
export async function hydrateTokens(): Promise<boolean> {
  try {
    const credentials = await Keychain.getGenericPassword({ service: KEYCHAIN_SERVICE });
    if (!credentials) {
      return false;
    }
    const parsed = JSON.parse(credentials.password) as Partial<AuthTokens>;
    if (!parsed.accessToken || !parsed.refreshToken) {
      return false;
    }
    inMemory = { accessToken: parsed.accessToken, refreshToken: parsed.refreshToken };
    return true;
  } catch {
    return false;
  }
}
