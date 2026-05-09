import { act, renderHook, waitFor } from '@testing-library/react';
import useScroll from '../index';

describe('useScroll', () => {
  let rafSpy: jest.SpyInstance;

  beforeEach(() => {
    rafSpy = jest
      .spyOn(window, 'requestAnimationFrame')
      .mockImplementation((cb: FrameRequestCallback) => {
        cb(0);
        return 0;
      });
  });

  afterEach(() => {
    rafSpy.mockRestore();
  });

  it('should read document scroll position', async () => {
    Object.defineProperty(document, 'scrollingElement', {
      configurable: true,
      value: {
        scrollLeft: 10,
        scrollTop: 20,
      },
    });

    const hook = renderHook(() => useScroll(document));

    await waitFor(() => {
      expect(hook.result.current).toEqual({
        left: 10,
        top: 20,
      });
    });
  });

  it('should update position on element scroll and respect shouldUpdate changes', async () => {
    const target = document.createElement('div');
    target.scrollLeft = 0;
    target.scrollTop = 0;

    document.body.appendChild(target);

    const hook = renderHook(
      ({ allowUpdate }) =>
        useScroll(target, () => allowUpdate),
      {
        initialProps: { allowUpdate: false },
      },
    );

    expect(hook.result.current).toBeUndefined();

    act(() => {
      target.scrollLeft = 30;
      target.scrollTop = 40;
      target.dispatchEvent(new Event('scroll'));
    });

    expect(hook.result.current).toBeUndefined();

    hook.rerender({ allowUpdate: true });

    act(() => {
      target.scrollLeft = 50;
      target.scrollTop = 60;
      target.dispatchEvent(new Event('scroll'));
    });

    expect(hook.result.current).toEqual({
      left: 50,
      top: 60,
    });

    document.body.removeChild(target);
  });
});
