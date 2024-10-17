import { renderHook /* , act */ } from '@testing-library/react';
import { act } from 'react';
// renderHook：运行hook
// act：调用hook里的方法

import useToggle from '../index';
const callUseToggle = (hook: any) => {
  act(() => {
    hook.result.current[1].toggle();
  });
};
describe('useToggle', () => {
  it('测试初始化没值的时候是否为false', () => {
    const hook = renderHook(() => useToggle());
    expect(hook.result.current[0]).toBeFalsy(); // 判断值是为等于false
  });
  it('测试hook的方法', async () => {
    const hook = renderHook(() => useToggle('Hello'));
    expect(hook.result.current[0]).toBe('Hello'); // toBe判断值与传入的值是否相等
    callUseToggle(hook);
    expect(hook.result.current[0]).toBeFalsy();
    act(() => {
      hook.result.current[1].setLeft();
    });
    expect(hook.result.current[0]).toBe('Hello');
    act(() => {
      hook.result.current[1].setRight();
    });
    expect(hook.result.current[0]).toBeFalsy();
  });
  it('测试两个值，hello world', () => {
    const hook = renderHook(() => useToggle('hello', 'world'));
    callUseToggle(hook);
    expect(hook.result.current[0]).toBe('world');
    callUseToggle(hook);
    expect(hook.result.current[0]).toBe('hello');
    act(() => {
      hook.result.current[1].set('world');
    });
    expect(hook.result.current[0]).toBe('world');
  });
});
