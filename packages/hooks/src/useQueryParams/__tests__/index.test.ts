import { renderHook } from '@testing-library/react';
import useQueryParams from '../index';

describe('useQueryParams', () => {
  beforeEach(() => {
    window.history.replaceState({}, '', 'http://localhost/?id=123&name=test');
  });

  it('should read all params from current window location', () => {
    const hook = renderHook(() => useQueryParams());

    expect(hook.result.current).toEqual({
      id: '123',
      name: 'test',
    });
  });

  it('should read specified param from current window location', () => {
    const hook = renderHook(() => useQueryParams('name'));

    expect(hook.result.current).toBe('test');
  });

  it('should prefer custom search over current location', () => {
    const hook = renderHook(() => useQueryParams('id', { search: '?id=456&name=next' }));

    expect(hook.result.current).toBe('456');
  });

  it('should parse params from custom url', () => {
    const hook = renderHook(() =>
      useQueryParams({
        url: 'https://example.com/path?foo=hello&bar=world',
      }),
    );

    expect(hook.result.current).toEqual({
      foo: 'hello',
      bar: 'world',
    });
  });

  it('should return null for missing param', () => {
    const hook = renderHook(() => useQueryParams('missing'));

    expect(hook.result.current).toBeNull();
  });
});
