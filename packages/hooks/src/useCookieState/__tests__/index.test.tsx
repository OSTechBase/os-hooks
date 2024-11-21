import { renderHook } from '@testing-library/react';
import useCookieState from '../index';
import type { Options } from '../index';
import Cookies from 'js-cookie';
import { act } from 'react';

describe('useCookieState', () => {
  const setUp = (key: string, options: Options) =>
    renderHook(() => {
      const [state, setState] = useCookieState(key, options);
      return {
        state,
        setState,
      } as const;
    });

  it('getKey should work', async () => {
    const COOKIE = 'test-key';
    const hook = setUp(COOKIE, {
      defaultValue: 'A',
    });
    expect(hook.result.current.state).toBe('A');
    await act(() => {
      hook.result.current.setState('B');
    });
    expect(hook.result.current.state).toBe('B');
    const anotherHook = setUp(COOKIE, {
      defaultValue: 'A',
    });
    expect(anotherHook.result.current.state).toBe('B');
    await act(() => {
      anotherHook.result.current.setState('C');
    });
    expect(anotherHook.result.current.state).toBe('C');
    expect(hook.result.current.state).toBe('B');
    expect(Cookies.get(COOKIE)).toBe('C');
  });

  it('should support undefined', async () => {
    const COOKIE = 'test-boolean-key-with-undefined';
    const hook = setUp(COOKIE, {
      defaultValue: 'undefined',
    });
    expect(hook.result.current.state).toBe('undefined');
    await act(() => {
      hook.result.current.setState(undefined);
    });
    expect(hook.result.current.state).toBeUndefined();
    const anotherHook = setUp(COOKIE, {
      defaultValue: 'false',
    });
    expect(anotherHook.result.current.state).toBe('false');
    expect(Cookies.get(COOKIE)).toBeUndefined();
    await act(() => {
      // @ts-ignore
      hook.result.current.setState();
    });
    expect(hook.result.current.state).toBeUndefined();
    expect(Cookies.get(COOKIE)).toBeUndefined();
  });

  it('should support empty string', () => {
    Cookies.set('test-key-empty-string', '');
    expect(Cookies.get('test-key-empty-string')).toBe('');
    const COOKIE = 'test-key-empty-string';
    const hook = setUp(COOKIE, {
      defaultValue: 'hello',
    });
    expect(hook.result.current.state).toBe('');
  });

  it('should support function updater', async () => {
    const COOKIE = 'test-func-updater';
    const hook = setUp(COOKIE, {
      defaultValue: () => 'hello world',
    });
    expect(hook.result.current.state).toBe('hello world');
    await act(() => {
      hook.result.current.setState((state) => `${state}, zhangsan`);
    });
    expect(hook.result.current.state).toBe('hello world, zhangsan');
  });

  it('using the same cookie name', async () => {
    const COOKIE_NAME = 'test-same-cookie-name';
    const { result: result1 } = setUp(COOKIE_NAME, { defaultValue: 'A' });
    const { result: result2 } = setUp(COOKIE_NAME, { defaultValue: 'B' });
    expect(result1.current.state).toBe('A');
    expect(result2.current.state).toBe('B');
    await act(() => {
      result1.current.setState('C');
    });
    expect(result1.current.state).toBe('C');
    expect(result2.current.state).toBe('B');
    expect(Cookies.get(COOKIE_NAME)).toBe('C');
    await act(() => {
      result2.current.setState('D');
    });
    expect(result1.current.state).toBe('C');
    expect(result2.current.state).toBe('D');
    expect(Cookies.get(COOKIE_NAME)).toBe('D');
  });
});
