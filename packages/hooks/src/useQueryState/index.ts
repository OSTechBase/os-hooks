import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import isBrowser from '../utils/isBrowser';
import { isFunction } from '../utils';

export type SetQueryState<T> = T | undefined | ((prevState: T | undefined) => T | undefined);
export type QueryLocationMode = 'auto' | 'search' | 'hash';
export type QueryHistoryMode = 'push' | 'replace';

export interface UseQueryStateOptions<T> {
  defaultValue?: T | (() => T);
  history?: QueryHistoryMode;
  locationMode?: QueryLocationMode;
  serializer?: (value: T) => string;
  deserializer?: (value: string) => T;
  onError?: (error: unknown) => void;
}

const QUERY_STATE_EVENT = 'os-hooks:query-state-change';
const defaultSerializer = JSON.stringify;
const defaultDeserializer = JSON.parse;
const defaultOnError = (error: unknown) => {
  console.error(error);
};

function encodeBase64(value: string) {
  if (typeof TextEncoder !== 'undefined' && typeof btoa === 'function') {
    const bytes = new TextEncoder().encode(value);
    let binary = '';
    bytes.forEach((byte) => {
      binary += String.fromCharCode(byte);
    });
    return btoa(binary);
  }

  if (typeof Buffer !== 'undefined') {
    return Buffer.from(value, 'utf8').toString('base64');
  }

  throw new Error('Base64 encoding is not supported in the current environment.');
}

function decodeBase64(value: string) {
  if (typeof TextDecoder !== 'undefined' && typeof atob === 'function') {
    const binary = atob(value);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  }

  if (typeof Buffer !== 'undefined') {
    return Buffer.from(value, 'base64').toString('utf8');
  }

  throw new Error('Base64 decoding is not supported in the current environment.');
}

function resolveDefaultValue<T>(defaultValue?: T | (() => T)) {
  return isFunction(defaultValue) ? defaultValue() : defaultValue;
}

function getHashSearch(hash: string) {
  const queryIndex = hash.indexOf('?');
  return queryIndex >= 0 ? hash.slice(queryIndex) : '';
}

function getHashPath(hash: string) {
  const normalizedHash = hash.startsWith('#') ? hash.slice(1) : hash;
  const queryIndex = normalizedHash.indexOf('?');
  return queryIndex >= 0 ? normalizedHash.slice(0, queryIndex) : normalizedHash;
}

function resolveLocationMode(mode: QueryLocationMode) {
  if (!isBrowser) {
    return 'search' as const;
  }

  if (mode !== 'auto') {
    return mode;
  }

  if (window.location.search) {
    return 'search' as const;
  }

  if (window.location.hash.includes('?') || window.location.hash.startsWith('#/')) {
    return 'hash' as const;
  }

  return 'search' as const;
}

function readRawValue(key: string, mode: QueryLocationMode) {
  if (!isBrowser) {
    return null;
  }

  const locationMode = resolveLocationMode(mode);
  const params =
    locationMode === 'hash'
      ? new URLSearchParams(getHashSearch(window.location.hash))
      : new URLSearchParams(window.location.search);

  return params.get(key);
}

function buildNextUrl(key: string, encodedValue: string | null, mode: Exclude<QueryLocationMode, 'auto'>) {
  const url = new URL(window.location.href);

  if (mode === 'hash') {
    const hashPath = getHashPath(url.hash);
    const params = new URLSearchParams(getHashSearch(url.hash));

    if (encodedValue === null) {
      params.delete(key);
    } else {
      params.set(key, encodedValue);
    }

    const nextSearch = params.toString();
    url.hash = nextSearch ? `${hashPath}?${nextSearch}` : hashPath;
    return `${url.pathname}${url.search}${url.hash}`;
  }

  if (encodedValue === null) {
    url.searchParams.delete(key);
  } else {
    url.searchParams.set(key, encodedValue);
  }

  return `${url.pathname}${url.search}${url.hash}`;
}

function syncUrl(
  url: string,
  history: QueryHistoryMode,
  locationMode: Exclude<QueryLocationMode, 'auto'>,
) {
  if (locationMode === 'hash') {
    const hashIndex = url.indexOf('#');
    const nextHash = hashIndex >= 0 ? url.slice(hashIndex) : '';
    if (history === 'replace') {
      window.history.replaceState(window.history.state, '', `${window.location.pathname}${window.location.search}${nextHash}`);
      return;
    }
    window.location.hash = hashIndex >= 0 ? url.slice(hashIndex + 1) : '';
    return;
  }

  const method = history === 'push' ? 'pushState' : 'replaceState';
  window.history[method](window.history.state, '', url);
}

function emitStateChange() {
  if (!isBrowser || typeof window.CustomEvent !== 'function') {
    return;
  }
  window.dispatchEvent(new CustomEvent(QUERY_STATE_EVENT));
}

function useQueryState<T>(key: string, options: UseQueryStateOptions<T> = {}) {
  const {
    defaultValue,
    history = 'replace',
    locationMode = 'auto',
    serializer = defaultSerializer,
    deserializer = defaultDeserializer,
    onError = defaultOnError,
  } = options;

  const getStateFromUrl = useCallback(() => {
    const rawValue = readRawValue(key, locationMode);

    if (rawValue === null) {
      return resolveDefaultValue(defaultValue);
    }

    try {
      return deserializer(decodeBase64(rawValue));
    } catch (error) {
      onError(error);
      return resolveDefaultValue(defaultValue);
    }
  }, [defaultValue, deserializer, key, locationMode, onError]);

  const [state, setState] = useState<T | undefined>(() => getStateFromUrl());
  const stateRef = useRef(state);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    setState(getStateFromUrl());
  }, [key, locationMode]);

  useEffect(() => {
    if (!isBrowser) {
      return;
    }

    const syncState = () => {
      setState(getStateFromUrl());
    };

    window.addEventListener('popstate', syncState);
    window.addEventListener('hashchange', syncState);
    window.addEventListener(QUERY_STATE_EVENT, syncState as EventListener);

    return () => {
      window.removeEventListener('popstate', syncState);
      window.removeEventListener('hashchange', syncState);
      window.removeEventListener(QUERY_STATE_EVENT, syncState as EventListener);
    };
  }, [getStateFromUrl]);

  const updateState = useCallback(
    (value: SetQueryState<T>) => {
      const nextState = isFunction(value) ? value(stateRef.current) : value;
      setState(nextState);

      if (!isBrowser) {
        return;
      }

      try {
        const resolvedLocationMode = resolveLocationMode(locationMode);
        const encodedValue =
          typeof nextState === 'undefined' ? null : encodeBase64(serializer(nextState));
        const nextUrl = buildNextUrl(key, encodedValue, resolvedLocationMode);

        syncUrl(nextUrl, history, resolvedLocationMode);
        emitStateChange();
      } catch (error) {
        onError(error);
      }
    },
    [history, key, locationMode, onError, serializer],
  );

  const helpers = useMemo(
    () => ({
      remove: () => updateState(undefined),
    }),
    [updateState],
  );

  return [state, updateState, helpers] as const;
}

export default useQueryState;
