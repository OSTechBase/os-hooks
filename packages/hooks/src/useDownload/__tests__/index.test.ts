import { renderHook } from '@testing-library/react';
import useDownload from '../index';
import { act } from 'react';

describe('useDownload', () => {
  let appendChildSpy: jest.SpyInstance;
  let removeChildSpy: jest.SpyInstance;

  beforeEach(() => {
    (global as any).fetch = jest.fn();
    // Mock URL.createObjectURL
    if (!window.URL.createObjectURL) {
      Object.defineProperty(window.URL, 'createObjectURL', {
        writable: true,
        value: jest.fn(() => 'mockObjectURL'),
      });
    }

    // Mock URL.revokeObjectURL
    if (!window.URL.revokeObjectURL) {
      Object.defineProperty(window.URL, 'revokeObjectURL', {
        writable: true,
        value: jest.fn(),
      });
    }

    // 原始的 createElement 用于避免递归
    const originalCreateElement = document.createElement.bind(document);

    // Mock document.createElement
    jest.spyOn(document, 'createElement').mockImplementation((tagName) => {
      const element = originalCreateElement(tagName); // 调用原始实现
      if (tagName === 'a') {
        Object.defineProperty(element, 'click', { value: jest.fn() });
      }
      return element;
    });
    appendChildSpy = jest.spyOn(document.body, 'appendChild');
    removeChildSpy = jest.spyOn(document.body, 'removeChild');
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      blob: jest.fn().mockResolvedValue(new Blob(['image'], { type: 'image/png' })),
    } as unknown as Response);
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should download file by URL', async () => {
    const { result } = renderHook(() => ({ download: useDownload('url') }));
    const download = result.current.download;
    const mockName = 'example.txt';
    const mockUrl = 'https://example.com/example.txt';

    await act(async () => {
      await download(mockUrl, mockName);
    });

    expect(appendChildSpy).toHaveBeenCalled();
    expect(removeChildSpy).toHaveBeenCalled();
    expect(window.URL.revokeObjectURL).not.toHaveBeenCalled();
  });

  it('should download image URL by fetching blob first', async () => {
    const { result } = renderHook(() => ({ download: useDownload('url') }));
    const download = result.current.download;

    await act(async () => {
      await download('https://example.com/image.png', 'image.png');
    });

    expect(fetch).toHaveBeenCalledWith('https://example.com/image.png');
    expect(window.URL.revokeObjectURL).toHaveBeenCalledWith('mockObjectURL');
  });

  it('should download file by Blob', async () => {
    const { result } = renderHook(() => ({ download: useDownload('blob') }));
    const download = result.current.download;
    const mockName = 'example.txt';
    const mockBlob = new Blob(['test content'], { type: 'text/plain' });

    await act(async () => {
      await download(mockBlob, mockName);
    });

    expect(window.URL.revokeObjectURL).toHaveBeenCalledWith('mockObjectURL');
  });

  it('should handle download failure gracefully', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      blob: jest.fn(),
    });

    const { result } = renderHook(() => ({ download: useDownload('url') }));
    const download = result.current.download;

    await act(async () => {
      await download('https://example.com/image.png', 'image.png');
    });

    expect(console.error).toHaveBeenCalled();
  });
});
