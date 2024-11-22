import { renderHook } from '@testing-library/react';
import useDownload from '../index';
import { act } from 'react';

describe('useDownload', () => {
  beforeEach(() => {
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
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should download file by URL', () => {
    const { result } = renderHook(() => useDownload('url'));
    const mockName = 'example.txt';
    const mockUrl = 'https://example.com/example.txt';

    act(() => {
      result.current(mockUrl, mockName);
    });
  });

  it('should download file by Blob', () => {
    const { result } = renderHook(() => useDownload('blob'));
    const mockName = 'example.txt';
    const mockBlob = new Blob(['test content'], { type: 'text/plain' });

    act(() => {
      result.current(mockBlob, mockName);
    });

    expect(window.URL.revokeObjectURL).toHaveBeenCalledWith('mockObjectURL');
  });
});
