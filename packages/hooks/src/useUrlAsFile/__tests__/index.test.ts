import { renderHook } from '@testing-library/react';
import useUrlAsFile from '../index';
import { act } from 'react';
import { sleep } from '../../utils/testingHelpers';

// Mock fetch globally
global.fetch = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();

  // Mock URL.createObjectURL
  if (!window.URL.createObjectURL) {
    Object.defineProperty(window.URL, 'createObjectURL', {
      writable: true,
      value: jest.fn(() => 'mockObjectURL'),
    });
  }
});

describe('useUrlAsFile', () => {
  beforeEach(() => {
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('should initialize with null file', () => {
    const { result } = renderHook(() => useUrlAsFile());
    const [file] = result.current;

    expect(file).toBeNull();
  });

  it('should fetch a file from URL and set it', async () => {
    // Mock Blob and its methods
    const mockBlob = new Blob(['mock content'], { type: 'text/plain' });
    Object.defineProperty(mockBlob, 'text', {
      value: jest.fn().mockResolvedValue('mock content'),
    });

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      blob: jest.fn().mockResolvedValueOnce(mockBlob),
    });

    const { result } = renderHook(() => useUrlAsFile());
    const [, fetchUrlAsFile] = result.current;

    let file: File | null = null;
    await act(async () => {
      file = await fetchUrlAsFile('https://example.com/mock.txt', 'mock.txt');
    });

    expect(fetch).toHaveBeenCalledWith(
      'https://example.com/mock.txt',
      expect.any(Object), // 忽略 signal 参数
    );
    expect(file).toBeInstanceOf(File);
    expect(result.current[0]).toBeInstanceOf(File);
    const resolvedFile = file as unknown as File;
    expect(resolvedFile.name).toBe('mock.txt');
    expect(resolvedFile.type).toBe('text/plain');
  });

  it('should handle fetch error', async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useUrlAsFile());
    const [, fetchUrlAsFile] = result.current;

    let error: Error | null = null;
    try {
      await act(async () => {
        await fetchUrlAsFile('https://example.com/error.txt', 'error.txt');
      });
    } catch (e) {
      error = e as Error;
    }

    expect(error).toBeNull();
    expect(result.current[0]).toBeNull();
    expect(console.error).toHaveBeenCalled();
  });

  it('should cancel fetch and reset file state', async () => {
    let abortSignal: AbortSignal | null | undefined;
    (fetch as jest.Mock).mockImplementationOnce((_url, init?: RequestInit) => {
      abortSignal = init?.signal;
      return new Promise((_resolve, reject) => {
        abortSignal?.addEventListener('abort', () => {
          const error = new Error('aborted');
          (error as any).name = 'AbortError';
          reject(error);
        });
      });
    });

    const { result } = renderHook(() => useUrlAsFile());
    const [, fetchUrlAsFile, cancelFetch] = result.current;

    let response: File | null = null;
    const pending = act(async () => {
      response = await fetchUrlAsFile('https://example.com/slow.txt', 'slow.txt');
    });

    act(() => {
      cancelFetch();
    });

    await pending;
    await act(async () => {
      await sleep(0);
    });

    expect(response).toBeNull();
    expect(result.current[0]).toBeNull();
    expect(console.warn).toHaveBeenCalledWith('Fetch aborted');
  });
});
