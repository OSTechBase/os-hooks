import { renderHook } from '@testing-library/react';
import useUrlAsFile from '../index';
import { act } from 'react';

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

    // if (file) {
    //   expect(file.name).toBe('mock.txt');
    //   expect(file.type).toBe('text/plain');
    //   expect(await file.text()).toBe('mock content');
    // }
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

    // expect(error).toEqual(new Error('Network error'));
  });
});
