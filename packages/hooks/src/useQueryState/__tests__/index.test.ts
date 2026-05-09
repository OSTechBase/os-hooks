import { act } from 'react';
import { renderHook } from '@testing-library/react';
import useQueryState from '../index';

describe('useQueryState', () => {
  beforeEach(() => {
    window.history.replaceState({}, '', 'http://localhost/');
  });

  it('should read and decode state from search params', () => {
    const value = window.btoa(JSON.stringify({ keyword: 'react', page: 2 }));
    window.history.replaceState({}, '', `http://localhost/?filters=${value}`);

    const hook = renderHook(() => useQueryState<{ keyword: string; page: number }>('filters'));

    expect(hook.result.current[0]).toEqual({
      keyword: 'react',
      page: 2,
    });
  });

  it('should use defaultValue when query param is missing', () => {
    const hook = renderHook(() =>
      useQueryState('status', {
        defaultValue: 'all',
      }),
    );

    expect(hook.result.current[0]).toBe('all');
  });

  it('should update url and encode the value', () => {
    const hook = renderHook(() =>
      useQueryState<{ keyword: string; page: number }>('filters', {
        defaultValue: {
          keyword: '',
          page: 1,
        },
      }),
    );

    act(() => {
      hook.result.current[1]({
        keyword: 'hooks',
        page: 3,
      });
    });

    const params = new URLSearchParams(window.location.search);
    const rawValue = params.get('filters');

    expect(rawValue).toBe(window.btoa(JSON.stringify({ keyword: 'hooks', page: 3 })));
    expect(hook.result.current[0]).toEqual({
      keyword: 'hooks',
      page: 3,
    });
  });

  it('should support utf-8 content during base64 encode and decode', () => {
    const hook = renderHook(() =>
      useQueryState<{ keyword: string; page: number }>('filters', {
        defaultValue: {
          keyword: '',
          page: 1,
        },
      }),
    );

    act(() => {
      hook.result.current[1]({
        keyword: '测试1',
        page: 1,
      });
    });

    const rawValue = new URLSearchParams(window.location.search).get('filters');

    expect(rawValue).toBeTruthy();
    expect(hook.result.current[0]).toEqual({
      keyword: '测试1',
      page: 1,
    });

    const anotherHook = renderHook(() =>
      useQueryState<{ keyword: string; page: number }>('filters'),
    );

    expect(anotherHook.result.current[0]).toEqual({
      keyword: '测试1',
      page: 1,
    });
  });

  it('should remove query param when state becomes undefined', () => {
    const value = window.btoa(JSON.stringify('react'));
    window.history.replaceState({}, '', `http://localhost/?keyword=${value}`);

    const hook = renderHook(() => useQueryState<string>('keyword'));

    act(() => {
      hook.result.current[2].remove();
    });

    expect(new URLSearchParams(window.location.search).has('keyword')).toBe(false);
    expect(hook.result.current[0]).toBeUndefined();
  });

  it('should support functional updater', () => {
    const hook = renderHook(() =>
      useQueryState('page', {
        defaultValue: 1,
      }),
    );

    act(() => {
      hook.result.current[1]((prev) => (prev || 0) + 1);
    });

    expect(hook.result.current[0]).toBe(2);
  });

  it('should keep hash routes while syncing hash params in auto mode', () => {
    window.history.replaceState({}, '', 'http://localhost/#/hooks/use-modal-fn');

    const hook = renderHook(() => useQueryState<{ keyword: string }>('filters'));

    act(() => {
      hook.result.current[1]({
        keyword: 'drawer',
      });
    });

    expect(window.location.hash).toContain('#/hooks/use-modal-fn?filters=');
    expect(hook.result.current[0]).toEqual({ keyword: 'drawer' });
  });

  it('should respect explicit search mode even on hash routes', () => {
    window.history.replaceState({}, '', 'http://localhost/#/hooks/use-modal-fn');

    const hook = renderHook(() =>
      useQueryState<{ keyword: string }>('filters', {
        locationMode: 'search',
      }),
    );

    act(() => {
      hook.result.current[1]({
        keyword: 'drawer',
      });
    });

    expect(window.location.search).toContain('filters=');
    expect(window.location.hash).toBe('#/hooks/use-modal-fn');
  });

  it('should fallback to default value and call onError when payload is invalid', () => {
    window.history.replaceState({}, '', 'http://localhost/?filters=%%%');
    const onError = jest.fn();

    const hook = renderHook(() =>
      useQueryState('filters', {
        defaultValue: 'all',
        onError,
      }),
    );

    expect(hook.result.current[0]).toBe('all');
    expect(onError).toHaveBeenCalled();
  });

  it('should replace current history entry in hash mode when history is replace', () => {
    window.history.replaceState({}, '', 'http://localhost/#/hooks/use-modal-fn');
    const initialLength = window.history.length;

    const hook = renderHook(() =>
      useQueryState<{ keyword: string }>('filters', {
        locationMode: 'hash',
        history: 'replace',
      }),
    );

    act(() => {
      hook.result.current[1]({
        keyword: 'drawer',
      });
    });

    expect(window.history.length).toBe(initialLength);
    expect(window.location.hash).toContain('filters=');
  });

  it('should read and update state from hash params in explicit hash mode', () => {
    const value = window.btoa(JSON.stringify({ keyword: 'hash-mode' }));
    window.history.replaceState({}, '', `http://localhost/#/hooks/use-modal-fn?filters=${value}`);

    const hook = renderHook(() =>
      useQueryState<{ keyword: string }>('filters', {
        locationMode: 'hash',
      }),
    );

    expect(hook.result.current[0]).toEqual({ keyword: 'hash-mode' });

    act(() => {
      hook.result.current[1]({ keyword: 'updated' });
    });

    expect(window.location.hash).toContain('#/hooks/use-modal-fn?filters=');
    expect(hook.result.current[0]).toEqual({ keyword: 'updated' });
  });

  it('should sync state across hook instances through custom events', () => {
    const first = renderHook(() =>
      useQueryState<{ keyword: string }>('filters', {
        defaultValue: { keyword: 'init' },
      }),
    );
    const second = renderHook(() =>
      useQueryState<{ keyword: string }>('filters', {
        defaultValue: { keyword: 'init' },
      }),
    );

    act(() => {
      first.result.current[1]({ keyword: 'shared' });
    });

    expect(second.result.current[0]).toEqual({ keyword: 'shared' });
  });

  it('should update state when browser navigation events change the query string', () => {
    const initialValue = window.btoa(JSON.stringify(1));
    const nextValue = window.btoa(JSON.stringify(2));
    window.history.replaceState({}, '', `http://localhost/?page=${initialValue}`);

    const hook = renderHook(() => useQueryState<number>('page'));

    expect(hook.result.current[0]).toBe(1);

    act(() => {
      window.history.pushState({}, '', `http://localhost/?page=${nextValue}`);
      window.dispatchEvent(new PopStateEvent('popstate'));
    });

    expect(hook.result.current[0]).toBe(2);
  });

  it('should refresh state when the key changes', () => {
    const firstValue = window.btoa(JSON.stringify('first'));
    const secondValue = window.btoa(JSON.stringify('second'));
    window.history.replaceState(
      {},
      '',
      `http://localhost/?first=${firstValue}&second=${secondValue}`,
    );

    const hook = renderHook(
      ({ queryKey }) => useQueryState<string>(queryKey),
      {
        initialProps: { queryKey: 'first' },
      },
    );

    expect(hook.result.current[0]).toBe('first');

    hook.rerender({ queryKey: 'second' });

    expect(hook.result.current[0]).toBe('second');
  });

  it('should call default onError when serializer fails during update', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const serializerError = new Error('serialize failed');
    const hook = renderHook(() =>
      useQueryState('filters', {
        serializer: () => {
          throw serializerError;
        },
      }),
    );

    act(() => {
      hook.result.current[1]('next-value');
    });

    expect(hook.result.current[0]).toBe('next-value');
    expect(consoleErrorSpy).toHaveBeenCalledWith(serializerError);
  });
});
